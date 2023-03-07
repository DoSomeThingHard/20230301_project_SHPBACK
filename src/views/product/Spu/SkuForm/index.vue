<template>
  <div>
    <el-form ref="form"  label-width="80px">
        <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
        <el-form-item label="SKU名称">
            <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
            <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" ref="form" label-width="80px">
                <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="index">
                    <!-- 我们给对象新增一个属性 将内容搜集到这个属性上面 -->
                    <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
                        <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}}}`" v-for="(attrValue,index) in attr.attrValueList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true" ref="form" label-width="80px">
                <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="index">
                    <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
                        <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
            <el-table :data="spuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" prop="prop" width="80"> </el-table-column>
                <el-table-column prop="prop" label="图片" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.imageUrl" style="width:100px;height:100px">
                    </template>
                </el-table-column>
                <el-table-column prop="imageName" label="名称" width="width"></el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
                        <el-button v-else >默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 网络获取的图片
            spuImageList: [{imageUrl:'https://img0.baidu.com/it/u=4003041677,625388034&fm=253&fmt=auto&app=138&f=JPEG?w=799&h=500',imageName:'ss',isDefault:0},{isDefault:0}],   // 存储图片的信息
            spuSaleAttrList:[], // 存储销售属性
            attrInfoList: [],   // 存储平台属性的数据
            skuInfo:{   // 搜集sku信息
                category3Id:'',
                spuId:'',
                tmId:'',

                skuName:'',
                price:0,
                weight:'',
                skuDesc:'',
                skuDefaultImg: '',
                skuImageList:[],
                // 平台属性
                skuAttrValueList:[],
                // 销售属性
                skuSaleAttrValueList:[]
            },
            spu:{},
            // 搜集图片的数据字段 缺少isDefault字段
            imageList:[],
        }
    },
    methods: {
        // 获取SKUForm数据
        async getData(category1Id,category2Id,spu){
            // 搜集父组件给的数据
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.spuId = spu.id
            this.skuInfo.tmId = spu.tmId
            this.spu = spu
            // 获取图片数据
            let result = await this.$API.sku.reqSpuImageList(spu.id)
            if(result.code == 200){
                let list = result.data
                list.forEach(element => {
                    element.isDefault = 0
                });
                this.spuImageList = list
            }
            // 获取销售属性的数据
            let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
            if(result1.code == 200){
                this.spuSaleAttrList = result1.data
            }
            // 获取平台属性的数据
            let result2 = this.$API.sku.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
            if(result2.code == 200){
                this.attrInfoList = result2.data
            }
        },
        handleSelectionChange(params){
            // 这里收集到的数据是不完整的 缺少了 isDefault
            this.imageList = params
        },
        // 
        changeDefault(row){
            this.spuImageList.forEach(element => {
                element.isDefault = 0
            })
            row.isDefault = 1
            this.skuInfo.skuDefaultImg = row.imageUrl
        },
        cancel(){
            // 自定义事件
            this.$emit('changescene',0)
            // 清除数据
            Object.assign(this._data, this.$options.data())
        },
        // 新增保存
        async save(){
            // 整理参数
            const {attrInfoList, skuInfo,spuSaleAttrList,imageList} = this
            // // 新建一个数组
            // let arr = [];
            // // 把收集到的数据整理一下
            // attrInfoList.forEach(element=>{
            //     // 代表当前平台属性 用户进行了选择
            //     if(element.attrIdAndValueId){
            //         const[attrId,valueId] = element.attrIdAndValueId.split(':')
            //         // 携带给服务器的参数应该是对象
            //         let obj = {attrId,valueId}
            //         arr.push(obj)
            //     }
            // });
            // // 将整理好的值赋值给skuInfo.skuAttrValueList
            // skuInfo.skuAttrValueList = arr
            // 整理的是平台属性
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
                if(item.attrIdAndValueId){
                    const[attrId,valueId] = element.attrIdAndValueId.split(':') 
                    prev.push({attrId,valueId})
                }
                return prev
            },[])
            // 整理销售属性
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((reev,item)=>{
                if(item.attrIdAndValueId){
                    const[saleAttrId,saleAttrValueId] = element.attrIdAndValueId.split(':') 
                    prev.push({saleAttrId,saleAttrValueId})
                }
                return prev
            },[])
            // 整理图片数据
            skuInfo.skuImageList = imageList.map(item=>{
                return {
                    imgName:item.imgName,
                    imgUrl:item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })  
            console.log(skuInfo)
            // 然后发请求了
            let result = await this.$API.spu.reqAddSku(skuInfo)
            if(result.code == 200){
                this.$message({type:'success', message:'增加SKU成功'})
                this.$emit('changeScenes',0)
            }

        }
    },
}
</script>

<style>

</style>