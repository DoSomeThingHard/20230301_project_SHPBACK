//  这个模块主要是获取品牌管理的接口
import request from '@/utils/request'

// 获取品牌管理列表 admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit)=> request({url:`/admin/product/baseTrademark/${page}/${limit}`, method:'get'})

// 处理添加品牌的操作 admin/product/baseTrademark/save  post  携带 tmName logoUrl  id不要
// 处理修改品牌的操作 admin/product/baseTrademark/update   put
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 判断对象是否包含id
    if(tradeMark.id){
        // 修改
        return request({url:'admin/product/baseTrademark/update',method:'put',data:tradeMark})
    }else{
        // 新增
        return request({url:'admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

// 删除品牌的接口
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
