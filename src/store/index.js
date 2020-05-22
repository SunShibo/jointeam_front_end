import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters.js'
import loading from './modules/loading'

Vue.use(Vuex)
const state = {
  requestLoading: false
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    loading //loading加载控制
  }
})