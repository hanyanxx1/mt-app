<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }"
        >{{ city }}美团</el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><a href="/"
          >{{ city }}{{ decodeURIComponent(keyword) }}</a
        ></el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Crumbs',
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  computed: mapState({
    city: state => state.geo.position.city.replace('市', '')
  })
}
</script>

<style lang="css"></style>
