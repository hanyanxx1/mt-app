<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <a :href="'#city-' + item">{{ item }}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-' + item.title">{{ item.title }}</dt>
      <dd>
        <span v-for="c in item.city" :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import pyjs from 'js-pinyin'
export default {
  name: 'Category',
  data() {
    return {
      list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block: []
    }
  },
  async mounted() {
    const self = this
    const blocks = []
    const {
      status,
      data: { city }
    } = await axios.get('/geo/city')
    if (status === 200) {
      let p
      let c
      const d = {}
      city.forEach(item => {
        p = pyjs
          .getFullChars(item.name)
          .toLocaleLowerCase()
          .slice(0, 1) // 获取拼音的全拼的小写，首字母
        c = p.charCodeAt(0) // 获取他的code值
        // 小写的a~z  a(97)~z(122)
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = []
          }
          d[p].push(item.name)
        }
      })
      for (const [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        })
      }
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      self.block = blocks
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/changeCity/categroy';
</style>
