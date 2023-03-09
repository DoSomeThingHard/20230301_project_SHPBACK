<template>
  <div>
    <el-form inline>
        <el-form-item>
            <el-input v-model="tempSearchObj.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-button type="primary" icon='el-icon-search' @click='search'>查询</el-button>
        <el-button @click='resetSearch'>清空</el-button>
    </el-form>
    <div style="margin-bottom:20px">
        <el-button type="primary" @click="isShowAddRoleDoalog = true">添加</el-button>
        <el-button type="danger" @click="removeRoles()" :disabled='selectedIds.length === 0'>批量删除</el-button>
    </div>
    <el-table border stripe :data="roles" style="width: 960px; margin: 20px 0" v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="角色名称">
            <template slot-scope="{row}">
                <template v-if="row.edit">
                    <el-row :gutter="10">
                        <el-col :span="16">
                            <!-- @blur="cancelEdit(row)" -->
                            <el-input v-model="role.roleName" class="edit-input" ref="myInput" size="small"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="danger" class="cancel-btn" size="small" icon="el-icon-edit" @click="addOrUpdate(row)">修改</el-button>
                            <el-button type="warning" class="cancel-btn" size="small" icon="el-icon-refresh" @click="cancelEdit(row)">取消</el-button>
                        </el-col>
                    </el-row>
                </template>
                <span v-else>{{row.roleName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" width="300" label="操作">
            <template slot-scope="{row}">
                <HintButton size='mini' type='info' icon='el-icon-info' title="分配权限" @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"></HintButton>
                <HintButton size='mini' type='primary' icon='el-icon-check' title="确定" @click="updateRole(row)" v-if="row.edit"></HintButton>
                <HintButton size='mini' type='primary' icon='el-icon-edit' title="修改角色" @click="beginEdit(row)" v-if="!row.edit"></HintButton>
                <HintButton size='mini' type='danger' icon='el-icon-delete' title="删除角色" @click="removeRole(row)"></HintButton>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        style="textAlign:center"
        :current-page="page"
        :total="total"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="getRoleList"
        :page-sizes="[5, 10, 20]"
        layout="prev, pager, next, jumper, -> ,  sizes, total"
        >
    </el-pagination>

    <!-- 添加角色 -->
    <el-dialog title="收货地址" :visible.sync="isShowAddRoleDoalog">
    <el-form :model="role">
        <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="role.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            tempSearchObj:{
                roleName: ''
            },
            listLoading: false,
            roles:[],
            page: 1,
            limit: 5,
            total: 0,
            isShowAddRoleDoalog: false,
            role:{  // 新增或者修改角色
                roleName:''
            },    // 角色 
            selectedIds:[]
        }
    },
    mounted() {
        this.getRoleList()
    },
    methods: {
        async getRoleList(page = 1){
            this.page = page;
            let result = await this.$API.role.getPageList(this.page, this.limit, this.tempSearchObj)
            this.total = result.data.total
            let listData = result.data.items
            listData.forEach(element => {
                this.$set(element,"edit",false)
            });
            this.roles = listData
        },
        beginEdit(role){
            this.role = {...role}
            role.edit=true
            this.$nextTick(()=>{
                console.log(this.$refs)
                this.$refs.myInput.focus()
            })
        },
        cancelEdit(role){
            console.log(this.role)
            role.edit = false
            this.role = {roleName:''}
        },
        search(){
            this.getRoleList()
        },
        // 重置搜索
        resetSearch(){
            this.tempSearchObj = {
                roleName:''
            }
            this.getRoleList()
        },
        // 取消新增角色
        cancel(){
            this.isShowAddRoleDoalog = false
            // 清空之前的数据
            this.role = {roleName:''}
        },
        // 删除或者修改角色
        async addOrUpdate(row){
            console.log(this.role)
            if(row){
                row.edit = false
                this.role.edit = undefined
            }
            let result = await this.$API.role.saveOrUpdate(this.role)
            if(result.code === 20000){
                this.isShowAddRoleDoalog = false
                this.$message({type:'success',message:'新增成功'})
                this.getRoleList()
            }else{
                this.$message({type:'success',message:'失败'})
            }
        },
        // 批量删除
        async removeRoles(){
            let result = await this.$API.role.batchRemove(this.selectedIds)
            if(result.code === 20000){
                this.$message({type:'success',message:'删除成功'})
                let page = (this.roles.length - this.selectedIds.length == 0)? (this.page - 1 || 1): this.page
                this.getRoleList(page)
            }else{
                this.$message({type:'success',message:'删除失败'})
            }
        },
        // 单独删除一个
        async removeRole(role){
            let result = await this.$API.role.remove(role.id)
            if(result.code === 20000){
                this.$message({type:'success',message:'删除成功'})
                this.getRoleList((this.roles.length == 1) ? this.page - 1 : this.page)
            }else{
                this.$message({type:'success',message:'失败'})
            }
        },
        // 
        handleSelectionChange(selection){
            this.selectedIds = selection.map(item => item.id)
        },
        // 切换一页的大小
        handleSizeChange(pageSize){
            this.limit = pageSize
            this.getRoleList()
        },
    },
}
</script>

<style>

</style>