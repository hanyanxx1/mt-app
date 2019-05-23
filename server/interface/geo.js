import Router from 'koa-router'
import config from '../dbs/config'
import { ErrorModel } from '../dbs/models/resModel'
import Menu from '../dbs/models/menu'
import Province from '../dbs/models/province'
import City from '../dbs/models/city'
import axios from './utils/axios'

const router = new Router({ prefix: '/geo' })

/**
 * 获取地理位置信息
 */
router.get('/getPosition', async (ctx, next) => {
  const { status, data } = await axios.get(config.ipUrl.url)
  if (status === 200 && data) {
    const result = await axios.get(
      `http://api.map.baidu.com/location/ip?ip=${data.query}&ak=${
        config.baiduAk.ak
      }`
    )
    if (result.status === 200) {
      const cityDate = result.data
      if (cityDate) {
        ctx.body = {
          province: cityDate.content.address_detail.province,
          city: cityDate.content.address_detail.city
        }
      }
    } else {
      ctx.body = new ErrorModel('获取城市地址失败')
    }
  } else {
    ctx.body = new ErrorModel('请求ip地址网络错误')
  }
})

// 省接口
router.get('/province', async ctx => {
  const province = await Province.find()
  ctx.body = {
    province: province.map(item => {
      return {
        id: item.id,
        name: item.value[0]
      }
    })
  }
})

// 获取城市
router.get('/city', async ctx => {
  let city = []
  const result = await City.find()
  result.forEach(item => {
    city = city.concat(item.value)
  })
  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name:
          item.name === '市辖区' || item.name === '省直辖县级行政区划'
            ? item.province
            : item.name
      }
    })
  }
})

// 根据省Id获取市
router.get('/province/:id', async ctx => {
  const city = await City.findOne({ id: ctx.params.id })
  ctx.body = {
    code: 0,
    city: city.value.map(item => {
      return {
        id: item.id,
        province: item.province,
        name: item.name
      }
    })
  }
})

// 热门城市
router.get('/hotCity', async ctx => {
  const list = [
    '北京市',
    '上海市',
    '广州市',
    '深圳市',
    '天津市',
    '西安市',
    '杭州市',
    '南京市',
    '武汉市',
    '成都市'
  ]
  const result = await City.find()
  let nList = []
  result.forEach(item => {
    nList = nList.concat(
      item.value.filter(k => list.includes(k.name) || list.includes(k.province))
    )
  })
  ctx.body = {
    hots: nList
  }
})

router.get('/menu', async ctx => {
  const result = await Menu.findOne()
  ctx.body = {
    menu: result.menu
  }
})

export default router
