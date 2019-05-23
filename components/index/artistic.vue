<template>
  <section class="m-istyle">
    <dl @mouseover="over">
      <dt>有格调</dt>
      <dd :class="{ active: kind === 'all' }" kind="all" keyword="全部">
        全部
      </dd>
      <dd :class="{ active: kind === 'part' }" kind="feast" keyword="约会聚餐">
        约会聚餐
      </dd>
      <dd :class="{ active: kind === 'spa' }" kind="spa" keyword="丽人spa">
        丽人SPA
      </dd>
      <dd
        :class="{ active: kind === 'movie' }"
        kind="journey"
        keyword="电影演出"
      >
        电影演出
      </dd>
    </dl>
    <ul class="ibody">
      <li v-for="item in cur" :key="item.title">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img :src="item.img" class="image" />
          <ul class="cbody">
            <li class="title">{{ item.title }}</li>
            <li class="pos">
              <span>{{ item.pos }}</span>
            </li>
            <li class="price">
              ￥<em>{{ item.price }}</em
              ><span>/起</span>
            </li>
          </ul>
        </el-card>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  data: () => {
    return {
      kind: 'all',
      list: {
        all: [],
        feast: [],
        spa: [],
        journey: []
      }
    }
  },
  computed: {
    cur: function() {
      return this.list[this.kind]
    }
  },
  mounted() {
    this.getData(this.kind)
  },
  methods: {
    over(e) {
      const dom = e.target
      const tag = dom.tagName.toLowerCase()
      if (tag === 'dd') {
        this.kind = dom.getAttribute('kind')
        if (this.list[this.kind].length > 0) {
          return
        }
        this.getData(this.kind)
      }
    },
    async getData(tab) {
      const self = this
      const { status, data } = await self.$axios.get(
        '/search/resultsByKeywords',
        { params: { tab } }
      )
      if (status === 200) {
        const currentTabData = data.data.map(item => {
          return {
            title: item.title,
            pos: item.bottomInfo,
            price: item.currentPrice,
            img:
              'https://p1.meituan.net/mogu/4aa363a920b92b922cfaa0298bcfbb65101055.jpg@368w_208h_1e_1c'
          }
        })
        self.list[data.tab.tab] = currentTabData
      } else {
        self.list[self.kind] = []
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/index/artistic.scss';
</style>
