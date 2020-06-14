import { getListIds } from '@/api/cms/fileInfo'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList, remove, save } from '@/api/lpm/companyModify'
import { getList as getMainMemberList } from '@/api/lpm/mainmember'
import { getList as getUserList } from '@/api/system/user'
import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { remove as removeCapitalModify, getList as getCapitalModifyList, save as saveCapitalModify } from '@/api/lpm/capitalModify'

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
        limit: 2000,
        id: undefined
      },
      user: {},
      businesslicenseData: {},
      enterpriseNameLabel: '***公司',
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
      restaurants: [],
      directorTags: [], // 董事
      supervisorTags: [], // 监事
      directorValue: '',
      supervisorValue: '',
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
        constitutionState: '',
        constitutionOld: '',
        constitutionNew: '',
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

        shareholderModifyState: '',
        shareholderIdsOld: '',
        shareholderIdsNew: '',

        businessLicenseFiles: '', // 营业执照
        approvalFiles: '', // 核准文件
        companyReferenceRegisterFiles: '', // 公司备案登记表
        companyModifyRegisterFiles: '', // 变更事项登记表
        companyArticlesAssociationFiles: '', // 公司章程
        shareholdersDecideFiles: '', // 股东会决议
        seniorManagementFiles: '', // 董事会决议
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
        applyReason: [
          { required: true, message: '请填写变更原因', trigger: 'blur' }
        ],
        modifyDate: [
          { required: true, message: '请填写变更日期', trigger: 'blur' }
        ],
        shareholder: [
          { required: true, message: '请选中股东名称', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      // total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      accessoryFiles: [], // 会议纪要、合作协议等
      businessLicenseFilesList: [], // 营业执照
      approvalFilesList: [], // 核准文件
      companyReferenceRegisterFilesList: [], // 公司备案登记表
      companyModifyRegisterFilesList: [], // 变更事项登记表
      companyArticlesAssociationFilesList: [], // 公司章程
      shareholdersDecideFilesList: [], // 股东会决议
      seniorManagementFilesList: [], // 董事会决议
      promiseFilesList: [], // 承诺书
      delegationFilesList: [], // 委托书
      authorizationFilesList: [], // 指定代表或者共同委托代理人授权委托书
      appointDismissFilesList: [], // 任职免职书
      otherFilesList: [], // 其它文件

      /**
       * 股权变更 -----start------
       */

      formCapitalModifyVisible: false,
      formCapitalModifyTitle: '添加股东及出资信息变更',
      isCapitalModifyAdd: true,
      subscribedCapitalTypeList: [], // 认缴出资方式，从数据字典中获取
      realityCapitalTypeList: [], // 实缴出资方式，从数据字典中获取
      typeList: [], // 类型，从数据字典中获取
      statusList: [], // 状态，从数据字典中获取
      enterpriseShareholders: [], // 公司股东列表
      naturalPersonShareholders: [], // 自然人股东列表
      formCapitalModify: {
        enterpriseCode: '',
        enterpriseName: '',
        serialIdModify: '',
        modifyStatusType: '',
        serialNumber: '',
        shareholder: '',
        subscribedCapitalType: '',
        subscribedCapitalContribution: '',
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: '',
        realityCapitalDate: '',
        responsiblePerson: '',
        shareholderType: '',
        shareholderMold: 1,
        proportion: 0,
        status: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        id: ''
      },

      // companyListQuery: {
      //   page: 1,
      //   limit: 2000,
      //   id: undefined
      // },
      // companyList: [],
      // companyTree: {
      //   show: false,
      //   defaultProps: {
      //     id: 'id',
      //     label: 'enterpriseName',
      //     children: 'children'
      //   }
      // },

      listCapitalModifyOldQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 0,
        id: undefined
      },
      listCapitalModifyOld: [],
      listCapitalModifyOldLoading: true,

      listCapitalModifyNewQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 1,
        id: undefined
      },
      listCapitalModifyNew: [],
      listCapitalModifyNewLoading: true,
      selCapitalModifyRow: {}
      /**
       * 股权变更 -----end------
       */

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
        // this.add()
      })
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseId = this.$route.query.id
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        // this.total = response.data.total
      })

      this.companyListQuery.id = this.$route.query.id
      getEnterpriseList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.listLoading = false
        if (response.data.records) {
          this.enterpriseNameLabel = '【' + response.data.records[0].enterpriseName + '】'
        }
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
        constitutionState: '',
        constitutionOld: '',
        constitutionNew: '',
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

        shareholderModifyState: '',
        shareholderIdsOld: '',
        shareholderIdsNew: '',

        accessoryFiles: '', // 会议纪要、合作协议等
        businessLicenseFiles: '', // 营业执照
        approvalFiles: '', // 核准文件
        companyReferenceRegisterFiles: '', // 公司备案登记表
        companyModifyRegisterFiles: '', // 变更事项登记表
        companyArticlesAssociationFiles: '', // 公司章程
        shareholdersDecideFiles: '', // 股东会决议
        seniorManagementFiles: '', // 董事会决议
        promiseFiles: '', // 承诺书
        delegationFiles: '', // 委托书
        authorizationFiles: '', // 指定代表或者共同委托代理人授权委托书
        appointDismissFiles: '', // 任职免职书
        otherFiles: '', // 其它文件
        id: ''
      }
      this.accessoryFiles = [] // 会议纪要、合作协议等
      this.businessLicenseFilesList = [] // 营业执照
      this.approvalFilesList = [] // 核准文件
      this.companyReferenceRegisterFilesList = [] // 公司备案登记表
      this.companyModifyRegisterFilesList = [] // 变更事项登记表
      this.companyArticlesAssociationFilesList = [] // 公司章程
      this.shareholdersDecideFilesList = [] // 股东会决议
      this.seniorManagementFilesList = [] // 董事会决议
      this.promiseFilesList = [] // 承诺书
      this.delegationFilesList = [] // 委托书
      this.authorizationFilesList = [] // 指定代表或者共同委托代理人授权委托书
      this.appointDismissFilesList = [] // 任职免职书
      this.otherFilesList = [] // 其它文件
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
      this.initFormInfo()
      this.initCapitalModify()
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    getShareholderIds(data) {
      const tempArr = []
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          tempArr.push(data[i].id)
        }
      }
      return tempArr
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const shareholderIdsOldArr = this.getShareholderIds(this.listCapitalModifyOld)
          const shareholderIdsNewArr = this.getShareholderIds(this.listCapitalModifyNew)

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
            enterpriseNameState: this.form.enterpriseNameState ? this.form.enterpriseNameState : 'false',
            enterpriseNameOld: this.form.enterpriseNameOld,
            enterpriseNameNew: this.form.enterpriseNameNew,
            registeredAddressState: this.form.registeredAddressState ? this.form.registeredAddressState : 'false',
            registeredAddressOld: this.form.registeredAddressOld,
            registeredAddressNew: this.form.registeredAddressNew,
            operatingPeriodEndState: this.form.operatingPeriodEndState ? this.form.operatingPeriodEndState : 'false',
            operatingPeriodEndOld: this.form.operatingPeriodEndOld,
            operatingPeriodEndNew: this.form.operatingPeriodEndNew,
            businessScopeState: this.form.businessScopeState ? this.form.businessScopeState : 'false',
            businessScopeOld: this.form.businessScopeOld,
            businessScopeNew: this.form.businessScopeNew,
            constitutionState: this.form.constitutionState ? this.form.constitutionState : 'false',
            constitutionOld: this.form.constitutionOld,
            constitutionNew: this.form.constitutionNew,
            legalRepresentativeState: this.form.legalRepresentativeState ? this.form.legalRepresentativeState : 'false',
            legalRepresentativeOld: this.form.legalRepresentativeOld,
            legalRepresentativeNew: this.form.legalRepresentativeNew,
            chairmanState: this.form.chairmanState ? this.form.chairmanState : 'false',
            chairmanOld: this.form.chairmanOld,
            chairmanNew: this.form.chairmanNew,
            chairmanIdOld: this.form.chairmanIdOld,
            chairmanIdNew: this.form.chairmanIdNew,

            generalManagerState: this.form.generalManagerState ? this.form.generalManagerState : 'false',
            generalManagerOld: this.form.generalManagerOld,
            generalManagerNew: this.form.generalManagerNew,
            generalManagerIdOld: this.form.generalManagerIdOld,
            generalManagerIdNew: this.form.generalManagerIdNew,

            directorState: this.form.directorState ? this.form.directorState : 'false',
            directorOld: this.form.directorOld,
            directorNew: this.form.directorNew,
            directorIdOld: this.form.directorIdOld,
            directorIdNew: this.form.directorIdNew,

            supervisorState: this.form.supervisorState ? this.form.supervisorState : 'false',
            supervisorOld: this.form.supervisorOld,
            supervisorNew: this.form.supervisorNew,
            supervisorIdOld: this.form.supervisorIdOld,
            supervisorIdNew: this.form.supervisorIdNew,

            shareholderModifyState: this.form.shareholderModifyState ? this.form.shareholderModifyState : 'false',
            shareholderIdsOld: shareholderIdsOldArr.toString(),
            shareholderIdsNew: shareholderIdsNewArr.toString(),

            accessoryFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''),
            businessLicenseFiles: this.form.businessLicenseFiles.replace(/(^\s*)|(\s*$)/g, ''), // 营业执照
            approvalFiles: this.form.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''), // 核准文件
            companyReferenceRegisterFiles: this.form.companyReferenceRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 公司备案登记表
            companyModifyRegisterFiles: this.form.companyModifyRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 变更事项登记表
            companyArticlesAssociationFiles: this.form.companyArticlesAssociationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 公司章程
            shareholdersDecideFiles: this.form.shareholdersDecideFiles.replace(/(^\s*)|(\s*$)/g, ''), // 股东会决议
            seniorManagementFiles: this.form.seniorManagementFiles.replace(/(^\s*)|(\s*$)/g, ''), // 董事会决议
            promiseFiles: this.form.promiseFiles.replace(/(^\s*)|(\s*$)/g, ''), // 承诺书
            delegationFiles: this.form.delegationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 委托书
            authorizationFiles: this.form.authorizationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 指定代表或者共同委托代理人授权委托书
            appointDismissFiles: this.form.appointDismissFiles.replace(/(^\s*)|(\s*$)/g, ''), // 任职免职书
            otherFiles: this.form.otherFiles.replace(/(^\s*)|(\s*$)/g, ''), // 其它文件

            id: this.form.id
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            if (response.success) {
              const arrayObject = this.listCapitalModifyOld
              const tempArr = arrayObject.concat(this.listCapitalModifyNew)
              console.log('response:', response)
              console.log('tempArr:', tempArr)
              if (tempArr && tempArr.length > 0 && response.data.shareholderModifyState === 'true') {
                for (let i = 0; i < tempArr.length; i++) {
                  const tempObj = tempArr[i]
                  saveCapitalModify({
                    enterpriseCode: tempObj.enterpriseCode,
                    enterpriseName: tempObj.enterpriseName,
                    serialIdModify: response.data.id,
                    modifyStatusType: tempObj.modifyStatusType,
                    serialNumber: tempObj.serialNumber,
                    shareholder: tempObj.shareholder,
                    subscribedCapitalType: tempObj.subscribedCapitalType,
                    subscribedCapitalContribution: tempObj.subscribedCapitalContribution,
                    subscribedCapitalDate: tempObj.subscribedCapitalDate,
                    realityCapitalType: tempObj.realityCapitalType,
                    realityCapitalContribution: tempObj.realityCapitalContribution,
                    realityCapitalDate: tempObj.realityCapitalDate,
                    responsiblePerson: tempObj.responsiblePerson,
                    shareholderType: tempObj.shareholderType,
                    shareholderMold: tempObj.shareholderMold,
                    proportion: tempObj.proportion,
                    status: tempObj.status,
                    branchCompanyName: tempObj.branchCompanyName,
                    branchCompanyCode: tempObj.branchCompanyCode,
                    id: tempObj.id
                  }).then(response => {
                    this.$message({
                      message: this.$t('common.optionSuccess'),
                      type: 'success'
                    })
                  })
                }
              }
            } else {
              this.back()
            }
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
        this.initFormInfo()
        this.form = this.selRow
        this.formTitle = '编辑企业变更'
        this.formVisible = true
        this.businesslicenseData = this.companyList[0]
        this.accessoryFilesList = [] // 会议纪要、合作协议等
        this.businessLicenseFilesList = [] // 营业执照
        this.approvalFilesList = [] // 核准文件
        this.companyReferenceRegisterFilesList = [] // 公司备案登记表
        this.companyModifyRegisterFilesList = [] // 变更事项登记表
        this.companyArticlesAssociationFilesList = [] // 公司章程
        this.shareholdersDecideFilesList = [] // 股东会决议
        this.seniorManagementFilesList = [] // 董事会决议
        this.promiseFilesList = [] // 承诺书
        this.delegationFilesList = [] // 委托书
        this.authorizationFilesList = [] // 指定代表或者共同委托代理人授权委托书
        this.appointDismissFilesList = [] // 任职免职书
        this.otherFilesList = [] // 其它文件

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

        if (this.form.constitutionState === 'true') {
          this.form.constitutionState = true
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

        if (this.form.shareholderModifyState === 'true') {
          this.form.shareholderModifyState = true
        }

        var accessoryArr = ['accessoryFiles', 'businessLicenseFiles', 'approvalFiles',
          'companyReferenceRegisterFiles', 'companyModifyRegisterFiles',
          'companyArticlesAssociationFiles', 'shareholdersDecideFiles',
          'seniorManagementFiles', 'promiseFiles',
          'delegationFiles', 'authorizationFiles',
          'appointDismissFiles', 'otherFiles']
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
                this[accessoryArr[j] + 'List'].push(file)
              }
            })
          }
        }

        this.initCapitalModify()
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
      if (queryString) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.name.indexOf(queryString) === 0)
      }
    },
    handleIconClick(ev) {
      const routeUrl = this.$router.resolve({ path: '/advancedUser/1' })
      window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: '/advancedUser/1' })
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
    },
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
    accessoryFilesRemove(file) { // 会议纪要、合作协议等
      this.handleRemoveFile(file, 'accessoryFiles')
    },
    accessoryFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'accessoryFiles')
    },
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
    seniorManagementFilesRemove(file) { // 董事会决议
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

    /**
       * 股权变更 -----start------
       */
    initCapitalModify() {
      dictList({ name: '认缴出资方式【股权及出资信息】' }).then(response => {
        this.subscribedCapitalTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '类型【股东信息】' }).then(response => {
        this.typeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '状态【股东信息】' }).then(response => {
        this.statusList = getDictList(response.data[0].detail)
      })
      this.companyListQuery.id = this.$route.query.id
      getEnterpriseList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.listLoading = false
      })

      // 请求公司股东全部列表
      getEnterpriseList({
        page: 1,
        limit: 2000
      }).then(response => {
        this.enterpriseShareholders = response.data.records
      })

      // 请求自然人股东全部列表
      getUserList({
        page: 1,
        limit: 50000
      }).then(response => {
        this.naturalPersonShareholders = response.data.records
      })
      this.fetchCapitalModifyOldData()
      this.fetchCapitalModifyNewData()
    },
    fetchCapitalModifyOldData() {
      this.listCapitalModifyOldLoading = true
      this.listCapitalModifyOldQuery.serialIdModify = this.form.id + ',new'
      getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
        this.listCapitalModifyOld = response.data.records || []
        this.listCapitalModifyOldLoading = false
      })
    },
    fetchCapitalModifyNewData() {
      this.listCapitalModifyNewLoading = true
      this.listCapitalModifyNewQuery.serialIdModify = this.form.id + ',new'
      getCapitalModifyList(this.listCapitalModifyNewQuery).then(response => {
        this.listCapitalModifyNew = response.data.records || []
        this.listCapitalModifyNewLoading = false
      })
    },
    resetCapitalModify() {
      this.listCapitalModifyOldQuery.id = ''
      this.fetchCapitalModifyOldData()
    },
    handleCapitalModifyFilter() {
      this.listCapitalModifyOldQuery.page = 1
      this.getCapitalModifyList()
    },
    handleCapitalModifyClose() {

    },
    handleCurrentCapitalModifyOldChange(currentRow, oldCurrentRow) {
      this.selCapitalModifyRow = currentRow
    },
    handleCurrentCapitalModifyNewChange(currentRow, oldCurrentRow) {
      this.selCapitalModifyRow = currentRow
    },
    resetCapitalModifyForm() {
      this.formCapitalModify = {
        enterpriseCode: this.businesslicenseData.id,
        enterpriseName: this.businesslicenseData.enterpriseName,
        serialIdModify: 'new',
        modifyStatusType: '',
        serialNumber: '',
        shareholder: '',
        subscribedCapitalType: '',
        subscribedCapitalContribution: '',
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: '',
        realityCapitalDate: '',
        responsiblePerson: '',
        shareholderMold: 1,
        shareholderType: '',
        proportion: 0,
        status: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        id: ''
      }
    },
    addCapitalModifyOld() {
      this.resetCapitalModifyForm()
      this.formCapitalModifyTitle = '添加股东及出资信息'
      this.formCapitalModifyVisible = true
      this.isCapitalModifyAdd = true
      this.formCapitalModify.modifyStatusType = 0
      this.formCapitalModify.enterpriseCode = this.businesslicenseData.id
      this.formCapitalModify.enterpriseName = this.businesslicenseData.enterpriseName
    },
    addCapitalModifyNew() {
      this.resetCapitalModifyForm()
      this.formCapitalModifyTitle = '添加股东及出资信息'
      this.formCapitalModifyVisible = true
      this.isCapitalModifyAdd = true
      this.formCapitalModify.modifyStatusType = 1
      this.formCapitalModify.enterpriseCode = this.businesslicenseData.id
      this.formCapitalModify.enterpriseName = this.businesslicenseData.enterpriseName
    },
    saveCapitalModify() {
      this.$refs['formCapitalModify'].validate((valid) => {
        if (valid) {
          saveCapitalModify({
            enterpriseCode: this.formCapitalModify.enterpriseCode,
            enterpriseName: this.formCapitalModify.enterpriseName,
            serialIdModify: 'new',
            modifyStatusType: this.formCapitalModify.modifyStatusType,
            serialNumber: this.formCapitalModify.serialNumber,
            shareholder: this.formCapitalModify.shareholder,
            subscribedCapitalType: this.formCapitalModify.subscribedCapitalType,
            subscribedCapitalContribution: this.formCapitalModify.subscribedCapitalContribution,
            subscribedCapitalDate: this.formCapitalModify.subscribedCapitalDate,
            realityCapitalType: this.formCapitalModify.realityCapitalType,
            realityCapitalContribution: this.formCapitalModify.realityCapitalContribution,
            realityCapitalDate: this.formCapitalModify.realityCapitalDate,
            responsiblePerson: this.formCapitalModify.responsiblePerson,
            shareholderType: this.formCapitalModify.shareholderType,
            shareholderMold: this.formCapitalModify.shareholderMold,
            proportion: this.formCapitalModify.proportion,
            status: this.formCapitalModify.status,
            branchCompanyName: this.formCapitalModify.branchCompanyName,
            branchCompanyCode: this.formCapitalModify.branchCompanyCode,
            id: this.formCapitalModify.id
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchCapitalModifyOldData()
            this.fetchCapitalModifyNewData()
            this.formCapitalModifyVisible = false
          })
        } else {
          return false
        }
      })
    },
    checkCapitalModifySel() {
      if (this.selCapitalModifyRow && this.selCapitalModifyRow.id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    editCapitalModifyOld() {
      if (this.checkCapitalModifySel()) {
        this.isCapitalModifyAdd = false
        this.formCapitalModify = this.selCapitalModifyRow
        this.formCapitalModifyTitle = '编辑股东及出资信息变更'
        this.formCapitalModifyVisible = true
        this.modifyStatusType = true
      }
    },
    editCapitalModifyNew() {
      if (this.checkCapitalModifySel()) {
        this.isCapitalModifyAdd = false
        this.formCapitalModify = this.selCapitalModifyRow
        this.formCapitalModifyTitle = '编辑股东及出资信息变更'
        this.formCapitalModifyVisible = true
      }
    },
    removeCapitalModifyOld() {
      if (this.checkCapitalModifySel()) {
        var id = this.selCapitalModifyRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          removeCapitalModify(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchCapitalModifyOldData()
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
    removeCapitalModifyNew() {
      if (this.checkCapitalModifySel()) {
        var id = this.selCapitalModifyRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          removeCapitalModify(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchCapitalModifyNewData()
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
    handleChangeRadio() {
      console.log(this.isCapitalModifyAdd)
      console.log(this.formCapitalModify.shareholder)
      if (this.isCapitalModifyAdd) {
        this.formCapitalModify.shareholder = ''
      }
    },
    // 搜索分公司相关函数
    querySearchCompanyAsync(queryString, cb) {
      if (queryString) {
        var restaurants = this.enterpriseShareholders
        var results = queryString ? restaurants.filter(this.createStateCompanyFilter(queryString)) : restaurants
        cb(results)
      }
    },
    createStateCompanyFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.enterpriseName.indexOf(queryString) === 0)
      }
    },
    handleBranchCompanySelect(item) {
      // console.log(this.list)
      if (item.id === this.formCapitalModify.enterpriseCode) {
        alert('不能选本身公司')
        return
      }
      var result = []
      if (this.formCapitalModify.modifyStatusType === 0) {
        result = this.listCapitalModifyOld.filter(word => word.branchCompanyCode === item.id)
      } else {
        result = this.listCapitalModifyNew.filter(word => word.branchCompanyCode === item.id)
      }
      if (result.length > 0 && this.isCapitalModifyAdd) {
        alert('此股东已经添加')
        return
      }
      this.formCapitalModify.shareholder = item.enterpriseName
      this.formCapitalModify.branchCompanyName = item.name
      this.formCapitalModify.branchCompanyCode = item.id
    },
    handleIconClickShareholder(ev) {
      // getUserList(this.listUserQuery).then(response => {
      //   this.enterpriseShareholders = response.data.records
      // })
      // alert('如果没有搜索到，如有权限可以新增股东信息')
      const routeUrl = this.$router.resolve({ path: '/lpm/businesslicenseEdit' })
      window.open(routeUrl.href, '_blank')
      console.log(ev)
    },

    handleNaturalPersonSelect(item) {
      // console.log(this.list)
      if (item.id === this.formCapitalModify.enterpriseCode) {
        alert('不能选本身公司')
        return
      }
      var result = []

      if (this.formCapitalModify.modifyStatusType === 0) {
        result = this.listCapitalModifyOld.filter(word => word.branchCompanyCode === item.id)
      } else {
        result = this.listCapitalModifyNew.filter(word => word.branchCompanyCode === item.id)
      }
      if (result.length > 0) {
        alert('此股东已经添加')
        return
      }
      this.formCapitalModify.shareholder = item.name
      this.formCapitalModify.branchCompanyName = item.name
      this.formCapitalModify.branchCompanyCode = item.id
    }
    /**
       * 股权变更 -----end------
       */
  }
}
