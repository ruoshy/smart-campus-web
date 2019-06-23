<template>
  <div>
    <!--头部-->
    <div id="head-frame">
      <!--logo-->
      <img :src='require("@/assets/logo.png")' style="width: 110px;margin-left: 80px;float: left">
      <img :src='require("@/assets/logot.png")' style="width: 200px;margin-top: 25px">
    </div>
    <!--login-->
    <div id="login-frame">
      <div style="width: 260px;margin: 0 auto">
        <span style="margin-bottom: 20px;display: block;margin-top: 35px;font-size: 25px">登录</span>
        <!--学校-->
        <div style="padding-bottom: 30px;height: 35px">
          <input type="text" autocomplete="off" placeholder="学校" @focus="school_list.flag=1"
                 v-model="school"
                 style="display: block;width: 230px;height: 35px;line-height:35px;border: gainsboro solid 1px;padding: 0 10px">
          <ul id="search-list" v-show="school_list.show===1">
            <li v-for="(item,index) in school_list.list" :key="index" @click="school_switch(item)">
              {{item.name}}
            </li>
          </ul>
        </div>
        <!--账号-->
        <div style="margin-bottom: 30px;">
          <IInput placeholder="账号" v-model="user" width="250"/>
          <!--<input type="text" placeholder="账号" v-model="user">-->
        </div>
        <!--密码-->
        <div>
          <IInput type="password" placeholder="密码" v-model="password" width="250"/>
          <!--<input type="password" placeholder="密码" v-model="password">-->
        </div>
        <button type="button" @click="login">登录</button>
      </div>
    </div>
    <!--背景-->
    <div style="width: 100%;height: 100%;overflow-x:hidden;">
      <img :src='require("@/assets/login_bg.png")' class="bg">
    </div>

    <IMask :show="mask_show" @click="exitModal"/>
    <IModal :show="model_show" @confirm="exitModal" @cancel="exitModal" title="失败"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">登录失败,请重新输入!</span>
      </div>
    </IModal>
  </div>
</template>

<script>

  import IInput from '../components/IInput'
  import IMask from '@/components/IMask'
  import IModal from '@/components/IModal'

  export default {
    name: 'Login',
    components: {IModal, IMask, IInput},
    data () {
      return {
        mask_show: false,
        model_show: false,
        school: '',
        school_id: '',
        query_school_name: '',
        user: '',
        password: '',
        search_time: null,
        //flag 请求开关,show 显示开关,list 数据列表
        school_list: {flag: 0, show: 0, list: []}
      }
    },
    methods: {
      exitModal () {
        this.mask_show = false
        this.model_show = false
      },
      login () {
        if (this.user === '') {
          return
        }
        if (this.password === '') {
          return
        }
        if (this.school_id === '') {
          return
        }
        this.axios.post('/login/adm', {user: this.user, password: this.password, id: this.school_id})
          .then((response) => {
            if (JSON.stringify(response.data)!=="null") {
              this.$store.state.info.admin_id = response.data.id
              this.$store.state.info.school_id = response.data.school_id
              this.$store.state.info.school_name = response.data.name
              this.$store.commit('setInfo')
              this.$router.push('index')
            }else{
              this.mask_show = true
              this.model_show = true
            }
          })
      },
      search_school () {
        if (this.school.trim().length > 0) {
          this.axios.get('/login/sl?name=' + this.school.trim()).then((response) => {
            if (response.data.length > 0) {
              this.school_list.list = response.data
              this.school_list.show = 1
            }
          })
        }
      }, school_switch (item) {
        this.school_id = item.id
        this.school = item.name
        this.query_school_name = item.name
        this.school_list.flag = 0
        this.school_list.show = 0
        this.school_list.list = []
      }
    }, watch: {
      school () {
        this.school_list.list = []
        clearTimeout(this.timeout)
        if (this.school_list.flag === 1) {
          this.timeout = setTimeout(() => {
            this.search_school()
          }, 300)
        }
      }
    }
  }
</script>

<style scoped>
  .bg {
    /*width: 100%;*/
    /*height: 100%;*/
  }

  #head-frame {
    width: 100%;
    height: 100px;
    top: 0;
    z-index: 999;
    position: fixed;
    background: black;
    opacity: 0.3;
  }

  #login-frame {
    width: 500px;
    height: 400px;
    position: absolute;
    background: white;
    opacity: 0.9;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -175px;
    border-radius: 7px;
    box-shadow: 0 0 5px #777;
  }

  #login-frame input {
    width: 240px;
    height: 35px;
    border: gainsboro solid 1px;
    border-radius: 3px;
    padding: 0 10px;
  }

  #login-frame button {
    margin-top: 30px;
    font-size: 17px;
    background: #3E83F7;
    width: 260px;
    height: 35px;
    line-height: 30px;
    text-align: center;
    color: #fff;
  }

  #search-list {
    list-style: none;
    width: 250px;
    background: white;
    position: relative;
    border-color: #eee;
    box-shadow: 0 1px 3px #999;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    border-style: solid;
    padding: 7px 0;
    margin-top: 1px;
    border-radius: 4px;
  }

  #search-list li {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    line-height: 25px;
  }

  #search-list li:hover {
    background: #6EADF8;
    color: white;
  }
</style>
