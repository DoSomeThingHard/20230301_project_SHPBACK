import request from '@/utils/request'

const api_name = '/admin/acl/user'

export function login({username, password}){
    return request({
        url:'/admin/acl/index/login',
        method:'post',
        data:{username,password}
    })
}

export function getInfo(){
    return request({
        url:'/admin/acl/index/info',
        method:'get'
    })
}

export function logout(){
    return request({
        url:'/admin/acl/index/logout',
        method:'post'
    })
}

// 获取用户列表
export function getPageList(page,limit,searchObj){
    return request({
        url:`/admin/acl/user/${page}/${limit}`,
        method:'get',
        params: searchObj
    })
}

// 添加用户
export function addOrUpdateUser(user){
    if(user.id){
        // 修改用户
        return request({url:'/admin/acl/user/update',method:'put',data:user})
    }else{
        // 新增用户
        return request({url:'/admin/acl/user/save',method:'post',data:user})
    }
}

// 删除用户
export function removeById(id){
    return request({
        url:`/admin/acl/user/remove/${id}`,
        method:'delete'
    })
}

// 根据用户获取角色数据
export function getRoles(id){
    return request({
        url:`/admin/acl/user/toAssign/${id}`,
        method:'get'
    })
}

// 根据用户的id分配角色
export function assignRoles(userId,roleId){
    return request({
        url:'/admin/acl/user/doAssign',
        method:'post',
        params:{userId:userId,roleId:roleId}    // query参数需要传递到params里面
    })
}

// 批量删除
export function removeUsers(idList){
    console.log(idList)
    return request({
        url:'/admin/acl/user/batchRemove',
        method:'post',
        data:idList   
    })
}
