import { Loading } from 'element-ui'
import pdf from 'vue-pdf'
import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { getDictList, getCityDate } from '@/utils/common'
import { get, save } from '@/api/lpm/businesslicense'
import { getListIds } from '@/api/cms/fileInfo'
import { parseTime } from '@/utils'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { pdf },
  data() {
    return {
      deptTree: {
        show: false,
        data: [],
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      typeList: [], // 企业类型，从数据字典中获取
      customTypeList: [], // 自定义企业类型，从数据字典中获取
      egistrationTypeList: [], // 企业注册类型，从数据字典中获取
      currencyList: [], // 币种，从数据字典中获取
      registrationStatusList: [], // 登记状态，从数据字典中获取
      registrationTypeList: [], // 企业注册类型，从数据字典中获取
      companyTagOptions: [], // 企业标签，从数据字典中获取
      uploadUrl: '',
      uploadFileId: '',
      uploadHeaders: {
        'Authorization': ''
      },
      formVisible: false,
      formTitle: '添加营业执照',
      isAdd: true,
      form: {
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseNameEn: '',
        enterpriseNameBusiness: '',
        enterpriseCode: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        registrationPlaceName: '',
        legalRepresentative: '',
        registeredCapital: 0,
        issuedShareCapital: 0,
        realProportion: 0,
        currency: '',
        setupDate: '',
        achieveDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        registrationAuthorityEn: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        registeredAddressEn: '',
        businessAddress: '',
        tags: '',
        remark: '',
        businessScope: '',
        businessScopeEn: '',
        businessLicenseFiles: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      },
      rules: {
        // pName: [
        //   { required: true, message: '请选中组织属性', trigger: 'blur' }
        // ],
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        registeredCapital: [
          { required: true, message: '请输入注册资本金额', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
        ],
        // currency: [
        //   { required: true, message: '请选择币种', trigger: 'blur' }
        // ],
        registrationType: [
          { required: true, message: '请选择企业注册类型', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        ids: ''
      },
      businessLicenseFilesList: [],
      approvalFilesList: [],
      companyArticlesAssociationList: [],
      shareholdersDecideList: [],
      applicationRegistrationFilesList: [],
      otherFilesList: [],
      provinces: []
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
  watch: {
    '$route.path': function(newVal, oldVal) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.provinces = getCityDate()
      deptList().then(response => {
        this.deptTree.data = response.data
      })

      dictList({ name: '企业类型' }).then(response => {
        this.typeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '自定义企业类型' }).then(response => {
        this.customTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '企业注册类型' }).then(response => {
        this.registrationTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '币种' }).then(response => {
        this.currencyList = getDictList(response.data[0].detail)
      })

      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusList = getDictList(response.data[0].detail)
      })

      dictList({ name: '企业标签' }).then(response => {
        this.companyTagOptions = getDictList(response.data[0].detail)
      })

      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      console.log(this.$route.query.registrationType)
      this.form.registrationType = this.$route.query.registrationType ? this.$route.query.registrationType + '' : ''
      const id = this.$route.query.id
      if (id) {
        get(id).then(response => {
          this.form = response.data
          // this.setContent(response.data.content)
          // this.ifUpload = false
          // this.businessLicenseList = []
          var accessoryArr = ['businessLicenseFiles', 'approvalFiles',
            'companyArticlesAssociation', 'shareholdersDecide',
            'applicationRegistrationFiles', 'otherFiles']
          for (let j = 0; j < accessoryArr.length; j++) {
            if (response.data[accessoryArr[j]]) {
              const listQuery = {
                page: 1,
                limit: 20,
                ids: response.data[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '') || '0'
              }
              // listQuery.ids = response.data[accessoryArr[j]]
              getListIds(listQuery).then(response => {
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

          this.form.registrationPlace = this.form.registrationPlace ? this.form.registrationPlace.split('-') : ''
          this.form.tags = this.form.tags ? this.form.tags.split('-') : ''
          // this.listQuery.ids = response.data.businessLicense
          // getListIds(this.listQuery).then(response => {
          //   console.log(response.data)
          //   this.list = response.data.records
          //   for (let i = 0; i < response.data.records.length; i++) {
          //     var file = {}
          //     file.name = response.data.records[i].originalFileName
          //     file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
          //     this.businessLicenseList.push(file)
          //   }
          //   // this.listLoading = false
          //   // this.total = response.data.total
          // })
        })
      }
    },
    back() {
      this.$router.go(-1)
    },
    resetForm() {
      this.form = {
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseNameEn: '',
        enterpriseNameBusiness: '',
        enterpriseCode: '',
        type: '',
        customType: '',
        registrationType: this.$route.query.registrationType,
        registrationPlace: '',
        registrationPlaceName: '',
        legalRepresentative: '',
        registeredCapital: 0,
        issuedShareCapital: 0,
        realProportion: 0,
        currency: '',
        setupDate: '',
        achieveDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        registrationAuthorityEn: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        registeredAddressEn: '',
        businessAddress: '',
        tags: '',
        remark: '',
        businessScope: '',
        businessScopeEn: '',
        businessLicenseFiles: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.pid) {
            alert('请现在组织属性')
            return false
          }
          const registeredCapital = this.form.registeredCapital ? parseFloat(this.form.registeredCapital).toFixed(2) : 0
          const issuedShareCapital = this.form.issuedShareCapital ? parseFloat(this.form.issuedShareCapital).toFixed(2) : 0
          if (this.form.pid * 1 === 26) {
            this.form.registrationType = 2
            // registeredCapital = registeredCapital / 10000
            // issuedShareCapital = issuedShareCapital / 10000
          }
          save({
            unifiedSocialCreditCode: this.form.unifiedSocialCreditCode,
            enterpriseName: this.form.enterpriseName,
            enterpriseNameEn: this.form.enterpriseNameEn,
            enterpriseNameBusiness: this.form.enterpriseNameBusiness,
            enterpriseCode: this.form.enterpriseCode,
            type: this.form.type,
            customType: this.form.customType,
            registrationType: this.form.registrationType,
            registrationPlace: this.form.registrationPlace ? this.form.registrationPlace.join('-') : '',
            registrationPlaceName: this.form.registrationPlaceName,
            legalRepresentative: this.form.legalRepresentative,
            registeredCapital: registeredCapital,
            issuedShareCapital: issuedShareCapital,
            realProportion: this.form.realProportion ? parseFloat(this.form.realProportion).toFixed(1) : 0,
            currency: this.form.currency,
            setupDate: this.form.setupDate ? parseTime(this.form.setupDate, '{y}-{m}-{d}') : '',
            achieveDate: this.form.achieveDate ? parseTime(this.form.achieveDate, '{y}-{m}-{d}') : '',
            operatingPeriodFrom: this.form.operatingPeriodFrom ? parseTime(this.form.operatingPeriodFrom, '{y}-{m}-{d}') : '',
            operatingPeriodEnd: this.form.operatingPeriodEnd ? parseTime(this.form.operatingPeriodEnd, '{y}-{m}-{d}') : '',
            registrationAuthority: this.form.registrationAuthority,
            registrationAuthorityEn: this.form.registrationAuthorityEn,
            approvalDate: this.form.approvalDate ? parseTime(this.form.approvalDate, '{y}-{m}-{d}') : '',
            registrationStatus: this.form.registrationStatus,
            registeredAddress: this.form.registeredAddress,
            registeredAddressEn: this.form.registeredAddressEn,
            businessAddress: this.form.businessAddress,
            tags: this.form.tags ? this.form.tags.join('-') : '',
            remark: this.form.remark,
            businessScope: this.form.businessScope,
            businessScopeEn: this.form.businessScopeEn,
            businessLicenseFiles: this.form.businessLicenseFiles.replace(/(^\s*)|(\s*$)/g, ''),
            approvalFiles: this.form.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''),
            companyArticlesAssociation: this.form.companyArticlesAssociation.replace(/(^\s*)|(\s*$)/g, ''),
            shareholdersDecide: this.form.shareholdersDecide.replace(/(^\s*)|(\s*$)/g, ''),
            applicationRegistrationFiles: this.form.applicationRegistrationFiles.replace(/(^\s*)|(\s*$)/g, ''),
            otherFiles: this.form.otherFiles.replace(/(^\s*)|(\s*$)/g, ''),
            pid: this.form.pid,
            pIds: this.form.pIds,
            pName: this.form.pName,
            id: this.form.id

          }
          ).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            if (response.success) {
              if (this.form.pid * 1 === 26) {
                this.$router.push({ path: '/enterprisemanagehw', query: { id: response.data.id }})
              } else {
                this.$router.push({ path: '/enterprisemanage', query: { id: response.data.id }})
              }
            } else {
              this.back()
            }
            //
          })
        } else {
          return false
        }
      })
    },
    handleNodeClick(data, node) {
      this.form.pid = data.id
      let pids = data.pids
      if (pids) {
        pids = pids.replace(/\[/g, '-')
        pids = pids.replace(/\]/g, '_')
        pids = pids.replace(/,/g, '|')
        pids = pids + '-' + data.id + '_1|'
        this.form.pIds = pids
      }

      this.form.pName = data.simplename
      this.deptTree.show = false
    },
    handleBeforeUpload() {
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
      this.$emit('viewfile', file.id, file.name)
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
    /**
     * 删除文件
     */

    businessLicenseFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'businessLicenseFiles')
    },
    approvalFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'approvalFiles')
    },
    companyArticlesAssociationRemoveFile(file) {
      this.handleRemoveFile(file, 'companyArticlesAssociation')
    },
    shareholdersDecideRemoveFile(file) {
      this.handleRemoveFile(file, 'shareholdersDecide')
    },
    applicationRegistrationFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'applicationRegistrationFiles')
    },
    otherFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'otherFiles')
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
     * 文件上传成功
     */

    businessLicenseFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'businessLicenseFiles')
    },
    approvalFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'approvalFiles')
    },
    companyArticlesAssociationUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyArticlesAssociation')
    },
    shareholdersDecideUploadSuccess(response) {
      this.handleUploadSuccess(response, 'shareholdersDecide')
    },
    applicationRegistrationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'applicationRegistrationFiles')
    },
    otherFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'otherFiles')
    },
    // 给注册地名称赋值
    handleRegistrationPlaceChange(value) {
      const selectVarArr = value
      const provinces = this.provinces
      const tempObj1 = getProvince(selectVarArr[0], provinces)
      const tempObj2 = getProvince(selectVarArr[1], tempObj1.children)
      this.form.registrationPlaceName = tempObj1.label + '-' + tempObj2.label
      function getProvince(val, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (val === arr[i].value) {
            return arr[i]
          }
        }
      }
    }
  }
}
