<template>
  <el-card>
    <div slot="header" class="header">
       <div class="search-header">
            <span>线上热门搜索</span>
            <el-dropdown>
            <span>
                <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
       </div>
    </div>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <LineCharts />
            </el-col>
            <el-col :span="12">
                <LineCharts />
            </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" style="width: 100%; margin:10px 0" border :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column type='index' label="排名"  width="60" align='center'></el-table-column>
            <el-table-column prop="name" label="搜索关键字"  width="180"></el-table-column>
            <el-table-column prop="address" label="用户数" sortable></el-table-column>
            <el-table-column prop="address" label="周涨幅" sortable></el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
            layout="prev, pager, next"
            :total="1000"
            align='right'>
        </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
    data() {
        return {
            tableData:[{}]
        }
    },
    components:{
        LineCharts
    }
}
</script>

<style scoped>
.header{
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.search-header{
    display: flex;
    justify-content: space-between;
}
</style>