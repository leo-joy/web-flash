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

</style>
<script src="./view.js"></script>
