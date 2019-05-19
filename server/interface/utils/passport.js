import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

passport.use(
  new LocalStrategy(async function(username, password, done) {
    const where = {
      username
    }
    const result = await UserModel.findOne(where)
    if (result !== null) {
      if (result.password === password) {
        return done(null, result)
      } else {
        return done(null, false, '密码错误')
      }
    } else {
      return done(null, false, '用户不存在')
    }
  })
)

// 查询到用户登录成功之后，会将用户数据存储到session中，并序列化
passport.serializeUser(function(user, done) {
  done(null, user)
})

// 反序列化
passport.deserializeUser(function(user, done) {
  done(null, user)
})

export default passport
