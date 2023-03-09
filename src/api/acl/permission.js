import request from '@/utils/request'

// 接口文档 http://39.98.123.211:8170/swagger-ui.html#/permission45admin45controller

// 权限管理相关的API请求函数
const api_name = '/admin/acl/permission'

export default{
    // 获取权限（菜单/功能）列表
    getPermissionList(){ 
        return request({url:`${api_name}`, method:'get'})
    },

    // 删除一个权限项
    removePermission(id){
        return request({url:`${api_name}/remove/${id}`, method:'delete'})
    },

    // 保存一个权限项
    addPermission(permission){
        return request({url:`${api_name}/save`,method:'post',data:permission})
    },

    // 根据角色获取菜单
    toAssign(roleId){
        return request({url:`${api_name}/toAssign/${roleId}`, method:'get'})
    },

    // 给角色分配权限
    doAssign(id,ids){
        return request({url:`${api_name}/doAssignAcl`,method:'post',data:{"permissionIdList":ids,"roleId":id}})
    }
}