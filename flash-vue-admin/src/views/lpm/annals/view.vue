<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="annalsData" style="width: 100%">
        <el-table-column prop="submissionYear" label="报送年度" width="180" />
        <el-table-column label="报送日期" width="150">
          <template
            slot-scope="scope"
          >{{ scope.row.submissionDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="经办人" />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListAnnals.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListAnnals" />
    </el-col>
  </el-row>
</template>
<style lang="scss">
</style>
<script src="./view.js"></script>
