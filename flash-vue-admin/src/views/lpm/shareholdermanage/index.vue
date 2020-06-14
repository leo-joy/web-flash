<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="投资股东" name="first">
        <div class="block">
          <el-row>
            <el-col :span="10">
              <el-button
                v-permission="['/businesslicense/add']"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="add3"
              >{{ $t('button.add') }}</el-button>
              <el-button
                v-permission="['/businesslicense/edit']"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <el-button
                v-permission="['/businesslicense/delete']"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button>
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" size="small" placeholder="请输入搜索企业名称" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
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
          <el-table-column
            type="index"
            width="55"
          />
          <el-table-column label="企业名称">
            <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
          </el-table-column>
          <el-table-column label="统一社会信用代码" width="200">
            <template slot-scope="scope">{{ scope.row.unifiedSocialCreditCode }}</template>
          </el-table-column>
          <el-table-column label="法定代表人" width="150">
            <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
          </el-table-column>
          <el-table-column label="成立日期" width="150">
            <template slot-scope="scope">{{ scope.row.setupDate.replace(' 00:00:00','') }}</template>
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
      <el-tab-pane label="香港及境外股东" name="second">
        <div class="block">
          <el-row>
            <el-col :span="10">
              <el-button
                v-permission="['/businesslicense/add']"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="add2"
              >{{ $t('button.add') }}</el-button>
              <el-button
                v-permission="['/businesslicense/edit']"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <el-button
                v-permission="['/businesslicense/delete']"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button>
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" size="small" placeholder="请输入搜索企业名称" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
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
          <el-table-column label="企业名称">
            <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
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
      <el-tab-pane label="体外公司" name="four">
        <div class="block">
          <el-row>
            <el-col :span="10">
              <el-button
                v-permission="['/businesslicense/add']"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="add4"
              >{{ $t('button.add') }}</el-button>
              <el-button
                v-permission="['/businesslicense/edit']"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <el-button
                v-permission="['/businesslicense/delete']"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button>
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" size="small" placeholder="请输入搜索企业名称" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
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
            width="250"
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
      <el-tab-pane label="投资企业" name="five">
        <div class="block">
          <el-row>
            <el-col :span="10">
              <!-- <el-button
                v-permission="['/businesslicense/add']"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="add5"
              >{{ $t('button.add') }}</el-button> -->
              <el-button
                v-permission="['/businesslicense/edit']"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <!-- <el-button
                v-permission="['/businesslicense/delete']"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button> -->
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" size="small" placeholder="请输入搜索企业名称" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
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
            width="250"
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
      <el-tab-pane label="OA 新注册" name="six">
        <div class="block">
          <el-row>
            <el-col :span="10">
              <!-- <el-button
                v-permission="['/businesslicense/add']"
                type="success"
                size="small"
                icon="el-icon-plus"
                @click.native="add6"
              >{{ $t('button.add') }}</el-button> -->
              <el-button
                v-permission="['/businesslicense/edit']"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.native="edit"
              >{{ $t('button.edit') }}</el-button>
              <!-- <el-button
                v-permission="['/businesslicense/delete']"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click.native="remove"
              >{{ $t('button.delete') }}</el-button> -->
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" size="small" placeholder="请输入搜索企业名称" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
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
            width="250"
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
    </el-tabs>
  </div>
</template>
<script src="./shareholdermanage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
