import request from '@/utils/request'

// 权限管理相关的API请求函数
const api_name = '/admin/acl/role'

export default{
    // 获取权限（菜单/功能）列表
    getPageList(page, limit, searchObj){
        return request({
            url:`${api_name}/${page}/${limit}`,
            method:'get',
            params: searchObj
        })
    },

    // 获取某个角色
    getById(id){
        return request({url:`${api_name}/get/${id}`, method:'get'})
    },
    
    // 保存一个角色
    save(role){
        return request({url:`${api_name}/save`,method:'post',data:role})
    }
}