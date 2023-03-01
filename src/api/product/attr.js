import request from '@/utils/request'

// 获取一级的数据
export const reqCategoryList = ()=>request({url:'/admin/product/getCategory1', method:'get'});
// 获取二级的数据
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`, method:'get'});
// 获取三级的数据
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`, method:'get'});

export const reqAttrList = (category1Id,category2Id,category3Id)=> request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method:'get'})



