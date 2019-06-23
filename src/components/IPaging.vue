<template>
  <div>
    <IButton @click="reply('l')">上一页</IButton>
    <IButton class="i-paging-item" v-for="item in split" :key="item.pos"
             :type="position===item.pos?'primary':'default'" @click="reply('c',item.pos)">
      {{item.name}}
    </IButton>
    <IButton @click="reply('r')">下一页</IButton>
    <!--<IDropdown :list="[{name:'第一页'},]" :winW="50"/>-->
  </div>
</template>

<script>
  import IButton from '@/components/IButton'
  import IDropdown from '@/components/IDropdown'

  export default {
    name: 'IPaging',
    components: {IDropdown, IButton},
    data () {
      return {
        split: [],
        maxNum: 0,
        position: 1
      }
    },
    props: {
      rows: Number,
      max: Number
    },
    methods: {
      proSplit () {
        this.split = []
        this.maxNum = Math.ceil(this.max / this.rows)
        let posb = this.position > 1 ? this.position - 1 : 1
        if (posb > this.maxNum - 5) {
          posb = this.maxNum - 5
        }
        if (posb <= 0) {
          posb = 1
        }
        for (let i = posb; i <= this.maxNum; i++) {
          let item = {}
          let num = this.position > 1 ? 3 : 4
          if (i > this.position + num) {
            item.name = '...'
            item.pos = this.maxNum
            this.split.push(item)
            break
          } else {
            item.name = i
            item.pos = i
            this.split.push(item)
          }
        }
      },
      reply (key, pos) {
        if (this.max < this.rows) {
          return
        }
        if (key === 'c') {
          // 跳转
          if (this.position === pos) {
            return
          }
          this.position = pos
        } else if (key === 'l') {
          // 上一页
          if (this.position === 1) {
            return
          }
          this.position -= 1
        } else {
          // 下一页
          if (this.position === this.maxNum) {
            return
          }
          this.position += 1
        }
        this.proSplit()
        // 换页 返回当前位置
        this.$emit('reply', this.position)
      }
    },
    watch: {
      max () {
        this.proSplit()
      }
    }
  }
</script>

<style scoped>
  .i-paging-item {
    width: 30px !important;
    height: 30px !important;
    margin: 0 3px;
  }
</style>
