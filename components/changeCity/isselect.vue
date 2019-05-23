<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select v-model="pvalue" placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select v-model="cvalue" :disabled="!city.length" placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from '@/plugins/axios'
export default {
  name: 'Isselect',
  data() {
    return {
      province: [],
      pvalue: '',
      city: [],
      cvalue: '',
      input: '',
      cities: []
    }
  },
  watch: {
    async pvalue(newPvalue) {
      const self = this
      const {
        status,
        data: { city }
      } = await axios.get(`/geo/province/${newPvalue}`)
      if (status === 200) {
        self.city = city.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        self.cvalue = ''
      }
    }
  },
  async mounted() {
    const self = this
    const {
      status,
      data: { province }
    } = await axios.get('/geo/province')
    if (status === 200) {
      self.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    querySearchAsync: _.debounce(async function(query, cb) {
      const self = this
      // 如果变量里已经有全国城市俩表了，直接返回过滤后的搜索结果
      console.log(self.cities.length)
      if (self.cities.length) {
        cb(self.cities.filter(item => item.value.indexOf(query) > -1))
      } else {
        const {
          status,
          data: { city }
        } = await axios.get('/geo/city')
        if (status === 200) {
          self.cities = city.map(item => ({
            value: item.name
          }))
          cb(self.cities.filter(item => item.value.indexOf(query) > -1))
        } else {
          const emptyArr = []
          cb(emptyArr)
        }
      }
    }, 200),
    handleSelect() {
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/changecity/iselect.scss';
</style>
