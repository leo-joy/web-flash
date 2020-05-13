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
.el-collapse-item__wrap {
  border: #ebeff5 dashed 1px;
  border-radius: 10px;
}
.dp-table-expand {
  font-size: 0;
}
.dp-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.dp-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.dp-row {
  padding: 10px;
}
// 清除浮动
.clearfix:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
//
.my-menu-vertical {
 position:fixed;
 top:180px;
 right:30px;
 z-index:10;
}
.my-menu-vertical .el-menu-item {
  height:36px;
  line-height: 36px;
}
</style>
<script src="./view.js"></script>
