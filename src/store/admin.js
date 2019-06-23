import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    one_pos: '基本信息',
    two_pos: '简介',
    info: JSON.parse(localStorage.getItem('info')) || {}
  },
  mutations: {
    setInfo(state) {
      localStorage.setItem('info', JSON.stringify(state.info));
    }
  }
});

export default store
