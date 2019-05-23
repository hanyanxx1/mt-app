<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register"
            >同意以下协议并注册</el-button
          >
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank"
            >《美团网用户协议》</a
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CrypToJS from 'crypto-js'
import axios from '@/plugins/axios'
export default {
  name: 'Register',
  layout: 'blank',
  data() {
    return {
      statusMsg: '',
      error: '',
      ruleForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      rules: {
        name: [
          {
            required: true,
            type: 'string',
            message: '请输入昵称',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '创建密码',
            trigger: 'blur'
          }
        ],
        cpwd: [
          {
            required: true,
            message: '确认密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.pwd) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    sendMsg() {
      const self = this
      let namePass
      let emailPass
      // timerid 用于存放验证码发送后 处理 剩余等待时间的定时器
      // 如果一上来发现timerid存在，即有定时器在运行，说明上次发送验证码的等待事假还没过，就不能继续执行注册
      if (self.timerid) {
        return false
      }
      // 检查用户名是否通过了 validate 非空校验
      // 很奇葩的一点  如果验证不通过 ，返回的valid 才有有值   - -!
      // 所以下面在做判断是，要以!val来做判断 ， 即 !(''==>false) === true 才通过
      this.$refs.ruleForm.validateField('name', valid => {
        namePass = valid
      })
      // 此值用来记录验证码发送后的状态信息
      self.statusMsg = ''
      // 如果有值 ，即验证不通过，则返回
      if (namePass) {
        return false
      }
      this.$refs.ruleForm.validateField('email', valid => {
        emailPass = valid
      })
      // 他两个都没值 （都通过）
      if (!namePass && !emailPass) {
        // 这个地方之所以能直接调用，是因为我们在配置nuxt的时候，选中了axios功能
        // 所以直接将$axios 绑定到了 实例上
        axios
          .post('/users/verify', {
            // 要注意用户名中文问题
            username: window.encodeURIComponent(self.ruleForm.name),
            email: self.ruleForm.email
          })
          .then(({ status, data }) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60
              // 登录成功启动定时器
              // self.statusMsg = `验证码已发送,剩余${count--}秒`
              self.timerid = setInterval(function() {
                count = count - 1
                if (count === 0) {
                  clearInterval(self.timerid)
                  self.timerid = null
                }
                self.statusMsg = `验证码已发送,剩余${count}秒`
              }, 1000)
            } else {
              self.statusMsg = data.msg
            }
          })
      }
    },
    register() {
      const self = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          axios
            .post('/users/signup', {
              username: window.encodeURIComponent(self.ruleForm.name),
              password: CrypToJS.MD5(self.ruleForm.pwd).toString(),
              email: self.ruleForm.email,
              code: self.ruleForm.code
            })
            .then(({ status, data }) => {
              if (status === 200) {
                if (data && data.code === 0) {
                  location.href = '/login'
                } else {
                  self.error = data.message
                }
              } else {
                self.error = `服务器出错,错误码:${status}`
              }
              setTimeout(function() {
                self.error = ''
              }, 1500)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/register/index';
</style>
