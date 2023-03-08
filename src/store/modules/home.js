import mockRequest from '@/utils/mockRequest'

const state = {
    list:{}
}

const mutations = {
    GETDATA(state, list){
        state.list = list.list
    }
}

const actions = {
    // 发请求获取首页数据
    async getData ({commit}){
        let result = await mockRequest.get('/home/list')
        console.log(result)
        if(result.code == 20000){
            commit('GETDATA', result.data)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
