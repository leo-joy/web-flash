<template>
  <div>
    <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group>
    <el-tabs :tab-position="tabPosition" style="height: auto;">
      <el-tab-pane label="营业执照"><div><edit /></div></el-tab-pane>
      <el-tab-pane label="主要人员信息"><mainmember /></el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import edit from '@/views/lpm/businesslicense/edit.vue'
import mainmember from '@/views/lpm/mainmember/index.vue'

export default {
  name: 'CompanyLayout',
  components: {
    edit,
    mainmember
  },
  data() {
    return {
      tabPosition: 'left'
    }
  }
}
</script>
