<template>
  <div>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="22">
        <h2 style="color:#176c6b;margin:10px 0 0 0;">{{ businesslicenseData.enterpriseName }}</h2>
        <h4 style="color:#176c6b;margin-top:0px">{{ businesslicenseData.enterpriseNameEn }}</h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="7">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">公司编号<br>Company Number&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.unifiedSocialCreditCode }}</h4>
      </el-col>
      <el-col :span="7">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">成立日期<br>Register Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</h4>
      </el-col>
      <el-col :span="9">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">注册地<br>Place of Incorporation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[0]:'' }} <br> {{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[1]:'' }}</h4>
      </el-col>
    </el-row>
    <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group> -->
    <el-tabs :tab-position="tabPosition" type="border-card">
      <el-tab-pane label="基本信息"><div><editHw @viewfile="viewfile" /></div></el-tab-pane>
      <el-tab-pane label="股东信息"><capital @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="董事信息"><mainmember @viewfile="viewfile" /></el-tab-pane>
      
    </el-tabs>
    <el-dialog title="原文查看" :visible.sync="pdfVisible" width="60%">
      <template>
        <PDFView :src="src" />
      </template>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.dp-row {
  padding: 10px;
}

.item-label {
  color:#606266;
  float:left;
  line-height:20px;
}

</style>
<script>
import { get as getBusinesslicense } from '@/api/lpm/businesslicense'

import { getApiUrl } from '@/utils/utils'
import PDFView from '@/components/PdfView/index.vue'

import editHw from '@/views/lpm/businesslicense/edit-hw.vue'
import mainmember from '@/views/lpm/mainmember/index.vue'
import capital from '@/views/lpm/capital/index-hw.vue'

export default {
  name: 'CompanyLayout',
  components: {
    editHw,
    mainmember,
    capital,
    PDFView
  },
  data() {
    return {
      tabPosition: 'left',
      src: '',
      pdfTitle: '原文查看器',
      pdfVisible: false,
      listLoading: false,
      /* 营业执照模块 */
      businesslicenseData: {} // 营业执照的相关信息
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化功能权限
    init() {
      // 获取企业的id
      const id = this.$route.query.id
      // 请求营业执照信息
      getBusinesslicense(id).then(response => {
        this.businesslicenseData = response.data
        this.logTitle = '【 ' + response.data.enterpriseName + ' 】'
      })
    },
    viewfile(id, fileName) {
      this.pdfVisible = true
      this.src =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + fileName
    }
  }
}
</script>
