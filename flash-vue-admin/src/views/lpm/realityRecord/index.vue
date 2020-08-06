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
        prop="realityCapitalType"
        label="实缴出资方式"
        width="150"
        :formatter="formatterrealityCapitalType"
      /> -->
      <!-- <el-table-column
        prop="currency"
        label="币种"
        width="100"
        :formatter="formatterCurrency"
      /> -->
      <el-table-column v-if="currentRegistrationType*1!==2" label="实缴出资额（万元）" width="150">
        <template slot-scope="scope">
          {{ scope.row.realityCapitalContribution }}
        </template>
      </el-table-column>
      <el-table-column v-if="currentRegistrationType*1===2" label="实缴出资额（元）" width="150">
        <template slot-scope="scope">
          {{ scope.row.realityCapitalContribution*10000 }}
        </template>
      </el-table-column>
      <el-table-column v-if="currentRegistrationType*1===2" label="实缴数量" width="100">
        <template slot-scope="scope">
          {{ scope.row.numberOfShares }}
        </template>
      </el-table-column>
      <el-table-column label="实缴出资日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.realityCapitalDate.replace(' 00:00:00','') }}
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
      :visible.sync="realityFormVisible"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
      @close="handleClose"
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
              <el-input v-model="form.enterpriseName" :disabled="true" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="股权序号">
              <el-input v-model="form.serialNumber" minlength="1" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="股东">
              <el-input v-model="form.shareholder" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实缴出资方式" prop="realityCapitalType">
              <el-select v-model="form.realityCapitalType" placeholder="请选择">
                <el-option
                  v-for="item in realityCapitalTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="currentRegistrationType*1 ===2?'实缴出资额（元）':'实缴出资额（万元）'" prop="realityCapitalContribution">
              <el-input v-model="form.realityCapitalContribution" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实缴出资日期" prop="realityCapitalDate">
              <el-date-picker
                v-model="form.realityCapitalDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种" prop="currency">
              <el-select v-model="form.currency" placeholder="请选择">
                <el-option
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="股本数量">
              <el-input v-model="form.numberOfShares" />
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
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./realityRecord.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

