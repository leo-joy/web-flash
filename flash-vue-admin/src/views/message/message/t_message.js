import { getList as getBusinesslicenseList } from '@/api/lpm/businesslicense'
import { getList as getMainmemberList } from '@/api/lpm/mainmember'
import { getList as getUserList } from '@/api/system/user'

import { clear, save, getList } from '@/api/message/message'

export default {
  data() {
    return {
      formVisible: false,
      formTitle: '添加消息',
      isAdd: true,
      form: {
        personId: '',
        personName: '',
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
        to: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      rangeDate: undefined,
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      listUserQuery: {
        page: 1,
        limit: 50000,
        type: '1,2',
        account: undefined,
        name: undefined
      },
      restaurants: []
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
      getUserList(this.listUserQuery).then(response => {
        this.restaurants = response.data.records
      })
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
        personId: '',
        personName: '',
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
    sendEmail(personName, content) {
      save({
        personId: '',
        personName: '',
        tplCode: 'EMAIL_TEST',
        from: '530759611@qq.com',
        to: this.form.to,
        cc: '',
        title: '公司高管【' + personName + '】离职，请尽快发起相关企业高管变更流程！',
        content: content,
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
    },
    getEnterpriseList(response) {
      const records = response.data.records
      let enterpriseNameStr = ''
      if (records && records.length > 0) {
        for (let i = 0; i < records.length; i++) {
          enterpriseNameStr = enterpriseNameStr + records[i].enterpriseName + ','
        }
      }
      return enterpriseNameStr
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const personName = this.form.personName
          if (!personName) {
            alert('请选择要离职的高管')
            return
          }
          // 发送离职法人代表提醒
          getBusinesslicenseList({ page: 1, limit: 6000, legalRepresentative: personName }).then(response => {
            let enterpriseNameStr = this.getEnterpriseList(response)
            if (enterpriseNameStr) {
              enterpriseNameStr = '公司高管 【' + personName + '】 在【' + enterpriseNameStr + '】担任【企业法人】'
              this.sendEmail(personName, enterpriseNameStr)
            }
          })
          // 发送离职董事长提醒
          getMainmemberList({ page: 1, limit: 6000, chairman: personName }).then(response => {
            let enterpriseNameStr = this.getEnterpriseList(response)
            if (enterpriseNameStr) {
              enterpriseNameStr = '公司高管 【' + personName + '】 在【' + enterpriseNameStr + '】担任【董事长】'
              this.sendEmail(personName, enterpriseNameStr)
            }
          })

          // 发送离职董事提醒
          getMainmemberList({ page: 1, limit: 6000, director: personName }).then(response => {
            let enterpriseNameStr = this.getEnterpriseList(response)
            if (enterpriseNameStr) {
              enterpriseNameStr = '公司高管 【' + personName + '】 在【' + enterpriseNameStr + '】担任【董事】'
              this.sendEmail(personName, enterpriseNameStr)
            }
          })
          // 发送离职监事提醒
          getMainmemberList({ page: 1, limit: 6000, supervisor: personName }).then(response => {
            let enterpriseNameStr = this.getEnterpriseList(response)
            if (enterpriseNameStr) {
              enterpriseNameStr = '公司高管 【' + personName + '】 在【' + enterpriseNameStr + '】担任【监事】'
              this.sendEmail(personName, enterpriseNameStr)
            }
          })
          // 发送离职总经理提醒
          getMainmemberList({ page: 1, limit: 6000, generalManager: personName }).then(response => {
            let enterpriseNameStr = this.getEnterpriseList(response)
            if (enterpriseNameStr) {
              enterpriseNameStr = '公司高管 【' + personName + '】 在【' + enterpriseNameStr + '】担任【总经理】'
              this.sendEmail(personName, enterpriseNameStr)
            }
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
    handleChairmanSelect(item) {
      this.form.personId = item.id
      this.form.personName = item.name
    },
    handleIconClick(ev) {
      alert('没有此高管')
      // this.addAdvancedUser()
    },
    clear() {
      this.$confirm('确认清楚所有离职提醒?', '提示', {
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
