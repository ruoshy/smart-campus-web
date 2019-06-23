<template>
  <transition name="mask">
    <!--遮罩-->
    <div style="width: 100%;height: 100%;background: black;position: absolute;left: 0;top: 0;opacity: 0.5;"
         v-if="show" @click="click"></div>
  </transition>
</template>

<script>
  export default {
    name: "IMask",
    props: {
      show: Boolean
    },
    methods: {
      click() {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>
  /*遮罩*/
  .mask-enter-active {
    animation: mask-in .3s;
  }

  .mask-leave-active {
    animation: mask-in .2s reverse;
  }

  @keyframes mask-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.5;
    }
  }
</style>
