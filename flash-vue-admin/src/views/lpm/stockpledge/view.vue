<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="stockpledgeData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="登记编号">
                <span>{{ props.row.registerCode }}</span>
              </el-form-item>
              <el-form-item label="出质人">
                <span>{{ props.row.pledgor }}</span>
              </el-form-item>
              <el-form-item label="证照/证件号码(出质人)">
                <span>{{ props.row.pledgorCertificateNumber }}</span>
              </el-form-item>
              <el-form-item label="出质股权数额">
                <span>{{ props.row.pledgeStockContribution }}</span>
              </el-form-item>
              <el-form-item label="质权人">
                <span>{{ props.row.pledgee }}</span>
              </el-form-item>
              <el-form-item label="证照/证件号码(质权人)">
                <span>{{ props.row.pledgeeCertificateNumber }}</span>
              </el-form-item>
              <el-form-item label="股权出质设立登记日期">
                <span>{{ props.row.stockPledgeRegisterDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ formatterStockStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="registerCode" label="登记编号" width="180" />
        <el-table-column prop="pledgor" label="出质人" />
        <el-table-column prop="pledgeStockContribution" label="出质股权数额" width="160" />
        <el-table-column prop="pledgee" label="质权人" />
        <el-table-column
          prop="status"
          label="状态"
          width="120"
          :formatter="formatterStockStatus"
        />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListStockpledge.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListStockpledge" />
    </el-col>
  </el-row>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>
