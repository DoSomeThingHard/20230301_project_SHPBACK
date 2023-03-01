<template>
  <div>
    <!-- inline代表的事行内表单：代表一行可以放多个表单

     -->
    <el-form :inline="true" :model="cFrom" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cFrom.category1Id" placeholder="请选择" @change="handle1">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cFrom.category2Id" placeholder="请选择" @change="handle2">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list2" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cFrom.category3Id" placeholder="请选择" @change="handle3">
            <el-option :label="c1.name" :value="c1.id" v-for="c1 in list3" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
        return {
            list1:[],   // 一级分类的数据
            list2:[],   // 二级分类的数据
            list3:[],   // 三级分类的数据
            cFrom:{
                category1Id:'',
                category2Id:'',
                category3Id:'',
            }
        }
    },
    mounted() {
        this.getCategoryList()
    },
    methods:{
        async getCategoryList(){
            try {
                let result = await this.$API.attr.reqCategoryList()
                alert(result)
                if(result.code == 200){
                    this.list1 = result.data
                }else{
                   
                }
            } catch (error) {
                 this.list1 = [{id:1,name:'手机'},{id:2,name:'啥'}]
            }
        },
        // 一级分类发生改变
        async handle1(){
            // 清空二级分类和三级分类的数据
            this.list2 = [];
            this.list3 = [];
            this.cFrom.category2Id = '';
            this.cFrom.category3Id = '';
            this.$emit('getCategoryId',{categoryId:this.cFrom.category1Id,level:1})
            // 请求二级分类的数据
            try {
                let result = await this.$API.attr.reqCategory2List(this.cFrom.category1Id)
                alert(result)
                if(result.code == 200){
                    this.list2 = result.data
                }else{
                   
                }
            } catch (error) {
                this.list2 = [{id:10,name:'二级手机'},{id:11,name:'二级啥'}]
            }
        },
        async handle2(){
            this.list3 = [];
            this.cFrom.category3Id = '';
            this.$emit('getCategoryId',{categoryId:this.cFrom.category2Id,level:2})
            try {
                let result = await this.$API.attr.reqCategory3List(this.cFrom.category2Id)
                alert(result)
                if(result.code == 200){
                    this.list3 = result.data
                }else{
                   
                }
            } catch (error) {
                this.list3 = [{id:100,name:'三级手机'},{id:101,name:'三级啥'}]
            }
        },
        async handle3(){
            this.$emit('getCategoryId',{categoryId:this.cFrom.category3Id,level:3})
        }

    }
};
</script>

<style></style>
