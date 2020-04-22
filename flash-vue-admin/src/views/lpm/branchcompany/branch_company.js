import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { remove, getList, save } from '@/api/lpm/branchcompany'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加分公司信息',
      companyListQuery: {
        page: 1,
        limit: 1000,
        id: undefined
      },
      companyList: [],
      companyTree: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'enterpriseName',
          children: 'children'
        }
      },
      isAdd: true,
      form: {
        enterpriseName: '',
        enterpriseCode: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        legalRepresentative: '',
        setupDate: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        registeredCapital: '',
        currency: '',
        registrationStatus: '',
        proportion: '',
        remark: '',
        id: ''
      },
      rules: {
        enterpriseName: [
          { required: true, message: '请选择所属公司名称', trigger: 'blur' }
        ],
        branchCompanyName: [
          { required: true, message: '请选择分公司', trigger: 'blur' }
        ],
        proportion: [
          { required: true, message: '股权占比不能为空', trigger: 'blur' }
        ]

      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      restaurants: [] // 分公司列表
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
  computed: {

    // 表单验证
    // rules() {
    //   return {
    //     // cfgName: [
    //     //   { required: true, message: this.$t('config.name') + this.$t('common.isRequired'), trigger: 'blur' },
    //     //   { min: 3, max: 2000, message: this.$t('config.name') + this.$t('config.lengthValidation'), trigger: 'blur' }
    //     // ]
    //   }
    // }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseCode = this.$route.query.id
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })

      this.companyListQuery.id = this.$route.query.id
      getEnterpriseList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.listLoading = false
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {

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
        enterpriseName: '',
        enterpriseCode: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        legalRepresentative: '',
        setupDate: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        registeredCapital: '',
        currency: '',
        registrationStatus: '',
        proportion: '',
        remark: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加分公司信息'
      this.formVisible = true
      this.isAdd = true
      // 设置新增公司的初始值;
      this.form.enterpriseName = this.companyList[0].enterpriseName
      this.form.enterpriseCode = this.companyList[0].id

      // 请求分公司全部列表
      getEnterpriseList({
        page: 1,
        limit: 1000
      }).then(response => {
        this.restaurants = response.data.records
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            branchCompanyName: this.form.branchCompanyName,
            branchCompanyCode: this.form.branchCompanyCode,
            legalRepresentative: this.form.legalRepresentative,
            setupDate: this.form.setupDate,
            type: this.form.type,
            customType: this.form.customType,
            registrationType: this.form.registrationType,
            registrationPlace: this.form.registrationPlace,
            registeredCapital: this.form.registeredCapital,
            currency: this.form.currency,
            registrationStatus: this.form.registrationStatus,
            proportion: this.form.proportion,
            remark: this.form.remark,
            id: this.form.id
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
            this.formVisible = false
          })
        } else {
          return false
        }
      })
    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑分公司信息'
        this.formVisible = true

        // 请求分公司全部列表
        getEnterpriseList({
          page: 1,
          limit: 1000
        }).then(response => {
          this.restaurants = response.data.records
        })
      }
    },
    remove() {
      if (this.checkSel()) {
        var id = this.selRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
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
    handleCompanyNodeClick(data, node) {
      this.form.enterpriseCode = data.id
      this.form.enterpriseName = data.enterpriseName
      this.companyTree.show = false
    },
    // 搜索分公司相关函数
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      cb(results)
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.enterpriseName.indexOf(queryString) === 0)
      }
    },
    handleBranchCompanySelect(item) {
      // console.log(this.list)
      if (item.id === this.form.enterpriseCode) {
        alert('不能选本身公司')
        return
      }
      var result = this.list.filter(word => word.branchCompanyCode === item.id)
      console.log(result)
      if (result.length > 0) {
        alert('这家分公司已经添加')
        return
      }

      this.form.branchCompanyName = item.enterpriseName
      this.form.branchCompanyCode = item.id
      this.form.legalRepresentative = item.legalRepresentative
      this.form.setupDate = item.setupDate
      this.form.type = item.type
      this.form.customType = item.customType
      this.form.registrationType = item.registrationType
      this.form.registrationPlace = item.registrationPlace
      this.form.registeredCapital = item.registeredCapital
      this.form.currency = item.currency
      this.form.registrationStatus = item.registrationStatus
      this.form.remark = item.remark
    },
    handleIconClick(ev) {
      // getUserList(this.listUserQuery).then(response => {
      //   this.restaurants = response.data.records
      // })
      alert('如果没有搜索到，如有权限可以新增分公司信息')
      console.log(ev)
    }

  }
}
