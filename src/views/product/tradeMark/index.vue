<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件
    data: 表格组件将来展示的数据  -- 数组类型
    border： 添加边框
    column  属性
    label：标题
    width：对应列的宽度
    align: 标题的对齐方式  
    prop: 对应列的字段名
    -->
    <el-table style="width: 100%" border :data="list">
      <!-- 这是一列 -->
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <!-- 作用域插槽 -->
        <!-- { row, $index } -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteTradeMark(row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    layout 就是调整每一项的前后顺序
    pager-count 是按钮的数量 设置为9 那么连续的是7
     -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
    >
    </el-pagination>

    <!-- 对话框
    visible.sync 是控制对话框显示与隐藏的
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单
      :model 这个属性的作用是 将表单的数据收集到tmForm上面
      :rules 这个是表单验证的规则 并将Form-item的prop属性设置为需要检验的字段名即可
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!-- 这里搜集数据不能使用 v-model 因为不是表单元素
            action: 图片上传的地址
            :before-upload: 在图片上传之前执行一次
            :on-success: 图片上传成功之后
             -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback)=>{
        // 自定义校验规则
        if(value.length < 2 || value.length > 10){
            callback(new Error('品牌名称需要2~10'))
        }else{
            // 这里写不写好像都行
            callback()
        }
    }
    return {
      total: 0,
      page: 1,
      limit: 3,
      list: [],
      dialogFormVisible: false,
      //   imageUrl: "", // 上传图片使用的属性
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      //   表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        //   { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change", },
          { validator: validateTmName , trigger: "change"}
        ],
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getPageList();
    },
    showDialog1() {
      this.dialogFormVisible = true;
      //   清空数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 当前选中的品牌的数据
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //   这里是拷贝 row里面的内容 {id, logoUrl, tmName}
      this.tmForm = { ...row };
    },
    // 删除品牌
    showDialog(row){
        this.$confirm(`你确定删除${row.tmName}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            let result = await his.$API.tradeMark.reqDeleteTradeMark(row.id)
            if(result.code == 200){
                this.$message({ type: 'success', message: '删除成功!'});
                // 再次获取品牌列表数据
                this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
            }else{

            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 图片上传相关
    handleAvatarSuccess(res, file) {
      // res 是上传成功之后 返回的数据 里面的 res.data是上传服务器之后的真实地址
      //   this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 新增品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          // 发请求
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出一个
            // this.$message(this.tmForm.id? '修改成功':'新增成功');
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改成功" : "新增成功",
            });
            // 添加之后重新请求数据
            this.getPageList(this.tmForm.id ? this.page : 1);
          } else {
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
