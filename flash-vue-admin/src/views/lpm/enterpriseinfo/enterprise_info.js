import { remove, save } from '@/api/lpm/businesslicense'
import { parseTime } from '@/utils'
import { getList } from '@/api/lpm/businesslicense'
import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel, getDictNum } from '@/utils/common'
// 权限判断指令
import permission from '@/directive/permission/index.js'
import axios from 'axios'
export default {
  directives: { permission },
  data() {
    return {
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
      }
      ],
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
        limit: 10,
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
      this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    init() {
      deptList().then(response => {
        this.deptTree.data = response.data
      })
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.companys = this.$store.state.user.companys
      this.listQuery.ids = this.companys ? this.companys.toString() : ''
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        this.listQuery.enterpriseName = ''
        this.listQuery.unifiedSocialCreditCode = ''
        this.listQuery.legalRepresentative = ''
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyDict = response.data[0].detail
      })
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
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑注册公司'
        this.formVisible = true
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
    handleLeftNodeClick(data, node) {
      this.listQuery.pIds = data.id
      this.fetchData()
    },
    detail(row) {
      console.log(row)
      this.$router.push({ path: '/lpm/detailEnterpriseinfo', query: { id: row.id }})
      // this.resetForm()
      // this.formTitle = '添加营业执照'
      // this.formVisible = true
      // this.isAdd = true
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
    },
    // 添加公司
    addCompany(url, id) {
      this.$router.push({ path: url, query: { id: id }})
    },
    changeFixed(clientHeight) {
      // 动态修改样式
      this.$refs.treecontainer.style.height = clientHeight - 124 + 'px'
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
    }
  }
}
