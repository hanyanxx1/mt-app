import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import user from './modules/user'
import home from './modules/home'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    modules: {
      geo,
      user,
      home
    },
    actions: {
      async nuxtServerInit({ commit }, { req, app }) {
        // 获取地理位置
        const {
          status: posStatus,
          data: { province, city }
        } = await app.$axios.get('/geo/getPosition')
        commit(
          'geo/setPosition',
          posStatus === 200 ? { city, province } : { city: '', province: '' }
        )

        // 获取用户名
        const {
          status: userStatus,
          data: {
            code,
            data: { user }
          }
        } = await app.$axios.get('/users/getUser')
        commit(
          'user/setUser',
          userStatus === 200 && code === 0
            ? global.decodeURIComponent(user)
            : ''
        )

        // 获取menu
        const {
          status: homeStatus,
          data: { menu }
        } = await app.$axios.get('geo/menu')
        commit('home/setMenu', homeStatus === 200 ? menu : [])

        // 请求热门搜索
        const {
          status: hotStatus,
          data: { result }
        } = await app.$axios.get('/search/hotPlace', {
          params: {
            city: app.store.state.geo.position.city.replace('市', '')
          }
        })
        commit('home/setHotPlace', hotStatus === 200 ? result : [])
      }
    }
  })

export default store
