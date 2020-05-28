<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="listQuery.name" size="mini" placeholder="请输入角色名称" />
        </el-col>
        <el-col :span="6">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-setting" @click.native="openPermissions">权限配置</el-button>
          <el-button type="primary" size="mini" icon="el-icon-setting" @click.native="openCompanyPermissions">公司权限配置</el-button>
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

      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="scope">
          {{ scope.row.tips }}
        </template>
      </el-table-column>
      <el-table-column label="所在部门">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column label="上级角色">
        <template slot-scope="scope">
          {{ scope.row.pName }}
        </template>
      </el-table-column>

    </el-table>

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

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码" prop="tips">
              <el-input v-model="form.tips" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" minlength="1" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="上级角色">
              <el-input
                v-model="form.pName"
                placeholder="请选择上级角色"
                readonly="readonly"
                @click.native="roleTree.show = !roleTree.show"
              />
              <el-tree
                v-if="roleTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="list"
                :props="roleTree.defaultProps"
                class="input-tree"
                @node-click="handleRoleNodeClick"
              />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model="form.num" type="number" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所在部门">
              <el-input
                v-model="form.deptName"
                placeholder="请选择所在部门"
                readonly="readonly"
                @click.native="deptTree.show = !deptTree.show"
              />
              <el-tree
                v-if="deptTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="deptList"
                :props="deptTree.defaultProps"
                class="input-tree"
                @node-click="handleDeptNodeClick"
              />

            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="功能权限配置" :visible.sync="permissonVisible" width="40%">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button size="mini" type="primary" @click="savePermissions">保存权限配置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-tree
              ref="permissonTree"
              empty-text="暂无数据"
              :data="permissons"
              show-checkbox
              node-key="id"
              :default-checked-keys="checkedPermissionKeys"
              :props="defaultProps"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <br>
              <el-button size="mini" type="primary" @click="savePermissions">保存权限配置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="公司权限配置" :visible.sync="permissonCompanyVisible" width="80%">
      <el-row>
        <el-col :span="18">
          <el-input
            v-model="companyListQuery.deptName"
            placeholder="请选择所在部门"
            readonly="readonly"
            @click.native="deptTree.show = !deptTree.show"
          />
          <el-tree
            v-if="deptTree.show"
            style="height:300px"
            empty-text="暂无数据"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :data="deptList"
            :props="deptTree.defaultProps"
            class="input-tree"
            @node-click="handleCompanyDeptNodeClick"
          />
        </el-col>
      </el-row>
      <br>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-select v-model="searchType" placeholder="搜索类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input v-model="keyword" placeholder="请输入搜索关键字" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            icon="el-icon-search"
            @click.native="searchCompany"
          >{{ $t('button.search') }}</el-button>
          <el-button type="primary" @click="saveCompanyPermissions">{{ $t('button.submit') }}</el-button>
        </el-col>
      </el-row>
      <br>
      <el-table
        ref="companytable"
        v-loading="companyListLoading"
        :data="companyList"
        height="550"
        element-loading-text="Loading"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column label="企业名称">
          <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
        </el-table-column>
        <el-table-column label="统一社会信用代码" width="200">
          <template slot-scope="scope">{{ scope.row.unifiedSocialCreditCode }}</template>
        </el-table-column>
        <el-table-column label="法定代表人" width="120">
          <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
        </el-table-column>
        <el-table-column label="成立日期" width="120">
          <template slot-scope="scope">{{ scope.row.setupDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50, 100, 500, 1500]"
        :page-size="companyListQuery.limit"
        :total="companyTotal"
        @size-change="changeCompanySize"
        @current-change="fetchCompanyPage"
        @prev-click="fetchCompanyPrev"
        @next-click="fetchCompanyNext"
      />
    </el-dialog>

  </div>
</template>

<script src="./role.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
  .el-tree-node__children .el-tree-node {
    float: left;
  }
</style>
