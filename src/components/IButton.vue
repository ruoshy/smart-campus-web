<template>
  <div :class="['i-button',type===undefined?'default':type]" @click="click">
    <span>
      <slot/>
    </span>
  </div>
</template>

<script>
  export default {
    name: "IButton",
    props: {
      size: Number,
      type: String
    },
    methods: {
      click() {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>
  .i-button {
    width: 73px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    text-align: center;
    font-size: 15px;
    display: inline-block;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .primary {
    background: #4E9AF7;
    color: white;
  }

  .error {
    background: #DB4E2B;
    color: white
  }

  .warning {
    background: #F29C38;
    color: white
  }

  .dashed {
    border-style: dashed;
    border-width: 1px;
    border-color: #DCDEE1;
    color: #757B89;
  }

  .default {
    background: white;
    border: #DCDEE1 solid 1px;
    color: #757B89;
  }

  .default:hover, .dashed:hover {
    border-color: #4E9AF7;
    color: #4E9AF7;
  }

  .i-button:hover {
    opacity: 0.8;
    transition: opacity .5s;
  }

  .i-button:active {
    opacity: 1;
  }

  input, button {
    -webkit-appearance: none;
    outline: none;
    border: none;
    background: none;
  }
</style>
