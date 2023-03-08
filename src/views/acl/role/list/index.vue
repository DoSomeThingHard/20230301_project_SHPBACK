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
        <el-button type="primary" @click="addRole">添加</el-button>
        <el-button type="danger" @click="removeRoles()" :disabled='selectedRoles.length === 0'>批量删除</el-button>
    </div>
    <el-table border stripe :data="roles" style="width: 960px" v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="角色名称">
            <template slot-scope="{row}">
                <template v-if="row.edit">
                    <el-input v-model="row.roleName" class="edit-input" size="small"></el-input>
                    <el-button type="warning" class="cancel-btn" size="small" icon="el-icon-refresh" @click="cancelEdit(row)">取消</el-button>
                </template>
                <span v-else>{{row.roleName}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" width="300" label="操作">
            <template slot-scope="{row}">
                <HintButton size='mini' type='info' icon='el-icon-info' title="分配权限" @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"></HintButton>
                <HintButton size='mini' type='primary' icon='el-icon-check' title="确定" @click="updateRole(row)" v-if="row.edit"></HintButton>
                <HintButton size='mini' type='primary' icon='el-icon-edit' title="修改角色" @click="row.edit=true" v-if="!row.edit"></HintButton>
                <HintButton size='mini' type='danger' icon='el-icon-delete' title="删除角色" @click="removeRole(row)"></HintButton>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        >
    </el-pagination>
  </div>
</template>

<script>
export default {
    data() {
        return {
            tempSearchObj:{},
            selectedRoles:[],
            listLoading: false,
            roles:[]
        }
    },
    methods: {
        search(){

        },
        resetSearch(){

        },
        addRole(){

        },
        removeRoles(){

        },
        handleSelectionChange(){

        }
    },
}
</script>

<style>

</style>