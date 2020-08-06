import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { showDictLabel } from '@/utils/common'
import { parseTime, accMul } from '@/utils'
import { remove, getList, save } from '@/api/lpm/realityRecord'
import { getList as getCapitalList, save as capitalSave } from '@/api/lpm/capital'

export default {
  props: ['enterpriseid', 'enterprisename', 'serialnumber', 'shareholder', 'currentregistrationtype', 'refresh'],
  data() {
    return {
      realityFormVisible: false,
      formTitle: '添加股东实缴记录信息',
      isAdd: true,
      enterpriseCode: this.enterpriseid,
      serialNumber: this.serialnumber,
      currentRegistrationType: this.currentregistrationtype,
      realityCapitalTypeList: [], // 实缴出资方式，从数据字典中获取
      currencyList: [], // 币种，从数据字典中获取
      form: {
        enterpriseCode: this.enterpriseid,
        enterpriseName: this.enterprisename,
        serialNumber: this.serialnumber,
        shareholder: this.shareholder,
        realityCapitalType: '',
        numberOfShares: 0,
        currency: '',
        realityCapitalContribution: 0,
        realityCapitalDate: '',
        responsiblePerson: '',
        remark: '',
        accessoryFiles: '',
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
    // enterpriseCode() {
    //   return this.enterpriseid
    // },
    // serialNumber() {
    //   return this.serialnumber
    // },
    // 表单验证
    rules() {
      return {
        realityCapitalType: [
          { required: true, message: '请选择实缴出资方式', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'blur' }
        ],
        realityCapitalContribution: [
          { required: true, message: '请输入实缴出资额', trigger: 'blur' },
          { pattern: /(^[0-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留六位小数' }
        ],
        realityCapitalDate: [
          { required: true, message: '请选择实缴出资日期', trigger: 'blur' }
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
    },
    fetchData() {
      this.listLoading = true
      console.log('this.enterpriseid:' + this.enterpriseCode)
      console.log('this.serialnumber:' + this.serialNumber)
      console.log('this.currentregistrationtype:' + this.currentRegistrationType)
      console.log(this.$parent)
      this.listQuery.enterpriseCode = this.enterpriseCode
      this.listQuery.serialNumber = this.serialNumber
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        if (this.list && this.list.length > 0 && this.currentRegistrationType * 1 === 2) {
          getCapitalList({ page: 1, limit: 1, id: this.serialNumber }).then(response => {
            const currentCapital = response.data.records[0]
            console.log(currentCapital)
            const newCapital = {}
            for (const key in currentCapital) {
              if (key !== 'createBy' && key !== 'createTime' && key !== 'modifyBy' && key !== 'modifyTime') {
                newCapital[key] = currentCapital[key]
              }
            }
            let realityCapitalContribution = 0
            for (let i = 0; i < this.list.length; i++) {
              realityCapitalContribution = realityCapitalContribution + this.list[i].realityCapitalContribution * 1
            }

            let numberOfShares = 0
            for (let i = 0; i < this.list.length; i++) {
              numberOfShares = numberOfShares + this.list[i].numberOfShares * 1
            }

            newCapital.realityCapitalContribution = realityCapitalContribution
            newCapital.numberOfShares = numberOfShares
            capitalSave(newCapital).then(response => {
              console.log(response)
              console.log(this.refresh)
              this.refresh(this.serialNumber)
            })
          })
        }
      })

      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeList = getDictList(response.data[0].detail)
      })
      dictList({ name: '币种' }).then(response => {
        this.currencyList = getDictList(response.data[0].detail)
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
      this.formVisible = false
      if (this.currentRegistrationType * 1 === 2) {
        this.form.realityCapitalContribution = this.form.realityCapitalContribution / 10000
      }
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
        enterpriseCode: this.enterpriseid,
        enterpriseName: this.enterprisename,
        serialNumber: this.serialnumber,
        shareholder: this.shareholder,
        realityCapitalType: '',
        numberOfShares: 0,
        currency: '',
        realityCapitalContribution: 0,
        realityCapitalDate: '',
        responsiblePerson: '',
        remark: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加股东实缴记录信息'
      this.realityFormVisible = true
      this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let realityCapitalContribution = parseFloat(this.form.realityCapitalContribution).toFixed(6)
          if (this.currentRegistrationType * 1 === 2) {
            realityCapitalContribution = realityCapitalContribution / 10000
          }
          save({
            enterpriseCode: this.form.enterpriseCode,
            enterpriseName: this.form.enterpriseName,
            serialNumber: this.form.serialNumber,
            shareholder: this.form.shareholder,
            realityCapitalType: this.form.realityCapitalType,
            numberOfShares: this.form.numberOfShares ? this.form.numberOfShares : 0,
            currency: this.form.currency,
            realityCapitalContribution: realityCapitalContribution,
            realityCapitalDate: parseTime(this.form.realityCapitalDate, '{y}-{m}-{d}'),
            responsiblePerson: this.form.responsiblePerson,
            remark: this.form.remark,
            accessoryFiles: this.form.accessoryFiles,
            id: this.form.id
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
            this.realityFormVisible = false
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
        this.formTitle = '编辑股东实缴记录信息'
        this.realityFormVisible = true
        if (this.currentRegistrationType * 1 === 2) {
          this.form.realityCapitalContribution = this.form.realityCapitalContribution ? accMul(this.form.realityCapitalContribution, 10000) : 0
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
    // 格式化 实缴出资方式【股权及出资信息】
    formatterrealityCapitalType(row) {
      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeCapital = response.data[0].detail
      })
      const res = showDictLabel(this.realityCapitalTypeCapital, row.realityCapitalType)
      return res
    },
    // 格式化 实缴出资方式【股权及出资信息】
    formatterCurrency(row) {
      dictList({ name: '币种' }).then(response => {
        this.currencyType = response.data[0].detail
      })
      const res = showDictLabel(this.currencyType, row.currency)
      return res
    }

  }
}
