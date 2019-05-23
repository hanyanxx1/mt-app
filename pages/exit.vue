<template>
  <div></div>
</template>

<script>
import axios from '@/plugins/axios'
export default {
  name: 'Exit',
  layout: 'blank',
  middleware: async ctx => {
    const { status, data } = await axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>

<style lang="css"></style>
