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
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'

export default {
  directives: { permission },
  data() {
    return {
      loginInfo: {}, // 当前登录人信息
      formVisible: false,
      formTitle: '添加企业变更',
      activeNames: ['1', '2', '3'],
      companyListQuery: {
        page: 1,
        limit: 6000,
        id: undefined
      },
      user: {},
      businesslicenseData: {},
      enterpriseNameLabel: '***公司',
      mainmemberData: {}, // 主要人员相关数据
      companyList: [],
      noAccessoryCauseList: [], // 无附件原因，从数据字典中获取
      currencyList: [], // 币种，从数据字典中获取
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
        limit: 50000,
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
        remark: '',
        enterpriseId: '',
        enterpriseNameState: '',
        enterpriseNameOld: '',
        enterpriseNameNew: '',
        enterpriseNameEnOld: '',
        enterpriseNameEnNew: '',
        registeredAddressState: '',
        registeredAddressOld: '',
        registeredAddressNew: '',
        unifiedSocialCreditCodeState: '',
        unifiedSocialCreditCodeOld: '',
        unifiedSocialCreditCodeNew: '',
        liquidationExitState: '',
        liquidationExitOld: '',
        liquidationExitNew: '',
        registeredCapitalState: '',
        registeredCapitalOld: 0,
        registeredCapitalNew: 0,
        currencyOld: '',
        currencyNew: '',
        ownershipState: '',
        ownershipOld: '',
        ownershipNew: '',
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

        newRegisteredState: '',

        accessoryFiles: '', // 1内部审批文件
        companyReferenceRegisterFiles: '', // 2工商申请表
        shareholdersDecideFiles: '', // 3股东会决议
        seniorManagementFiles: '', // 4董事会决议
        companyArticlesAssociationFiles: '', // 5公司章程
        appointDismissFiles: '', // 6任职免职书
        promiseFiles: '', // 7住所使用证明
        delegationFiles: '', // 8股权转让合同
        approvalFiles: '', // 9核准文件
        businessLicenseFiles: '', // 10营业执照
        sealFiles: '', // 11印章备案文件
        openAccountFiles: '', // 12开户许可证
        orgCreditCodeFiles: '', // 13机构信用代码证
        authorizationFiles: '', // 14外商投资批准文件（批复和批准证书）或备案文件
        companyModifyRegisterFiles: '', // 15外商投资企业变更备案回执
        stockPledgeFiles: '', // 16质权合同
        liquidationFiles: '', // 17清算报告
        liquidationPersonFiles: '', // 18清算组成员备案通知书
        tallageFiles: '', // 19清税证明
        noticeFiles: '', // 20公告报纸样张
        otherFiles: '', // 21其它文件
        accessoryRemark: '', // 1内部审批文件-无附件备注
        companyReferenceRegisterRemark: '', // 2工商申请表-无附件备注
        shareholdersDecideRemark: '', // 3股东会决议-无附件备注
        seniorManagementRemark: '', // 4董事会决议-无附件备注
        companyArticlesAssociationRemark: '', // 5公司章程-无附件备注
        appointDismissRemark: '', // 6任职免职书-无附件备注
        promiseRemark: '', // 7住所使用证明-无附件备注
        delegationRemark: '', // 8股权转让合同-无附件备注
        approvalRemark: '', // 9核准文件-无附件备注
        businessLicenseRemark: '', // 10营业执照-无附件备注
        sealRemark: '', // 11印章备案文件-无附件备注
        openAccountRemark: '', // 12开户许可证-无附件备注
        orgCreditCodeRemark: '', // 13机构信用代码证-无附件备注
        authorizationRemark: '', // 14外商投资批准文件（批复和批准证书）或备案文件-无附件备注
        companyModifyRegisterRemark: '', // 15外商投资企业变更备案回执-无附件备注
        stockPledgeRemark: '', // 16质权合同-无附件备注
        liquidationRemark: '', // 17清算报告-无附件备注
        liquidationPersonRemark: '', // 18清算组成员备案通知书-无附件备注
        tallageRemark: '', // 19清税证明-无附件备注
        noticeRemark: '', // 20公告报纸样张-无附件备注
        otherRemark: '', // 21其它文件-无附件备注
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
        ],
        registeredCapitalOld: [
          { pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留六位小数' }
        ],
        registeredCapitalNew: [
          { pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留六位小数' }
        ],
        subscribedCapitalContribution: [
          { pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留六位小数' }
        ],
        realityCapitalContribution: [
          { pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留六位小数' }
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
      accessoryFilesList: [], // 1内部审批文件
      companyReferenceRegisterFilesList: [], // 2工商申请表
      shareholdersDecideFilesList: [], // 3股东会决议
      seniorManagementFilesList: [], // 4董事会决议
      companyArticlesAssociationFilesList: [], // 5公司章程
      appointDismissFilesList: [], // 6任职免职书
      promiseFilesList: [], // 7住所使用证明
      delegationFilesList: [], // 8股权转让合同
      approvalFilesList: [], // 9核准文件
      businessLicenseFilesList: [], // 10营业执照
      sealFilesList: [], // 11印章备案文件
      openAccountFilesList: [], // 12开户许可证
      orgCreditCodeFilesList: [], // 13机构信用代码证
      authorizationFilesList: [], // 14外商投资批准文件（批复和批准证书）或备案文件
      companyModifyRegisterFilesList: [], // 15外商投资企业变更备案回执
      stockPledgeFilesList: [], // 16质权合同
      liquidationFilesList: [], // 17清算报告
      liquidationPersonFilesList: [], // 18清算组成员备案通知书
      tallageFilesList: [], // 19清税证明
      noticeFilesList: [], // 20公告报纸样张
      otherFilesList: [], // 21其它文件

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
        subscribedCapitalContribution: 0,
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: 0,
        realityCapitalDate: '',
        responsiblePerson: '',
        shareholderType: '',
        currency: '',
        shareholderMold: 1,
        proportion: 0,
        status: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        id: ''
      },

      // companyListQuery: {
      //   page: 1,
      //   limit: 6000,
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

      const userList = this.$store.state.common.userList
      if (!userList || userList.length === 0) {
        getUserList(this.listUserQuery).then(response => {
          this.restaurants = response.data.records
          this.getAllUserList()
          // this.add()
        })
      } else {
        this.restaurants = userList
      }

      dictList({ name: '无附件原因【企业变更】' }).then(response => {
        this.noAccessoryCauseList = getDictList(response.data[0].detail)
      })

      dictList({ name: '币种' }).then(response => {
        this.currencyList = getDictList(response.data[0].detail)
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
    async getAllUserList() {
      await this.$store.dispatch('common/getUserList')
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
        remark: '',
        enterpriseId: '',
        enterpriseNameState: '',
        enterpriseNameOld: '',
        enterpriseNameNew: '',
        enterpriseNameEnOld: '',
        enterpriseNameEnNew: '',
        registeredAddressState: '',
        registeredAddressOld: '',
        registeredAddressNew: '',
        unifiedSocialCreditCodeState: '',
        unifiedSocialCreditCodeOld: '',
        unifiedSocialCreditCodeNew: '',
        liquidationExitState: '',
        liquidationExitOld: '',
        liquidationExitNew: '',
        registeredCapitalState: '',
        registeredCapitalOld: 0,
        registeredCapitalNew: 0,
        currencyOld: '',
        currencyNew: '',

        ownershipState: '',
        ownershipOld: '',
        ownershipNew: '',
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

        newRegisteredState: '',

        accessoryFiles: '', // 1内部审批文件
        companyReferenceRegisterFiles: '', // 2工商申请表
        shareholdersDecideFiles: '', // 3股东会决议
        seniorManagementFiles: '', // 4董事会决议
        companyArticlesAssociationFiles: '', // 5公司章程
        appointDismissFiles: '', // 6任职免职书
        promiseFiles: '', // 7住所使用证明
        delegationFiles: '', // 8股权转让合同
        approvalFiles: '', // 9核准文件
        businessLicenseFiles: '', // 10营业执照
        sealFiles: '', // 11印章备案文件
        openAccountFiles: '', // 12开户许可证
        orgCreditCodeFiles: '', // 13机构信用代码证
        authorizationFiles: '', // 14外商投资批准文件（批复和批准证书）或备案文件
        companyModifyRegisterFiles: '', // 15外商投资企业变更备案回执
        stockPledgeFiles: '', // 16质权合同
        liquidationFiles: '', // 17清算报告
        liquidationPersonFiles: '', // 18清算组成员备案通知书
        tallageFiles: '', // 19清税证明
        noticeFiles: '', // 20公告报纸样张
        otherFiles: '', // 21其它文件
        accessoryRemark: '', // 1内部审批文件-无附件备注
        companyReferenceRegisterRemark: '', // 2工商申请表-无附件备注
        shareholdersDecideRemark: '', // 3股东会决议-无附件备注
        seniorManagementRemark: '', // 4董事会决议-无附件备注
        companyArticlesAssociationRemark: '', // 5公司章程-无附件备注
        appointDismissRemark: '', // 6任职免职书-无附件备注
        promiseRemark: '', // 7住所使用证明-无附件备注
        delegationRemark: '', // 8股权转让合同-无附件备注
        approvalRemark: '', // 9核准文件-无附件备注
        businessLicenseRemark: '', // 10营业执照-无附件备注
        sealRemark: '', // 11印章备案文件-无附件备注
        openAccountRemark: '', // 12开户许可证-无附件备注
        orgCreditCodeRemark: '', // 13机构信用代码证-无附件备注
        authorizationRemark: '', // 14外商投资批准文件（批复和批准证书）或备案文件-无附件备注
        companyModifyRegisterRemark: '', // 15外商投资企业变更备案回执-无附件备注
        stockPledgeRemark: '', // 16质权合同-无附件备注
        liquidationRemark: '', // 17清算报告-无附件备注
        liquidationPersonRemark: '', // 18清算组成员备案通知书-无附件备注
        tallageRemark: '', // 19清税证明-无附件备注
        noticeRemark: '', // 20公告报纸样张-无附件备注
        otherRemark: '', // 21其它文件-无附件备注
        id: ''
      }

      this.directorTags = [] // 董事
      this.supervisorTags = [] // 监事
      this.accessoryFilesList = [] // 1内部审批文件
      this.companyReferenceRegisterFilesList = [] // 2工商申请表
      this.shareholdersDecideFilesList = [] // 3股东会决议
      this.seniorManagementFilesList = [] // 4董事会决议
      this.companyArticlesAssociationFilesList = [] // 5公司章程
      this.appointDismissFilesList = [] // 6任职免职书
      this.promiseFilesList = [] // 7住所使用证明
      this.delegationFilesList = [] // 8股权转让合同
      this.approvalFilesList = [] // 9核准文件
      this.businessLicenseFilesList = [] // 10营业执照
      this.sealFilesList = [] // 11印章备案文件
      this.openAccountFilesList = [] // 12开户许可证
      this.orgCreditCodeFilesList = [] // 13机构信用代码证
      this.authorizationFilesList = [] // 14外商投资批准文件（批复和批准证书）或备案文件
      this.companyModifyRegisterFilesList = [] // 15外商投资企业变更备案回执
      this.stockPledgeFilesList = [] // 16质权合同
      this.liquidationFilesList = [] // 17清算报告
      this.liquidationPersonFilesList = [] // 18清算组成员备案通知书
      this.tallageFilesList = [] // 19清税证明
      this.noticeFilesList = [] // 20公告报纸样张
      this.otherFilesList = [] // 21其它文件
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
      this.form.enterpriseNameEnOld = this.companyList[0].enterpriseNameEn
      this.form.registeredAddressOld = this.companyList[0].registeredAddress
      this.form.unifiedSocialCreditCodeOld = this.companyList[0].unifiedSocialCreditCode
      this.form.liquidationExitOld = this.companyList[0].liquidationExit
      this.form.registeredCapitalOld = this.companyList[0].registeredCapital * 1
      this.form.operatingPeriodEndOld = this.companyList[0].operatingPeriodEnd
      this.form.businessScopeOld = this.companyList[0].businessScope

      // 注释初始化数据 【法人】
      // this.form.legalRepresentativeOld = this.companyList[0].legalRepresentative
      if (this.mainmemberData) {
        // 注释初始化数据 【董事长、经理、董事、监事】
        // this.form.chairmanIdOld = this.mainmemberData.chairmanId
        // this.form.chairmanOld = this.mainmemberData.chairman
        // this.form.generalManagerIdOld = this.mainmemberData.generalManagerId
        // this.form.generalManagerOld = this.mainmemberData.generalManager
        // this.form.directorIdOld = this.mainmemberData.directorId
        // this.form.directorOld = this.mainmemberData.director
        // this.form.supervisorIdOld = this.mainmemberData.supervisorId
        // this.form.supervisorOld = this.mainmemberData.supervisor
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
          this.saveingInstance = Loading.service({
            lock: true,
            text: '表单提交中...  如时间太长，可刷新界面重新填写提交！',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const isHw = this.businesslicenseData.registrationType * 1 === 2 ? 2 : ''
          save({
            isHw: isHw,
            affiliatedUnit: this.form.affiliatedUnit,
            applyDepartment: this.form.applyDepartment,
            applicant: this.form.applicant,
            applyTime: this.form.applyTime,
            applicantContact: this.form.applicantContact,
            applyType: this.form.applyType,
            applyReason: this.form.applyReason,
            modifyDate: this.form.modifyDate ? parseTime(this.form.modifyDate, '{y}-{m}-{d}') : '',
            remark: this.form.remark,
            enterpriseId: this.form.enterpriseId,
            enterpriseNameState: this.form.enterpriseNameState ? this.form.enterpriseNameState : 'false',
            enterpriseNameOld: this.form.enterpriseNameOld,
            enterpriseNameNew: this.form.enterpriseNameNew,
            enterpriseNameEnOld: this.form.enterpriseNameEnOld,
            enterpriseNameEnNew: this.form.enterpriseNameEnNew,
            registeredAddressState: this.form.registeredAddressState ? this.form.registeredAddressState : 'false',
            registeredAddressOld: this.form.registeredAddressOld,
            registeredAddressNew: this.form.registeredAddressNew,
            unifiedSocialCreditCodeState: this.form.unifiedSocialCreditCodeState ? this.form.unifiedSocialCreditCodeState : 'false',
            unifiedSocialCreditCodeOld: this.form.unifiedSocialCreditCodeOld,
            unifiedSocialCreditCodeNew: this.form.unifiedSocialCreditCodeNew,
            liquidationExitState: this.form.liquidationExitState ? this.form.liquidationExitState : 'false',
            liquidationExitOld: this.form.liquidationExitOld,
            liquidationExitNew: this.form.liquidationExitNew,
            registeredCapitalState: this.form.registeredCapitalState ? this.form.registeredCapitalState : 'false',
            registeredCapitalOld: this.form.registeredCapitalOld ? parseFloat(this.form.registeredCapitalOld).toFixed(6) : 0,
            registeredCapitalNew: this.form.registeredCapitalNew ? parseFloat(this.form.registeredCapitalNew).toFixed(6) : 0,
            ownershipState: this.form.ownershipState ? this.form.ownershipState : 'false',
            currencyOld: this.form.currencyOld,
            currencyNew: this.form.currencyNew,
            ownershipOld: this.form.ownershipOld,
            ownershipNew: this.form.ownershipNew,
            operatingPeriodEndState: this.form.operatingPeriodEndState ? this.form.operatingPeriodEndState : 'false',
            operatingPeriodEndOld: this.form.operatingPeriodEndOld ? parseTime(this.form.operatingPeriodEndOld, '{y}-{m}-{d}') : '',
            operatingPeriodEndNew: this.form.operatingPeriodEndNew ? parseTime(this.form.operatingPeriodEndNew, '{y}-{m}-{d}') : '',
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

            newRegisteredState: this.form.newRegisteredState ? this.form.newRegisteredState : 'false',

            accessoryFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''), // 1内部审批文件
            companyReferenceRegisterFiles: this.form.companyReferenceRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 2工商申请表
            shareholdersDecideFiles: this.form.shareholdersDecideFiles.replace(/(^\s*)|(\s*$)/g, ''), // 3股东会决议
            seniorManagementFiles: this.form.seniorManagementFiles.replace(/(^\s*)|(\s*$)/g, ''), // 4董事会决议
            companyArticlesAssociationFiles: this.form.companyArticlesAssociationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 5公司章程
            appointDismissFiles: this.form.appointDismissFiles.replace(/(^\s*)|(\s*$)/g, ''), // 6任职免职书
            promiseFiles: this.form.promiseFiles.replace(/(^\s*)|(\s*$)/g, ''), // 7住所使用证明
            delegationFiles: this.form.delegationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 8股权转让合同
            approvalFiles: this.form.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''), // 9核准文件
            businessLicenseFiles: this.form.businessLicenseFiles.replace(/(^\s*)|(\s*$)/g, ''), // 10营业执照
            sealFiles: this.form.sealFiles.replace(/(^\s*)|(\s*$)/g, ''), // 11印章备案文件
            openAccountFiles: this.form.openAccountFiles.replace(/(^\s*)|(\s*$)/g, ''), // 12开户许可证
            orgCreditCodeFiles: this.form.orgCreditCodeFiles.replace(/(^\s*)|(\s*$)/g, ''), // 13机构信用代码证
            authorizationFiles: this.form.authorizationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 14外商投资批准文件（批复和批准证书）或备案文件
            companyModifyRegisterFiles: this.form.companyModifyRegisterFiles.replace(/(^\s*)|(\s*$)/g, ''), // 15外商投资企业变更备案回执
            stockPledgeFiles: this.form.stockPledgeFiles.replace(/(^\s*)|(\s*$)/g, ''), // 16质权合同
            liquidationFiles: this.form.liquidationFiles.replace(/(^\s*)|(\s*$)/g, ''), // 17清算报告
            liquidationPersonFiles: this.form.liquidationPersonFiles.replace(/(^\s*)|(\s*$)/g, ''), // 18清算组成员备案通知书
            tallageFiles: this.form.tallageFiles.replace(/(^\s*)|(\s*$)/g, ''), // 19清税证明
            noticeFiles: this.form.noticeFiles.replace(/(^\s*)|(\s*$)/g, ''), // 20公告报纸样张
            otherFiles: this.form.otherFiles.replace(/(^\s*)|(\s*$)/g, ''), // 21其它文件

            accessoryRemark: this.form.accessoryRemark, // 1内部审批文件-无附件备注
            companyReferenceRegisterRemark: this.form.companyReferenceRegisterRemark, // 2工商申请表-无附件备注
            shareholdersDecideRemark: this.form.shareholdersDecideRemark, // 3股东会决议-无附件备注
            seniorManagementRemark: this.form.seniorManagementRemark, // 4董事会决议-无附件备注
            companyArticlesAssociationRemark: this.form.companyArticlesAssociationRemark, // 5公司章程-无附件备注
            appointDismissRemark: this.form.appointDismissRemark, // 6任职免职书-无附件备注
            promiseRemark: this.form.promiseRemark, // 7住所使用证明-无附件备注
            delegationRemark: this.form.delegationRemark, // 8股权转让合同-无附件备注
            approvalRemark: this.form.approvalRemark, // 9核准文件-无附件备注
            businessLicenseRemark: this.form.businessLicenseRemark, // 10营业执照-无附件备注
            sealRemark: this.form.sealRemark, // 11印章备案文件-无附件备注
            openAccountRemark: this.form.openAccountRemark, // 12开户许可证-无附件备注
            orgCreditCodeRemark: this.form.orgCreditCodeRemark, // 13机构信用代码证-无附件备注
            authorizationRemark: this.form.authorizationRemark, // 14外商投资批准文件（批复和批准证书）或备案文件-无附件备注
            companyModifyRegisterRemark: this.form.companyModifyRegisterRemark, // 15外商投资企业变更备案回执-无附件备注
            stockPledgeRemark: this.form.stockPledgeRemark, // 16质权合同-无附件备注
            liquidationRemark: this.form.liquidationRemark, // 17清算报告-无附件备注
            liquidationPersonRemark: this.form.liquidationPersonRemark, // 18清算组成员备案通知书-无附件备注
            tallageRemark: this.form.tallageRemark, // 19清税证明-无附件备注
            noticeRemark: this.form.noticeRemark, // 20公告报纸样张-无附件备注
            otherRemark: this.form.otherRemark, // 21其它文件-无附件备注

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
              if (tempArr && tempArr.length > 0 && (response.data.shareholderModifyState === 'true' || response.data.newRegisteredState === 'true')) {
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
                    subscribedCapitalContribution: tempObj.subscribedCapitalContribution ? parseFloat(tempObj.subscribedCapitalContribution).toFixed(6) : 0,
                    subscribedCapitalDate: tempObj.subscribedCapitalDate ? parseTime(tempObj.subscribedCapitalDate, '{y}-{m}-{d}') : '',
                    realityCapitalType: tempObj.realityCapitalType,
                    realityCapitalContribution: tempObj.realityCapitalContribution ? parseFloat(tempObj.realityCapitalContribution).toFixed(6) : 0,
                    realityCapitalDate: tempObj.realityCapitalDate ? parseTime(tempObj.realityCapitalDate, '{y}-{m}-{d}') : '',
                    responsiblePerson: tempObj.responsiblePerson,
                    shareholderType: tempObj.shareholderType,
                    currency: tempObj.currency,
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
            this.saveingInstance.close()
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
        this.accessoryFilesList = [] // 1内部审批文件
        this.companyReferenceRegisterFilesList = [] // 2工商申请表
        this.shareholdersDecideFilesList = [] // 3股东会决议
        this.seniorManagementFilesList = [] // 4董事会决议
        this.companyArticlesAssociationFilesList = [] // 5公司章程
        this.appointDismissFilesList = [] // 6任职免职书
        this.promiseFilesList = [] // 7住所使用证明
        this.delegationFilesList = [] // 8股权转让合同
        this.approvalFilesList = [] // 9核准文件
        this.businessLicenseFilesList = [] // 10营业执照
        this.sealFilesList = [] // 11印章备案文件
        this.openAccountFilesList = [] // 12开户许可证
        this.orgCreditCodeFilesList = [] // 13机构信用代码证
        this.authorizationFilesList = [] // 14外商投资批准文件（批复和批准证书）或备案文件
        this.companyModifyRegisterFilesList = [] // 15外商投资企业变更备案回执
        this.stockPledgeFilesList = [] // 16质权合同
        this.liquidationFilesList = [] // 17清算报告
        this.liquidationPersonFilesList = [] // 18清算组成员备案通知书
        this.tallageFilesList = [] // 19清税证明
        this.noticeFilesList = [] // 20公告报纸样张
        this.otherFilesList = [] // 21其它文件

        if (this.form.enterpriseNameState === 'true') {
          this.form.enterpriseNameState = true
        }

        if (this.form.registeredAddressState === 'true') {
          this.form.registeredAddressState = true
        }

        if (this.form.unifiedSocialCreditCodeState === 'true') {
          this.form.unifiedSocialCreditCodeState = true
        }

        if (this.form.liquidationExitState === 'true') {
          this.form.liquidationExitState = true
        }

        if (this.form.registeredCapitalState === 'true') {
          this.form.registeredCapitalState = true
          this.form.registeredCapitalOld = this.form.registeredCapitalOld ? this.form.registeredCapitalOld * 1 : 0
          this.form.registeredCapitalNew = this.form.registeredCapitalNew ? this.form.registeredCapitalNew * 1 : 0
        }

        if (this.form.ownershipState === 'true') {
          this.form.ownershipState = true
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

        if (this.form.newRegisteredState === 'true') {
          this.form.newRegisteredState = true
          if (this.selRow.directorIdNew) {
            this.directorTags = []
            const directorIdArr = this.selRow.directorIdNew.split('、')
            const directorArr = this.selRow.directorNew.split('、')
            for (let j = 0; j < directorIdArr.length; j++) {
              this.directorTags.push({ name: directorArr[j], id: directorIdArr[j] })
            }
          }
          if (this.selRow.supervisorIdNew) {
            this.supervisorTags = []
            const supervisorIdArr = this.selRow.supervisorIdNew.split('、')
            const supervisorArr = this.selRow.supervisorNew.split('、')
            for (let j = 0; j < supervisorIdArr.length; j++) {
              this.supervisorTags.push({ name: supervisorArr[j], id: supervisorIdArr[j] })
            }
          }
        }

        var accessoryArr = [
          'accessoryFiles', // 1内部审批文件
          'companyReferenceRegisterFiles', // 2工商申请表
          'shareholdersDecideFiles', // 3股东会决议
          'seniorManagementFiles', // 4董事会决议
          'companyArticlesAssociationFiles', // 5公司章程
          'appointDismissFiles', // 6任职免职书
          'promiseFiles', // 7住所使用证明
          'delegationFiles', // 8股权转让合同
          'approvalFiles', // 9核准文件
          'businessLicenseFiles', // 10营业执照
          'sealFiles', // 11印章备案文件
          'openAccountFiles', // 12开户许可证
          'orgCreditCodeFiles', // 13机构信用代码证
          'authorizationFiles', // 14外商投资批准文件（批复和批准证书）或备案文件
          'companyModifyRegisterFiles', // 15外商投资企业变更备案回执
          'stockPledgeFiles', // 16质权合同
          'liquidationFiles', // 17清算报告
          'liquidationPersonFiles', // 18清算组成员备案通知书
          'tallageFiles', // 19清税证明
          'noticeFiles', // 20公告报纸样张
          'otherFiles'] // 21其它文件
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
        if (results && results.length === 0) {
          this.$message({
            message: '您输入的信息没有匹配到相应的结果！请检查输入是否正确！如匹配到不可通过右侧➕搜索配置高级管理人员！',
            type: 'warning'
          })
        }
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
    },

    handleBeforeUpload(file) {
      const isPdf = file.type === 'application/pdf'
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isPdf) {
        this.$message.error('上传文件只能是 pdf 格式!')
        return false
      }

      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 100MB!')
        return false
      }

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
    accessoryFilesRemove(file) { // 1内部审批文件
      this.handleRemoveFile(file, 'accessoryFiles')
    },
    accessoryFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'accessoryFiles')
    },

    companyReferenceRegisterFilesRemove(file) { // 2工商申请表
      this.handleRemoveFile(file, 'companyReferenceRegisterFiles')
    },
    companyReferenceRegisterFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyReferenceRegisterFiles')
    },

    shareholdersDecideFilesRemove(file) { // 3股东会决议
      this.handleRemoveFile(file, 'shareholdersDecideFiles')
    },
    shareholdersDecideFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'shareholdersDecideFiles')
    },

    seniorManagementFilesRemove(file) { // 4董事会决议
      this.handleRemoveFile(file, 'seniorManagementFiles')
    },
    seniorManagementFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'seniorManagementFiles')
    },

    companyArticlesAssociationFilesRemove(file) { // 5公司章程
      this.handleRemoveFile(file, 'companyArticlesAssociationFiles')
    },
    companyArticlesAssociationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyArticlesAssociationFiles')
    },

    appointDismissFilesRemove(file) { // 6任职免职书
      this.handleRemoveFile(file, 'appointDismissFiles')
    },
    appointDismissFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'appointDismissFiles')
    },

    promiseFilesRemove(file) { // 7住所使用证明
      this.handleRemoveFile(file, 'promiseFiles')
    },
    promiseFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'promiseFiles')
    },

    delegationFilesRemove(file) { // 8股权转让合同
      this.handleRemoveFile(file, 'delegationFiles')
    },
    delegationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'delegationFiles')
    },

    approvalFilesRemove(file) { // 9核准文件
      this.handleRemoveFile(file, 'approvalFiles')
    },
    approvalFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'approvalFiles')
    },

    businessLicenseFilesRemove(file) { // 10营业执照
      this.handleRemoveFile(file, 'businessLicenseFiles')
    },
    businessLicenseFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'businessLicenseFiles')
    },

    sealFilesRemove(file) { // 11印章备案文件
      this.handleRemoveFile(file, 'sealFiles')
    },
    sealFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'sealFiles')
    },

    openAccountFilesRemove(file) { // 12开户许可证
      this.handleRemoveFile(file, 'openAccountFiles')
    },
    openAccountFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'openAccountFiles')
    },

    orgCreditCodeFilesRemove(file) { // 13机构信用代码证
      this.handleRemoveFile(file, 'orgCreditCodeFiles')
    },
    orgCreditCodeFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'orgCreditCodeFiles')
    },

    authorizationFilesRemove(file) { // 14外商投资批准文件（批复和批准证书）或备案文件
      this.handleRemoveFile(file, 'authorizationFiles')
    },
    authorizationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'authorizationFiles')
    },

    companyModifyRegisterFilesRemove(file) { // 15外商投资企业变更备案回执
      this.handleRemoveFile(file, 'companyModifyRegisterFiles')
    },
    companyModifyRegisterFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyModifyRegisterFiles')
    },

    stockPledgeFilesRemove(file) { // 16质权合同
      this.handleRemoveFile(file, 'stockPledgeFiles')
    },
    stockPledgeFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'stockPledgeFiles')
    },

    liquidationFilesRemove(file) { // 17清算报告
      this.handleRemoveFile(file, 'liquidationFiles')
    },
    liquidationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'liquidationFiles')
    },

    liquidationPersonFilesRemove(file) { // 18清算组成员备案通知书
      this.handleRemoveFile(file, 'liquidationPersonFiles')
    },
    liquidationPersonFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'liquidationPersonFiles')
    },

    tallageFilesRemove(file) { // 19清税证明
      this.handleRemoveFile(file, 'tallageFiles')
    },
    tallageFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'tallageFiles')
    },

    noticeFilesRemove(file) { // 20公告报纸样张
      this.handleRemoveFile(file, 'noticeFiles')
    },
    noticeFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'noticeFiles')
    },

    otherFilesRemove(file) { // 21其它文件
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
        limit: 6000
      }).then(response => {
        this.enterpriseShareholders = response.data.records
      })

      // 请求自然人股东全部列表
      const userList = this.restaurants
      if (userList && userList.length === 0) {
        getUserList({
          page: 1,
          limit: 50000,
          type: '1,2'
        }).then(response => {
          this.naturalPersonShareholders = response.data.records
        })
      } else {
        this.naturalPersonShareholders = userList
      }
      this.fetchCapitalModifyOldData()
      this.fetchCapitalModifyNewData()
    },
    fetchCapitalModifyOldData() {
      this.listCapitalModifyOldLoading = true
      const userId = this.$store.state.user ? this.$store.state.user.profile.id : ''
      console.log('createBy:', this.form.createBy)
      console.log('userId:', userId)
      this.listCapitalModifyOldQuery.serialIdModify = this.form.id + ',new-' + userId
      // this.loginInfo = this.$store.state.user.profile
      if (userId * 1 === this.form.modifyBy * 1) {
        this.listCapitalModifyOldQuery.createBy = userId
      }
      getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
        this.listCapitalModifyOld = response.data.records || []
        this.listCapitalModifyOldLoading = false
      })
    },
    fetchCapitalModifyNewData() {
      this.listCapitalModifyNewLoading = true
      const userId = this.$store.state.user ? this.$store.state.user.profile.id : ''
      this.listCapitalModifyNewQuery.serialIdModify = this.form.id + ',new-' + userId
      if (userId * 1 === this.form.modifyBy * 1) {
        this.listCapitalModifyNewQuery.createBy = userId
      }
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
        subscribedCapitalContribution: 0,
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: 0,
        realityCapitalDate: '',
        responsiblePerson: '',
        shareholderMold: 1,
        shareholderType: '',
        currency: '',
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
          const userId = this.$store.state.user ? this.$store.state.user.profile.id : ''
          saveCapitalModify({
            enterpriseCode: this.formCapitalModify.enterpriseCode,
            enterpriseName: this.formCapitalModify.enterpriseName,
            serialIdModify: 'new-' + userId,
            modifyStatusType: this.formCapitalModify.modifyStatusType,
            serialNumber: this.formCapitalModify.serialNumber,
            shareholder: this.formCapitalModify.shareholder,
            subscribedCapitalType: this.formCapitalModify.subscribedCapitalType,
            subscribedCapitalContribution: this.formCapitalModify.subscribedCapitalContribution ? parseFloat(this.formCapitalModify.subscribedCapitalContribution).toFixed(6) : 0,
            subscribedCapitalDate: this.formCapitalModify.subscribedCapitalDate ? parseTime(this.formCapitalModify.subscribedCapitalDate, '{y}-{m}-{d}') : '',
            realityCapitalType: this.formCapitalModify.realityCapitalType,
            realityCapitalContribution: this.formCapitalModify.realityCapitalContribution ? parseFloat(this.formCapitalModify.realityCapitalContribution).toFixed(6) : 0,
            realityCapitalDate: this.formCapitalModify.realityCapitalDate ? parseTime(this.formCapitalModify.realityCapitalDate, '{y}-{m}-{d}') : '',
            responsiblePerson: this.formCapitalModify.responsiblePerson,
            shareholderType: this.formCapitalModify.shareholderType,
            currency: this.formCapitalModify.currency,
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
