import request from '@/utils/request'

// 权限管理相关的API请求函数
const api_name = '/admin/acl/role'

export default{
    // 获取权限（菜单/功能）列表
    getPageList(page, limit, searchObj){
        return request({url:`${api_name}/${page}/${limit}`, method:'get', params: searchObj})
    },

    // 获取某个角色
    getById(id){
        return request({url:`${api_name}/get/${id}`, method:'get'})
    },

    // 新增或者修改角色
    saveOrUpdate(role){
        if(role.id){
            return request({url:`${api_name}/update`,method:'put',data:role})
        }else{
            return request({url:`${api_name}/save`,method:'post',data:role})
        }
    },
    
    // 根据id删除一个角色
    remove(id){
        return request({url:`${api_name}/remove/${id}`,method:'delete'})
    },
    // 批量删除
    batchRemove(ids){
        return request({url:`${api_name}/batchRemove`, method:'post', data:ids})
    }

}