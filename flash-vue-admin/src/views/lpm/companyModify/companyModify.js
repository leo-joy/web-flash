import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getListIds } from '@/api/cms/fileInfo'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { remove, getList, save } from '@/api/lpm/companyModify'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加企业变更',
      activeNames: ['1', '2', '3'],
      companyListQuery: {
        page: 1,
        limit: 1000,
        id: undefined
      },
      user: {},
      businesslicenseData: {},
      companyList: [],
      companyTree: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'enterpriseName',
          children: 'children'
        }
      },
      uploadUrl: '',
      uploadFileId: '',
      uploadHeaders: {
        'Authorization': ''
      },
      accessoryFilesList: [],

      isAdd: true,
      form: {
        affiliatedUnit: '',
        applyDepartment: '',
        applicant: '',
        applyTime: '',
        applicantContact: '',
        applyType: '',
        applyReason: '',
        modifyDate: '',
        enterpriseId: '',
        enterpriseNameState: '',
        enterpriseNameOld: '',
        enterpriseNameNew: '',
        registeredAddressState: '',
        registeredAddressOld: '',
        registeredAddressNew: '',
        businessScopeState: '',
        businessScopeOld: '',
        businessScopeNew: '',
        otherFiles: '',
        id: ''
      },
      rules: {
        affiliatedUnit: [
          { required: true, message: '请填写单位信息', trigger: 'blur' }
        ],
        applyDepartment: [
          { required: true, message: '请填写申请部门', trigger: 'blur' }
        ],
        applicant: [
          { required: true, message: '请填写申请人', trigger: 'blur' }
        ],
        applicantContact: [
          { required: true, message: '请填写办理人联系方式', trigger: 'blur' }
        ],
        applyReason: [
          { required: true, message: '请填写申请理由', trigger: 'blur' }
        ],
        modifyDate: [
          { required: true, message: '请填写变更日期', trigger: 'blur' }
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
      this.user = this.$store.state.user.profile
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseId = this.$route.query.id
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
        affiliatedUnit: '',
        applyDepartment: '',
        applicant: '',
        applyTime: '',
        applicantContact: '',
        applyType: '',
        applyReason: '',
        modifyDate: '',
        enterpriseId: '',
        enterpriseNameState: '',
        enterpriseNameOld: '',
        enterpriseNameNew: '',
        registeredAddressState: '',
        registeredAddressOld: '',
        registeredAddressNew: '',
        businessScopeState: '',
        businessScopeOld: '',
        businessScopeNew: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加企业变更'
      this.formVisible = true
      this.isAdd = true

      // 申请申请人相关信息
      this.form.affiliatedUnit = this.companyList[0].enterpriseName
      // this.form.affiliatedUnit = this.user.dept
      this.form.applyDepartment = '人力行政部'
      this.form.applicant = this.user.name
      this.form.applicantContact = this.user.phone

      // 设置企业旧的初始值;
      this.businesslicenseData = this.companyList[0]
      this.form.enterpriseId = this.companyList[0].id
      this.form.enterpriseNameOld = this.companyList[0].enterpriseName
      this.form.registeredAddressOld = this.companyList[0].registeredAddress
      this.form.businessScopeOld = this.companyList[0].businessScope
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            affiliatedUnit: this.form.affiliatedUnit,
            applyDepartment: this.form.applyDepartment,
            applicant: this.form.applicant,
            applyTime: this.form.applyTime,
            applicantContact: this.form.applicantContact,
            applyType: this.form.applyType,
            applyReason: this.form.applyReason,
            modifyDate: this.form.modifyDate,
            enterpriseId: this.form.enterpriseId,
            enterpriseNameState: this.form.enterpriseNameState,
            enterpriseNameOld: this.form.enterpriseNameOld,
            enterpriseNameNew: this.form.enterpriseNameNew,
            registeredAddressState: this.form.registeredAddressState,
            registeredAddressOld: this.form.registeredAddressOld,
            registeredAddressNew: this.form.registeredAddressNew,
            businessScopeState: this.form.businessScopeState,
            businessScopeOld: this.form.businessScopeOld,
            businessScopeNew: this.form.businessScopeNew,
            accessoryFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''),
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
        this.formTitle = '编辑企业变更'
        this.formVisible = true
        this.businesslicenseData = this.companyList[0]

        if (this.form.enterpriseNameState === 'true') {
          this.form.enterpriseNameState = true
        }

        if (this.form.registeredAddressState === 'true') {
          this.form.registeredAddressState = true
        }

        if (this.form.businessScopeState === 'true') {
          this.form.businessScopeState = true
        }

        if (this.selRow.accessoryFiles) {
          this.accessoryFilesList = []
          const filesListQuery = {
            page: 1,
            limit: 20,
            ids: this.selRow.accessoryFiles.toString()
          }
          getListIds(filesListQuery).then(response => {
            for (let i = 0; i < response.data.records.length; i++) {
              const file = {}
              file.id = response.data.records[i].id
              file.name = response.data.records[i].originalFileName
              file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
              this.accessoryFilesList.push(file)
            }
          })
        }
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
    }, handleCompanyNodeClick(data, node) {
      this.form.enterpriseCode = data.id
      this.form.enterpriseName = data.enterpriseName
      this.companyTree.show = false
    },
    handleBeforeUpload() {
      if (this.uploadFileId !== '') {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
      this.loadingInstance = Loading.service({
        lock: true,
        text: this.$t('common.uploading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    hanglePreview(file) {
      this.$router.push({ path: '/lpm/businesslicense/pdfview' })
    },
    handleRemoveFile(file) {
      // 删除原文时更新原文列表
      // 判断删除文件的位置，等于0，是在列表首位
      if (this.form.accessoryFiles.indexOf(file.id) !== 0) {
        this.form.accessoryFiles = this.form.accessoryFiles.replace(' ' + file.id, '')
      } else {
        this.form.accessoryFiles = this.form.accessoryFiles.replace(file.id, '')
      }
    },
    accessoryFilesUploadSuccess(response) {
      this.loadingInstance.close()
      if (response.code === 20000) {
        if (this.form.accessoryFiles) {
          this.form.accessoryFiles = this.form.accessoryFiles + ' ' + response.data.id
        } else {
          this.form.accessoryFiles = response.data.id
        }
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }
    }

  }
}
