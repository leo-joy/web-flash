import { getList as getUserList } from '@/api/system/user'

const state = {
  userList: []
}

const mutations = {
  SET_USERLIST: (state, userlist) => {
    state.userList = userlist
  }
}

const actions = {
  // get user info
  getUserList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserList({ page: 1, limit: 50000 }).then(response => {
        const { records } = response.data
        if (!records) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_USERLIST', records)
        resolve(records)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  removeUserList({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_USERLIST', [])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

