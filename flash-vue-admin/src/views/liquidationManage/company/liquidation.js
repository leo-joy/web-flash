import { getList } from '@/api/lpm/businesslicense'
import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel, getDictNum } from '@/utils/common'
// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      enterpriseType: '', // 企业类型
      registrationStatus: '', // 登记状态过滤条件
      registrationStatusBL: '', // 登记状态
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
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
  },
  created() {
    this.init()
  },
  watch: {
  },
  methods: {
    init() {
      if (this.$route.path) {
        const tempArr = this.$route.path.split('/')
        this.registrationStatus = tempArr[tempArr.length - 1]
      }

      dictList({ name: '企业类型' }).then(response => {
        this.enterpriseType = response.data[0].detail
      })
      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusBL = response.data[0].detail
      })
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      if (this.registrationStatus) {
        this.listQuery.registrationStatus = this.registrationStatus
      }
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        this.listQuery.page = response.data.current || 1
        this.listQuery.enterpriseName = ''
        this.listQuery.unifiedSocialCreditCode = ''
        this.listQuery.legalRepresentative = ''
      })
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
    }
  }
}
