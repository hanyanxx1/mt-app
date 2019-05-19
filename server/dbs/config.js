export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'smpt.qq.com'
    },
    get user() {
      return '946749697@qq.com'
    },
    // SMTP服务验证码
    get pass() {
      return 'lxqopgahogvlbdjd'
    },
    // 验证码
    get code() {
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toUpperCase()
      }
    },
    // 过期时间
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 1000
      }
    },
    // 获取端口
    get port() {
      return 587
    }
  }
}
