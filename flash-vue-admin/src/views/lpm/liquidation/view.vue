<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="liquidationData" style="width: 100%">
        <el-table-column prop="liquidationTeamLeader" label="清算组负责人" width="160" />
        <el-table-column prop="liquidationTeamMember" label="清算组成员" />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListLiquidation.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListLiquidation" />
    </el-col>
  </el-row>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>
