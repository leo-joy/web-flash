<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="capitalData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="股东">
                <span>{{ props.row.shareholder }}</span>
              </el-form-item>
              <el-form-item label="占比（%）">
                <span>{{ props.row.proportion }}</span>
              </el-form-item>
              <el-form-item label="认缴出资方式">
                <span>{{ formatterSubscribedCapitalType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="认缴出资额（万元）">
                <span>{{ props.row.subscribedCapitalContribution }}</span>
              </el-form-item>
              <el-form-item label="认缴出资日期">
                <span>{{ props.row.subscribedCapitalDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="实缴出资方式">
                <span>{{ formatterRealityCapitalType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="实缴出资额（万元）">
                <span>{{ props.row.realityCapitalContribution }}</span>
              </el-form-item>
              <el-form-item label="实缴出资日期">
                <span>{{ props.row.realityCapitalDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="shareholder" label="股东" />
        <el-table-column label="占比（%）">
          <template
            slot-scope="scope"
          >{{ scope.row.proportion }}</template>
        </el-table-column>

        <el-table-column
          prop="subscribedCapitalContribution"
          label="认缴出资额（万元）"
          width="100"
        />
        <el-table-column
          prop="realityCapitalContribution"
          label="实缴出资额（万元）"
          width="100"
        />
        <el-table-column label="实缴出资日期" width="120">
          <template
            slot-scope="scope"
          >{{ scope.row.realityCapitalDate.replace(' 00:00:00','') }}</template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListCapital.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListCapital" />
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
