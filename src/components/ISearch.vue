<template>
  <div>
    <IInput :placeholder="placeholder" width="250" v-model="value" @click="show=!show" @focus="focus"/>
    <transition name="select-list">
      <ul class="select-list" style="width: 245px;height: 150px;margin-left: 4px" v-if="show">
        <li v-for="(item,index) in list" :key="index" @click="click(item)">
          {{item.name}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
  import IInput from '@/components/IInput'

  export default {
    name: 'ISearch',
    data () {
      return {
        show: false,
        value: '',
        timeout: undefined
      }
    },
    methods: {
      focus (flag) {
        this.show = flag
      },
      click (item) {
        this.value = item.name
        this.$emit('click', item)
      }
    },
    components: {IInput},
    props: {
      list: Array,
      placeholder: {type: String, default: ''}
    },
    watch: {
      value (val) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.$emit('change', val)
        }, 300)
      }
    }
  }
</script>

<style scoped>
  .select-list {
    position: absolute;
    background: white;
    float: left;
    padding: 0;
    margin-left: 2px;
    width: 143px;
    height: 30px;
    overflow: hidden;
    margin-top: 3px;
    box-shadow: 0 0 2px #999;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    z-index: 999;
  }

  .select-list li {
    list-style: none;
    padding: 0 10px;
    font-size: 13px;
    color: gray;
    line-height: 30px;
    height: 30px;
    cursor: pointer;
  }

  .select-list li:hover {
    background: #5FA4F8;
    color: white;
  }

  .select-list-enter-active {
    animation: mask-in .2s;
  }

  .select-list-leave-active {
    animation: mask-in .2s reverse;
  }

  @keyframes mask-in {
    0% {
      height: 20px;
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
</style>
