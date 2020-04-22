<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
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
      <el-table-column label="调用系统">
        <template slot-scope="scope">
          {{ scope.row.callSystem }}
        </template>
      </el-table-column>
      <el-table-column label="调用系统名称">
        <template slot-scope="scope">
          {{ scope.row.callSystemName }}
        </template>
      </el-table-column>
      <el-table-column label="所属企业编码">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="所属企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="所属表">
        <template slot-scope="scope">
          {{ scope.row.tableCode }}
        </template>
      </el-table-column>
      <el-table-column label="所属表名称">
        <template slot-scope="scope">
          {{ scope.row.tableName }}
        </template>
      </el-table-column>
      <el-table-column label="所属字段">
        <template slot-scope="scope">
          {{ scope.row.fieldCode }}
        </template>
      </el-table-column>
      <el-table-column label="所属字段名称">
        <template slot-scope="scope">
          {{ scope.row.fieldName }}
        </template>
      </el-table-column>
      <el-table-column label="字段历史值">
        <template slot-scope="scope">
          {{ scope.row.fieldOldValue }}
        </template>
      </el-table-column>
      <el-table-column label="字段新值">
        <template slot-scope="scope">
          {{ scope.row.fieldNewValue }}
        </template>
      </el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          {{ scope.row.accessoryFiles }}
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
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="调用系统">
              <el-input v-model="form.callSystem" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用系统名称">
              <el-input v-model="form.callSystemName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属企业编码">
              <el-input v-model="form.enterpriseCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属企业名称">
              <el-input v-model="form.enterpriseName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属表">
              <el-input v-model="form.tableCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属表名称">
              <el-input v-model="form.tableName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属字段">
              <el-input v-model="form.fieldCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属字段名称">
              <el-input v-model="form.fieldName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段历史值">
              <el-input v-model="form.fieldOldValue" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段新值">
              <el-input v-model="form.fieldNewValue" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详情">
              <el-input v-model="form.accessoryFiles" minlength="1" />
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

<script src="./modify_log.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

