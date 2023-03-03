<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show='!isShowTable'></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- 当category3Id有值的时候添加属性可以点击 -->
        <el-button type="primary" icon="el-icon-plus" :disabled='!category3Id' @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%; margin-top: 10px" border :data="attrList">
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attr,index) in row.attrValueList" :key="index" style="margin:0 10px">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
              <template slot-scope="{row,$index}">
                  <el-button type="warning" size="mini" icon='el-icon-edit' @click="updateAttr(row)"></el-button>
                  <el-button type="danger" size="mini" icon='el-icon-delete'></el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮的禁用 根据attrName是否有值 -->
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled='(!attrInfo.attrName || (flagIndex !== undefined))'>添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table  style="width: 100%; margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里的结构是下面只显示一个 -->
              <el-input v-if="flagIndex==$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里的气泡框 由于是版本问题 文档上面写的是 confirm 实际是 onConfirm(2.13.x老版本 我们用的版本旧) -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue(row,$index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled='attrInfo.attrValueList.length < 1'>保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,  // 控制table的显示与隐藏
      flagIndex: undefined, // 控制当前正在编辑的下标
      // 手机新增和修改属性
      attrInfo:{
        attrName:'',  //属性名
        attrValueList:[], // 属性值 是一个数组 里面是对象 {attrId, valueName}
        categoryId:0, // 
        categoryLevel:0 //
      }
    };
  },
  mounted() {},
  methods: {
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
        this.getAttrList();
      }
    },
    // 请求列表数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      try {
        let result = await this.$API.attr.reqAttrList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code == 200) {
        }
      } catch (error) {
        this.attrList = JSON.parse(
          '[{"id":3058 ,"attrName":"手机","categoryId": 61,"categoryLevel":3, "attrValueList": [{"valueName":"华为"},{"valueName":"小米"},{"valueName":"苹果"},{"valueName":"VIVO"}]}]'
        );
      }
    },
    // 添加属性值
    async addAttrValue(){
      this.attrInfo.attrValueList.push({
        valueName:'',
        attrId:this.attrInfo.id, // 新增的时候没有这个id就是undefined 修改的时候这个id是有值的
      })
      // 添加属性值的时候 就让添加上来的那一条的input变为focus
      this.flagIndex = this.attrInfo.attrValueList.length - 1
      this.$nextTick(()=>{
        console.log(this.$refs)
        this.$refs[this.flagIndex].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr(){
      this.isShowTable=false
      // 清空上次操作的值
      this.attrInfo = {
        attrName:'',  
        attrValueList:[],  
        categoryId:this.category3Id,  
        categoryLevel:3  
      }
    },
    // 修改属性
    updateAttr(row){
      console.log(row)
      this.isShowTable=false
      // 这里面由于涉及到深层级的接口 不能使用 {...row}的方式了 会影响层级深的
      // this.attrInfo = {...row}
      this.attrInfo = cloneDeep(row)
      this.flagIndex = undefined
    },
    // 切换模式
    toLook(row){
      console.log(this.$refs)
      // 判断输入是否为空
      if(row.valueName.trim()==''){
        this.$message('请你输入一个正常的属性值')
        this.$refs[this.flagIndex].focus()
        return 
      }
      // 去重
      const isRepeat = this.attrInfo.attrValueList.some(item =>{
        if(item !== row){  // 因为自己也在数组中 不跟跟自己比较
          return  item.valueName == row.valueName
        }
      })
      if(isRepeat){
        this.$message('重复了')
        return 
      }
      // 修改为查看模式
      this.flagIndex = undefined
    },
    toEdit(row,$index){
      this.flagIndex=$index
      // 获取input节点
      // console.log(this.$refs,$index,this.$refs[$index])
      this.$nextTick(()=>{
        this.$refs[$index].focus()
      })
    },
    // 删除 
    deleteAttrValue(row,index){
      // 删除 
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮
    async addOrUpdateAttr(){
      // 整理参数  属性名为空的和如果自己加了服务器不需要的属性 都是需要去掉的
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 不是空才要
        if(item.valueName != ''){
          // 删除自己添加的属性
          delete item.flag
          return true
        }
      })
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({type:'success', message:'成功'})
        // 再次获取平台属性
        this.getAttrList()
      } catch (error) {
        this.$message.error('失败')
      }      
    }
  },
};
</script>

<style>
</style>