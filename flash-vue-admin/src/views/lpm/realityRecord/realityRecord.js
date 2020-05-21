import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { showDictLabel } from '@/utils/common'
import { parseTime } from '@/utils'
import { remove, getList, save } from '@/api/lpm/realityRecord'

export default {
  props: ['enterpriseid', 'enterprisename', 'serialnumber', 'shareholder'],
  data() {
    return {
      realityFormVisible: false,
      formTitle: '添加股东实缴记录信息',
      isAdd: true,
      enterpriseCode: this.enterpriseid,
      serialNumber: this.serialnumber,
      realityCapitalTypeList: [], // 实缴出资方式，从数据字典中获取
      form: {
        enterpriseCode: this.enterpriseid,
        enterpriseName: this.enterprisename,
        serialNumber: this.serialnumber,
        shareholder: this.shareholder,
        realityCapitalType: '',
        realityCapitalContribution: '',
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
        realityCapitalContribution: [
          { required: true, message: '请输入实缴出资额', trigger: 'blur' }
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
      this.listQuery.enterpriseCode = this.enterpriseCode
      this.listQuery.serialNumber = this.serialNumber
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })

      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeList = getDictList(response.data[0].detail)
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
        enterpriseCode: this.enterpriseid,
        enterpriseName: this.enterprisename,
        serialNumber: this.serialnumber,
        shareholder: this.shareholder,
        realityCapitalType: '',
        realityCapitalContribution: '',
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
          save({
            enterpriseCode: this.form.enterpriseCode,
            enterpriseName: this.form.enterpriseName,
            serialNumber: this.form.serialNumber,
            shareholder: this.form.shareholder,
            realityCapitalType: this.form.realityCapitalType,
            realityCapitalContribution: this.form.realityCapitalContribution,
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

  }
}
