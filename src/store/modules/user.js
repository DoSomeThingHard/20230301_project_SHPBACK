import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter,asyncRoutes,constantRoutes, anyRoutes } from '@/router'
// 引入router
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    routes: [], // 服务器返回的菜单的信息 不同角色不一样 数组中是字符串
    buttons:[], // 按钮权限信息
    roles:[], // 角色信息
    name: '',
    avatar: '',
    // 对比之后【项目中已有的和服务器返回的标记进行比较】
    resultAsyncRoutes:[],
    // 用户最终需要展示全部路由
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) =>{
    // 存储用户名
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    // 菜单权限的标记
    state.routes = userInfo.routes
    // 按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 对比存储用户该有的路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes) =>{
    state.resultAsyncRoutes = asyncRoutes;
    // 计算出全部需要的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if(result.code == 20000){
      // vuex存储Token
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 服务器返回用户信息
        // 返回的数据包括  用户名name、头像avatar、routes 返回的标识 不同用户不同标签
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // vuex存储用户全部的信息
        console.log(data)
        commit('SET_USERINFO',data)
        // asyncRoutes 和 data.routes 进行对比
        commit('SET_RESULTASYNCROUTES',computedAsnycRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

const computedAsnycRoutes = (asyncRoutes, routes)=>{
  // console.log('11', asyncRoutes)
  // console.log('22', routes)
  // 需要过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // 看看数组中是否包含
    if(routes.indexOf(item.name) != -1){
      // 这里需要递归
      if(item.children && item.children.length){
        item.children = computedAsnycRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

