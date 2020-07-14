<template>
  <div style="background-color:#fffff;border:1px #efefef dotted;margin:5px;">
    <div style="padding:5px 10px;">

      <el-button v-permission="['/newFilesList']" style="border:none;padding:5px;z-index:10;margin:0;margin-left:10px;position:absolute;right:130px;top:50px;" @click="openAllFilesDialog()">
        <img class="user-avatar" title="点击营业执照查看公司文件" src="@/assets/img/zhizhao.png">
        <div style="margin-top:10px;">点击营业执照查看公司文件</div>
      </el-button>
      
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1" disabled>
          <template slot="title">
            <i class="header-icon el-icon-notebook-1" /> 营业执照信息
          </template>
          <div><businesslicense /></div>
        </el-collapse-item>
        <el-collapse-item name="2" disabled>
          <template slot="title">
            <i class="header-icon el-icon-user-solid" /> 人员信息
          </template>
          <div><mainmember /></div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <i class="header-icon el-icon-set-up" /> 股权信息
          </template>
          <div><capital /></div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <i class="header-icon el-icon-coordinate" /> 行政许可信息
          </template>
          <div><administrativelicense /></div>
        </el-collapse-item>
        <el-collapse-item name="5">
          <template slot="title">
            <i class="header-icon el-icon-postcard" /> 税务信息
          </template>
          <div><tallage /></div>
        </el-collapse-item>
      </el-collapse>
      <el-dialog
        :title="title"
        :visible.sync="fileDialogVisible"
        width="90%"
        :close-on-press-escape="false"
      >
        <el-row>
          <el-col :span="8" sytle="border-right:#ccc 1px solid;">
            <el-input
              v-model="filterText"
              style="margin-top:-50px;margin-bottom:20px;padding-right:30px;"
              size="small"
              placeholder="可输入文件名进行搜索过滤"
            />
            <br>
            <el-tree
              ref="tree"
              class="filter-tree"
              icon-class="el-icon-folder-opened"
              :data="filesData"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="viewPdf"
            />
          </el-col>
          <el-col :span="16">
            <PDFView :src="src" />
          </el-col>
        </el-row>
        <br>
        <div><b>*附件备注：</b>{{ currentCompanyModify.remark? currentCompanyModify.remark:'没有备注信息' }}</div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss">
.dp-table {
  width:100%;
  border:1px dotted #ebeef5;
  border-collapse:collapse;
}

.dp-table th, .dp-table td {
    border-top:1px solid #ebeef5;
    padding: 10px;
}

.dp-table th{
    margin:5px;
    text-align: center;
    background-color: #f9f9f9;
}
.dp-table td b{
    margin: 10px 5px;
}
// 清除浮动
.clearfix:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
.modifyList {
  padding:5px
}
.filter-tree {
  padding-right:30px;
}

.filter-tree .el-tree-node__children {
  padding:3px 0;
  color:#00a2ff;
}
.el-tree-node {
  white-space:normal;
}
</style>
<script>
import { getListIds } from '@/api/cms/fileInfo'
import { getList as companyModify } from '@/api/lpm/companyModify'
import { getList as getCapitalModifyList } from '@/api/lpm/capitalModify'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel } from '@/utils/common'
import PDFView from '@/components/PdfView/index.vue'
import { getApiUrl } from '@/utils/utils'

import businesslicense from '@/views/lpm/businesslicense/view.vue'
import mainmember from '@/views/lpm/mainmember/view.vue'
import capital from '@/views/lpm/capital/view.vue'
import administrativelicense from '@/views/lpm/administrativelicense/view.vue'
import tallage from '@/views/lpm/tallage/view.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: {
    PDFView,
    businesslicense,
    mainmember,
    capital,
    administrativelicense,
    tallage
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
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],

      id: '',
      /* 企业变更信息模块 */
      companyModifyData: [], // 企业变更信息数据
      companyModifyDataAll: [], // 全部企业变更信息数据
      fileDialogVisible: false, // 文件列表弹出框
      currentCompanyModify: {}, // 当前变更对象
      newFilesListObj: {}, // 文件列表汇总
      noAccessoryCause: '', // 无附件原因
      companyModifyTypeOptions: [{
        value: 'enterpriseNameState',
        label: '企业名称变更'
      }, {
        value: 'legalRepresentativeState',
        label: '法人变更'
      }, {
        value: 'registeredAddressState',
        label: '地址变更'
      }, {
        value: 'registeredCapitalState',
        label: '注册资本变更'
      }, {
        value: 'ownershipState',
        label: '改制'
      }, {
        value: 'liquidationExitState',
        label: '股权清算退出'
      }, {
        value: 'operatingPeriodEndState',
        label: '经营期限变更'
      }, {
        value: 'businessScopeState',
        label: '经营范围变更'
      }, {
        value: 'constitutionState',
        label: '章程变更'
      }, {
        value: 'chairmanState',
        label: '董事长变更'
      }, {
        value: 'generalManagerState',
        label: '经理变更'
      }, {
        value: 'directorState',
        label: '董事变更'
      }, {
        value: 'supervisorState',
        label: '监事变更'
      }, {
        value: 'shareholderModifyState',
        label: '股东变更'
      }],
      filterText: '',
      filesData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '变更文件',
      src: '',
      generalFileTypeArr: [
        'businessLicenseFiles', // 10营业执照
        'companyArticlesAssociationFiles', // 5公司章程
        'shareholdersDecideFiles', // 3股东会决议
        'seniorManagementFiles', // 4董事会决议
        'stockPledgeFiles' // 16质权合同
      ],
      generalFileTypeObj: [
        { 'businessLicenseFiles': '营业执照' }, // 10营业执照
        { 'companyArticlesAssociationFiles': '公司章程' }, // 5公司章程
        { 'shareholdersDecideFiles': '股东会决议' }, // 3股东会决议
        { 'seniorManagementFiles': '董事会决议' }, // 4董事会决议
        { 'stockPledgeFiles': '质权合同' } // 16质权合同
      ],
      fileTypeArr: [
        'accessoryFiles', // 1内部审批文件
        'companyReferenceRegisterFiles', // 2工商申请表
        'shareholdersDecideFiles', // 3股东会决议
        'seniorManagementFiles', // 4董事会决议
        'companyArticlesAssociationFiles', // 5公司章程
        'appointDismissFiles', // 6任职免职书
        'promiseFiles', // 7住所使用证明
        'delegationFiles', // 8股权转让合同
        'approvalFiles', // 9核准文件
        'businessLicenseFiles', // 10营业执照
        'sealFiles', // 11印章备案文件
        'openAccountFiles', // 12开户许可证
        'orgCreditCodeFiles', // 13机构信用代码证
        'authorizationFiles', // 14外商投资批准文件（批复和批准证书）或备案文件
        'companyModifyRegisterFiles', // 15外商投资企业变更备案回执
        'stockPledgeFiles', // 16质权合同
        'liquidationFiles', // 17清算报告
        'liquidationPersonFiles', // 18清算组成员备案通知书
        'tallageFiles', // 19清税证明
        'noticeFiles', // 20公告报纸样张
        'otherFiles'], // 21其它文件
      fileTypeObj: [
        { 'accessoryFiles': '1、内部审批文件' },
        { 'companyReferenceRegisterFiles': '2、工商申请表' },
        { 'shareholdersDecideFiles': '3、股东会决议' },
        { 'seniorManagementFiles': '4、董事会决议' },
        { 'companyArticlesAssociationFiles': '5、公司章程' },
        { 'appointDismissFiles': '6、任职免职书' },
        { 'promiseFiles': '7、住所使用证明' },
        { 'delegationFiles': '8、股权转让合同' },
        { 'approvalFiles': '9、核准文件' },
        { 'businessLicenseFiles': '10、营业执照' },
        { 'sealFiles': '11、印章备案文件' },
        { 'openAccountFiles': '12、开户许可证' },
        { 'orgCreditCodeFiles': '13、机构信用代码证' },
        { 'authorizationFiles': '14、外商投资批准文件（批复和批准证书）或备案文件' },
        { 'companyModifyRegisterFiles': '15、外商投资企业变更备案回执' },
        { 'stockPledgeFiles': '16、质权合同' },
        { 'liquidationFiles': '17、清算报告' },
        { 'liquidationPersonFiles': '18、清算组成员备案通知书' },
        { 'tallageFiles': '19、清税证明' },
        { 'noticeFiles': '20、公告报纸样张' },
        { 'otherFiles': '21、其它文件' }],
      companyModifyTypeValue: [],
      accessoryFilesListCompanyModify: [], // 1内部审批文件
      companyReferenceRegisterFilesListCompanyModify: [], // 2工商申请表
      shareholdersDecideFilesListCompanyModify: [], // 3股东会决议
      seniorManagementFilesListCompanyModify: [], // 4董事会决议
      companyArticlesAssociationFilesListCompanyModify: [], // 5公司章程
      appointDismissFilesListCompanyModify: [], // 6任职免职书
      promiseFilesListCompanyModify: [], // 7住所使用证明
      delegationFilesListCompanyModify: [], // 8股权转让合同
      approvalFilesListCompanyModify: [], // 9核准文件
      businessLicenseFilesListCompanyModify: [], // 10营业执照
      sealFilesListCompanyModify: [], // 11印章备案文件
      openAccountFilesListCompanyModify: [], // 12开户许可证
      orgCreditCodeFilesListCompanyModify: [], // 13机构信用代码证
      authorizationFilesListCompanyModify: [], // 14外商投资批准文件（批复和批准证书）或备案文件
      companyModifyRegisterFilesListCompanyModify: [], // 15外商投资企业变更备案回执
      stockPledgeFilesListCompanyModify: [], // 16质权合同
      liquidationFilesListCompanyModify: [], // 17清算报告
      liquidationPersonFilesListCompanyModify: [], // 18清算组成员备案通知书
      tallageFilesListCompanyModify: [], // 19清税证明
      noticeFilesListCompanyModify: [], // 20公告报纸样张
      otherFilesListCompanyModify: [], // 21其它文件

      listQuery: {
        page: 1,
        limit: 20,
        ids: ''
      },

      listCapitalModifyOldQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 0,
        id: undefined
      },
      listCapitalModifyOld: [],
      listCapitalModifyOldLoading: true,

      listCapitalModifyNewQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 1,
        id: undefined
      },
      listCapitalModifyNew: [],
      listCapitalModifyNewLoading: true,
      selCapitalModifyRow: {}
    }
  },
  computed: {
    // 表单验证
    rules() {
      return {
      }
    }
  },
  watch: {
    '$route'(newUrl, oldUrl) {
      if (newUrl !== oldUrl) {
        this.init()
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    viewPdf(item) {
      console.log(item)
      if (item.id * 1 > 21) {
        this.src = getApiUrl() + '/file/download?idFile=' + item.id + '&fileName=' + encodeURI(item.label)
      } else {
        this.$message({
          showClose: true,
          message: '您好！这是文件清单！请点击查看具体文件！'
        })
      }
    },
    init() {
      dictList({ name: '无附件原因【企业变更】' }).then(response => {
        this.noAccessoryCause = response.data[0].detail
      })
      this.getCompanyModifyList()
      // const _this = this
      // setTimeout(function() {
      //   _this.getNewFilesList()
      // }, 3000)
    },

    // 企业变更数据
    getCompanyModifyList() {
      // 获取企业的id
      const id = this.$route.query.id
      companyModify({ enterpriseId: id, page: 1, limit: 20 }).then(response => {
        var shareholderArr = ['shareholderOld', 'shareholderNew']
        this.getFilesList('CompanyModify', this.fileTypeArr, response.data, shareholderArr)
      })
    },

    // 过滤变更数据
    filterTypeList() {
      const tempModifyData = this.companyModifyDataAll
      const filterArr = this.companyModifyTypeValue
      const tempArr = []
      if (filterArr.length === 0) {
        this.companyModifyData = this.companyModifyDataAll
        return
      }
      if (tempModifyData && tempModifyData.length > 0) {
        for (let i = 0; i < tempModifyData.length; i++) {
          for (let j = 0; j < filterArr.length; j++) {
            if (tempModifyData[i][filterArr[j]] === 'true') {
              tempArr.push(tempModifyData[i])
            }
          }
        }
        this.companyModifyData = tempArr
      } else {
        this.companyModifyData = this.companyModifyDataAll
      }
    },

    // 格式化 无附件原因
    formatterNoAccessoryCause(num) {
      if (num) {
        return '备注：' + showDictLabel(this.noAccessoryCause.toString(), num)
      } else {
        return '' // '没有无附件备注原因'
      }
    },

    fetchCapitalModifyOldData(tempRecord) {
      this.listCapitalModifyOldLoading = true
      this.listCapitalModifyOldQuery.serialIdModify = tempRecord.id
      getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
        this.listCapitalModifyOld = response.data.records || []
        this.listCapitalModifyOldLoading = false
      })
    },
    fetchCapitalModifyNewData() {
      this.listCapitalModifyNewLoading = true
      this.listCapitalModifyNewQuery.serialIdModify = this.form.id
      getCapitalModifyList(this.listCapitalModifyNewQuery).then(response => {
        this.listCapitalModifyNew = response.data.records || []
        this.listCapitalModifyNewLoading = false
      })
    },

    // 获取原文列表
    async getFilesList(module, accessoryArr, record, shareholderArr) {
      const records = record
      if (records.length === 0) {
        return false
      }
      // for (let j = 0; j < accessoryArr.length; j++) {
      // const Module = module
      const listQuery = {
        page: 1,
        limit: 20
        // ids: records[0][accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
      }
      if (records.length > 0) {
        const newRecords = []
        for (let p = 0; p < records.length; p++) {
          const Module = module
          const tempRecord = records[p]
          if (tempRecord.shareholderModifyState === 'true') {
            // this.listCapitalModifyOldQuery.ids = tempRecord.shareholderIdsOld
            // getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
            //   tempRecord['shareholderOldList'] = response.data.records || []
            // })
            // this.listCapitalModifyNewQuery.ids = tempRecord.shareholderIdsNew
            // getCapitalModifyList(this.listCapitalModifyNewQuery).then(response => {
            //   tempRecord['shareholderNewList'] = response.data.records || []
            // })
            this.listCapitalModifyOldQuery.ids = tempRecord.shareholderIdsOld
            const response1 = await getCapitalModifyList(this.listCapitalModifyOldQuery)
            tempRecord['shareholderOldList'] = response1.data.records || []
            this.listCapitalModifyNewQuery.ids = tempRecord.shareholderIdsNew
            const response2 = await getCapitalModifyList(this.listCapitalModifyNewQuery)
            tempRecord['shareholderNewList'] = response2.data.records || []
          } else {
            tempRecord['shareholderOldList'] = []
            tempRecord['shareholderNewList'] = []
          }

          for (let j = 0; j < accessoryArr.length; j++) {
            if (tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')) {
              const ids = tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
              listQuery.ids = ids

              if (!listQuery.ids) {
                // console.log('没有找到：' + accessoryArr[j] + 'List' + Module + ' 相关的原文！')
              } else {
                // getListIds({
                //   page: 1,
                //   limit: 20,
                //   ids: ids
                // }).then(response => {
                //   const fileList = []
                //   for (let i = 0; i < response.data.records.length; i++) {
                //     const file = {}
                //     file.id = response.data.records[i].id
                //     file.name = response.data.records[i].originalFileName
                //     fileList.push(file)
                //   }
                //   tempRecord[accessoryArr[j] + 'List' + Module] = fileList
                //   if (records.length === p + 1) {
                //     this.companyModifyData = []
                //     this.companyModifyData = newRecords
                //     console.log('companyModifyData:', this.companyModifyData)
                //   }
                // })
                const response3 = await getListIds({
                  page: 1,
                  limit: 20,
                  ids: ids
                })
                const fileList = []
                for (let i = 0; i < response3.data.records.length; i++) {
                  const file = {}
                  file.id = response3.data.records[i].id
                  file.name = response3.data.records[i].originalFileName
                  fileList.push(file)
                }
                tempRecord[accessoryArr[j] + 'List' + Module] = fileList
                if (records.length === p + 1) {
                  this.companyModifyData = []
                  this.companyModifyData = newRecords
                  this.companyModifyDataAll = []
                  this.companyModifyDataAll = newRecords
                }
              }
            }
          }

          newRecords.push(tempRecord)
        }
      }
      // }
    },

    // 弹出单条变更记录的文件列表
    openFilesDialog(results) {
      this.fileDialogVisible = true
      this.currentCompanyModify = results
      this.title = '本次变更文件'
      this.initFilesList(results, this.fileTypeArr, this.fileTypeObj)
    },

    initFilesList(results, fileTypeArr, fileTypeObj) {
      const tempArr = []
      let flag = true
      for (let i = 0; i < fileTypeArr.length; i++) {
        const mainObj = {}
        mainObj.id = '' + i
        mainObj.label = fileTypeObj[i][fileTypeArr[i]]
        if (results[fileTypeArr[i] + 'ListCompanyModify'] && results[fileTypeArr[i] + 'ListCompanyModify'].length > 0) {
          const newArr = []
          const arr = results[fileTypeArr[i] + 'ListCompanyModify']
          for (let j = 0; j < arr.length; j++) {
            if (j === 0 && flag) {
              flag = false
              this.src = getApiUrl() + '/file/download?idFile=' + arr[0].id + '&fileName=' + encodeURI(arr[0].label)
            }
            const sonObj = {}
            sonObj.id = arr[j].id
            sonObj.label = arr[j].name
            newArr.push(sonObj)
          }
          mainObj.children = newArr
        } else {
          mainObj.children = []
        }
        if (mainObj.children && mainObj.children.length > 0) {
          tempArr.push(mainObj)
        }
      }
      this.filesData = tempArr
    },

    // 打开全部文件
    openAllFilesDialog() {
      if (this.companyModifyDataAll && this.companyModifyDataAll.length > 0 && this.newFilesListObj) {
        this.$message({
          message: '成功获取到最新的公司相关文件！请查看！',
          type: 'success'
        })
        this.getNewFilesList()
        this.fileDialogVisible = true
        this.currentCompanyModify = this.newFilesListObj
        this.title = '公司最新文件'
        this.initFilesList(this.newFilesListObj, this.generalFileTypeArr, this.generalFileTypeObj)
      } else {
        this.$message('没有找到相关文件！')
      }
    },

    // 最新文件列表
    getNewFilesList() {
      const tempObj = {}
      if (this.companyModifyDataAll && this.companyModifyDataAll.length > 0) {
        const data = this.companyModifyDataAll
        const len = data.length - 1
        for (let i = len; i >= 0; i--) {
          for (let j = 0; j < this.fileTypeArr.length; j++) {
            if (data[i][this.fileTypeArr[j]] !== '' && data[i][this.fileTypeArr[j] + 'ListCompanyModify'] !== '') {
              tempObj[this.fileTypeArr[j] + 'ListCompanyModify'] = data[i][this.fileTypeArr[j] + 'ListCompanyModify']
            }
          }
        }
        this.newFilesListObj = tempObj
      } else {
        console.log('数据还没有请求完成')
      }
    }
  }
}
</script>
