<template>
  <div class="page-cart">
    <el-row>
      <el-col v-if="cart.length" :span="24" class="m-cart">
        <List :cart-data="cart" />
        <p>
          应付金额：<em class="money">￥{{ total }}</em>
        </p>
        <div class="post">
          <el-button type="primary" @click="submit">提交订单</el-button>
        </div>
      </el-col>
      <el-col v-else class="empty">购物车为空</el-col>
    </el-row>
  </div>
</template>

<script>
import List from '../components/cart/list'
import axios from '@/plugins/axios'
export default {
  name: 'Cart',
  components: {
    List
  },
  data() {
    return {
      cart: []
    }
  },
  computed: {
    total() {
      let total = 0
      this.cart.forEach(item => {
        total += item.price * item.count
      })
      return total
    }
  },
  async asyncData(ctx) {
    const {
      status,
      data: {
        code,
        data: { name, price }
      }
    } = await ctx.$axios.post('/cart/getCart', {
      id: ctx.query.id
    })
    if (status === 200 && code === 0 && name) {
      return {
        cart: [
          {
            name,
            price,
            count: 1
          }
        ],
        cartNo: ctx.query.id
      }
    }
  },
  methods: {
    async submit() {
      const {
        status,
        data: { code }
      } = await axios.post('/order/createOrder', {
        params: {
          id: this.$route.query.id,
          price: this.total,
          count: this.cart.length
        }
      })

      if (status === 200 && code === 0) {
        window.location = '/order'
      } else {
        console.log('添加订单失败')
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/cart/index';
</style>
