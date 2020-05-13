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
