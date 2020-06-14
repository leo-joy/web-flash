<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/investcompany/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/investcompany/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/investcompany/delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click.native="investCompanySyn"
          >同步企查查</el-button>
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
      <el-table-column label="企业名称" width="400">
        <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
      </el-table-column>
      <el-table-column label="投资公司编码" width="120">
        <template slot-scope="scope">{{ scope.row.branchCompanyCode }}</template>
      </el-table-column>
      <el-table-column label="被投资公司名称">
        <template slot-scope="scope">{{ scope.row.branchCompanyName }}</template>
      </el-table-column>
      <el-table-column label="法人" width="100">
        <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    />

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司名称" prop="enterpriseName">
              <el-input
                v-model="form.enterpriseName"
                :disabled="true"
                placeholder="请选择公司"
                readonly="readonly"
                @click.native="companyTree.show = (!companyTree.show && false)"
              />
              <el-tree
                v-if="companyTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="companyList"
                :props="companyTree.defaultProps"
                class="input-tree"
                @node-click="handleCompanyNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" />
          <el-col :span="24">
            <el-form-item label="请选择被投资公司" prop="branchCompanyName">
              <el-autocomplete
                v-model="form.branchCompanyName"
                popper-class="my-autocomplete"
                style="min-width:600px;line-height:10px;"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入被投资公司名称"
                @select="handleBranchCompanySelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClick"
                />
                <template slot-scope="{ item }" style="width:300px">
                  <div class="name">{{ item.enterpriseName }}</div>
                  <span
                    class="addr"
                  >法人：{{ item.legalRepresentative }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span class="addr">地址：{{ item.businessAddress }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认缴金额（万元）" prop="realityCapitalContribution">
              <el-input v-model.number="form.realityCapitalContribution" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="股权占比（%）" prop="proportion">
              <el-slider v-model="form.proportion" show-input />
            </el-form-item>
          </el-col>
          
        </el-row>
        <br>
        <br>
        <br>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./invest_company.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.my-autocomplete {
  li {
    line-height: 10px;
    padding: 5px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

