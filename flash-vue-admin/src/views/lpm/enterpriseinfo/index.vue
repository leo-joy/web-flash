<template>
  <div class="app-container">
    <div class="block">
      <!-- <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="5">
          <el-input v-model="filterText" class="filterInput" placeholder="输入关键字进行树过滤" />
          <div ref="treecontainer" class="filter-tree">
            <el-tree
              ref="tree"
              :data="deptTree.data"
              :props="deptTree.defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="handleLeftNodeClick"
            />
          </div>

        </el-col>
        <el-col :span="19">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-select v-model="searchType" placeholder="搜索类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="11">
              <el-input v-model="keyword" placeholder="请输入搜索关键字" />
            </el-col>

            <el-col :span="9">
              <el-button
                type="success"
                icon="el-icon-search"
                @click.native="search"
              >{{ $t('button.search') }}</el-button>
              <el-button
                v-permission="['/lpm/businesslicenseEdit']"
                type="success"
                icon="el-icon-add"
                @click.native="addCompany('/lpm/businesslicenseEdit')"
              >{{ $t('button.add') }}</el-button>
              <el-button
                v-permission="['/businesslicense/ca']"
                type="primary"
                @click.native="businessCirclesSynErgodic()"
              >{{ $t('button.businessCirclesSyn') }}</el-button>
            </el-col>

          </el-row>
          <br>
          <el-table
            v-loading="listLoading"
            :data="list"
            height="550"
            element-loading-text="Loading"
            border
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" width="50" />
            <el-table-column label="企业编码">
              <template slot-scope="scope">{{ scope.row.enterpriseCode }}</template>
            </el-table-column>
            <el-table-column label="企业名称">
              <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
            </el-table-column>
            <el-table-column label="社会信用代码">
              <template slot-scope="scope">{{ scope.row.unifiedSocialCreditCode }}</template>
            </el-table-column>
            <el-table-column label="法定代表人">
              <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
            </el-table-column>
            <el-table-column
              prop="registrationStatus"
              label="登记状态"
              width="100"
              :formatter="formatterRegistrationStatus"
            />
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-permission="['/lpm/businesslicenseEdit']" type="text" @click="edit(scope.row.id)">{{ $t('button.edit') }}</el-button>
                <el-button type="text" @click="detail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
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
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="组织属性">
              <el-input
                v-model="form.pname"
                placeholder="请选择组织属性"
                readonly="readonly"
                @click.native="deptTree.show = !deptTree.show"
              />
              <el-tree
                v-if="deptTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="deptTree.data"
                :props="deptTree.defaultProps"
                class="input-tree"
                @node-click="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称">
              <el-input v-model="form.enterpriseName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业类型">
              <el-input v-model="form.type" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-input v-model="form.status" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./enterprise_info.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.filterInput {
  width: 90%
}
.filter-tree {
  overflow-y: auto;
  height: 500px;
}
</style>

