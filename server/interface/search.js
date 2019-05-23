// import Router from 'koa-router'
// import { mapState } from 'vuex'
// import Poi from '../dbs/models/poi'

import axios from './utils/axios'
const Router = require('koa-router')
const Poi = require('../dbs/models/poi')

const router = new Router({ prefix: '/search' })

router.get('/top', async ctx => {
  try {
    const top = await Poi.find({
      name: new RegExp(ctx.query.input),
      city: ctx.query.city.replace('市', '')
    })
    ctx.body = {
      code: 0,
      top: top.map(item => {
        return {
          name: item.name,
          type: item.type
        }
      }),
      type: top.length ? top[0] : ''
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      top: []
    }
  }
})

router.get('/hotPlace', async ctx => {
  const city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  try {
    const result = await Poi.find({
      city,
      type: ctx.query.type || '丽人'
    }).limit(10)

    ctx.body = {
      code: 0,
      result: result.map(item => {
        return {
          name: item.name,
          type: item.type
        }
      })
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      result: []
    }
  }
})

router.get('/resultsByKeywords', async ctx => {
  const { tab } = ctx.query
  const { status, data } = await axios.get(
    `https://bj.meituan.com/ptapi/getScenesList?theme=quality&tab=${tab}&ci=1&limit=10`
  )
  if (status === 200) {
    ctx.body = data
  }
})

router.get('/getProductList', async ctx => {
  const { keyword } = ctx.query
  const url = `https://apimobile.meituan.com/group/v4/poi/pcsearch/1?uuid=d365b6f393ea4ce39d97.1558090562.2.0.0&userid=161190758&limit=32&offset=32&cateId=-1&q=${encodeURIComponent(
    keyword
  )}`
  const { status, data } = await axios.get(url)
  if (status === 200) {
    ctx.body = data
  }
})

router.get('/products', ctx => {
  ctx.body = {
    product: {
      name: '北京故宫博物院',
      rating: '4.5',
      cost: '25',
      location: [116.46, 39.92],
      address: '东城区景山前街4号',
      tel: '88895199;15008998190',
      photos: [
        {
          title: '故宫',
          url:
            'http://p0.meituan.net/travel/83544ca4b38bbe0f7644982c3528defd117921.jpg@660w_500h_1e_1c'
        },
        {
          title: '故宫',
          url:
            'http://p1.meituan.net/poi/da126392d46c5dc80ee94fef84385569821248.jpg'
        },
        {
          title: '故宫',
          url:
            'http://p1.meituan.net/poi/e732ed2314a1a2619e6c3254fd2f1fd0112611.jpg'
        },
        {
          title: '故宫',
          url:
            'http://p0.meituan.net/poi/e7d94c4d609e5dd4d71bcea6a5eb0c5e220371.jpg'
        }
      ]
    },
    more: ctx.isAuthenticated()
      ? [
          {
            photos: [
              {
                title: '故宫',
                url:
                  'http://p0.meituan.net/travel/83544ca4b38bbe0f7644982c3528defd117921.jpg@660w_500h_1e_1c'
              }
            ],
            name: '北京故宫博物院',
            ticket_ordering: '20',
            deadline: '2019-06-05',
            cost: '25'
          }
        ]
      : [],
    login: ctx.isAuthenticated()
  }
})

export default router
