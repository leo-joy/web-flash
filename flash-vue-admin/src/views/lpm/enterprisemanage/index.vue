<template>
  <div>
    <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group> -->
    <el-tabs :tab-position="tabPosition" style="height: auto;padding-top:10px">
      <el-tab-pane label="营业执照"><div><edit /></div></el-tab-pane>
      <el-tab-pane label="主要人员信息"><mainmember /></el-tab-pane>
      <el-tab-pane label="股东信息"><shareholder /></el-tab-pane>
      <el-tab-pane label="印章信息"><seal /></el-tab-pane>
      <el-tab-pane label="年报信息"><annals /></el-tab-pane>
      <el-tab-pane label="股权及出资信息"><capital /></el-tab-pane>
      <el-tab-pane label="行政许可信息"><administrativelicense /></el-tab-pane>
      <el-tab-pane label="行政处罚信息"><administrativepunish /></el-tab-pane>
      <el-tab-pane label="证照废弃声明"><certificatecancel /></el-tab-pane>
      <el-tab-pane label="清算信息"><liquidation /></el-tab-pane>
      <el-tab-pane label="分公司信息"><branchcompany /></el-tab-pane>
      <el-tab-pane label="投资企业"><investcompany /></el-tab-pane>
      <el-tab-pane label="动产抵押登记"><propertypledge /></el-tab-pane>
      <el-tab-pane label="知识产权出质登记"><stockpledge /></el-tab-pane>
      <el-tab-pane label="商标信息"><trademark /></el-tab-pane>
      <el-tab-pane label="税务信息"><tallage /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import edit from '@/views/lpm/businesslicense/edit.vue'
import mainmember from '@/views/lpm/mainmember/index.vue'
import shareholder from '@/views/lpm/shareholder/index.vue'
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
import trademark from '@/views/lpm/trademark/index.vue'
import tallage from '@/views/lpm/tallage/index.vue'
export default {
  name: 'CompanyLayout',
  components: {
    edit,
    mainmember,
    shareholder,
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
    trademark,
    tallage,
  },
  data() {
    return {
      tabPosition: 'left'
    }
  }
}
</script>
