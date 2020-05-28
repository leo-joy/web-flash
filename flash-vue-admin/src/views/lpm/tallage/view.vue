<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="tallageData" style="width: 100%">
        <el-table-column prop="dutyParagraph" label="税务登记号" width="180" />
        <el-table-column prop="bankAccount" label="银行账号" width="160" />
        <el-table-column prop="openAccountBank" label="开户行" />
        <el-table-column
          prop="levyType"
          label="征收方式"
          width="120"
          :formatter="formatterLevyType"
        />
        <el-table-column prop="phone" label="电话" width="150" />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListTallage.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListTallage" />
    </el-col>
  </el-row>
</template>
<style lang="scss">
</style>
<script src="./view.js"></script>
