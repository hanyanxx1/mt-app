import Router from 'koa-router'
// import axios from './utils/axios'

const router = new Router({ prefix: '/geo' })

router.get('/getPosition', async ctx => {
  // todo 获取当前位置
})

export default router
