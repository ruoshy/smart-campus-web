<template>
  <div class="i-input" :class="fous?'i-input-focus':''" @click="fous=true"
       :style="{width:width+'px',height: height+'px'}">
    <label>
      <input
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        @blur="fous=false"
        class="i-input-in" :type="type===undefined?'text':type"
        :style="{borderColor:fous?'#6EADF8':'',width:(width-22)+'px',height: height+'px'}" :placeholder="placeholder">
    </label>
  </div>
</template>

<script>
  export default {
    name: 'IInput',
    data () {
      return {
        fous: false
      }
    },
    props: {
      width: {type: String, default: '160'},
      height: {type: String, default: '35'},
      placeholder: String,
      type: String,
      value: String,
    },
    watch: {
      fous () {
        this.$emit('focus', this.fous)
      }
    }
  }
</script>

<style scoped>
  .i-input {
    border-width: 2px;
    border-style: solid;
    border-color: white;
    border-radius: 5px;
    display: inline-block;
  }

  .i-input-focus {
    box-shadow: 0 0 2px #DCEBFD;
    border-color: #DCEBFD;
    transition: all .3s;
  }

  .i-input-in:hover {
    border-color: #6EADF8;
  }

  .i-input-in {
    font-size: 13px;
    padding: 0 10px;
    border: #D8DDD9 solid 1px;
    border-radius: 3px;
    color: #4E5360;
  }

  input, button {
    -webkit-appearance: none;
    outline: none;
    border: none;
    background: none;
  }

</style>
