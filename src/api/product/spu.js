import request from '@/utils/request'

// 获取SPU列表数据的接口
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// 获取SPU信息
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
// 获取品牌信息
export const reqTradeMarkList = ()=>request({url:'admin/product/baseTrademark/getTrademarkList',method:'get'})
// 获取SPU图标
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
// 获取平台全部销售属性
export const reqBaseSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList', method:'get'})

// 修改或者添加SPU
export const reqAddOrUpdateSpu = (supInfo)=>{
    // 根据是否有id来区分是修改还是添加
    if(supInfo.id){
        return request({url:'/admin/product/updateSpuInfo', method:'post', data:supInfo})
    }else{
        return request({url:'/admin/product/saveSpuInfo', method:'post', data:supInfo})
    }
}
// 删除SPU
export const reqDeleteSpu = (spuId)=>request({url:`admin/product/deleteSpu/${spuId}`, method:'delete'})


