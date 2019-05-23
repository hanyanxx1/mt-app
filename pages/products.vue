<template>
  <div class="page-product">
    <el-col :span="19">
      <crumbs :keyword="keyword" />
      <!--<category :types="types" :areas="areas" />-->
      <list :list="list" />
    </el-col>
    <el-col :span="5">
      <amap
        v-if="point.length"
        :width="230"
        :height="290"
        :point="point[currentMapIdx]"
        :position="position"
      />
    </el-col>
  </div>
</template>

<script>
import Crumbs from '../components/products/crumbs'
import List from '../components/products/list'
import Amap from '../components/public/map'
export default {
  name: 'Products',
  components: {
    List,
    Crumbs,
    // Category,
    Amap
  },
  data() {
    return {
      list: [],
      types: [],
      areas: [],
      keyword: '',
      point: [],
      position: 'fixed',
      count: 0,
      currentMapIdx: 0
    }
  },
  async asyncData(ctx) {
    const keyword = ctx.query.keyword
    const {
      status,
      data: { data: proData }
    } = await ctx.$axios.get('/search/getProductList', {
      params: {
        keyword
      }
    })
    if (status === 200) {
      const searchResult = proData.searchResult
      const result = {
        list: searchResult.map(item => {
          return {
            type: item.backCateName,
            img:
              'https://p0.meituan.net/travel/83544ca4b38bbe0f7644982c3528defd117921.jpg@220w_125h_1e_1c',
            name: item.title,
            comment: item.comments,
            rate: Number(item.avgscore),
            price: Number(item.avgprice),
            scene: item.tag,
            tel: '138XXXXXXXX',
            status: '可订明日',
            location: { latitude: item.latitude, longitude: item.longitude },
            module: item.backCateName,
            address: item.address
          }
        }),
        keyword,
        point: searchResult.map(item => {
          return [item.longitude, item.latitude]
        }),
        count: searchResult.length
      }
      return result
    }
  },
  mounted() {
    window.onscroll = this.onscroll
  },
  methods: {
    onscroll() {
      const topOffset = 264
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop > topOffset) {
        this.currentMapIdx = Math.floor((scrollTop - topOffset) / 172)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/products/index';
</style>
