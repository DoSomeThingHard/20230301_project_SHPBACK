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