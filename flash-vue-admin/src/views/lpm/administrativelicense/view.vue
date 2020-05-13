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

</style>
<script src="./view.js"></script>
