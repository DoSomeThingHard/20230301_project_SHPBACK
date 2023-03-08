<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="销售额" name="first"> </el-tab-pane>
        <el-tab-pane label="访问量" name="second"> </el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          class="date"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts" style="margin-top:50px"></div>
        </el-col>
        <el-col :span="6">
            <h3>门店{{title}}排名</h3>
            <ul>
                <li>
                    <span class="rindex rindex-rad">1</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex rindex-rad">2</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex rindex-rad">3</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex">4</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex">5</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex">6</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex">7</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
                <li>
                    <span class="rindex">8</span>
                    <span style="margin-left:10px">肯德基</span>
                    <span class="rvalue">1234</span>
                </li>
            </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      activeName: "first",
      myCharts: null,
      date:[],  // 搜集日历的
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.activeName = tab.name;
    },
  },
  computed:{
    title(){
        return this.activeName=='first'?'销售额':'访问量'
    },
    ...mapState({
        listState: state => state.home.list
    })
  },
  watch:{
    title(){
        console.log(this.listState)
        // 图表的配置数据 可以再次修改
        this.myCharts.setOption({
            title: {
              text: this.title + '趋势',
            },
            xAxis:{
                data: (this.title=='销售额')?this.listState.orderFullYearAxis : this.listState.userFullYearAxis
            },
            series: {
                name: "Direct",
                type: "bar",
                barWidth: "60%",
                data: (this.title=='销售额')?this.listState.orderFullYear : this.listState.userFullYear,
                color: 'yellowgreen'
            },
        })
    },
    listState(){
        this.myCharts.setOption({
            title: {
                text: '销售额趋势',
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: this.listState.orderFullYearAxis,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    axisLine:{show: true},
                },
            ],
            series: [
                {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: this.listState.orderFullYear,
                    color: 'yellowgreen'
                },
            ],
        });
    }
  },
  methods:{
    // 本天
    setDay(){
        // 获取当天
        const day = dayjs().format('YYYY-MM-DD')
        this.date = [day,day]
    },
    setWeek(){
        const start = dayjs().day(1).format('YYYY-MM-DD')
        const end = dayjs().day(7).format('YYYY-MM-DD')
        this.date = [start,end]
    },
    setMonth(){
        const start = dayjs().startOf('month').format('YYYY-MM-DD')
        const end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.date = [start,end]
    },
    setYear(){
        const start = dayjs().startOf('year').format('YYYY-MM-DD')
        const end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.date = [start,end]
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
}
.date {
  width: 250px;
  margin: 0 20px;
}

.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
}

ul li{
    height: 8%;
    margin: 10px 0;
}

.rindex{
    float: left;
    width: 15px;
    height: 15px;
    text-align: center;

    font-size: 12px;
    line-height: 15px;
}

.rindex-rad{
    border-radius: 50%;
    background: black;
    color: white;
}

.rvalue{
    float: right;
}

</style>