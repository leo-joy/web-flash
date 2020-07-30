import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { listForRouter } from '@/api/system/menu'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  permissions: null,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_COMPANYS: (state, companys) => {
    state.companys = companys
  }
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(response)
        commit('SET_TOKEN', data.token)
        setToken(data.token)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (data) {
          const { name, profile, permissions, roles, companys } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', profile.avatar)
          commit('SET_PROFILE', profile)
          commit('SET_ROLES', roles)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_COMPANYS', companys)
          resolve(data)
        } else {
          reject('Verification failed, please Login again.')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_PROFILE', {})
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_COMPANYS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  updateToken({ commit }, { token }) {
    console.log('newToken', token)
    commit('SET_TOKEN', token)
    setToken(token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

