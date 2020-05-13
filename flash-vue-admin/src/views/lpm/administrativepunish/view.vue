<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="administrativepunishData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="决定书文号">
                <span>{{ props.row.decisionReferenceNumber }}</span>
              </el-form-item>
              <el-form-item label="违法行为类型">
                <span>{{ formatterPunishType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="行政处罚内容">
                <span>{{ props.row.administrativePunishContent }}</span>
              </el-form-item>
              <el-form-item label="决定机关名称">
                <span>{{ props.row.decisionOrgName }}</span>
              </el-form-item>
              <el-form-item label="处罚决定日期">
                <span>{{ props.row.validityFrom.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="公示日期">
                <span>{{ props.row.publicityDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="decisionReferenceNumber" label="决定书文号" width="160" />
        <el-table-column prop="decisionOrgName" label="决定机关名称" width="200" />
        <el-table-column prop="administrativePunishContent" label="行政处罚内容" />
        <el-table-column label="公示日期" width="150">
          <template
            slot-scope="scope"
          >{{ scope.row.publicityDate?scope.row.publicityDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListAdministrativepunish.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListAdministrativepunish" />
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
