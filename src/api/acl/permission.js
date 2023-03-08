import request from '@/utils/request'

// 权限管理相关的API请求函数
const api_name = '/admin/acl/permission'

export default{
    // 获取权限（菜单/功能）列表
    getPermissionList(){
        return request({
            url:`${api_name}`,
            method:'get'
        })
    },

    // 删除一个权限项
    removePermission(id){
        return request({url:`${api_name}/remove/${id}`, method:'delete'})
    },

    // 保存一个权限项
    addPermission(permission){
        return request({url:`${api_name}/save`,method:'post',data:permission})
    }
}