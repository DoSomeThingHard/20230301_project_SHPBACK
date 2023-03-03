<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
            <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select v-model="spu.tmId" placeholder="请选择品牌">
                <el-option v-for="(tm,index) in tradeMarkList" :key="index" :label="tm.tmName" :value="tm.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input v-model="spu.description" type="textarea" rows="4" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- 上传图片： 
            action 图片上传的地址   list-type:文件列表类型  on-preview:预览
            file-list:上传的文件列表[{name: url: }]
             -->
             <!-- https://jsonplaceholder.typicode.com/posts/ -->
             <!-- /dev-api/admin/product/fileUpload -->
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handleSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <!-- 这里仅仅是搜集的就是下面模板字符串的内容 放到了 attrIdAndAttrName 这个字段上面 -->
            <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}个未选中`">
                <!-- :value里面可以写模板字符串 多收集一些信息  -->
                <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="(unSelect,index) in unSelectSaleAttr" :key="index"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled='!attrIdAndAttrName' @click="addSaleAttr">添加销售属性</el-button>
            <!-- 销售属性的配置 -->
            <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80"> </el-table-column>
                <el-table-column prop="saleAttrName" label="属性名" width="width"> </el-table-column>
                <el-table-column prop="prop" label="属性值名称列表" width="width">
                    <template slot-scope="{row, $index}">
                        <!-- 标签 -->
                        <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)"> {{tag.saleAttrValueName}}</el-tag>
                        <!-- 输入 -->
                        <el-input class="input-new-tag" v-if="inputVisibleIndex == $index" v-model="inputValue" :ref="$index" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"></el-input>
                        <!-- 新增按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput($index)">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{row, $index}">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
      return {
        dialogImageUrl: '',     // 需要放大的图片
        dialogVisible: false,   // 显示图片的放大框
        // spu属性 初始化是空的对象
        spu:{
            category3Id : undefined,
            description: '',
            spuName:'', 
            tmId:'', // 平台的id
            spuImageList:[],
            spuSaleAttrList:[   // 销售属性
                {saleAttrName:'颜色',saleAttrValueName:'blur', spuSaleAttrValueList:[
                    {id:8564,saleAttrName:'颜色',saleAttrValueName:'blur'}
                    ]}
            ],
        },     // 存储SPU信息属性
        tradeMarkList: [],  // 存储的是品牌的信息 网络请求来的
        spuImageList:[],    // spu图片  网络请求的和后期修改的
        saleAttrList: [{name:'颜色',id:1},{name:'尺码',id:2},{name:'ss',id:3}],   // 销售属性的数据网络请求来的

        inputVisibleIndex: undefined,
        inputValue: '',
        attrIdAndAttrName:'',  // 收集未选择的销售属性的id和名字
      };
    },
    computed:{
        // 计算出来 还没选择的销售属性
        unSelectSaleAttr(){
            const result = this.saleAttrList.filter((item)=>{
                // every数组的方法 返回一个布尔值
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name != item1.saleAttrName
                })
            })
            return result
        }
    },
    methods: {
        // 照片墙删除图片的时候触发 file是删除的  fileList是删除后剩余的图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.spuImageList = fileList;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(response, file, fileList){
        console.log(response,file,fileList)
        // 收集图片
        this.spuImageList = fileList;
      },
      //   初始化新增Spu的数据
      async addSpuData(category3Id){
        this.spu.category3Id = category3Id
        // 获取的是品牌的信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200){
            this.tradeMarkList = tradeMarkResult.data
        }
        // 获取平台全部的销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(saleResult.code == 200){
            this.saleAttrList = saleResult.data
        }
      },
      //   初始化SpuForm数据
      async initSpuData(spu){
        // 获取Spu信息的数据
        let spuResult = await this.$API.spu.reqSpu(spu.id)
        if(spuResult.code == 200){
            this.spu = spuResult.data
        }
        // 获取的是品牌的信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200){
            this.tradeMarkList = tradeMarkResult.data
        }
        // 获取spu图片的信息
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if(spuImageResult.code == 200){
            // this.spuImageList = spuImageResult.data
            // 我们先处理一下数据
            let listArr = spuImageResult.data
            // 由于照片墙的需要 需要修改
            listArr.forEach(element => {
                element.name = element.imgName;
                element.url = element.imgUrl;
            });
            // 把整理好的数据 赋值给
            this.spuImageList = listArr;
        }
        // 获取平台全部的销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(saleResult.code == 200){
            this.saleAttrList = saleResult.data
        }
      },
      // 显示输入框
      showInput(index) {
        this.inputVisibleIndex = index;
        this.$nextTick(_ => {
          this.$refs[index].focus();
        });
      },
      // 输入确认
      handleInputConfirm(row) {
        // 解析出销售属性中的数据
        let inputValue = this.inputValue.trim();
        // 需要加点条件 不能为空 不能重复
        if(inputValue==''){
            // this.$message('属性值不能为空')
            this.inputVisibleIndex = undefined;
            this.inputValue = '';
            return

        }
        let isNotRepeat = row.spuSaleAttrValueList.every( item => item.saleAttrValueName != inputValue )
        if(!isNotRepeat){
            this.$message('属性值不能重复')
            return 
        }
        const {baseSaleAttrId} =  row
        if (inputValue) {
            let newSaleAttrValue = {baseSaleAttrId, saleAttrValueName: inputValue}
            row.spuSaleAttrValueList.push(newSaleAttrValue);
        }
        this.inputVisibleIndex = undefined;
        this.inputValue = '';
      },
      // 添加新的销售属性
      addSaleAttr(){
          // 把搜集到的attrIdAndAttrName分割
          const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
          // 向spu对象的 spuSaleAttrList数组中添加对象
          let newSaleAttr = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList:[]}
          this.spu.spuSaleAttrList.push(newSaleAttr)
          this.attrIdAndAttrName = ''
      },
      // 新增或者是修改SPU
      async addOrUpdateSpu(){
        // 需要整理照片墙的数据 需要imageName 和 imageUrl
        // console.log(this.spuImageList)
        // this.spuImageList = [{name:'icon.png',url:'sss',response:{data:'dd'}}]
        this.spu.spuImageList = this.spuImageList.map(item=>{
            return {
                imageName:item.name,
                imageUrl: (item.response && item.response.data) || item.url
            }
        })
        // 发请求
        console.log(this.spu)
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        if(result.code == 200){
            this.$message({type:'success',message:'保存成功'})
            // 通知父组件回到 scene 0
            this.$emit('changescene',{scene:0, flag:this.spu.id? '修改':'添加'});
             Object.assign(this._data, this.$options.data())
        }
      },
      // 取消
      cancel(){
        // 需要清空数据
        /*
            Object.assign 是ES6中新增的方法 可以合并对象
            组件实例的 this._data  可以操作响应式数据
            this.$options 可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空 就是data中的样子
        */
        Object.assign(this._data, this.$options.data())
        // 通知父亲
        // this.$emit('changescene',{scene:0,flag:''})
      }
    },
    // 我们的请求不能写在这里了 因为前面是 v-show 在父组件加载的时候本组件就已经挂载了，一直没有卸载
    mounted() {
        
    },
}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>