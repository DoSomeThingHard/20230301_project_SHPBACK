<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
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
                <el-button type="warning" size="mini" icon='el-icon-edit'></el-button>
                <el-button type="danger" size="mini" icon='el-icon-delete'></el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
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
        let test = JSON.parse(
          '[{"id":3058 ,"attrName":"手机","categoryId": 61,"categoryLevel":3, "attrValueList": [{"valueName":"华为"},{"valueName":"小米"},{"valueName":"苹果"},{"valueName":"VIVO"}]}]'
        );
        console.log(test);
        this.attrList = test;
      }
    },
  },
};
</script>

<style>
</style>