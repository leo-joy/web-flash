<template>
  <div>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="22">
        <h2 style="color:#176c6b;margin:10px 0 0 0;">{{ businesslicenseData.enterpriseName }}</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="8">
        <h4>统一社会信用代码：{{ businesslicenseData.unifiedSocialCreditCode }}</h4>
      </el-col>
      <el-col :span="5">
        <h4>法定代表人：{{ businesslicenseData.legalRepresentative }}</h4>
      </el-col>
      <el-col :span="5">
        <h4>成立日期：{{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</h4>
      </el-col>
    </el-row>
    <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group> -->
    <el-tabs :tab-position="tabPosition" type="border-card">
      <el-tab-pane label="基本信息"><div><edit @viewfile="viewfile" /></div></el-tab-pane>
      <el-tab-pane label="主要人员信息"><mainmember @viewfile="viewfile" /></el-tab-pane>
      <!-- <el-tab-pane label="股东信息"><shareholder /></el-tab-pane> -->
      <el-tab-pane label="印章信息"><seal @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="年报信息"><annals @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="股权及出资信息"><capital @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="行政许可信息"><administrativelicense @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="行政处罚信息"><administrativepunish @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="证照废弃声明"><certificatecancel @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="清算信息"><liquidation @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="分公司信息"><branchcompany /></el-tab-pane>
      <el-tab-pane label="投资企业"><investcompany /></el-tab-pane>
      <el-tab-pane label="动产抵押登记"><propertypledge @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="股权出质登记"><stockpledge @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="知识产权出质登记"><knowledgepledge @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="商标信息"><trademark @viewfile="viewfile" /></el-tab-pane>
      <el-tab-pane label="税务信息"><tallage @viewfile="viewfile" /></el-tab-pane>
    </el-tabs>
    <el-dialog title="原文查看" :visible.sync="pdfVisible" width="60%">
      <template>
        <PDFView :src="src" />
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.dp-row {
  padding: 10px;
}

</style>
<script>
import { get as getBusinesslicense } from '@/api/lpm/businesslicense'

import { getApiUrl } from '@/utils/utils'
import PDFView from '@/components/PdfView/index.vue'

import edit from '@/views/lpm/businesslicense/edit.vue'
import mainmember from '@/views/lpm/mainmember/index.vue'
// import shareholder from '@/views/lpm/shareholder/index.vue'
import seal from '@/views/lpm/seal/index.vue'
import annals from '@/views/lpm/annals/index.vue'
import capital from '@/views/lpm/capital/index.vue'
import administrativelicense from '@/views/lpm/administrativelicense/index.vue'
import administrativepunish from '@/views/lpm/administrativepunish/index.vue'
import certificatecancel from '@/views/lpm/certificatecancel/index.vue'
import liquidation from '@/views/lpm/liquidation/index.vue'
import branchcompany from '@/views/lpm/branchcompany/index.vue'
import investcompany from '@/views/lpm/investcompany/index.vue'
import propertypledge from '@/views/lpm/propertypledge/index.vue'
import stockpledge from '@/views/lpm/stockpledge/index.vue'
import knowledgepledge from '@/views/lpm/knowledgepledge/index.vue'
import trademark from '@/views/lpm/trademark/index.vue'
import tallage from '@/views/lpm/tallage/index.vue'
export default {
  name: 'CompanyLayout',
  components: {
    edit,
    mainmember,
    // shareholder,
    seal,
    annals,
    capital,
    administrativelicense,
    administrativepunish,
    certificatecancel,
    liquidation,
    branchcompany,
    investcompany,
    propertypledge,
    stockpledge,
    knowledgepledge,
    trademark,
    tallage,
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
