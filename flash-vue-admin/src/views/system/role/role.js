import { remove, getList, save, savePermissons, saveCompanyPermissons, companyListByRoleId } from '@/api/system/role'
import { list as getDeptList } from '@/api/system/dept'
import { menuTreeListByRoleId } from '@/api/system/menu'
import { getList as getCompanyList } from '@/api/lpm/businesslicense'

export default {
  data() {
    return {
      formVisible: false,
      formTitle: '添加角色',
      deptList: [],
      roleList: [],
      isAdd: true,
      checkedPermissionKeys: [],
      permissons: [],
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children'
      },
      permissonVisible: false,
      deptTree: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      roleTree: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        }
      },

      form: {
        tips: '',
        name: '',
        deptid: '',
        pid: 0,
        id: '',
        version: '',
        deptName: '',
        pName: '',
        num: 1
      },
      rules: {
        tips: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      listQuery: {
        name: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},

      permissonCompanyVisible: false,
      searchType: 'enterpriseName',
      keyword: '',
      options: [{
        value: 'enterpriseName',
        label: '企业名称'
      }, {
        value: 'unifiedSocialCreditCode',
        label: '社会信用代码'
      }, {
        value: 'legalRepresentative',
        label: '法定代表人'
      }
      ],
      companyListQuery: {
        page: 1,
        limit: 100,
        deptName: '',
        deptId: '',
        id: undefined
      },
      companyTotal: 0,
      companyList: null,
      companyListLoading: true,

      multipleSelection: [],

      companyPermissons: []
    }
  },
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
  created() {
    this.init()
  },
  methods: {
    init() {
      getDeptList().then(response => {
        this.deptList = response.data
      })
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.name = ''
      this.fetchData()
    },
    handleFilter() {
      this.getList()
    },
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
        tips: '',
        name: '',
        deptid: '',
        pid: 0,
        id: '',
        version: '',
        deptName: '',
        pName: '',
        num: 1

      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加角色'
      this.formVisible = true
      this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            id: this.form.id,
            num: this.form.num,
            deptid: this.form.deptid,
            pid: this.form.pid,
            name: this.form.name,
            tips: this.form.tips
          }).then(response => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.fetchData()
            this.formVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
        this.formTitle = '修改角色'
        this.formVisible = true
      }
    },
    remove() {
      if (this.checkSel()) {
        const id = this.selRow.id
        this.$confirm('确定删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(id).then(response => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.fetchData()
          }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    },
    openPermissions() { // 功能权限
      this.companyListQuery.deptName = ''
      this.deptTree.show = false
      if (this.checkSel()) {
        menuTreeListByRoleId(this.selRow.id).then(response => {
          this.permissons = response.data.treeData
          this.checkedPermissionKeys = response.data.checkedIds
          this.permissonVisible = true
        })
      }
    },
    savePermissions() {
      const checkedNodes = this.$refs.permissonTree.getCheckedNodes(false, true)
      let menuIds = ''
      for (var index in checkedNodes) {
        menuIds += checkedNodes[index].id + ','
      }
      const data = {
        roleId: this.selRow.id,
        permissions: menuIds
      }
      savePermissons(data).then(response => {
        this.permissonVisible = false
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    },
    handleDeptNodeClick(data, node) {
      this.form.deptid = data.id
      this.form.deptName = data.simplename
      this.deptTree.show = false
    },
    handleRoleNodeClick(data, node) {
      this.form.pid = data.id
      this.form.pName = data.name
      this.roleTree.show = false
    },

    searchCompany() {
      if (this.searchType === 'enterpriseName') {
        this.companyListQuery.enterpriseName = this.keyword
      }
      if (this.searchType === 'unifiedSocialCreditCode') {
        this.companyListQuery.unifiedSocialCreditCode = this.keyword
      }
      if (this.searchType === 'legalRepresentative') {
        this.companyListQuery.legalRepresentative = this.keyword
      }
      this.fetchCompanyData()
    },
    handleCompanyDeptNodeClick(data, node) {
      if (data.id === '24') {
        this.companyListQuery.pIds = data.id
      } else if (data.id === '244' || data.id === '103' || data.id === '106' || data.id === '107' || data.id === '30') {
        this.companyListQuery.pIds = '_' + data.id + '_'
      } else {
        this.companyListQuery.pIds = '-' + data.id + '_'
      }
      this.companyListQuery.deptName = data.simplename
      this.deptTree.show = false
      this.fetchCompanyData()
    },

    openCompanyPermissions() { // 公司权限
      if (this.checkSel()) {
        const companyRoleQuery = {
          page: 1,
          limit: 1000,
          roleId: this.selRow.id
        }
        companyListByRoleId(companyRoleQuery).then(response => {
          var tempArr = []
          if (response.data.records && response.data.records.length > 0) {
            for (let i = 0; i < response.data.records.length; i++) {
              tempArr.push(response.data.records[i].companyid)
            }
          }
          this.companyPermissons = tempArr
          this.checkedCompanyPermissionKeys = response.data.tempArr
          this.permissonCompanyVisible = true
          this.fetchCompanyData()
        })
      }
    },

    fetchCompanyData() {
      this.companyListLoading = true

      // const companys = this.$store.state.user.companys
      if (this.companyPermissons && this.companyPermissons.length > 0) {
        // this.companyListQuery.ids = this.companyPermissons.toString()
        // this.companyListQuery.page = 1
      } else {
        this.companyListQuery.ids = ''
      }
      getCompanyList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.companyListLoading = false
        this.companyTotal = response.data.total
        this.companyListQuery.enterpriseName = ''
        this.companyListQuery.unifiedSocialCreditCode = ''
        this.companyListQuery.legalRepresentative = ''
        this.initCompanyChecked()
      })
    },

    // 初始化公司选中状态
    initCompanyChecked() {
      const _this = this
      setTimeout(() => {
        _this.companyList.forEach(row => {
          let bool = false
          if (_this.companyPermissons.indexOf(row.id) >= 0) {
            bool = true
          } else {
            bool = false
          }
          _this.$refs.companytable.toggleRowSelection(row, bool)
        })
      }, 100)
    },

    fetchCompanyNext() {
      this.companyListQuery.page = this.companyListQuery.page + 1
      this.fetchCompanyData()
    },
    fetchCompanyPrev() {
      this.companyListQuery.page = this.companyListQuery.page - 1
      this.fetchCompanyData()
    },
    fetchCompanyPage(page) {
      this.companyListQuery.page = page
      this.fetchCompanyData()
    },
    changeCompanySize(limit) {
      this.companyListQuery.limit = limit
      this.fetchCompanyData()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    saveCompanyPermissions() { // 公司权限保存
      const checkedNodes = this.multipleSelection
      let companyIds = ''
      for (var index in checkedNodes) {
        companyIds += checkedNodes[index].id + ','
      }
      console.log(companyIds)
      const data = {
        roleId: this.selRow.id,
        permissions: companyIds
      }
      saveCompanyPermissons(data).then(response => {
        this.permissonCompanyVisible = false
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    }

  }
}
