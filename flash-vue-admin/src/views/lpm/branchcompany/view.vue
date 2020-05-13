<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="branchcompanyData" style="width: 100%">
        <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="200" />
        <el-table-column prop="enterpriseName" label="企业名称" />
        <el-table-column prop="legalRepresentative" label="法定代表人" width="120" />
        <el-table-column label="详情" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<style lang="scss">
</style>
<script src="./view.js"></script>
