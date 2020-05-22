import { OPEN_LOADING, CLOSE_LOADING } from './mutation-types.js'
  export default {
    [OPEN_LOADING] (state) {
      state.requestLoading = true;
    },
    [CLOSE_LOADING] (state) {
        state.requestLoading = false;
    }
  }