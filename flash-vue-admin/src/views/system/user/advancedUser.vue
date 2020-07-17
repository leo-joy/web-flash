<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="listQuery.name" size="small" placeholder="请输入姓名" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            size="small"
            icon="el-icon-search"
            @click.native="search"
          >{{ $t('button.search') }}</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click.native="reset"
          >{{ $t('button.reset') }}</el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="12">
          <el-button
            v-permission="['/businesslicense/add']"
            type="success"
            size="small"
            icon="el-icon-plus"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/businesslicense/edit']"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/businesslicense/delete']"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button>
          <!-- <el-button :disabled="true" type="info" icon="el-icon-role" @click.native="openRole">角色分配</el-button> -->
        </el-col>
        <el-col :span="12">
          <el-button
            v-if="userParamType*1 !== 2"
            style="float:right"
            type="primary"
            size="small"
            icon="el-icon-config"
            @click.native="edit"
          >设置高级管理人员/自然人股东</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="姓名" width="100">>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <!-- <el-table-column label="英文名">
        <template slot-scope="scope">{{ scope.row.englishName }}</template>
      </el-table-column> -->
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">{{ scope.row.sexName }}</template>
      </el-table-column>
      <el-table-column label="工号" width="80">
        <template slot-scope="scope">{{ scope.row.workNumber }}</template>
      </el-table-column>
      <el-table-column label="职务">
        <template slot-scope="scope">{{ scope.row.jobName }}</template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column prop="type" width="120" label="用户类型" :formatter="formatterUserType" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">{{ scope.row.statusName }}</template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    />

    <el-dialog :title="formTitle" :visible.sync="formVisible" :append-to-body="true" width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" minlength="1" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用" prop="status">
              <el-switch v-model="form.status" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="工号" prop="workNumber">
              <el-input v-model="form.workNumber" />
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="8">
            <el-form-item label="英文姓氏" prop="englishSurnames">
              <el-input v-model="form.englishSurnames"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="英文名" prop="englishName">
              <el-input v-model="form.englishName" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="出生日期">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.birthday"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="前用中文名" prop="chineseNameBefore">
              <el-input v-model="form.chineseNameBefore"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前用英文名" prop="englishNameBefore">
              <el-input v-model="form.englishNameBefore"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="电话">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="别名中文名" prop="chineseNameAlias">
              <el-input v-model="form.chineseNameAlias"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="别名英文名" prop="englishNameAlias">
              <el-input v-model="form.englishNameAlias"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="内地身份证号" prop="identityCardChinese">
              <el-input v-model="form.identityCardChinese" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="香港身份证号" prop="identityCardHk">
              <el-input v-model="form.identityCardHk" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="护照号码" prop="passportNo">
              <el-input v-model="form.passportNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="地区" prop="region">
              <el-input v-model="form.region"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历" prop="academic">
              <el-select v-model="form.academic" placeholder="请选择">
                <el-option
                  v-for="item in academicList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业" prop="specialty">
              <el-select v-model="form.specialty" placeholder="请选择">
                <el-option
                  v-for="item in specialtyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="职称" prop="post">
              <el-select v-model="form.post" placeholder="请选择">
                <el-option
                  v-for="item in postList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="8">
            <el-form-item label="职务" prop="duty">
              <el-select v-model="form.duty" placeholder="请选择">
                <el-option
                  v-for="item in dutyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="8">
            <el-form-item label="用户类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in userTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="护照签发国家" prop="passportNational">
              <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.passportNational"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工作经历" prop="experience">
              <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.experience"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveUser">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="角色分配" :visible.sync="roleDialog.visible" width="25%">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-tree
              ref="roleTree"
              :data="roleDialog.roles"
              show-checkbox
              node-key="id"
              :default-checked-keys="roleDialog.checkedRoleKeys"
              :props="roleDialog.defaultProps"
            />
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="setRole">{{ $t('button.submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteUser,
  getList,
  saveUser,
  remove,
  setRole
} from '@/api/system/user'
import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { getDictList, showDictLabel, getUuid } from '@/utils/common'
import { parseTime } from '@/utils/index'
import { roleTreeListByIdUser } from '@/api/system/role'
// 权限判断指令
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    // userTypeValue: String,
  },
  data() {
    return {
      roleDialog: {
        visible: false,
        roles: [],
        roleTree: [],
        checkedRoleKeys: [],
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        }
      },
      formVisible: false,
      formTitle: '添加人员',
      academic: '', // 学历
      academicList: [], // 学历，从数据字典中获取
      specialty: '', // 专业
      specialtyList: [], // 专业，从数据字典中获取
      post: '', // 职称
      postList: [], // 职称，从数据字典中获取
      duty: '', // 职务
      dutyList: [], // 职务，从数据字典中获取
      userType: '', // 用户类型
      userTypeList: [], // 用户类型，从数据字典中获取
      userParamType: '', // 路由传参类型
      deptTree: {
        show: false,
        data: [],
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      isAdd: true,
      form: {
        id: '',
        account: '',
        name: '',
        birthday: '',
        sex: 1,
        academic: '',
        specialty: '',
        post: '',
        duty: '',
        experience: '',
        type: '1',
        email: '',
        phone: '',
        password: '',
        rePassword: '',
        dept: '',
        status: true,
        deptid: 1,
        deptName: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在11位数字', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入email', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        limit: 20,
        account: undefined,
        name: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      deptList().then(response => {
        this.deptTree.data = response.data
      })
      dictList({ name: '用户类型' }).then(response => {
        this.userTypeList = getDictList(response.data[0].detail)
      })
      dictList({ name: '用户类型' }).then(response => {
        this.userType = response.data[0].detail
      })
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let userType = ''
      if (this.$route.path) {
        const tempArr = this.$route.path.split('/')
        userType = tempArr[tempArr.length - 1]
      }
      // if( this.$route.path === '/advancedUser') {
      //   userType = 1
      // }
      // this.listQuery.type = userType || this.$attrs.userTypeValue
      this.userParamType = userType || this.$attrs.userTypeValue
      if (userType * 1 === 2) {
        this.listQuery.type = 2
      }
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.listQuery.page = 1
      this.fetchData()
    },
    reset() {
      this.listQuery.account = ''
      this.listQuery.name = ''
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {},
    fetchNext() {
      this.listQuery.page = this.listQuery.page + 1
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        id: '',
        account: '',
        name: '',
        birthday: '',
        sex: 1,
        academic: '',
        specialty: '',
        post: '',
        duty: '',
        experience: '',
        type: this.userParamType,
        email: '',
        phone: '',
        password: '',
        rePassword: '',
        dept: '',
        status: true,
        deptid: 1
      }
    },
    add() {
      this.resetForm()
      this.formTitle =
      this.userParamType === '1' ? '添加高级管理人员' : '添加股东信息'
      this.formVisible = true
      this.isAdd = true
      console.log(this.form)
    },
    validName() {
      if (!this.isAdd) {
        return true
      }
      if (this.form.name === '') {
        return false
      }
      return true
    },
    saveUser() {
      var self = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          const form = self.form
          if (form.status === true) {
            // 启用
            form.status = 1
          } else {
            // 冻结
            form.status = 2
          }
          const uuid = getUuid()
          form.birthday = parseTime(form.birthday, '{y}-{m}-{d}')
          form.academic = form.academic
          form.specialty = form.specialty
          form.post = form.post
          form.duty = form.duty
          form.experience = form.experience
          form.type = form.type
          form.account = 'yjl-' + uuid // 登录名
          form.password = 'yjl-' + uuid // 密码
          form.rePassword = 'yjl-' + uuid // 重复密码
          form.deptid = form.type === '1' ? 24 : 36 // 部门
          saveUser(form).then(response => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.fetchData()
            this.formVisible = false
            this.getAllUserList()
          })
        } else {
          return false
        }
      })
    },
    async getAllUserList() {
      await this.$store.dispatch('common/getUserList')
    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: '请选中操作项',
        type: 'warning'
      })
      return false
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false

        this.form = this.selRow
        this.form.status = this.selRow.statusName === '启用'
        this.form.password = ''
        this.formTitle = this.userParamType === '1' ? '修改高级管理人员' : '修改股东信息'
        this.formVisible = true
      }
    },
    remove() {
      if (this.checkSel()) {
        var id = this.selRow.id

        this.$confirm('确定删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            remove(id)
              .then(response => {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.fetchData()
              })
              .catch(err => {
                this.$notify.error({
                  title: '错误',
                  message: err
                })
              })
          })
          .catch(() => {})
      }
    },
    handleNodeClick(data, node) {
      this.form.deptid = data.id
      this.form.deptName = data.simplename
      this.deptTree.show = false
    },

    openRole() {
      if (this.checkSel()) {
        roleTreeListByIdUser(this.selRow.id).then(response => {
          this.roleDialog.roles = response.data.treeData
          this.roleDialog.checkedRoleKeys = response.data.checkedIds
          this.roleDialog.visible = true
        })
      }
    },
    setRole() {
      var checkedRoleKeys = this.$refs.roleTree.getCheckedKeys()
      var roleIds = ''
      for (var index in checkedRoleKeys) {
        roleIds += checkedRoleKeys[index] + ','
      }
      var data = {
        userId: this.selRow.id,
        roleIds: roleIds
      }
      setRole(data).then(response => {
        this.roleDialog.visible = false
        this.fetchData()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    },
    // 格式化 用户类型
    formatterUserType(row) {
      const res = showDictLabel(this.userType, row.type)
      return res
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

