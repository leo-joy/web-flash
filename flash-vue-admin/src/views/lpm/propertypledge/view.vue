<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="propertypledgeData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="登记编号">
                <span>{{ props.row.registerCode }}</span>
              </el-form-item>
              <el-form-item label="被担保债权数额">
                <span>{{ props.row.byAssureBondContribution }}</span>
              </el-form-item>
              <el-form-item label="登记机关">
                <span>{{ props.row.registerOrg }}</span>
              </el-form-item>
              <el-form-item label="登记日期">
                <span>{{ props.row.registerDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ formatterPropertyStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="registerCode" label="登记编号" width="160" />
        <el-table-column prop="registerOrg" label="登记机关" />
        <el-table-column label="登记日期" width="120">
          <template
            slot-scope="scope"
          >{{ scope.row.registerDate?scope.row.registerDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :formatter="formatterPropertyStatus"
        />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListPropertypledge.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListPropertypledge" />
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
