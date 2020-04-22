<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click.native="apply">{{ $t('button.apply') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
    <el-table-column
        prop="registrationStatus"
        label="登记状态"
        width="100"
        :formatter="formatterRegistrationStatus"
      ></el-table-column>
      <el-table-column label="统一社会信用代码" width="200">
        <template slot-scope="scope">{{scope.row.unifiedSocialCreditCode}}</template>
      </el-table-column>
      <el-table-column :label="$t('businesslicense.enterpriseName')" width="300">
        <template slot-scope="scope">{{scope.row.enterpriseName}}</template>
      </el-table-column>
      <el-table-column :label="$t('businesslicense.enterpriseCode')" width="150">
        <template slot-scope="scope">{{scope.row.enterpriseCode}}</template>
      </el-table-column>
      <el-table-column prop="type" label="企业类型" width="150" :formatter="formatterEnterpriseType"></el-table-column>

      <el-table-column label="法定代表人" width="150">
        <template slot-scope="scope">{{scope.row.legalRepresentative}}</template>
      </el-table-column>
      <el-table-column label="注册资本" width="100">
        <template slot-scope="scope">{{scope.row.registeredCapital}}</template>
      </el-table-column>
      <el-table-column label="成立日期" width="150">
        <template slot-scope="scope">{{scope.row.setupDate.replace(' 00:00:00','')}}</template>
      </el-table-column>
      <el-table-column label="营业期限自" width="150">
        <template slot-scope="scope">{{scope.row.operatingPeriodFrom.replace(' 00:00:00','')}}</template>
      </el-table-column>
      <el-table-column label="营业期限至" width="150">
        <template slot-scope="scope">{{scope.row.operatingPeriodEnd.replace(' 00:00:00','')}}</template>
      </el-table-column>
      <el-table-column label="登记机关" width="200">
        <template slot-scope="scope">{{scope.row.registrationAuthority}}</template>
      </el-table-column>
      <el-table-column label="核准日期" width="150">
        <template slot-scope="scope">{{scope.row.approvalDate.replace(' 00:00:00','')}}</template>
      </el-table-column>
      
    </el-table>
    <br />
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    ></el-pagination>
  </div>
</template>

<script src="../../lpm/businesslicense/businesslicense.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

