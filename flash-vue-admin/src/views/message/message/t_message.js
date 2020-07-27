import { clear, save, getList } from '@/api/message/message'

export default {
  data() {
    return {
      formVisible: false,
      formTitle: '添加消息',
      isAdd: true,
      form: {
        tplCode: 'EMAIL_TEST',
        from: '530759611@qq.com',
        to: '',
        cc: '',
        title: '',
        content: '',
        type: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      rules: {
        title: [
          { required: true, message: '邮件标题不能为空', trigger: 'blur' }
        ],
        to: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '邮件内容不能为空', trigger: 'blur' }
        ]
      },
      rangeDate: undefined,
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
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const queryData = this.listQuery
      if (this.rangeDate) {
        queryData['startDate'] = this.rangeDate[0]
        queryData['endDate'] = this.rangeDate[1]
      }
      getList(queryData).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.startDate = undefined
      this.listQuery.endDate = undefined
      this.rangeDate = ''
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        tplCode: 'EMAIL_TEST',
        from: '530759611@qq.com',
        to: '',
        cc: '',
        title: '',
        content: '',
        type: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '发送高管离职预警提醒'
      this.formVisible = true
      this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            tplCode: 'EMAIL_TEST',
            from: '530759611@qq.com',
            to: this.form.to,
            cc: '',
            title: this.form.title,
            content: this.form.content,
            type: '',
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
        this.formTitle = '编辑消息模板'
        this.formVisible = true
      }
    },
    clear() {
      this.$confirm('确认清楚所有历史消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clear().then(response => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '清楚成功!'
          })
        })
      })
    }

  }
}
