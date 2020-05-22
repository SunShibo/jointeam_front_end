import {
    OPEN_LOADING,
    CLOSE_LOADING
} from './mutation-types.js'
export default {
    openLoading({
        commit,
        state
    }) {
        commit(OPEN_LOADING)
    },
    closeLoading({
        commit,
        state
    }) {
        commit(CLOSE_LOADING)
    }
}