import { getOne as getBusinesslicenseOne, remove, save } from '@/api/lpm/businesslicense'
import { parseTime } from '@/utils'
import { getList } from '@/api/lpm/businesslicense'
import { getList as getInvestCompanyList, save as investCompanySave } from '@/api/lpm/investcompany'

import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { getList as mainmemberList } from '@/api/lpm/mainmember'

import { showDictLabel, getDictNum } from '@/utils/common'
// 权限判断指令
import permission from '@/directive/permission/index.js'
import axios from 'axios'
export default {
  directives: { permission },
  data() {
    return {
      moduleType: '1', // 1、企业信息管理模块 2、企业变更模块
      enterpriseType: '', // 企业类型
      registrationStatusBL: '', // 登记状态
      filterText: '',
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
      }, {
        value: 'chairman',
        label: '董事长'
      }, {
        value: 'director',
        label: '董事'
      }, {
        value: 'supervisor',
        label: '监事'
      }, {
        value: 'generalManager',
        label: '总经理'
      }
      ],
      deptRadio: '27',
      deptTree: {
        show: false,
        data: [],
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      formVisible: false,
      formTitle: '添加注册公司',
      isAdd: true,
      form: {
        enterpriseName: '',
        enterpriseCode: '',
        parentEnterpriseName: '',
        parentEnterpriseCode: '',
        enterpriseType: '',
        status: '',
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
      selRow: {},
      clientHeight: '',
      tableHeight: 600
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
  mounted() {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`
  },
  created() {
    this.init()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight() {
      // this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    init() {
      deptList().then(response => {
        this.deptTree.data = response.data
      })
      if (this.$store.state.user.companys) {
        this.deptRadio = '24'
        this.listQuery.pIds = 24
      } else {
        this.deptRadio = '27'
        this.listQuery.pIds = 27
      }

      if (this.$route.path) {
        const tempArr = this.$route.path.split('/')
        this.moduleType = tempArr[tempArr.length - 1]
      }

      dictList({ name: '企业类型' }).then(response => {
        this.enterpriseType = response.data[0].detail
      })
      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusBL = response.data[0].detail
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyDict = response.data[0].detail
      })

      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      if ((this.searchType === 'chairman' ||
          this.searchType === 'director' ||
          this.searchType === 'supervisor' ||
          this.searchType === 'generalManager') && this.keyword) {
        const listQuery = {
          page: 1,
          limit: 2000
        }
        listQuery[this.searchType] = this.keyword
        mainmemberList(listQuery).then(response => {
          console.log(response)
          const records = response.data.records
          const pIds = []
          for (let i = 0; i < records.length; i++) {
            pIds.push(records[i].enterpriseCode)
          }

          // 如果进入企业管理模块和变更模块进行，公司权限过滤
          if (this.moduleType === '1' || this.moduleType === '2') {
            this.companys = this.$store.state.user.companys
          }
          this.listQuery.ids = pIds.length > 0 ? pIds.toString() : '2000000'
          getList(this.listQuery).then(response => {
            this.list = response.data.records
            this.listLoading = false
            this.total = response.data.total
            this.listQuery.page = response.data.current || 1
            this.listQuery.enterpriseName = ''
            this.listQuery.unifiedSocialCreditCode = ''
            this.listQuery.legalRepresentative = ''
          })
        })
      } else {
        // 如果进入企业管理模块和变更模块进行，公司权限过滤
        if (this.moduleType === '1' || this.moduleType === '2') {
          this.companys = this.$store.state.user.companys
        }
        this.listQuery.ids = this.companys ? this.companys.toString() : ''
        getList(this.listQuery).then(response => {
          this.list = response.data.records
          this.listLoading = false
          this.total = response.data.total
          this.listQuery.page = response.data.current || 1
          this.listQuery.enterpriseName = ''
          this.listQuery.unifiedSocialCreditCode = ''
          this.listQuery.legalRepresentative = ''
        })
      }
    },
    initSearchParams() {
      if (this.searchType === 'enterpriseName') {
        this.listQuery.enterpriseName = this.keyword
      }
      if (this.searchType === 'unifiedSocialCreditCode') {
        this.listQuery.unifiedSocialCreditCode = this.keyword
      }
      if (this.searchType === 'legalRepresentative') {
        this.listQuery.legalRepresentative = this.keyword
      }
    },
    search() {
      this.initSearchParams()
      this.listQuery.page = 1
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
      this.initSearchParams()
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1
      this.initSearchParams()
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.initSearchParams()
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.initSearchParams()
      this.fetchData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        enterpriseName: '',
        enterpriseCode: '',
        parentEnterpriseName: '',
        parentEnterpriseCode: '',
        enterpriseType: '',
        status: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加注册公司'
      this.formVisible = true
      this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            parentEnterpriseName: this.form.parentEnterpriseName,
            parentEnterpriseCode: this.form.parentEnterpriseCode,
            enterpriseType: this.form.enterpriseType,
            status: this.form.status,
            pid: this.form.pid,
            pIds: this.form.pIds,
            pName: this.form.pName,
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
    edit(id) {
      this.$router.push({ path: '/enterprisemanage', query: { id: id }})
      // this.$router.push({ path: '/lpm/businesslicenseEdit', query: { id: id }})
      // if (this.checkSel()) {
      //   this.isAdd = false
      //   this.form = this.selRow
      //   this.formTitle = '编辑注册公司'
      //   this.formVisible = true
      // }
    },
    modify(id) {
      this.$router.push({ path: '/editCompany', query: { id: id }})
      // this.$router.push({ path: '/lpm/businesslicenseEdit', query: { id: id }})
      // if (this.checkSel()) {
      //   this.isAdd = false
      //   this.form = this.selRow
      //   this.formTitle = '编辑注册公司'
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
    handleNodeClick(data, node) {
      this.form.pid = data.id
      let pids = data.pIds
      if (pids) {
        pids = pids.replace(/\[/g, '-')
        pids = pids.replace(/\]/g, '_')
        pids = pids.replace(/,/g, '|')
        pids = pids + '_' + data.id + '_1|'
        this.form.pIds = pids
      }

      this.form.pname = data.simplename
      this.deptTree.show = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.simplename.indexOf(value) !== -1
    },
    handleRadioClick() {
      this.listQuery.pIds = this.deptRadio
      this.listQuery.page = 1
      this.fetchData()
    },
    handleLeftNodeClick(data, node) {
      this.listQuery.pIds = data.id
      this.fetchData()
    },
    detail(row) {
      const routeUrl = this.$router.resolve({ path: '/lpm/detailEnterpriseinfo', query: { id: row.id }})
      window.open(routeUrl.href, '_blank')
    },
    // 格式化 企业类型
    formatterEnterpriseType(row) {
      // dictList({ name: '企业类型' }).then(response => {
      //   this.enterpriseType = response.data[0].detail
      // })
      const res = showDictLabel(this.enterpriseType, row.type)
      return res
    },
    // 格式化 登记状态
    formatterRegistrationStatus(row) {
      const res = showDictLabel(this.registrationStatusBL, row.registrationStatus)
      return res
    },
    // 添加公司
    addCompany(url, id) {
      this.$router.push({ path: url, query: { id: id }})
    },
    changeFixed(clientHeight) {
      // 动态修改样式
      if (clientHeight) {
        this.$refs.treecontainer.style.height = clientHeight - 124 + 'px'
      }
    },

    // 批量工商同步
    businessCirclesSynErgodic() {
      // const num = getDictNum(this.currencyDict, '港元')
      // console.log('num:', num)
      const list = this.list
      const _this = this
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          this.businessCirclesSyn(list[i], _this)
        }
      }
    },
    // 单条工商数据同步
    businessCirclesSyn(oldItem, _this) {
      if ((oldItem.unifiedSocialCreditCode || oldItem.enterpriseName) && (oldItem.initCa) * 1 !== 1) {
      // if (oldItem.unifiedSocialCreditCode || oldItem.enterpriseName) {
        let url = 'https://signtest.agile.com.cn:8082/ec-webservice/interface/everifyServer?appId=cfb6b6eef1b6462a8e0d360a9f9417cb'
        if (oldItem.unifiedSocialCreditCode) {
          url = url + '&unCreditCode=' + oldItem.unifiedSocialCreditCode + '&keywordType=3'
        } else {
          url = url + '&enterpriseName=' + oldItem.enterpriseName + '&keywordType=1'
        }

        axios.get(url)
          .then(function(res) {
            console.log('查询无结果:', res.data.resultMessage !== '查询无结果')
            console.log('企业类型：', _this.enterpriseType)
            if (res.data.statusCode === '200') {
              const data = JSON.parse(res.data.statusMessage)
              if (data.resultMessage === '查询无结果') {
                return '查询无结果'
              }
              // 统一社会信息代码
              const unifiedSocialCreditCode = data.unCreditCode || oldItem.unifiedSocialCreditCode
              // 企业名称
              const enterpriseName = data.enterpriseName || oldItem.enterpriseName
              // 企业法人
              const legalRepresentative = data.leagalPerson || oldItem.legalRepresentative
              // 企业编号
              const enterpriseCode = data.unitCode || oldItem.enterpriseCode
              // 企业类型
              const type = getDictNum(_this.enterpriseType, data.enterpriseType.replace('（', '(').replace('）', ')')) || oldItem.type
              // 注册地址
              const registeredAddress = data.address || oldItem.registeredAddress
              // 成立日期
              const setupDate = data.establishDate || oldItem.setupDate
              // 核准日期
              const approvalDate = data.checkDate || oldItem.approvalDate
              // 营业日期自
              const operatingPeriodFrom = data.businessStart || oldItem.operatingPeriodFrom
              // 营业日期至
              const operatingPeriodEnd = data.businessEnd || oldItem.operatingPeriodEnd
              // 登记机关
              const registrationAuthority = data.belongOrg || oldItem.registrationAuthority
              // 经营范围
              const businessScope = data.scope || oldItem.businessScope

              // 注册资本
              const registeredCapital = data.registCapital || oldItem.registeredCapital || 0
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
                  currency = oldItem.currency || '1'
                }
              }
              save({
                unifiedSocialCreditCode: unifiedSocialCreditCode, // 统一社会信息代码
                enterpriseCode: enterpriseCode, // 企业编号
                enterpriseName: enterpriseName, // 企业名称
                legalRepresentative: legalRepresentative, // 法定代表人
                type: type, // 企业类型
                registeredAddress: registeredAddress, // 注册地址
                setupDate: setupDate ? parseTime(setupDate, '{y}-{m}-{d}') : '', // 成立日期
                approvalDate: approvalDate ? parseTime(approvalDate, '{y}-{m}-{d}') : '', // 核准日期
                operatingPeriodFrom: operatingPeriodFrom ? parseTime(operatingPeriodFrom, '{y}-{m}-{d}') : '', // 营业期限自
                operatingPeriodEnd: operatingPeriodEnd ? parseTime(operatingPeriodEnd, '{y}-{m}-{d}') : '', // 营业期限至
                registrationAuthority: registrationAuthority, // 登记机关
                businessScope: businessScope, // 经营范围
                registeredCapital: parseFloat(registeredCapital).toFixed(1), // 注册资本
                currency: currency, // 币种
                initCa: 1, // 是否工商初始化过， 1 是
                registrationType: oldItem.registrationType || 1, // 企业注册类型
                registrationPlace: oldItem.registrationPlace || 1, // 企业注册地

                enterpriseNameEn: oldItem.enterpriseNameEn, // 企业英文名称
                enterpriseNameBusiness: oldItem.enterpriseNameBusiness, // 企业商用名称
                customType: oldItem.customType || 1, // 自定义企业类型

                achieveDate: oldItem.achieveDate ? parseTime(oldItem.achieveDate, '{y}-{m}-{d}') : '', // 取得日期
                registrationStatus: oldItem.registrationStatus || '1', // 登记状态
                businessAddress: oldItem.businessAddress, // 经营地址
                remark: oldItem.remark, // 备注
                pid: oldItem.pid,
                pIds: oldItem.pIds,
                pName: oldItem.pName,
                id: oldItem.id
              }).then(response => {
                _this.$message({
                  message: _this.$t('common.optionSuccess'),
                  type: 'success'
                })
              })
            } else {
              console.error('CA 请求失败')
            }
          })
          .catch(function(err) {
            console.error(err)
          })
      } else {
        console.log('统一社会信用代码或企业名称为空！请检查')
      }
    },

    // 获取主要人员信息列表
    searchTypeHander(val) {
      this.memberType = val
    },

    // 批量同步投资企业
    async investCompanySynErgodic() {
      // const num = getDictNum(this.currencyDict, '港元')
      // console.log('num:', num)
      const list = this.list
      const _this = this
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          await this.investCompanySyn(list[i], _this)
        }
      }
    },

    // 同步投资企业
    async investCompanySyn(currentCompany, pThis) {
      const _this = pThis
      const initInvest = currentCompany.initInvest
      if (initInvest !== '1') {
        // 1、获取企业名称
        const enterpriseName = currentCompany.enterpriseName
        // 2、通过企查查接口获取投资企业信息
        const investCompanyList = await this.getSingleInvestCompany(enterpriseName)
        console.log('investCompanyList-2', investCompanyList)

        const currentInvestList = await getInvestCompanyList({ enterpriseCode: currentCompany.id, page: 1, limit: 100 })
        console.log('investList---', currentInvestList.data.records)

        // 3、循环遍历投资企业

        for (let i = 0; i < investCompanyList.length; i++) {
          const investCompany = await this.getInvestCompany(investCompanyList[i].Name)
          console.log('investCompany', investCompany)
          if (investCompany && investCompany.length === 1) {
          // 如在数据库中已有投资企业
            await this.singleInvestCompanySyn(investCompanyList[i], investCompany[0], currentCompany, currentInvestList, _this)
          } else {
            const newInvestCompany = await this.createInvestCompany(investCompanyList[i], _this)
            console.log('newInvestCompany', newInvestCompany)
            if (newInvestCompany.data) {
              await this.singleInvestCompanySyn(investCompanyList[i], newInvestCompany.data, currentCompany, currentInvestList, _this)
            }
          }
        }
        // 更新公司的是否同步投资公司
        await this.initInvestCompany(currentCompany)
      } else {
        console.log(currentCompany.enterpriseName + ', 这家公司已经与企查查同步比对过投资企业！')
      }
    },
    // 获取单条企业的投资企业
    async getSingleInvestCompany(enterpriseName) {
      const investmentUrl = '/interface/qcc/api/investcompanylist?enterpriseName=' + enterpriseName
      // 创建实例时设置配置的默认值
      const instance = axios.create({
        baseURL: 'http://10.1.10.35:5008', // node接口服务地址
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
      const type = getDictNum(_this.enterpriseType, data.EconKind.replace('（', '(').replace('）', ')'))
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
      const businesslicense = await save({
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
    async initInvestCompany(pCurrentCompany, _this) {
      const currentCompany = pCurrentCompany
      currentCompany.initInvest = 1 // 是否同步过投资公司 1 是
      const businesslicense = await save({
        unifiedSocialCreditCode: currentCompany.unifiedSocialCreditCode,
        enterpriseName: currentCompany.enterpriseName,
        enterpriseNameEn: currentCompany.enterpriseNameEn,
        enterpriseNameBusiness: currentCompany.enterpriseNameBusiness,
        enterpriseCode: currentCompany.enterpriseCode,
        type: currentCompany.type,
        customType: currentCompany.customType,
        registrationType: currentCompany.registrationType,
        registrationPlace: currentCompany.registrationPlace,
        legalRepresentative: currentCompany.legalRepresentative,
        registeredCapital: parseFloat(currentCompany.registeredCapital).toFixed(1) || 0,
        currency: currentCompany.currency,
        setupDate: currentCompany.setupDate ? parseTime(currentCompany.setupDate, '{y}-{m}-{d}') : '',
        achieveDate: currentCompany.achieveDate ? parseTime(currentCompany.achieveDate, '{y}-{m}-{d}') : '',
        operatingPeriodFrom: currentCompany.operatingPeriodFrom ? parseTime(currentCompany.operatingPeriodFrom, '{y}-{m}-{d}') : '',
        operatingPeriodEnd: currentCompany.operatingPeriodEnd ? parseTime(currentCompany.operatingPeriodEnd, '{y}-{m}-{d}') : '',
        registrationAuthority: currentCompany.registrationAuthority,
        approvalDate: currentCompany.approvalDate ? parseTime(currentCompany.approvalDate, '{y}-{m}-{d}') : '',
        registrationStatus: currentCompany.registrationStatus,
        registeredAddress: currentCompany.registeredAddress,
        businessAddress: currentCompany.businessAddress,
        remark: currentCompany.remark,
        businessScope: currentCompany.businessScope,
        businessLicense: currentCompany.businessLicense.replace(/(^\s*)|(\s*$)/g, ''),
        approvalFiles: currentCompany.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''),
        companyArticlesAssociation: currentCompany.companyArticlesAssociation.replace(/(^\s*)|(\s*$)/g, ''),
        shareholdersDecide: currentCompany.shareholdersDecide.replace(/(^\s*)|(\s*$)/g, ''),
        applicationRegistrationFiles: currentCompany.applicationRegistrationFiles.replace(/(^\s*)|(\s*$)/g, ''),
        otherFiles: currentCompany.otherFiles.replace(/(^\s*)|(\s*$)/g, ''),
        pid: currentCompany.pid,
        pIds: currentCompany.pIds,
        pName: currentCompany.pName,
        id: currentCompany.id,
        initCa: currentCompany.initCa, // CA 是否同步
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
    async singleInvestCompanySyn(investCompany, businesslicense, currentCompany, investList, _this) {
      // 传入businesslicense对象，是为了获取投资企业的在法人系统中的id
      console.log('investCompany---', investCompany)
      console.log('businesslicense---', businesslicense)
      console.log('currentCompany---', currentCompany)
      if (investCompany && businesslicense) {
        // 判断投资企业是否已经添加过
        if (investList && investList.success && investList.data.records.length > 0) {
          var result = investList.data.records.filter(word => word.branchCompanyCode === businesslicense.id)
          if (result.length > 0) {
            console.log('这家投资公司已经添加')
            return
          }
        }

        // 所属企业名称
        const enterpriseName = currentCompany.enterpriseName
        // 所属企业名称
        const enterpriseCode = currentCompany.id

        // 出资比例
        const proportion = investCompany.FundedRatio.replace('%', '') * 1
        // 投资企业名称
        const branchCompanyName = investCompany.Name
        // 法定代表人
        const legalRepresentative = investCompany.OperName
        // 注册资本
        const registeredCapital = investCompany.RegistCapi
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

        investCompanySave({
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
