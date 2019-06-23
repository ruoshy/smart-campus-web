<template>
  <div style="display: inline-block;">
    <div class="i-select" @click="click">
      <input disabled="disabled" :placeholder="placeholder" v-model="value" :style="{width:winW+'px'}">

      <img src="../assets/select-flag.png" :class="select_flag?'select-ope':'select-ext'">
    </div>
    <transition name="select-list">
      <ul class="select-list" v-if="select_flag" :style="{height:list.length*30+'px',width:(winW+43)+'px'}">
        <li v-for="(item,index) in list" :key="index" @click="choice(index)">
          {{item.name}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'IDropdown',
    props: {
      list: Array,
      placeholder: String,
      defval: String,
      winW: {type: Number, default: 99}
    },
    data () {
      return {
        value: '',
        select_flag: false,
        init: true
        // list: [{id: 1, name: "信息技术系", number: 2, school_id: 1}]
      }
    },
    methods: {
      click () {
        if (this.list.length > 0) {
          this.select_flag = !this.select_flag
        }
      },
      choice (index) {
        this.value = this.list[index].name
        this.click()
        this.$emit('reply', index, this.list[index].name)
      }
    },
    watch: {
      list () {
        this.value = this.init ? this.defval : ''
        this.init = false
        this.select_flag = false
      }
    },
    mounted () {
      if (this.defval !== undefined) {
        this.value = this.defval
      }
    }
  }
</script>

<style scoped>
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: lightgrey;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: lightgrey;
    opacity: 1;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: lightgrey;
    opacity: 1;
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: lightgrey;
  }

  .i-select {
    border-radius: 4px;
    border: #D8DDE3 solid 1px;
    padding-right: 10px;
    cursor: pointer;
    background: white;
  }

  .i-select input {
    height: 31px;
    border-radius: 4px;
    border-width: 0;
    padding: 0 10px;
    font-size: 13px;
    width: 100px;
    cursor: pointer;
  }

  .i-select:hover {
    border-color: #6EADF8;
  }

  .select-ope {
    transform: rotate(180deg);
    transition: all .3s;
  }

  .select-ext {
    transition: all .3s;
  }

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
