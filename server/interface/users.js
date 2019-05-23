import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import { SuccessModel, ErrorModel } from '../dbs/models/resModel'
import Email from '../dbs/config'
import axios from './utils/axios'
import Passport from './utils/passport'

const router = new Router({
  prefix: '/users'
})

const Store = new Redis().client

router.post('/signup', async ctx => {
  const { username, password, email, code } = ctx.request.body
  // 验证验证码
  if (code) {
    // 注册的时候从Redis中取出验证码
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 不让验证码无限的有效，比如一分钟之内必须使用验证码，如果没有成功注册，则失效
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        // 如果验证码已经过期
        ctx.body = new ErrorModel('验证码已过期，请重新尝试')
        return false
      }
    } else {
      ctx.body = new ErrorModel('请填写正确的验证码')
    }
  } else {
    ctx.body = new ErrorModel('请填写验证码')
  }

  // 用户名已被注册情况判断
  const user = await User.find({
    username
  })
  if (user.length) {
    ctx.body = new ErrorModel('已被注册')
    return
  }

  const nuser = await User.create({
    username,
    password,
    email
  })
  if (nuser) {
    const res = await axios.post('/users/signin', {
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = new SuccessModel({ user: res.data.user }, '注册成功')
    } else {
      ctx.body = new ErrorModel('error')
    }
  }
  // 如果数据库都写入失败
  else {
    ctx.body = new ErrorModel('注册失败')
  }
})

// 登录
router.post('/signin', (ctx, next) => {
  return Passport.authenticate('local', function(err, user, msg, status) {
    // 登录失败
    if (err) {
      ctx.body = new ErrorModel(err)
    } else if (user) {
      // 登录成功 返回 user
      ctx.body = new SuccessModel(user, '登录成功')
      return ctx.login(user)
    } else {
      // 如果没有登录成功，返回异常信息
      ctx.body = new ErrorModel(msg)
    }
  })(ctx, next)
})

// 验证信息
router.post('/verify', async (ctx, next) => {
  const username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  // 如果当前验证时间，小于过期时间，表明请求过于频繁，限制一段时间(saveExpire)执行一次
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = new ErrorModel('验证请求过于频繁,1分钟内1次')
    return false
  }

  const tranConfig = {
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  }

  const transporter = nodeMailer.createTransport(tranConfig)

  // 发送方
  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  // 发送信息
  const mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}> `,
    to: ko.email,
    subject: '《千峰二阶段考试_仿美团》注册码',
    html: `您在《千峰二阶段考试_仿美团》课程中注册，您的邀请码是${ko.code}`
  }

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(`验证码发送失败，错误信息:${JSON.stringify(err)}`)
    } else {
      Store.hmset(
        `nodemail:${ko.user}`,
        'code',
        ko.code,
        'expire',
        ko.expire,
        'email',
        ko.email
      )
    }
  })

  ctx.body = new SuccessModel('验证码已发送，可能会有延时，有效期1分钟')
})

router.get('/exit', async (ctx, next) => {
  // 执行注销
  await ctx.logout()
  // 检查现在是否还是登陆状态
  if (!ctx.isAuthenticated()) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel()
  }
})

// 获取用户名
router.get('/getUser', ctx => {
  // 检查是否是登陆状态
  // 从这段代码可以看出两个事
  // 1、isAuthenticated 是koa-passport默认封装的函数，用于校验用户登录状态的
  // 2、passport 会将信息存储在session中 ，可以直接取
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = new SuccessModel({ user: username, email })
  } else {
    ctx.body = new SuccessModel({ user: '', email: '' })
  }
})

export default router
