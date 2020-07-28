<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="annalsData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <FilesListComponent file-title="相关附件" :files-list="props.row.accessoryArrList" />
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" />
        <el-table-column prop="submissionYear" label="报送年度" width="160" />
        <el-table-column label="报送日期" width="150">
          <template
            slot-scope="scope"
          >{{ scope.row.submissionDate?scope.row.submissionDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="经办人" width="150" />
      </el-table>
    </el-col>
  </el-row>
</template>
<style lang="scss">
</style>
<script src="./view.js"></script>
