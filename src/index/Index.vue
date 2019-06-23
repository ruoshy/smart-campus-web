<template>
  <div style="min-width: 1000px">
    <!--tab栏-->
    <transition name="itab">
      <div id="tab" v-if="show_tab"
           :style="{height: winH+'px',width:tabW+'px'}"
           style="box-shadow: 0 0 3px #333;float: left;background: #333">
        <img src="../assets/logot.png" style="width: 150px;margin:20px 15px">
        <!--选项-->
        <div v-for="(array,index) in tab_list" :key="index" class="tab-bar">
          <!--标题-->
          <span @click="open_list(index)">
          <img :src='require("@/assets/tab/"+array.icon)' class="tab-bar-icon">
          {{array.title}}
          <img class="tab-bar-flag" src="../assets/tab/tab-flag.png"
               :class="tab_list[index].show===1?'tab-select-ope':'tab-select-ext'">
        </span>
          <!--子选项-->
          <div style="overflow: hidden;-webkit-backface-visibility: hidden;">
            <transition name="tab-bat">
              <div v-if="tab_list[index].show===1">
          <span v-for="(item,index2) in array.list" :key="index2"
                style="padding-left: 40px;"
                @click="child_jump(item,array.title)">{{item.name}}</span>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
    <!--主体-->
    <div style="background: #eee;" :style="{height: winH+'px'}">
      <!--头部-->
      <div style="background: white;box-shadow:2px -2px 5px black;">
        <img src="../assets/tab/tat.png" class="i-bt"
             style="width: 25px;display: inline-block;margin-left: 15px;cursor: pointer;float: left;margin-top: 12px"
             @click="closeTabBar"
             :class="show_tab?'tab-select-ope':'tab-select-ext'">
        <span style="line-height: 50px;color: #555;margin-left: 20px">{{this.$store.state.info.one_pos}}</span>
        <span style="line-height: 50px">/ {{this.$store.state.info.two_pos}}</span>
        <img @click="logout" src="../assets/exit.png" class="head-title i-bt exit">
        <span class="head-title">{{this.$store.state.info.school_name}}</span>
      </div>
      <!--内容-->
      <div :class="show_tab?'ovcont':''">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data () {
      return {
        show_tab: true,
        tabW: 180,
        winH: window.innerHeight,
        winW: window.innerWidth,
        tab_list:
          [
            {
              title: '基本信息',
              icon: 'base.png',
              show: 1,
              height: '250px',
              list: [
                {name: '简介', router: '/index'},
                {name: '系部', router: 'dep'},
                {name: '班级', router: 'classs'},
                {name: '专业', router: 'major'},
                {name: '教室', router: 'clasrom'}
              ]
            },
            {
              title: '账号管理',
              icon: 'user.png',
              show: 0,
              height: '100px',
              list: [{name: '教师', router: 'tec'}, {name: '学生', router: 'stu'}]
            },
            {
              title: '新闻管理',
              icon: 'news.png',
              show: 0,
              height: '100px',
              list: [{name: '发布', router: 'newsd'}, {name: '维护', router: 'newmg'}]
            },
            {
              title: '课程管理',
              icon: 'course.png',
              show: 0,
              height: '50px',
              list: [{name: '课程表', router: 'custab'}]
            }
          ]
      }
    }, methods: {
      closeTabBar () {
        this.show_tab = !this.show_tab
        this.$store.state.info.show_tab = this.show_tab
        this.$store.commit('setInfo')
      },
      open_list (index) {
        this.tab_list[index].show = this.tab_list[index].show === 1 ? 0 : 1
        this.$store.state.info.tab_list = JSON.stringify(this.tab_list)
        this.$store.commit('setInfo')
      },
      child_jump (item, group) {
        this.$router.push(item.router)
        this.$store.state.info.one_pos = group
        this.$store.state.info.two_pos = item.name
        this.$store.commit('setInfo')
      }, logout () {
        // 退出账户
        this.$router.push('/')
      }
    }, mounted () {
      const that = this
      window.onresize = function temp () {
        that.winH = window.innerHeight < 820 ? 820 : window.innerHeight
        that.winW = window.innerWidth
      }
    },
    created () {
      this.winH = window.innerHeight < 820 ? 820 : window.innerHeight
      this.winW = window.innerWidth
      if (this.$store.state.info.show_tab !== undefined) {
        this.show_tab = this.$store.state.info.show_tab
      }
      if (this.$store.state.info.tab_list !== undefined) {
        this.tab_list = JSON.parse(this.$store.state.info.tab_list)
      }
    }
  }
</script>

<style scoped>
  .ovcont {
    margin-left: 180px;
    transition: all .3s;

  }

  .head-title {
    color: black;
    font-size: 15px;
    margin-top: 13px;
    margin-right: 30px;
    display: inline-block;
    float: right;
  }

  .exit {
    width: 25px;
    margin-top: 12px;
    cursor: pointer;
  }

  .i-bt:hover {
    opacity: 0.6;
  }

  .i-bt:active {
    opacity: 1;
  }

  #tab {
    overflow: hidden;
  }

  #tab span {
    display: block;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    color: white;
    cursor: pointer;
    /*font-weight: bold;*/
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tab-bar span:hover {
    background: #555;
  }

  .tab-bar-icon {
    float: left;
    width: 18px;
    margin-top: 15px;
    margin-right: 10px;
  }

  .tab-bar-flag {
    width: 15px;
    float: right;
    margin-top: 17px;
    margin-right: 15px;
  }

  .tab-bar-body {
    margin-left: 180px;
  }

  /*tab选择箭头动画*/
  .tab-select-ope {
    transform: rotate(90deg);
    transition: all .2s;
  }

  .tab-select-ext {
    transition: all .2s;
  }

  /*tab选项动画*/
  .tab-bat-enter-active {
    animation: mask-in .3s;
  }

  .tab-bat-leave-active {
    animation: mask-in .3s reverse;
  }

  @keyframes mask-in {
    0% {
      margin-top: -100%;
    }
  }

  /*tab动画 */
  .itab-enter-active {
    animation: tab-in .3s;
  }

  .itab-leave-active {
    animation: tab-in 190ms reverse;
  }

  @keyframes tab-in {
    0% {
      margin-left: -180px;
    }
  }

</style>
