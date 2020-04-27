import { remove, getList, save } from '@/api/lpm/businesslicense'
import { parseTime } from '@/utils'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel } from '@/utils/common'
import advancedUser from '@/views/system/user/advancedUser.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { advancedUser },
  data() {
    return {
      activeName: 'second',
      formVisible: false,
      formTitle: '添加营业执照',
      enterpriseType: '', // 企业类型
      registrationStatusBL: '', // 登记状态
      isAdd: true,
      form: {
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseCode: '',
        type: '',
        legalRepresentative: '',
        registeredCapital: '',
        setupDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        businessAddress: '',
        businessScope: '',
        businessLicense: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {}
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
    rules() {
      return {
        // cfgName: [
        //   { required: true, message: this.$t('config.name') + this.$t('common.isRequired'), trigger: 'blur' },
        //   { min: 3, max: 2000, message: this.$t('config.name') + this.$t('config.lengthValidation'), trigger: 'blur' }
        // ]
      }
    }
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

      this.listQuery.registrationType = 2
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.listQuery.registrationType = '2'
      }
      if (tab.name === 'second') {
        this.listQuery.registrationType = '3'
      }

      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
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
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseCode: '',
        type: '',
        legalRepresentative: '',
        registeredCapital: '',
        setupDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        businessAddress: '',
        businessScope: '',
        businessLicense: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      }
    },
    addHK() {
      this.$router.push({ path: '/lpm/businesslicense/edit', query: { registrationType: 2 }})
    },
    addOther() {
      this.$router.push({ path: '/lpm/businesslicense/edit', query: { registrationType: 3 }})
    },
    add() {
      if (this.$route.meta.registrationType) {
        this.$router.push({ path: '/lpm/businesslicense/edit', query: { registrationType: this.$route.meta.registrationType }})
      } else {
        this.$router.push({ path: '/lpm/businesslicense/edit' })
      }
      // this.resetForm()
      // this.formTitle = '添加营业执照'
      // this.formVisible = true
      // this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            unifiedSocialCreditCode: this.form.unifiedSocialCreditCode,
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            type: this.form.type,
            legalRepresentative: this.form.legalRepresentative,
            registeredCapital: (this.form.registeredCapital) * 1,
            setupDate: parseTime(this.form.setupDate, '{y}-{m}-{d}'),
            operatingPeriodFrom: parseTime(this.form.operatingPeriodFrom, '{y}-{m}-{d}'),
            operatingPeriodEnd: parseTime(this.form.operatingPeriodEnd, '{y}-{m}-{d}'),
            registrationAuthority: this.form.registrationAuthority,
            approvalDate: parseTime(this.form.approvalDate, '{y}-{m}-{d}'),
            registrationStatus: this.form.registrationStatus,
            registeredAddress: this.form.registeredAddress,
            businessAddress: this.form.businessAddress,
            businessScope: this.form.businessScope,
            businessLicense: this.form.businessLicense,
            approvalFiles: this.form.approvalFiles,
            companyArticlesAssociation: this.form.companyArticlesAssociation,
            shareholdersDecide: this.form.shareholdersDecide,
            applicationRegistrationFiles: this.form.applicationRegistrationFiles,
            otherFiles: this.form.otherFiles,
            id: this.form.id
          }
          ).then(response => {
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
        if (this.$route.meta.registrationType) {
          this.$router.push({ path: '/lpm/businesslicense/edit', query: { id: this.selRow.id, registrationType: this.$route.meta.registrationType }})
        } else {
          this.$router.push({ path: '/lpm/businesslicense/edit', query: { id: this.selRow.id }})
        }
      }
      // if (this.checkSel()) {
      //   this.isAdd = false
      //   this.form = this.selRow
      //   this.formTitle = '编辑营业执照'
      //   this.formVisible = true
      // }
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
    // 格式化 企业类型
    formatterEnterpriseType(row) {
      dictList({ name: '企业类型' }).then(response => {
        this.enterpriseType = response.data[0].detail
      })
      const res = showDictLabel(this.enterpriseType, row.type)
      return res
    },
    // 格式化 登记状态
    formatterRegistrationStatus(row) {
      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusBL = response.data[0].detail
      })
      const res = showDictLabel(this.registrationStatusBL, row.registrationStatus)
      return res
    }

  }
}