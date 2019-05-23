<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left"
        ><a href="/">
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团"
        />
      </a></el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家或地点"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, index) in hotPlace" :key="index">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item, index) in searchList" :key="index">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            v-for="(item, idx) in hotPlace"
            :key="idx"
            :href="'/products?keyword=' + encodeURIComponent(item.name)"
          >
            {{ item.name }}
          </a>
        </p>
        <ul class="nav">
          <li><nuxt-link to="/" class="takeout">美团外卖</nuxt-link></li>
          <li><nuxt-link to="/" class="movie">猫眼电影</nuxt-link></li>
          <li><nuxt-link to="/" class="hotel">美团酒店</nuxt-link></li>
          <li><nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link></li>
          <li><nuxt-link to="/" class="business">商家入驻</nuxt-link></li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li>
            <i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li>
            <i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from '@/plugins/axios'
import { mapState } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      search: '',
      isFocus: false,
      // hotPlace: [],
      searchList: []
    }
  },
  computed: {
    isHotPlace() {
      return this.isFocus && !this.search
    },
    isSearchList() {
      return this.isFocus && this.search
    },
    ...mapState({
      city: state => state.geo.position.city,
      hotPlace: state => state.home.hotPlace.slice(0, 5)
    })
  },
  methods: {
    focus() {
      this.isFocus = true
    },
    blur() {
      const self = this
      setTimeout(() => {
        self.isFocus = false
      }, 200)
    },
    input: _.debounce(async function() {
      const self = this
      self.searchList = []
      const {
        status,
        data: { top }
      } = await axios.get('/search/top', {
        params: {
          input: self.search,
          city: self.city
        }
      })
      if (status === 200) {
        self.searchList = top.slice(0, 10)
      }
    }, 300)
  }
}
</script>
