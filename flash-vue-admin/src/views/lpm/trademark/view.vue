<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="trademarkData" style="width: 100%">
        <el-table-column prop="trademarkRegisterCode" label="注册号" width="160" />
        <el-table-column prop="trademarkName" label="商标名称" />
        <el-table-column
          prop="trademarkType"
          label="类别"
          width="150"
          :formatter="formatterTrademarkType"
        />
        <el-table-column label="注册日期" width="160">
          <template
            slot-scope="scope"
          >{{ scope.row.trademarkRegisterDate?scope.row.trademarkRegisterDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="经办人" width="100" />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListTrademark.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListTrademark" />
    </el-col>
  </el-row>
</template>
<style lang="scss">
</style>
<script src="./view.js"></script>
