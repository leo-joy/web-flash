<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="my-table"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="企业名称">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{ scope.row.enterpriseName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="法定代表人" width="150">
        <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
      </el-table-column>
      <el-table-column label="注册资本（万元）" width="150">
        <template slot-scope="scope">{{ scope.row.registeredCapital }}</template>
      </el-table-column>
      <el-table-column label="成立日期" width="150">
        <template slot-scope="scope">{{ scope.row.setupDate.replace(' 00:00:00','') }}</template>
      </el-table-column>
      <el-table-column label="营业期限至" width="150">
        <template slot-scope="scope">{{ scope.row.operatingPeriodEnd.replace(' 00:00:00','') }}</template>
      </el-table-column>
      <el-table-column
        prop="registrationStatus"
        label="登记状态"
        width="100"
        :formatter="formatterRegistrationStatus"
      />

    </el-table>
    <br>
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
    />
  </div>
</template>

<script src="./liquidation.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.my-table >>> td {
  padding: 0 0;
}
</style>

