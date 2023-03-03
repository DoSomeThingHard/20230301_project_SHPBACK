<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- show关联着组件内部的 disabled字段 scene=0可以编辑 不等于1不能编辑 -->
      <CategorySelect @getCategoryId="getCategoryId" :show='scene != 0'></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里 有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled='!category3Id' @click="addSpu">添加SPU</el-button>
        <el-table border style="width:100%; margin:20px 0" :data="records">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{row, $index}">
              <hint-button title="添加sku" type="success" icon="el-icon-plus" size="mini"></hint-button>
              <hint-button title="修改spu" type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)"></hint-button>
              <hint-button title="查看当前spu全部sku列表" type="info" icon="el-icon-info" size="mini"></hint-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row,$index)">
                <hint-button title="删除spu" type="danger" icon="el-icon-delete" size="mini" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="textAlign:center" @size-change="handleSizeChange" @current-change="getSpuList" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, -> , sizes, total" :total="total">
        </el-pagination>
      </div>
      <!-- 添加spu|编辑spu -->
      <SpuForm v-show="scene == 1" @changescene='changescene' ref="spu" />
      <!-- 添加SKU -->
      <SkuForm v-show="scene == 2" />
    </el-card>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
    name:'Spu',
    data() {
      return {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        records:[],
        page: 1,
        limit: 3,
        total:0,
        scene:0,   // 0代表展示spu列表 1添加|修改spu  2添加sku
      }
    },
    components:{
      SkuForm,
      SpuForm
    },
    methods: {
      // 分页器的回调
      handleSizeChange(limit){
        this.limit = limit
        this.getSpuList()
      },
      // 自定义事件的回调
      getCategoryId({ categoryId, level }) {
        if (level == 1) {
          this.category1Id = categoryId;
          this.category2Id = "";
          this.category3Id = "";
        } else if (level == 2) {
          this.category2Id = categoryId;
          this.category3Id = "";
        } else {
          this.category3Id = categoryId;
          // 当三级分类发生变换的时候 发送请求 请求数据
          this.getSpuList()
        }
      },
      // 获取SPU列表数据的方法
      async getSpuList(pages = 1){
        this.page = pages
        const {page, limit, category3Id} = this;
        try {
          let result = this.$API.spu.getSpuList(page, limit, category3Id)
          if(result.code == 200){
            this.total = result.data.total
            this.records = result.data.records
          }
        } catch (error) {
          this.total = 100
          this.records = [{"spuName":"ammacac","description":"aaa"}]
        }
      },
      // 添加spu
      addSpu(){
        this.scene = 1;
        // 需要通知子组件发请求
        this.$refs.spu.addSpuData(this.category3Id)
      },
      // 修改spu
      updateSpu(row){
        this.scene = 1
        this.$refs.spu.initSpuData(row)
      },
      // 自定义事件 SpuForm
      changescene({scene, flag}){
        this.scene = scene
        if(flag == '修改'){
          this.getSpuList(this.page)
        }else{
          this.getSpuList()
        }
      },
      // 删除
      async deleteSpu(row){
        let result = await this.$API.spu.reqDeleteSpu(row.id)
        if(result.code == 200){
          this.$message({type:'success', message:'删除成功'})
          if(this.records.length == 1){
            this.getSpuList(this.page - 1)
          }else{
            this.getSpuList(this.page)
          }
        }
      }
    },
}
</script>

<style>

</style>