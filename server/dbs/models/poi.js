// import mongoose from 'mongoose'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Poi = new Schema({
  name: {
    type: String // 景点名
  },
  province: {
    type: String // 景点所在省份
  },
  city: {
    type: String // 城市
  },
  county: {
    type: String // 所在区县
  },
  areaCode: {
    type: String // 区号
  },
  tel: {
    type: String // 电话
  },
  area: {
    type: String // 地区 (商圈)
  },
  addr: {
    type: String // 地址
  },
  type: {
    type: String // 类型 （丽人，景点，餐饮，美食）
  },
  module: {
    // 子分类
    type: String
  },
  // 经度
  longitude: {
    type: Number
  },
  // 纬度
  latitude: {
    type: Number
  }
})

// 景点
// export default mongoose.model('Poi', Poi)
module.exports = mongoose.model('Poi', Poi)
