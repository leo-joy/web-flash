import { getListIds } from '@/api/cms/fileInfo'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList, remove, save } from '@/api/lpm/companyModify'
import { getList as getMainMemberList } from '@/api/lpm/mainmember'
import { getList as getUserList } from '@/api/system/user'
// 权限判断指令
import permission from '@/directive/permission/index.js'
import { getToken } from '@/utils/auth'
import { getApiUrl } from '@/utils/utils'
import { Loading } from 'element-ui'

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
      mainmemberData: {}, // 主要人员相关数据
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

      restaurants: [],
      directorTags: [], // 董事
      supervisorTags: [], // 监事
      listUserQuery: {
        page: 1,
        limit: 20000,
        account: undefined,
        name: undefined
      },

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
        operatingPeriodEndState: '',
        operatingPeriodEndOld: '',
        operatingPeriodEndNew: '',
        businessScopeState: '',
        businessScopeOld: '',
        businessScopeNew: '',
        legalRepresentativeState: '',
        legalRepresentativeOld: '',
        legalRepresentativeNew: '',
        chairmanState: '',
        chairmanOld: '',
        chairmanNew: '',
        chairmanIdOld: '',
        chairmanIdNew: '',

        generalManagerState: '',
        generalManagerOld: '',
        generalManagerNew: '',
        generalManagerIdOld: '',
        generalManagerIdNew: '',

        directorState: '',
        directorOld: '',
        directorNew: '',
        directorIdOld: '',
        directorIdNew: '',

        supervisorState: '',
        supervisorOld: '',
        supervisorNew: '',
        supervisorIdOld: '',
        supervisorIdNew: '',

        businessLicenseFiles: '', // 营业执照
        approvalFiles: '', // 核准文件
        companyReferenceRegisterFiles: '', // 公司备案登记表
        companyModifyRegisterFiles: '', // 变更事项登记表
        companyArticlesAssociationFiles: '', // 公司章程
        shareholdersDecideFiles: '', // 股东会决议
        seniorManagementFiles: '', // 企业高管信息确认书
        promiseFiles: '', // 承诺书
        delegationFiles: '', // 委托书
        authorizationFiles: '', // 指定代表或者共同委托代理人授权委托书
        appointDismissFiles: '', // 任职免职书
        otherFiles: '', // 其它文件
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
      selRow: {},
      businessLicenseFilesList: [], // 营业执照
      approvalFilesList: [], // 核准文件
      companyReferenceRegisterFilesList: [], // 公司备案登记表
      companyModifyRegisterFilesList: [], // 变更事项登记表
      companyArticlesAssociationFilesList: [], // 公司章程
      shareholdersDecideFilesList: [], // 股东会决议
      seniorManagementFilesList: [], // 企业高管信息确认书
      promiseFilesList: [], // 承诺书
      delegationFilesList: [], // 委托书
      authorizationFilesList: [], // 指定代表或者共同委托代理人授权委托书
      appointDismissFilesList: [], // 任职免职书
      otherFilesList: [], // 其它文件
      accessoryFiles: [] // 详情附件
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
      getUserList(this.listUserQuery).then(response => {
        this.restaurants = response.data.records
      })
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

      // 请求主要人员信息数据
      getMainMemberList({ enterpriseCode: this.$route.query.id, page: 1, limit: 1 }).then(response => {
        if (response.data.records && response.data.records.length > 0) {
          this.mainmemberData = response.data.records[0]
        }
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
        operatingPeriodEndState: '',
        operatingPeriodEndOld: '',
        operatingPeriodEndNew: '',
        businessScopeState: '',
        businessScopeOld: '',
        businessScopeNew: '',
        legalRepresentativeState: '',
        legalRepresentativeOld: '',
        legalRepresentativeNew: '',

        chairmanState: '',
        chairmanOld: '',
        chairmanNew: '',
        chairmanIdOld: '',
        chairmanIdNew: '',

        generalManagerState: '',
        generalManagerOld: '',
        generalManagerNew: '',
        generalManagerIdOld: '',
        generalManagerIdNew: '',

        directorState: '',
        directorOld: '',
        directorNew: '',
        directorIdOld: '',
        directorIdNew: '',

        supervisorState: '',
        supervisorOld: '',
        supervisorNew: '',
        supervisorIdOld: '',
        supervisorIdNew: '',

        businessLicenseFiles: '', // 营业执照
        approvalFiles: '', // 核准文件
        companyReferenceRegisterFiles: '', // 公司备案登记表
        companyModifyRegisterFiles: '', // 变更事项登记表
        companyArticlesAssociationFiles: '', // 公司章程
        shareholdersDecideFiles: '', // 股东会决议
        seniorManagementFiles: '', // 企业高管信息确认书
        promiseFiles: '', // 承诺书
        delegationFiles: '', // 委托书
        authorizationFiles: '', // 指定代表或者共同委托代理人授权委托书
        appointDismissFiles: '', // 任职免职书
        otherFiles: '', // 其它文件

        accessoryFiles: '',
        id: ''
      }
    },
    initFormInfo() {
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
      this.form.operatingPeriodEndOld = this.companyList[0].operatingPeriodEnd
      this.form.businessScopeOld = this.companyList[0].businessScope
      this.form.legalRepresentativeOld = this.companyList[0].legalRepresentative

      // 董事长
      if (this.mainmemberData) {
        this.form.chairmanIdOld = this.mainmemberData.chairmanId
        this.form.chairmanOld = this.mainmemberData.chairman
      }

      // 经理
      if (this.mainmemberData) {
        this.form.generalManagerIdOld = this.mainmemberData.generalManagerId
        this.form.generalManagerOld = this.mainmemberData.generalManager
      }
      // 董事
      if (this.mainmemberData) {
        this.form.directorIdOld = this.mainmemberData.directorId
        this.form.directorOld = this.mainmemberData.director
      }

      // 监事
      if (this.mainmemberData) {
        this.form.supervisorIdOld = this.mainmemberData.supervisorId
        this.form.supervisorOld = this.mainmemberData.supervisor
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加企业变更'
      this.formVisible = true
      this.isAdd = true
      this.accessoryFilesList = []
      this.initFormInfo()
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
            operatingPeriodEndState: this.form.operatingPeriodEndState,
            operatingPeriodEndOld: this.form.operatingPeriodEndOld,
            operatingPeriodEndNew: this.form.operatingPeriodEndNew,
            businessScopeState: this.form.businessScopeState,
            businessScopeOld: this.form.businessScopeOld,
            businessScopeNew: this.form.businessScopeNew,
            legalRepresentativeState: this.form.legalRepresentativeState,
            legalRepresentativeOld: this.form.legalRepresentativeOld,
            legalRepresentativeNew: this.form.legalRepresentativeNew,
            chairmanState: this.form.chairmanState,
            chairmanOld: this.form.chairmanOld,
            chairmanNew: this.form.chairmanNew,
            chairmanIdOld: this.form.chairmanIdOld,
            chairmanIdNew: this.form.chairmanIdNew,

            generalManagerState: this.form.generalManagerState,
            generalManagerOld: this.form.generalManagerOld,
            generalManagerNew: this.form.generalManagerNew,
            generalManagerIdOld: this.form.generalManagerIdOld,
            generalManagerIdNew: this.form.generalManagerIdNew,

            directorState: this.form.directorState,
            directorOld: this.form.directorOld,
            directorNew: this.form.directorNew,
            directorIdOld: this.form.directorIdOld,
            directorIdNew: this.form.directorIdNew,

            supervisorState: this.form.supervisorState,
            supervisorOld: this.form.supervisorOld,
            supervisorNew: this.form.supervisorNew,
            supervisorIdOld: this.form.supervisorIdOld,
            supervisorIdNew: this.form.supervisorIdNew,

            businessLicenseFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''), // 营业执照
            approvalFiles: this.form.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''), // 核准文件
            companyReferenceRegisterFiles: this.form.companyReferenceRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 公司备案登记表
            companyModifyRegisterFiles: this.form.companyModifyRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 变更事项登记表
            companyArticlesAssociationFiles: this.form.companyArticlesAssociationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 公司章程
            shareholdersDecideFiles: this.form.shareholdersDecideFiles.replace(/(^\s*)|(\s*$)/g, ''), // 股东会决议
            seniorManagementFiles: this.form.seniorManagementFiles.replace(/(^\s*)|(\s*$)/g, ''), // 企业高管信息确认书
            promiseFiles: this.form.promiseFiles.replace(/(^\s*)|(\s*$)/g, ''), // 承诺书
            delegationFiles: this.form.delegationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 委托书
            authorizationFiles: this.form.authorizationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 指定代表或者共同委托代理人授权委托书
            appointDismissFiles: this.form.appointDismissFiles.replace(/(^\s*)|(\s*$)/g, ''), // 任职免职书
            otherFiles: this.form.otherFiles.replace(/(^\s*)|(\s*$)/g, ''), // 其它文件

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
        this.initFormInfo()
        this.businessLicenseFilesList = [] // 营业执照
        this.approvalFilesList = [] // 核准文件
        this.companyReferenceRegisterFilesList = [] // 公司备案登记表
        this.companyModifyRegisterFilesList = [] // 变更事项登记表
        this.companyArticlesAssociationFilesList = [] // 公司章程
        this.shareholdersDecideFilesList = [] // 股东会决议
        this.seniorManagementFilesList = [] // 企业高管信息确认书
        this.promiseFilesList = [] // 承诺书
        this.delegationFilesList = [] // 委托书
        this.authorizationFilesList = [] // 指定代表或者共同委托代理人授权委托书
        this.appointDismissFilesList = [] // 任职免职书
        this.otherFilesList = [] // 其它文件
        this.accessoryFilesList = [] // 详情附件

        if (this.form.enterpriseNameState === 'true') {
          this.form.enterpriseNameState = true
        }

        if (this.form.registeredAddressState === 'true') {
          this.form.registeredAddressState = true
        }

        if (this.form.operatingPeriodEndState === 'true') {
          this.form.operatingPeriodEndState = true
        }

        if (this.form.businessScopeState === 'true') {
          this.form.businessScopeState = true
        }

        if (this.form.legalRepresentativeState === 'true') {
          this.form.legalRepresentativeState = true
        }

        if (this.form.chairmanState === 'true') {
          this.form.chairmanState = true
        }

        if (this.form.generalManagerState === 'true') {
          this.form.generalManagerState = true
        }

        if (this.form.directorState === 'true') {
          this.form.directorState = true
          if (this.selRow.directorIdNew) {
            this.directorTags = []
            const directorIdArr = this.selRow.directorIdNew.split('、')
            const directorArr = this.selRow.directorNew.split('、')
            for (let j = 0; j < directorIdArr.length; j++) {
              this.directorTags.push({ name: directorArr[j], id: directorIdArr[j] })
            }
          }
        }

        if (this.form.supervisorState === 'true') {
          this.form.supervisorState = true
          if (this.selRow.supervisorIdNew) {
            this.supervisorTags = []
            const supervisorIdArr = this.selRow.supervisorIdNew.split('、')
            const supervisorArr = this.selRow.supervisorNew.split('、')
            for (let j = 0; j < supervisorIdArr.length; j++) {
              this.supervisorTags.push({ name: supervisorArr[j], id: supervisorIdArr[j] })
            }
          }
        }

        var accessoryArr = ['businessLicenseFiles', 'approvalFiles',
          'companyReferenceRegisterFiles', 'companyModifyRegisterFiles',
          'companyArticlesAssociationFiles', 'shareholdersDecideFiles',
          'seniorManagementFiles', 'promiseFiles',
          'delegationFiles', 'authorizationFiles',
          'appointDismissFiles', 'otherFiles', 'accessoryFiles']
        for (let j = 0; j < accessoryArr.length; j++) {
          if (this.selRow[accessoryArr[j]]) {
            const filesListQuery = {
              page: 1,
              limit: 20,
              ids: this.selRow[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '') || '0'
            }
            getListIds(filesListQuery).then(response => {
              for (let i = 0; i < response.data.records.length; i++) {
                const file = {}
                file.id = response.data.records[i].id
                file.name = response.data.records[i].originalFileName
                file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
                // this.accessoryFilesList.push(file)
                this[accessoryArr[j] + 'List'].push(file)
              }
            })
          }
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
    },
    handleCompanyNodeClick(data, node) {
      this.form.enterpriseCode = data.id
      this.form.enterpriseName = data.enterpriseName
      this.companyTree.show = false
    },

    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      cb(results)
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.name.indexOf(queryString) === 0)
      }
    },
    handleIconClick(ev) {
      this.$router.push({ path: '/advancedUser/1' })
      console.log(ev)
    },
    handleChairmanSelect(item) {
      this.form.chairmanIdNew = item.id
      this.form.chairmanNew = item.name
    },

    handleGeneralManagerSelect(item) {
      this.form.generalManagerIdNew = item.id
      this.form.generalManagerNew = item.name
    },

    handleDirectorSelect(item) {
      console.log(item)
      console.log(this.form.directorNew)
      if (this.form.directorNew) {
        if (this.form.directorNew.indexOf(item.name) === -1) {
          this.form.directorIdNew = this.form.directorIdNew + '、' + item.id
          this.form.directorNew = this.form.directorNew + '、' + item.name
          this.directorTags.push({ id: item.id, name: item.name })
        } else {
          this.form.directorIdNew = this.form.directorIdNew
          this.form.directorNew = this.form.directorNew
        }
      } else {
        this.form.directorIdNew = item.id
        this.form.directorNew = item.name
        this.directorTags.push({ id: item.id, name: item.name })
      }
    },
    handleDirectorDelete(id, name) {
      var result = this.directorTags.filter(word => word.id !== id)
      console.log(result)
      this.directorTags = result.length > 0 ? result : []
      const n = (this.form.directorIdNew.split('、')).length - 1
      console.log(this.form.directorIdNew)
      console.log(this.form.directorNew)
      console.log(n)
      if (n > 0) {
        console.log('多个')
        if (this.form.directorNew.indexOf(name) !== 0) {
          this.form.directorIdNew = this.form.directorIdNew.replace('、' + id, '')
          this.form.directorNew = this.form.directorNew.replace('、' + name, '')
        } else {
          this.form.directorIdNew = this.form.directorIdNew.replace(id + '、', '')
          this.form.directorNew = this.form.directorNew.replace(name + '、', '')
        }
      } else {
        console.log('单个')
        this.form.directorIdNew = this.form.directorIdNew.replace(id, '')
        this.form.directorNew = this.form.directorNew.replace(name, '')
      }
      console.log(this.form.directorIdNew)
      console.log(this.form.directorNew)
      console.log(this.directorTags)
    },

    handleSupervisorSelect(item) {
      console.log(item)
      console.log(this.form.supervisorNew)
      if (this.form.supervisorNew) {
        if (this.form.supervisorNew.indexOf(item.name) === -1) {
          this.form.supervisorIdNew = this.form.supervisorIdNew + '、' + item.id
          this.form.supervisorNew = this.form.supervisorNew + '、' + item.name
          this.supervisorTags.push({ id: item.id, name: item.name })
        } else {
          this.form.supervisorIdNew = this.form.supervisorIdNew
          this.form.supervisorNew = this.form.supervisorNew
        }
      } else {
        this.form.supervisorIdNew = item.id
        this.form.supervisorNew = item.name
        this.supervisorTags.push({ id: item.id, name: item.name })
      }
    },
    handleSupervisorDelete(id, name) {
      var result = this.supervisorTags.filter(word => word.id !== id)
      console.log(result)
      this.supervisorTags = result.length > 0 ? result : []
      const n = (this.form.supervisorIdNew.split('、')).length - 1
      console.log(this.form.supervisorIdNew)
      console.log(this.form.supervisorNew)
      console.log(n)
      if (n > 0) {
        console.log('多个')
        if (this.form.supervisorNew.indexOf(name) !== 0) {
          this.form.supervisorIdNew = this.form.supervisorIdNew.replace('、' + id, '')
          this.form.supervisorNew = this.form.supervisorNew.replace('、' + name, '')
        } else {
          this.form.supervisorIdNew = this.form.supervisorIdNew.replace(id + '、', '')
          this.form.supervisorNew = this.form.supervisorNew.replace(name + '、', '')
        }
      } else {
        console.log('单个')
        this.form.supervisorIdNew = this.form.supervisorIdNew.replace(id, '')
        this.form.supervisorNew = this.form.supervisorNew.replace(name, '')
      }
      console.log(this.form.supervisorIdNew)
      console.log(this.form.supervisorNew)
      console.log(this.supervisorTags)
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
      alert('暂时不能预览')
      //this.$router.push({ path: '/lpm/businesslicense/pdfview' })
    },
    // handleRemoveFile(file) {
    //   // 删除原文时更新原文列表
    //   // 判断删除文件的位置，等于0，是在列表首位
    //   if (this.form.accessoryFiles.indexOf(file.id) !== 0) {
    //     this.form.accessoryFiles = this.form.accessoryFiles.replace(' ' + file.id, '')
    //   } else {
    //     this.form.accessoryFiles = this.form.accessoryFiles.replace(file.id, '')
    //   }
    // },
    // accessoryFilesUploadSuccess(response) {
    //   this.loadingInstance.close()
    //   if (response.code === 20000) {
    //     if (this.form.accessoryFiles) {
    //       this.form.accessoryFiles = this.form.accessoryFiles + ' ' + response.data.id
    //     } else {
    //       this.form.accessoryFiles = response.data.id
    //     }
    //   } else {
    //     this.$message({
    //       message: this.$t('common.uploadError'),
    //       type: 'error'
    //     })
    //   }
    // }
    handleRemoveFile(file, type) {
      // 删除原文时更新原文列表
      // 判断删除文件的位置，等于0，是在列表首位
      if (this.form[type].indexOf(file.id) !== 0) {
        this.form[type] = this.form[type].replace(' ' + file.id, '')
      } else {
        this.form[type] = this.form[type].replace(file.id, '')
      }
    },
    handleUploadSuccess(response, type) {
      this.loadingInstance.close()
      if (response.code === 20000) {
        this.form[type] = this.form[type] + ' ' + response.data.id
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }
    },
    /**
     * 附件删除和上传成功函数
     */
    businessLicenseFilesRemove(file) { // 营业执照
      this.handleRemoveFile(file, 'businessLicenseFiles')
    },
    businessLicenseFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'businessLicenseFiles')
    },
    approvalFilesRemove(file) { // 核准文件
      this.handleRemoveFile(file, 'approvalFiles')
    },
    approvalFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'approvalFiles')
    },
    companyReferenceRegisterFilesRemove(file) { // 公司备案登记表
      this.handleRemoveFile(file, 'companyReferenceRegisterFiles')
    },
    companyReferenceRegisterFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyReferenceRegisterFiles')
    },
    companyModifyRegisterFilesRemove(file) { // 变更事项登记表
      this.handleRemoveFile(file, 'companyModifyRegisterFiles')
    },
    companyModifyRegisterFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyModifyRegisterFiles')
    },
    companyArticlesAssociationFilesRemove(file) { // 公司章程
      this.handleRemoveFile(file, 'companyArticlesAssociationFiles')
    },
    companyArticlesAssociationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyArticlesAssociationFiles')
    },
    shareholdersDecideFilesRemove(file) { // 股东会决议
      this.handleRemoveFile(file, 'shareholdersDecideFiles')
    },
    shareholdersDecideFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'shareholdersDecideFiles')
    },
    seniorManagementFilesRemove(file) { // 企业高管信息确认书
      this.handleRemoveFile(file, 'seniorManagementFiles')
    },
    seniorManagementFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'seniorManagementFiles')
    },
    promiseFilesRemove(file) { // 承诺书
      this.handleRemoveFile(file, 'promiseFiles')
    },
    promiseFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'promiseFiles')
    },
    delegationFilesRemove(file) { // 委托书
      this.handleRemoveFile(file, 'delegationFiles')
    },
    delegationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'delegationFiles')
    },
    authorizationFilesRemove(file) { // 指定代表或者共同委托代理人授权委托书
      this.handleRemoveFile(file, 'authorizationFiles')
    },
    authorizationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'authorizationFiles')
    },
    appointDismissFilesRemove(file) { // 任职免职书
      this.handleRemoveFile(file, 'appointDismissFiles')
    },
    appointDismissFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'appointDismissFiles')
    },
    otherFilesRemove(file) { // 其它文件
      this.handleRemoveFile(file, 'otherFiles')
    },
    otherFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'otherFiles')
    },
    accessoryFilesRemove(file) { // 详情附件
      this.handleRemoveFile(file, 'accessoryFiles')
    },
    accessoryFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'accessoryFiles')
    }
  }
}
