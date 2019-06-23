<template>
  <!--模态框 动画-->
  <transition name="modal">
    <div class="modal" v-if="show" :style="{marginLeft:'-'+mgleft+'px',marginTop:'-'+mgtop+'px'}">
      <div class="modal-head">
        <span class="modal-head-title">{{title}}</span>
      </div>
      <slot></slot>
      <div class="modal-bottom" v-if="showb">
        <IButton @click="cancel">
          取消
        </IButton>
        <IButton @click="confirm" type="primary">
          确认
        </IButton>
      </div>
    </div>
  </transition>
</template>

<script>
  import IButton from './IButton'

  export default {
    name: 'IModal',
    components: {IButton},
    props: {
      title: String,
      show: Boolean,
      mgleft: {type: String, default: '240'},
      mgtop: {type: String, default: '240'},
      showb: {type: Boolean, default: true}
    },
    methods: {
      cancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$emit('confirm')
      }
    }

  }
</script>

<style scoped>
  /*模态框*/
  .modal-enter-active {
    animation: modal-in .3s;
  }

  .modal-leave-active {
    animation: modal-in .2s reverse;
  }

  @keyframes modal-in {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal {
    top: 50%;
    left: 50%;
    width: 480px;
    position: absolute;
    border-radius: 10px;
    background: #fff;
    box-shadow: 1px 1px 6px #666;
  }

  .modal-head {
    width: 94%;
    height: 45px;
    border-bottom: lightgrey solid 1px;
    margin: 0 3%;
  }

  .modal-head-title {
    line-height: 50px;
    padding-left: 10px;
    font-size: 18px;
    color: #4E5360;
    font-weight: bold;
  }

  .modal-bottom {
    width: 94%;
    height: 43px;
    border-top: lightgrey solid 1px;
    margin: 0 3%;
    padding-top: 7px;
    text-align: right;
  }
</style>
