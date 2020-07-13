<template>
  <div style="background-color:#fffff;border:1px #efefef dotted;margin:5px;">
    <div style="padding:5px 10px;">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <i class="header-icon el-icon-notebook-1" /> 营业执照信息
          </template>
          <div><businesslicense /></div>
        </el-collapse-item>
        <el-collapse-item name="2">
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
    </div>
  </div>
</template>
<script>
import businesslicense from '@/views/lpm/businesslicense/view.vue'
import mainmember from '@/views/lpm/mainmember/view.vue'
import capital from '@/views/lpm/capital/view.vue'
import administrativelicense from '@/views/lpm/administrativelicense/view.vue'
import tallage from '@/views/lpm/tallage/view.vue'

export default {
  components: {
    businesslicense,
    mainmember,
    capital,
    administrativelicense,
    tallage
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5']
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>
