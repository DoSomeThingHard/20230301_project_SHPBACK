<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" style="width:80px; height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row,$index}">
          <!-- 这个是上架呢 click是下架 -->
          <el-button v-if="row.isSale" type="info" icon="el-icon-sort-down" size="mini" @click="cancel(row)"></el-button>
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSku"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="textAlign:center" @size-change="handleSizeChange" @current-change="getSkuList" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
    </el-pagination>

    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size='50%'>
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="index" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" >
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
    name:'Sku',
    data() {
      return {
        page:1,
        limit: 10,
        records:[{isSale:true},{isSale:false}],
        total: 0,
        skuInfo:{skuImageList:[{},{},{},{}]},  // 存储skuInfo
        drawer: false,
      }
    },
    mounted() {
      this.getSkuList()
    },
    methods: {
      handleSizeChange(limit){
        // 修改参数
        this.limit = limit
        this.getSkuList()
      },
      // 请求数据
      async getSkuList(pager = 1){
        this.page = pager
        const {page, limit} = this
        let result = await this.$API.sku.reqSkuHomeList(page,limit)
        if(result.code == 200){
          this.records = result.data.records
          this.total = result.data.total
        }else{

        }
      },
      // 上架
      async sale(sku){
        sku.isSale = true
        let result = await this.$API.sku.reqSale(sku.id)
        if(result.code == 200){
          this.$message({type:'success', message:'上架成功'})
        }
      },
      // 下架
      async cancel(sku){
        sku.isSale = false
        let result = await this.$API.sku.reqSale(sku.id)
        if(result.code == 200){
            this.$message({type:'success', message:'下架成功'})
        }
      },
      edit(){

      },
      async getSkuInfo(sku){
        this.drawer = true
        let result = await this.$API.sku.reqSkuById(sku.id)
        if(result.code == 200){
            this.skuInfo = result.data
        }
      }
    },
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

/* .el-carousel__button{
  width:10px;
  height: 10px;
  background: red;
  border-radius: 50%;
} */
</style>

<style scoped>
.el-row .el-col-5{
  font-size: 18px;
  text-align: right;
}

.el-col{
  margin: 10px;
}

/* 深度选择器 */
>>>.el-carousel__button{
  width:10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>