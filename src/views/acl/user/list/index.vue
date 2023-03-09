<template>
  <div class="app-container">
    <!-- 行内的form -->
    <el-form inline>
        <el-form-item>
            <el-input v-model="tempSearchObj.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 查询清空 -->
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>
    <!-- 添加与批量删除 -->
    <div style="margin-bottom: 20px">
        <el-button type="primary" @click="showAddUser">添 加</el-button>
        <el-button type="danger" @click="removeUsers" :disabled='selectedIds.length===0'>批量删除</el-button>
    </div>

    <!-- table表格 展示用户列表 -->
    <el-table stripe border v-loading='listLoading' :data="user" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="roleName" label="权限列表"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" width="180"></el-table-column>

        <el-table-column align="center" width="230" label="操作" >
            <template slot-scope="{row}">
                <HintButton type='info' size='mini' icon='el-icon-user-solid' title="分配角色" @click="showAssignRole(row)" />
                <HintButton type='primary' size='mini' icon='el-icon-edit' title="修改用户" @click="showUpdateUser(row)" />
                <el-popconfirm :title="`确定删除${row.username}吗？`" @onConfirm="removeUser(row.id)">
                    <HintButton style="margin-left: 10px" slot="reference" type='danger' size='mini' icon='el-icon-delete' title="删除用户" />
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 20px 0;"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @size-change="handleSizeChange"
        @current-change="getUsers"
        :page-sizes="[5, 10, 15]"
        >
    </el-pagination>
    <!-- 设置用户相关 -->
    <el-dialog :title="user.id?'修改用户':'添加用户'" :visible.sync="dialogUserVisible">
        <el-form :model="user" ref="userForm" :rules="userRules" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称">
                <el-input v-model="user.nickName"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" v-if="!user.id" prop="password">
                <el-input v-model="user.password"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button :loading="loading" type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 设置角色相关 -->
    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
        <el-form label-width="80px">
            <el-form-item label="用户名">
                <el-input disabled :value="user.username"></el-input>
            </el-form-item>
            <el-form-item label="角色列表">
                <!-- 全选按钮 -->
                <el-checkbox :indeterminate='isIndeterminate' v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <!-- 这个是集群 然后数据搜集在 userRoleIds 这个数组中 -->
                <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
                    <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button :loading='loading' type="primary" @click="assignRole">保存</el-button>
            <el-button @click="resetRoleData">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:'AclUserList',
    data() {
        return {
            listLoading: false, // 是否显示列表加载的提示
            searchObj:{ // 包含请求搜索条件数据的对象
                username:''
            },
            tempSearchObj:{  // 手机搜索条件的对象
                username:''
            },
            selectedIds:[],   // 所有选择的user的id的数组
            users:[],   // 当前页的用户列表
            page: 1,    //当前页码
            limit: 5,   // 每页数量
            total: 0,   //总数量
            user: {},   // 当前要操作的user
            dialogUserVisible: false,   // 是否显示用户添加/修改的dialog
            userRules:{ // 用户添加/修改表单的校验规则
                username:[
                    {required: true, message:'用户名必须输入'},
                    {min:4, message:'用户名不能小于4位'}
                ],
                password:[
                    {required:true, validator: this.validatePassword}
                ]
            },
            loading: false, // 是否正在提交
            dialogRoleVisible: false,   // 是否显示角色dialog
            allRoles:[],    // 所有角色列表
            userRoleIds:[], // 选中的用户角色id的列表
            isIndeterminate: false, // 是否是不确定的
            checkAll : false,     // 是否全选
        }
    },
    created() {
        this.getUsers()
    },
    methods: {
        // 显示指定角色的界面
        showAssignRole(user){
            this.user = user
            this.dialogRoleVisible = true
            this.getRoles()
        },
        // 全选 value是布尔值 true和false
        handleCheckAllChange(value){
            this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
            // 如果当前不是全选也不全不选时，指定为false
            this.isIndeterminate = false
        },

        // 异步获取用户角色列表
        async getRoles(){
            const result = await this.$API.user.getRoles(this.user.id)
            // assignRoles是用户的角色  allRolesList是全部角色
            const {allRolesList, assignRoles} = result.data
            this.allRoles = allRolesList
            this.userRoleIds = assignRoles.map(item => item.id)
            // 是否全选
            this.checkAll = allRolesList.length === assignRoles.length
            this.isIndeterminate = assignRoles.length > 0 && assignRoles.length < allRolesList.length
        },
        // 角色列表选中项发生该表
        handleCheckedChange(value){
            const {userRoleIds, allRoles} = this
            this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
            this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
        },
        // 请求给用户进行角色授权
        async assignRole(){
            const userId = this.user.id
            const roleIds = this.userRoleIds.join(',')  //数组转为字符串
            // 1633660182010216450
            console.log(userId,roleIds)
            this.loading = true
            const result = await this.$API.user.assignRoles(userId,roleIds)
            this.loading = false
            this.$message.success(result.message || '分配角色成功')
            this.resetRoleData()

            if(this.$store.getter.name === this.user.username){
                window.location.reload()
            }
        },
        // 重置用户角色的数据
        resetRoleData(){
            this.dialogRoleVisible = false
            this.allRoles = []
            this.userRoleIds = []
            this.isIndeterminate = false
            this.checkAll = false
        },
        // 自定义密码校验
        validatePassword(rule, value, callback){
            if(!value){
                callback('密码必须输入')
            }else if(!value || value.length < 6){
                callback('密码不能小于6位')
            }else{
                callback()
            }
        },
        // 根据输入进行搜索
        search(){
            this.searchObj = {...this.tempSearchObj}
            this.getUsers()
        },
        // 重置机输入后搜索
        resetSearch(){
            this.searchObj = {
                username : ''
            }
            this.tempSearchObj = {
                username : ''
            }
            this.getUsers()
        },
        // 显示添加用户的界面
        showAddUser(){
            this.user = {},
            this.dialogUserVisible = true,
            this.$nextTick(()=>{
                this.$refs.userForm.clearValidate()
            })
        },
        // 删除所有选中的用户
        removeUsers(){
            this.$confirm('确定删除吗？').then(async ()=>{
                await this.$API.user.removeUsers(this.selectedIds)
                this.$message.success('删除成功')
                this.getUsers()
            }).catch(()=>{
                this.$message.info('取消删除')
            })
        },
        // 列表选中状态发生改变的监听回调
        handleSelectionChange(selection){
            this.selectedIds = selection.map(item => item.id)
        },

        // 显示更新用户的界面
        showUpdateUser(user){
            this.user = cloneDeep(user)
            this.dialogUserVisible = true
        },

        // 删除某个用户
        async removeUser(id){
            await this.$API.user.removeById(id)
            this.$message.success('删除成功')
            this.getUsers(this.users.length===1? this.page-1:this.page)
        },

        //获取用户列表
        async getUsers(page = 1) {
            this.page = page
            const{limit, searchObj} = this
            this.listLoading = true
            const result = await this.$API.user.getPageList(page,limit,searchObj)
            console.log(result)
            this.listLoading = false
            const {items, total}  = result.data
            this.user = items.filter(item => item.username !== 'admin')
            this.total = total - 1
            this.selectedIds = []
        },
        // 处理pageSize发生改变的监听回调
        handleSizeChange(pageSize){
            this.limit = pageSize
            this.getUsers()
        },
        // 取消用户的保存或更新
        cancel(){
            this.dialogUserVisible = false
            this.user = {}
        },
        // 新增或者修改用户
        addOrUpdate(){
            // 验证表单
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    this.dialogUserVisible = false;
                    // 发请求
                    let result = await this.$API.user.addOrUpdateUser(this.user);
                    if (result.code == 20000) {
                        // 弹出一个
                        // this.$message(this.tmForm.id? '修改成功':'新增成功');
                        this.$message({
                            type: "success",
                            message: this.user.id ? "修改成功" : "新增成功",
                        });
                        // 添加之后重新请求数据
                        this.getUsers(this.user.id ? this.page : 1);
                    } else {

                    }
                } else {
                    return false;
                }
            });
        },
    },
}
</script>

<style>

</style>