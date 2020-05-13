<template>
  <div class="app-container">
    <div class="block">
      <el-table :data="shareholderData" style="width: 100%">
        <el-table-column prop="shareholder" label="股东" />
        <el-table-column label="占比（%）" width="100">
          <template
            slot-scope="scope"
          >{{ scope.row.proportion }}</template>
        </el-table-column>
        <el-table-column
          prop="shareholderType"
          label="类型"
          :formatter="formatterShareholderType"
          width="160"
        />
        <el-table-column
          prop="status"
          label="状态"
          :formatter="formatterShareholderStatus"
          width="100"
        />
      </el-table>
      <el-row v-if="accessoryFilesListShareholder.length>0">
        <el-col :span="24">
          <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListShareholder" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>
