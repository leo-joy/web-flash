<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
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
      <el-table-column label="股东">
        <template slot-scope="scope">
          {{ scope.row.shareholder }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="subscribedCapitalType"
        label="认缴出资方式"
        width="150"
        :formatter="formatterSubscribedCapitalType"
      /> -->
      <el-table-column label="认缴出资额（万元）" width="150">
        <template slot-scope="scope">
          {{ scope.row.subscribedCapitalContribution }}
        </template>
      </el-table-column>
      <el-table-column label="认缴出资日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.subscribedCapitalDate.replace(' 00:00:00','') }}
        </template>
      </el-table-column>
      <el-table-column label="备注信息">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="formTitle"
      :visible.sync="subcribeFormVisible"
      :modal="false"
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="所属企业编码">
              <el-input v-model="form.enterpriseCode" minlength="1" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="企业名称">
              <el-input v-model="form.enterpriseName" disabled="true" minlength="1" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="股权序号">
              <el-input v-model="form.serialNumber" minlength="1" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="股东">
              <el-input v-model="form.shareholder" disabled="true" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认缴出资方式" prop="subscribedCapitalType">
              <el-select v-model="form.subscribedCapitalType" placeholder="请选择">
                <el-option
                  v-for="item in subscribedCapitalTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认缴出资额（万元）" prop="subscribedCapitalContribution">
              <el-input v-model="form.subscribedCapitalContribution" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认缴出资日期" prop="subscribedCapitalDate">
              <el-date-picker
                v-model="form.subscribedCapitalDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人">
              <el-input v-model="form.responsiblePerson" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息">
              <el-input v-model="form.remark" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="subcribeFormVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./subcribeRecord.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

