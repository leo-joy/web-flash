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
