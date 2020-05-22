const loading = {
  state: {
    requestLoading: false
  },
  mutations: {
    OPEN_LOADING (state) {
      state.requestLoading = true;
    },
    CLOSE_LOADING (state) {
      state.requestLoading = false;
    }
  }
}

export default loading
