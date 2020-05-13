<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="administrativelicenseData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="许可文件编号">
                <span>{{ props.row.permissionFileCode }}</span>
              </el-form-item>
              <el-form-item label="许可文件名称">
                <span>{{ props.row.permissionFileName }}</span>
              </el-form-item>
              <el-form-item label="有效期自">
                <span>{{ props.row.validityFrom.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="有效日期至">
                <span>{{ props.row.validityEnd.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="许可机关">
                <span>{{ props.row.permissionOrg }}</span>
              </el-form-item>
              <el-form-item label="许可内容">
                <span>{{ props.row.permissionContent }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ formatterLicenseStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="permissionFileName" label="许可文件名称" />
        <el-table-column prop="permissionOrg" label="许可机关" width="160" />
        <el-table-column label="有效期自" width="100">
          <template
            slot-scope="scope"
          >{{ scope.row.validityFrom?scope.row.validityFrom.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column label="有效日期至" width="100">
          <template
            slot-scope="scope"
          >{{ scope.row.validityEnd?scope.row.validityEnd.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :formatter="formatterLicenseStatus"
        />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListAdministrativelicense.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListAdministrativelicense" />
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
