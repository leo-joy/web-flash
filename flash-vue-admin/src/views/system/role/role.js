import { remove, getList, save, savePermissons, saveCompanyPermissons, companyListByRoleId } from '@/api/system/role'
import { list as getDeptList } from '@/api/system/dept'
import { menuTreeListByRoleId } from '@/api/system/menu'
import { getList as getCompanyList } from '@/api/lpm/businesslicense'
import { MergeArray } from '@/utils/index'
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

      // permissonCompanyVisible: false,
      // searchType: 'enterpriseName',
      // keyword: '',
      // options: [{
      //   value: 'enterpriseName',
      //   label: '企业名称'
      // }, {
      //   value: 'unifiedSocialCreditCode',
      //   label: '社会信用代码'
      // }, {
      //   value: 'legalRepresentative',
      //   label: '法定代表人'
      // }
      // ],
      // companyListQuery: {
      //   page: 1,
      //   limit: 100,
      //   deptName: '',
      //   deptId: '',
      //   id: undefined
      // },
      // companyTotal: 0,
      // companyList: null,
      // companyListLoading: true,

      // multipleSelection: [],

      // companyPermissons: [],

      permissonCompanyVisible: false,
      // 左侧企业
      deptTreeLeft: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      searchTypeLeft: 'enterpriseName',
      keywordLeft: '',
      optionsLeft: [{
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
      companyListQueryLeft: {
        page: 1,
        limit: 100,
        deptName: '',
        deptId: '',
        id: undefined
      },
      companyTotalLeft: 0,
      companyListLeft: null,
      companyListLoadingLeft: true,

      multipleSelectionLeft: [],

      // 右侧企业
      deptTreeRight: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      searchTypeRight: 'enterpriseName',
      keywordRight: '',
      optionsRight: [{
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
      companyListQueryRight: {
        page: 1,
        limit: 100,
        deptName: '',
        deptId: '',
        id: undefined
      },
      companyTotalRight: 0,
      companyListRight: null,
      companyListLoadingRight: true,

      multipleSelectionRight: [],

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

    /**
     * 公司权限管理-原
     */

    // openCompanyPermissions() { // 公司权限
    //   if (this.checkSel()) {
    //     const companyRoleQuery = {
    //       page: 1,
    //       limit: 3000,
    //       roleId: this.selRow.id
    //     }
    //     companyListByRoleId(companyRoleQuery).then(response => {
    //       var tempArr = []
    //       if (response.data.records && response.data.records.length > 0) {
    //         for (let i = 0; i < response.data.records.length; i++) {
    //           tempArr.push(response.data.records[i].companyid)
    //         }
    //       }
    //       this.companyPermissons = tempArr
    //       this.checkedCompanyPermissionKeys = response.data.tempArr
    //       this.permissonCompanyVisible = true
    //       this.fetchCompanyData()
    //     })
    //   }
    // },

    // searchCompany() {
    //   if (this.searchType === 'enterpriseName') {
    //     this.companyListQuery.enterpriseName = this.keyword
    //   }
    //   if (this.searchType === 'unifiedSocialCreditCode') {
    //     this.companyListQuery.unifiedSocialCreditCode = this.keyword
    //   }
    //   if (this.searchType === 'legalRepresentative') {
    //     this.companyListQuery.legalRepresentative = this.keyword
    //   }
    //   this.fetchCompanyData()
    // },
    // handleCompanyDeptNodeClick(data, node) {
    //   if (data.id === '51' ||
    //       data.id === '104' ||
    //       data.id === '102' ||
    //       data.id === '105' ||
    //       data.id === '25' ||
    //       data.id === '32' ||
    //       data.id === '37' ||
    //       data.id === '38' ||
    //       data.id === '43' ||
    //       data.id === '40' ||
    //       data.id === '41' ||
    //       data.id === '46' ||
    //       data.id === '42' ||
    //       data.id === '39' ||
    //       data.id === '44' ||
    //       data.id === '45') {
    //     this.companyListQuery.pIds = '-' + data.id + '_'
    //   } else if (data.id === '244' || data.id === '103' || data.id === '106' || data.id === '107' || data.id === '30' || data.id === '36') {
    //     this.companyListQuery.pIds = '-' + data.id + '_'
    //   } else {
    //     this.companyListQuery.pIds = data.id
    //   }
    //   this.companyListQuery.deptName = data.simplename
    //   this.deptTree.show = false
    //   this.fetchCompanyData()
    // },
    // fetchCompanyData() {
    //   this.companyListLoading = true

    //   // const companys = this.$store.state.user.companys
    //   if (this.companyPermissons && this.companyPermissons.length > 0) {
    //     // this.companyListQuery.ids = this.companyPermissons.toString()
    //     // this.companyListQuery.page = 1
    //   } else {
    //     this.companyListQuery.ids = ''
    //   }
    //   getCompanyList(this.companyListQuery).then(response => {
    //     this.companyList = response.data.records
    //     this.companyListLoading = false
    //     this.companyTotal = response.data.total
    //     this.companyListQuery.enterpriseName = ''
    //     this.companyListQuery.unifiedSocialCreditCode = ''
    //     this.companyListQuery.legalRepresentative = ''
    //     this.initCompanyChecked()
    //   })
    // },

    // // 初始化公司选中状态
    // initCompanyChecked() {
    //   const _this = this
    //   setTimeout(() => {
    //     _this.companyList.forEach(row => {
    //       let bool = false
    //       if (_this.companyPermissons.indexOf(row.id) >= 0) {
    //         bool = true
    //       } else {
    //         bool = false
    //       }
    //       _this.$refs.companytable.toggleRowSelection(row, bool)
    //     })
    //   }, 100)
    // },

    // fetchCompanyNext() {
    //   this.companyListQuery.page = this.companyListQuery.page + 1
    //   this.fetchCompanyData()
    // },
    // fetchCompanyPrev() {
    //   this.companyListQuery.page = this.companyListQuery.page - 1
    //   this.fetchCompanyData()
    // },
    // fetchCompanyPage(page) {
    //   this.companyListQuery.page = page
    //   this.fetchCompanyData()
    // },
    // changeCompanySize(limit) {
    //   this.companyListQuery.limit = limit
    //   this.fetchCompanyData()
    // },

    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // },
    // saveCompanyPermissions() { // 公司权限保存
    //   const checkedNodes = this.multipleSelection
    //   let companyIds = ''
    //   for (var index in checkedNodes) {
    //     companyIds += checkedNodes[index].id + ','
    //   }
    //   console.log(companyIds)
    //   const data = {
    //     roleId: this.selRow.id,
    //     permissions: companyIds
    //   }
    //   saveCompanyPermissons(data).then(response => {
    //     this.permissonCompanyVisible = false
    //     this.$message({
    //       message: '提交成功',
    //       type: 'success'
    //     })
    //   })
    // },
    /**
     * 公司权限管理-原
     */

    openCompanyPermissions() { // 公司权限
      if (this.checkSel()) {
        this.permissonCompanyVisible = true
        this.companyListQueryLeft.pIds = ''
        this.companyListQueryLeft.deptName = ''
        this.companyListQueryRight.pIds = ''
        this.companyListQueryRight.deptName = ''
        this.fetchCompanyDataLeft()
        this.fetchCompanyDataRight()
      }
    },

    // 左侧企业
    searchCompanyLeft() {
      if (this.searchTypeLeft === 'enterpriseName') {
        this.companyListQueryLeft.enterpriseName = this.keywordLeft
      }
      if (this.searchTypeLeft === 'unifiedSocialCreditCode') {
        this.companyListQueryLeft.unifiedSocialCreditCode = this.keywordLeft
      }
      if (this.searchTypeLeft === 'legalRepresentative') {
        this.companyListQueryLeft.legalRepresentative = this.keywordLeft
      }
      this.companyListQueryLeft.page = 1
      this.fetchCompanyDataLeft()
    },
    handleCompanyDeptNodeClickLeft(data, node) {
      if (data.id === '35') {
        this.companyListQueryLeft.pIds = ''
      } else {
        this.companyListQueryLeft.pIds = '-' + data.id + '_'
      }

      this.companyListQueryLeft.deptName = data.simplename
      this.deptTreeLeft.show = false
      this.fetchCompanyDataLeft()
    },
    fetchCompanyDataLeft() {
      this.companyListLoadingLeft = true
      this.companyListQueryLeft.ids = ''
      getCompanyList(this.companyListQueryLeft).then(response => {
        this.companyListLeft = response.data.records
        this.companyListLoadingLeft = false
        this.companyTotalLeft = response.data.total
        this.companyListQueryLeft.enterpriseName = ''
        this.companyListQueryLeft.unifiedSocialCreditCode = ''
        this.companyListQueryLeft.legalRepresentative = ''
      })
    },

    fetchCompanyNextLeft() {
      this.companyListQueryLeft.page = this.companyListQueryLeft.page + 1
      this.fetchCompanyDataLeft()
    },
    fetchCompanyPrevLeft() {
      this.companyListQueryLeft.page = this.companyListQueryLeft.page - 1
      this.fetchCompanyDataLeft()
    },
    fetchCompanyPageLeft(page) {
      this.companyListQueryLeft.page = page
      this.fetchCompanyDataLeft()
    },
    changeCompanySizeLeft(limit) {
      this.companyListQueryLeft.limit = limit
      this.fetchCompanyDataLeft()
    },

    handleSelectionChangeLeft(val) {
      this.multipleSelectionLeft = val
    },

    // 右侧企业
    searchCompanyRight() {
      if (this.searchTypeRight === 'enterpriseName') {
        this.companyListQueryRight.enterpriseName = this.keywordRight
      }
      if (this.searchTypeRight === 'unifiedSocialCreditCode') {
        this.companyListQueryRight.unifiedSocialCreditCode = this.keywordRight
      }
      if (this.searchTypeRight === 'legalRepresentative') {
        this.companyListQueryRight.legalRepresentative = this.keywordRight
      }
      this.companyListQueryRight.page = 1
      this.fetchCompanyDataRight()
    },
    handleCompanyDeptNodeClickRight(data, node) {
      if (data.id === '35') {
        this.companyListQueryRight.pIds = ''
      } else {
        this.companyListQueryRight.pIds = '-' + data.id + '_'
      }
      this.companyListQueryRight.deptName = data.simplename
      this.deptTreeRight.show = false
      this.fetchCompanyDataRight()
    },
    fetchCompanyDataRight() {
      this.companyListLoadingRight = true
      const companyRoleQuery = {
        page: 1,
        limit: 3000,
        roleId: this.selRow.id
      }
      companyListByRoleId(companyRoleQuery).then(response => {
        var tempArr = []
        if (response.data.records && response.data.records.length > 0) {
          for (let i = 0; i < response.data.records.length; i++) {
            if (response.data.records[i].companyid) {
              tempArr.push(response.data.records[i].companyid)
            }
          }
        }
        this.companyPermissons = tempArr
        this.companyListQueryRight.ids = tempArr.length > 0 ? tempArr.join(',') : '1000020000'
        getCompanyList(this.companyListQueryRight).then(response => {
          this.companyListRight = response.data.records
          this.companyListLoadingRight = false
          this.companyTotalRight = response.data.total
          this.companyListQueryRight.enterpriseName = ''
          this.companyListQueryRight.unifiedSocialCreditCode = ''
          this.companyListQueryRight.legalRepresentative = ''
        })
      })
    },

    fetchCompanyNextRight() {
      this.companyListQueryRight.page = this.companyListQueryRight.page + 1
      this.fetchCompanyDataRight()
    },
    fetchCompanyPrevRight() {
      this.companyListQueryRight.page = this.companyListQueryRight.page - 1
      this.fetchCompanyDataRight()
    },
    fetchCompanyPageRight(page) {
      this.companyListQueryRight.page = page
      this.fetchCompanyDataRight()
    },
    changeCompanySizeRight(limit) {
      this.companyListQueryRight.limit = limit
      this.fetchCompanyDataRight()
    },

    handleSelectionChangeRight(val) {
      this.multipleSelectionRight = val
    },

    saveCompanyPermissions(num) { // 公司权限保存
      let companyPermissons = this.companyPermissons
      if (num === 1) {
        const checkedNodes = this.multipleSelectionLeft
        const companyIds = []
        for (var index in checkedNodes) {
          companyIds.push(checkedNodes[index].id)
        }
        companyPermissons = MergeArray(this.companyPermissons, companyIds)
      } else {
        const checkedNodes = this.multipleSelectionRight
        for (var index in checkedNodes) {
          var key = companyPermissons.indexOf(checkedNodes[index].id)
          companyPermissons.splice(key, 1)
        }
      }

      const data = {
        roleId: this.selRow.id,
        permissions: companyPermissons.join(',')
      }
      saveCompanyPermissons(data).then(response => {
        // this.permissonCompanyVisible = false
        this.fetchCompanyDataRight()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    }

  }
}
