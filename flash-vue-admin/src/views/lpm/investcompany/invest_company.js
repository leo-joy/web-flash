import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { remove, getList, save } from '@/api/lpm/investcompany'
import { getOne as getBusinesslicenseOne, save as businesslicenseSave } from '@/api/lpm/businesslicense'

import axios from 'axios'
import { parseTime } from '@/utils'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel, getDictNum } from '@/utils/common'
import { getDictList } from '@/utils/common'

// 权限判断指令
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加投资企业',
      companyListQuery: {
        page: 1,
        limit: 3000,
        id: undefined
      },
      currencyList: [], // 币种，从数据字典中获取
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
        proportion: 0,
        remark: '',
        realityCapitalContribution: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 100,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      restaurants: [], // 投资公司列表

      enterpriseType: '', // 企业类型
      registrationStatusBL: '', // 登记状态
      currencyDict: '' // 货币类型
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
        enterpriseName: [
          { required: true, message: '请选择所属公司名称', trigger: 'blur' }
        ],
        branchCompanyName: [
          { required: true, message: '请选择投资公司', trigger: 'blur' }
        ],
        proportion: [
          { required: true, message: '股权占比不能为空', trigger: 'blur' }
        ],
        realityCapitalContribution: [
          { required: true, message: '认缴金额不能为空', trigger: 'blur' },
          { type: 'number', message: '只能输入是数值', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
      dictList({ name: '企业类型' }).then(response => {
        this.enterpriseType = response.data[0].detail
      })
      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusBL = response.data[0].detail
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyDict = response.data[0].detail
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyList = getDictList(response.data[0].detail)
      })
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
        proportion: 0,
        remark: '',
        realityCapitalContribution: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加投资企业'
      this.formVisible = true
      this.isAdd = true
      // 设置新增公司的初始值;
      this.form.enterpriseName = this.companyList[0].enterpriseName
      this.form.enterpriseCode = this.companyList[0].id

      // 请求投资公司全部列表
      getEnterpriseList({
        page: 1,
        limit: 2000
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
            realityCapitalContribution: this.form.realityCapitalContribution,
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
        this.formTitle = '编辑投资企业'
        this.formVisible = true

        // 请求投资公司全部列表
        getEnterpriseList({
          page: 1,
          limit: 2000
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
      if (queryString) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      }
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
        alert('这家投资公司已经添加')
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
      alert('如果没有搜索到，如有权限可以新增投资公司信息')
      console.log(ev)
    },
    synQCC() {

    },
    // 同步投资企业
    async investCompanySyn() {
      const _this = this
      const initInvest = this.companyList[0].enterpriseName
      if (initInvest !== '1') {
        // 1、获取企业名称
        const enterpriseName = this.companyList[0].enterpriseName
        // 2、通过企查查接口获取投资企业信息
        const investCompanyList = await this.getSingleInvestCompany(enterpriseName)
        console.log('investCompanyList-2', investCompanyList)
        // 3、循环遍历投资企业

        for (let i = 0; i < investCompanyList.length; i++) {
          const investCompany = await this.getInvestCompany(investCompanyList[i].Name)
          // console.log('investCompany', investCompany)
          if (investCompany && investCompany.length === 1) {
          // 如在数据库中已有投资企业
            await this.singleInvestCompanySyn(investCompanyList[i], investCompany[0], _this)
          } else {
            const newInvestCompany = await this.createInvestCompany(investCompanyList[i], _this)
            console.log('newInvestCompany', newInvestCompany)
            if (newInvestCompany.data) {
              await this.singleInvestCompanySyn(investCompanyList[i], newInvestCompany.data, _this)
            }
          }
        }
        // 更新公司的是否同步投资公司
        await this.initInvestCompany(_this)
        // 重新获取最新的投资公司清单
        await this.fetchData()
      } else {
        alert('该公司已经同步投资企业')
      }
    },
    // 获取单条企业的投资企业
    async getSingleInvestCompany(enterpriseName) {
      const investmentUrl = '/interface/qcc/api/investcompanylist?enterpriseName=' + enterpriseName
      // 创建实例时设置配置的默认值
      const instance = axios.create({
        baseURL: 'http://localhost:3000', // node接口服务地址
        withCredentials: false // 表示跨域请求时是否需要使用凭证
      })
      // 获取投资企业列表
      const investCompanyList = await instance.get(investmentUrl)

      // console.log('接口返回的投资企业数据：', investCompanyList)
      // 如企业列表有值则返回，如无值则返回空数组
      if (investCompanyList !== null &&
          investCompanyList.status === 200 &&
          investCompanyList.data.Result !== null &&
          investCompanyList.data.Status === '200' &&
          investCompanyList.data.Result.length > 0) {
        return investCompanyList.data.Result
      } else {
        this.$message({
          message: this.$t('common.searchResultEmpty'),
          type: 'success'
        })
        return []
      }
    },

    // 创建投资企业
    async createInvestCompany(res, _this) {
      const data = res
      // 统一社会信息代码
      const unifiedSocialCreditCode = data.CreditCode
      // 企业名称
      const enterpriseName = data.Name
      // 企业法人
      const legalRepresentative = data.OperName
      // 企业类型
      const type = getDictNum(_this.enterpriseType, data.EconKind.replace('（', '(').replace('）', ')')) || oldItem.type
      // 成立日期
      const setupDate = data.StartDate
      // 注册资本
      const registeredCapital = data.RegistCapi || 0
      // 币种
      let currency = '1'
      if (data.registCapital) {
        if (data.registCapital.indexOf('人民币') > -1) {
          currency = getDictNum(_this.currencyDict, '人民币')
        } else if (data.registCapital.indexOf('美元') > -1) {
          currency = getDictNum(_this.currencyDict, '美元')
        } else if (data.registCapital.indexOf('港') > -1) {
          currency = getDictNum(_this.currencyDict, '港元')
        } else if (data.registCapital.indexOf('澳') > -1) {
          currency = getDictNum(_this.currencyDict, '澳元')
        } else {
          currency = '1'
        }
      }
      const businesslicense = await businesslicenseSave({
        unifiedSocialCreditCode: unifiedSocialCreditCode, // 统一社会信息代码
        // enterpriseCode: enterpriseCode, // 企业编号
        enterpriseName: enterpriseName, // 企业名称
        legalRepresentative: legalRepresentative, // 法定代表人
        type: type, // 企业类型
        // registeredAddress: registeredAddress, // 注册地址
        setupDate: setupDate ? parseTime(setupDate, '{y}-{m}-{d}') : '', // 成立日期
        // approvalDate: approvalDate ? parseTime(approvalDate, '{y}-{m}-{d}') : '', // 核准日期
        // operatingPeriodFrom: operatingPeriodFrom ? parseTime(operatingPeriodFrom, '{y}-{m}-{d}') : '', // 营业期限自
        // operatingPeriodEnd: operatingPeriodEnd ? parseTime(operatingPeriodEnd, '{y}-{m}-{d}') : '', // 营业期限至
        // registrationAuthority: registrationAuthority, // 登记机关
        // businessScope: businessScope, // 经营范围
        registeredCapital: parseFloat(registeredCapital).toFixed(1), // 注册资本
        currency: currency, // 币种
        // initCa: 0, // 是否工商初始化过， 1 是
        registrationType: 5, // 企业注册类型 1、国内企业 2、香港及境外企业 3、合作单位 4、体外公司 5、被投资企业(新创建)
        // registrationPlace: oldItem.registrationPlace || 1, // 企业注册地

        // enterpriseNameEn: oldItem.enterpriseNameEn, // 企业英文名称
        // enterpriseNameBusiness: oldItem.enterpriseNameBusiness, // 企业商用名称
        // customType: oldItem.customType || 1, // 自定义企业类型

        // achieveDate: oldItem.achieveDate ? parseTime(oldItem.achieveDate, '{y}-{m}-{d}') : '', // 取得日期
        registrationStatus: '1', // 登记状态
        // businessAddress: oldItem.businessAddress, // 经营地址
        // remark: oldItem.remark, // 备注
        pid: '36',
        pIds: '-0_|-35_|_36_1|',
        pName: '新创建投资公司'
        // id: oldItem.id
      })
      if (businesslicense.success) {
        return businesslicense
      } else {
        return {}
      }
    },

    // 初始化投资企业
    async initInvestCompany(_this) {
      const currentCompany = _this.companyList[0]
      currentCompany.initInvest = 1 // 是否同步过投资公司 1 是
      const businesslicense = await businesslicenseSave({
        unifiedSocialCreditCode: _this.companyList[0].unifiedSocialCreditCode,
        enterpriseName: _this.companyList[0].enterpriseName,
        enterpriseNameEn: _this.companyList[0].enterpriseNameEn,
        enterpriseNameBusiness: _this.companyList[0].enterpriseNameBusiness,
        enterpriseCode: _this.companyList[0].enterpriseCode,
        type: _this.companyList[0].type,
        customType: _this.companyList[0].customType,
        registrationType: _this.companyList[0].registrationType,
        registrationPlace: _this.companyList[0].registrationPlace,
        legalRepresentative: _this.companyList[0].legalRepresentative,
        registeredCapital: parseFloat(_this.companyList[0].registeredCapital).toFixed(1) || 0,
        currency: _this.companyList[0].currency,
        setupDate: _this.companyList[0].setupDate ? parseTime(_this.companyList[0].setupDate, '{y}-{m}-{d}') : '',
        achieveDate: _this.companyList[0].achieveDate ? parseTime(_this.companyList[0].achieveDate, '{y}-{m}-{d}') : '',
        operatingPeriodFrom: _this.companyList[0].operatingPeriodFrom ? parseTime(_this.companyList[0].operatingPeriodFrom, '{y}-{m}-{d}') : '',
        operatingPeriodEnd: _this.companyList[0].operatingPeriodEnd ? parseTime(_this.companyList[0].operatingPeriodEnd, '{y}-{m}-{d}') : '',
        registrationAuthority: _this.companyList[0].registrationAuthority,
        approvalDate: _this.companyList[0].approvalDate ? parseTime(_this.companyList[0].approvalDate, '{y}-{m}-{d}') : '',
        registrationStatus: _this.companyList[0].registrationStatus,
        registeredAddress: _this.companyList[0].registeredAddress,
        businessAddress: _this.companyList[0].businessAddress,
        remark: _this.companyList[0].remark,
        businessScope: _this.companyList[0].businessScope,
        businessLicense: _this.companyList[0].businessLicense.replace(/(^\s*)|(\s*$)/g, ''),
        approvalFiles: _this.companyList[0].approvalFiles.replace(/(^\s*)|(\s*$)/g, ''),
        companyArticlesAssociation: _this.companyList[0].companyArticlesAssociation.replace(/(^\s*)|(\s*$)/g, ''),
        shareholdersDecide: _this.companyList[0].shareholdersDecide.replace(/(^\s*)|(\s*$)/g, ''),
        applicationRegistrationFiles: _this.companyList[0].applicationRegistrationFiles.replace(/(^\s*)|(\s*$)/g, ''),
        otherFiles: _this.companyList[0].otherFiles.replace(/(^\s*)|(\s*$)/g, ''),
        pid: _this.companyList[0].pid,
        pIds: _this.companyList[0].pIds,
        pName: _this.companyList[0].pName,
        id: _this.companyList[0].id,
        initCa: _this.companyList[0].initCa, // CA 是否同步
        initInvest: 1 // 是否同步过投资公司 1 是
      })
      if (businesslicense.success) {
        return businesslicense
      } else {
        return {}
      }
    },

    // 在法人系统的企业表中查询是否同名的投资企业
    async getInvestCompany(enterpriseName) {
      const listQuery = {
        page: 1,
        limit: 1,
        enterpriseName: enterpriseName
      }
      const businesslicense = await getBusinesslicenseOne(listQuery)
      if (businesslicense.success && businesslicense.data.records.length === 1) {
        return businesslicense.data.records
      } else {
        return []
      }
    },

    /**
     * 单条投资企业数据同步到投资列表
     * @param {*} investCompany  接口中返回的单条投资企业信息
     * @param {*} businesslicense  法人系统企业表中获取到的投资企业基本信息
     * @param {*} _this //
     */
    async singleInvestCompanySyn(investCompany, businesslicense, _this) {
      // 传入businesslicense对象，是为了获取投资企业的在法人系统中的id
      if (investCompany && businesslicense) {
        // 判断投资企业是否已经添加过
        var result = _this.list.filter(word => word.branchCompanyCode === businesslicense.id)
        if (result.length > 0) {
          console.log('这家投资公司已经添加')
          return
        }

        // 所属企业名称
        const enterpriseName = _this.companyList[0].enterpriseName
        // 所属企业名称
        const enterpriseCode = _this.companyList[0].id

        // 出资比例
        const proportion = investCompany.FundedRatio.replace('%', '') * 1
        // 投资企业名称
        const branchCompanyName = investCompany.Name
        // 法定代表人
        const legalRepresentative = investCompany.OperName
        // 注册资本
        const registeredCapital = investCompany.RegistCapi ? investCompany.RegistCapi : 0
        // 成立日期
        const setupDate = investCompany.establishDate

        // 企业类型
        const type = businesslicense.type
        // 投资企业id
        const branchCompanyCode = businesslicense.id
        // 货币类型
        const currency = businesslicense.currency
        // 备注
        const remark = businesslicense.remark
        // 状态
        const registrationStatus = businesslicense.registrationStatus

        save({
          enterpriseName: enterpriseName, // 所属企业名称
          enterpriseCode: enterpriseCode, // 所属企业编码
          branchCompanyName: branchCompanyName, // 被投资企业名称
          branchCompanyCode: branchCompanyCode, // 被投资企业的id
          legalRepresentative: legalRepresentative, // 法定代表人
          setupDate: setupDate ? parseTime(setupDate, '{y}-{m}-{d}') : '', // 成立日期
          type: type, // 企业类型
          // customType: _this.form.customType,
          // registrationType: _this.form.registrationType,
          // registrationPlace: _this.form.registrationPlace,
          registeredCapital: parseFloat(registeredCapital).toFixed(1), // 注册资本
          currency: currency,
          registrationStatus: registrationStatus,
          proportion: proportion * 1, // 投资占比
          remark: remark, // 备注
          realityCapitalContribution: parseFloat(registeredCapital).toFixed(1) // 投资额
          // id: _this.form.id

        }).then(response => {
          _this.$message({
            message: _this.$t('common.optionSuccess'),
            type: 'success'
          })
        })
      } else {
        console.log('投资企业关联失败！请检查')
      }
    }
  }
}
