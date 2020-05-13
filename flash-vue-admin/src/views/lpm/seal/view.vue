<template>
  <div class="app-container">
    <div class="block">
      <el-table :data="sealData" style="width: 100%">
        <el-table-column prop="sealName" label="印章名称" />
        <el-table-column label="启用日期" width="120">
          <template slot-scope="scope">{{ scope.row.activeDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
        <el-table-column label="作废日期" width="120">
          <template slot-scope="scope">{{ scope.row.obsoleteDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :formatter="formatterSealStatus"
        />
      </el-table>
      <el-row v-if="accessoryFilesListSeal.length>0">
        <el-col :span="24">
          <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListSeal" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>
