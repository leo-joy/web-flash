import { remove, getList, save } from '@/api/lpm/businesslicense'
import { parseTime } from '@/utils'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel, getDictNum } from '@/utils/common'
// 权限判断指令
import permission from '@/directive/permission/index.js'
import axios from 'axios'
// axios.defaults.withCredentials = true

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加营业执照',
      enterpriseType: '', // 企业类型
      currencyDict: '', // 币种
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
  watch: {
    '$route.path': function(newVal, oldVal) {
      this.fetchData()
    }
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.companys = this.$store.state.user.companys
      this.listQuery.ids = this.companys ? this.companys.toString() : ''
      this.listQuery.registrationType = this.$route.meta.registrationType
      this.listQuery.registrationStatus = this.$route.meta.registrationStatus
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyDict = response.data[0].detail
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
    add() {
      if (this.$route.meta.registrationType) {
        this.$router.push({ path: '/lpm/businesslicenseEdit', query: { registrationType: this.$route.meta.registrationType }})
      } else {
        this.$router.push({ path: '/lpm/businesslicenseEdit' })
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
            initCa: 0,
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
    initCA() {
      // const num = getDictNum(this.currencyDict, '港元')
      // console.log('num:', num)
      const list = this.list
      const _this = this
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          this.caInit(list[i], _this)
        }
      }
    },
    caInit(oldItem, _this) {
      if ((oldItem.unifiedSocialCreditCode || oldItem.enterpriseName) && (oldItem.initCa) * 1 !== 1) {
        let url = 'https://signtest.agile.com.cn:8082/ec-webservice/interface/everifyServer?appId=cfb6b6eef1b6462a8e0d360a9f9417cb'
        if (oldItem.unifiedSocialCreditCode) {
          url = url + '&unCreditCode=' + oldItem.unifiedSocialCreditCode + '&keywordType=3'
        } else {
          url = url + '&enterpriseName=' + oldItem.enterpriseName + '&keywordType=1'
        }

        axios.get(url)
          .then(function(res) {
            console.log('查询无结果:', res.data.resultMessage !== '查询无结果')
            console.log(_this.enterpriseType)
            if (res.data.statusCode === '200') {
              const data = JSON.parse(res.data.statusMessage)
              if (data.resultMessage === '查询无结果') {
                return '查询无结果'
              }
              console.log('qweqweqwe')
              console.log(data)
              // 统一社会信息代码
              const unifiedSocialCreditCode = data.unCreditCode || oldItem.unifiedSocialCreditCode
              // 企业名称
              const enterpriseName = data.enterpriseName || oldItem.enterpriseName
              // 企业法人
              const legalRepresentative = data.leagalPerson || oldItem.legalRepresentative
              // 企业编号
              const enterpriseCode = data.unitCode || oldItem.enterpriseCode
              // 企业类型
              const type = getDictNum(_this.enterpriseType, data.enterpriseType) || oldItem.type
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
            console.log('33333')
            console.error(err)
          })
      } else {
        console.log('统一社会信用代码或企业名称为空！请检查')
      }
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
          this.$router.push({ path: '/lpm/businesslicenseEdit', query: { id: this.selRow.id, registrationType: this.$route.meta.registrationType }})
        } else {
          this.$router.push({ path: '/lpm/businesslicenseEdit', query: { id: this.selRow.id }})
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
