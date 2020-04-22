<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="香港及境外股东" name="first">
          <div class="block">
          <el-row>
            <el-col :span="24">
              <el-button
                type="success"
                icon="el-icon-plus"
                @click.native="addHK"
              >{{ $t('button.add') }}</el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button>
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
          <el-table-column label="统一社会信用代码" width="200">
            <template slot-scope="scope">{{scope.row.unifiedSocialCreditCode}}</template>
          </el-table-column>
          <el-table-column label="企业名称" width="400">
            <template slot-scope="scope">{{scope.row.enterpriseName}}</template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="企业类型"
            width="250"
            :formatter="formatterEnterpriseType"
          ></el-table-column>

          <el-table-column label="法定代表人" width="150">
            <template slot-scope="scope">{{scope.row.legalRepresentative}}</template>
          </el-table-column>
          <el-table-column label="注册资本" width="100">
            <template slot-scope="scope">{{scope.row.registeredCapital}}</template>
          </el-table-column>
          <el-table-column label="成立日期" width="150">
            <template slot-scope="scope">{{scope.row.setupDate.replace(' 00:00:00','')}}</template>
          </el-table-column>
          <el-table-column label="登记机关" width="300">
            <template slot-scope="scope">{{scope.row.registrationAuthority}}</template>
          </el-table-column>
          <el-table-column label="核准日期" width="150">
            <template slot-scope="scope">{{scope.row.approvalDate.replace(' 00:00:00','')}}</template>
          </el-table-column>
          <el-table-column
            prop="registrationStatus"
            label="登记状态"
            width="100"
            :formatter="formatterRegistrationStatus"
          ></el-table-column>
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
      </el-tab-pane> -->
      <el-tab-pane label="第三方公司股东" name="second">
        <div class="block">
          <el-row>
            <el-col :span="24">
              <el-button
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="addOther"
              >{{ $t('button.add') }}</el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button>
            </el-col>
          </el-row>
        </div>

        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column label="统一社会信用代码" width="200">
            <template slot-scope="scope">{{ scope.row.unifiedSocialCreditCode }}</template>
          </el-table-column>
          <el-table-column label="企业名称" width="400">
            <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="企业类型"
            width="150"
            :formatter="formatterEnterpriseType"
          />

          <el-table-column label="法定代表人" width="150">
            <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
          </el-table-column>
          <el-table-column label="注册资本" width="100">
            <template slot-scope="scope">{{ scope.row.registeredCapital }}</template>
          </el-table-column>
          <el-table-column label="成立日期" width="150">
            <template slot-scope="scope">{{ scope.row.setupDate.replace(' 00:00:00','') }}</template>
          </el-table-column>
          <el-table-column label="登记机关" width="300">
            <template slot-scope="scope">{{ scope.row.registrationAuthority }}</template>
          </el-table-column>
          <el-table-column label="核准日期" width="150">
            <template slot-scope="scope">{{ scope.row.approvalDate.replace(' 00:00:00','') }}</template>
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
      </el-tab-pane>
      <el-tab-pane label="自然人股东" name="third">
        <advanced-user user-type-value="2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script src="./shareholdermanage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
