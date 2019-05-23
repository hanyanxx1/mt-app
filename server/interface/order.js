import Router from 'koa-router'
import md5 from 'crypto-js/md5'
import { ErrorModel } from '../dbs/models/resModel'
import Order from '../dbs/models/order'
import Cart from '../dbs/models/cart'

const router = new Router({ prefix: '/order' })

router.post('/createOrder', async ctx => {
  const {
    params: { id, price, count }
  } = ctx.request.body
  const time = Date()
  const orderID = md5(Math.random() * 1000 + time).toString()
  if (!ctx.isAuthenticated()) {
    ctx.body = new ErrorModel('pleas login')
  } else {
    console.log(ctx.request.body)
    const findCart = await Cart.findOne({ cartNo: id })
    const order = new Order({
      id: orderID,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    })
    try {
      const result = await order.save()
      if (result) {
        await findCart.remove()
        ctx.body = {
          code: 0,
          id: orderID
        }
      } else {
        ctx.body = new ErrorModel()
      }
    } catch (e) {
      ctx.body = new ErrorModel()
    }
  }
})

router.post('/getOrders', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = new ErrorModel('pleas login')
  } else {
    try {
      const result = await Order.find()
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        }
      } else {
        ctx.body = {
          code: -1,
          list: []
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
})

export default router
