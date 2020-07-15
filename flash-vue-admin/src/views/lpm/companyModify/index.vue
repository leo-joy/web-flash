<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="12">
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
        </el-col>
        <el-col :span="12">
          <div style="float:right">企业名称：{{ enterpriseNameLabel }}</div>
        </el-col>

      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="变更原因" width="260">
        <template slot-scope="scope">
          {{ scope.row.applyReason }}
        </template>
      </el-table-column>
      <el-table-column label="变更事项及内容">
        <template slot-scope="scope">
          <div v-if="scope.row.enterpriseNameState+'' === 'true'">
            <span><b>企业名称：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.enterpriseNameOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.enterpriseNameNew }}</b></span>
          </div>
          <div v-if="scope.row.legalRepresentativeState+'' === 'true'">
            <span><b>企业法人：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.legalRepresentativeOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.legalRepresentativeNew }}</b></span>
          </div>
          <div v-if="scope.row.registeredAddressState+'' === 'true'">
            <span><b>注册地址：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.registeredAddressOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.registeredAddressNew }}</b></span>
          </div>
          <div v-if="scope.row.registeredCapitalState+'' === 'true'">
            <span><b>注册资本：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.registeredCapitalOld }}万元</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.registeredCapitalNew }}万元</b></span>
          </div>
          <div v-if="scope.row.ownershipState+'' === 'true'">
            <span><b>企业类型：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.ownershipOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.ownershipNew }}</b></span>
          </div>
          <div v-if="scope.row.liquidationExitState+'' === 'true'">
            <span><b>股权清算退出备注：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.liquidationExitOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.liquidationExitNew }}</b></span>
          </div>
          <div v-if="scope.row.operatingPeriodEndState+'' === 'true'">
            <span><b>经营期限：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.operatingPeriodEndOld.replace("00:00:00","") }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.operatingPeriodEndNew?scope.row.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</b></span>
          </div>
          <div v-if="scope.row.businessScopeState+'' === 'true'">
            <div><b>经营范围：由 </b></div>
            <div>{{ scope.row.businessScopeOld }}</div>
            <br>
            <div><b>变更为:</b></div>
            <div>{{ scope.row.businessScopeNew }}</div>
          </div>
          <div v-if="scope.row.constitutionState+'' === 'true'">
            <div><b>章程：由 </b></div>
            <div>{{ scope.row.constitutionOld }}</div>
            <br>
            <div><b>变更为:</b></div>
            <div>{{ scope.row.constitutionNew }}</div>
          </div>
          <div v-if="scope.row.chairmanState+'' === 'true'">
            <span><b>董事长：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.chairmanOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.chairmanNew }}</b></span>
          </div>
          <div v-if="scope.row.generalManagerState+'' === 'true'">
            <span><b>经理：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.generalManagerOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.generalManagerNew }}</b></span>
          </div>
          <div v-if="scope.row.directorState+'' === 'true'">
            <span><b>董事：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.directorOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.directorNew }}</b></span>
          </div>
          <div v-if="scope.row.supervisorState+'' === 'true'">
            <span><b>监事：</b></span>
            <span>由</span>
            <span><b style="color:red">{{ scope.row.supervisorOld }}</b></span>
            <span>变更为</span>
            <span><b style="color:green">{{ scope.row.supervisorNew }}</b></span>
          </div>
          
          <div v-if="scope.row.newRegisteredState+'' === 'true'">
            <div><b>企业名称： </b>{{ scope.row.enterpriseNameNew }}</div>
            <div><b>注册资本： </b>{{ scope.row.registeredCapitalNew }} 万元</div>
            <div><b>法定代表人： </b>{{ scope.row.legalRepresentativeNew }}</div>
            <div><b>经营期限： </b>{{ scope.row.operatingPeriodEndNew?scope.row.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</div>
            <div><b>注册地址： </b>{{ scope.row.registeredAddressNew }}</div>
            <div><b>经营范围： </b>{{ scope.row.businessScopeNew }}</div>
            <div><b>董事长： </b>{{ scope.row.chairmanNew }}</div>
            <div><b>董事： </b>{{ scope.row.directorNew }}</div>
            <div><b>监事： </b>{{ scope.row.supervisorNew }}</div>
            <div><b>总经理： </b>{{ scope.row.generalManagerNew }}</div>
          </div>
          <div v-if="scope.row.shareholderModifyState+'' === 'true'">
            <span><b>股东或股权</b></span>
          </div>
          <div
            v-if="scope.row.enterpriseNameState+'' === 'false'
              && scope.row.legalRepresentativeState+'' === 'false'
              && scope.row.registeredAddressState+'' === 'false'
              && scope.row.liquidationExitState+'' === 'false'
              && scope.row.registeredCapitalState+'' === 'false'
              && scope.row.ownershipState+'' === 'false'
              && scope.row.operatingPeriodEndState+'' === 'false'
              && scope.row.businessScopeState+'' === 'false'
              && scope.row.constitutionState+'' === 'false'
              && scope.row.chairmanState+'' === 'false'
              && scope.row.generalManagerState+'' === 'false'
              && scope.row.directorState+'' === 'false'
              && scope.row.supervisorState+'' === 'false'
              && scope.row.shareholderModifyState+'' === 'false'
              && scope.row.newRegisteredState+'' === 'false'
            "
          >
            <span>无变更事项</span>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="变更日期" width="120">
        <template slot-scope="scope">
          {{ scope.row.modifyDate.replace("00:00:00","") }}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!-- <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    /> -->

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="2" title="填写变更事项相关信息">
            <el-row lass="dp-row">
              <el-col :span="1">&nbsp;
              </el-col>
              <el-col :span="11">
                <h2 style="color:#176c6b;">企业名称：{{ businesslicenseData.enterpriseName }}</h2>
              </el-col>
              <el-col :span="8">
                <h4>统一社会信用代码：{{ businesslicenseData.unifiedSocialCreditCode }}</h4>
              </el-col>
              <el-col :span="4">
                <h4>法定代表人：{{ businesslicenseData.legalRepresentative }}</h4>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="17">
                <el-form-item label="变更原因" prop="applyReason">
                  <el-input v-model="form.applyReason" type="textarea" rows="2" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="变更日期" prop="modifyDate">
                  <el-date-picker
                    v-model="form.modifyDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
                <el-form-item label="企业id">
                  <el-input v-model="form.enterpriseId" minlength="1" />
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-form-item label="变更类型">
                  <el-checkbox v-model="form.enterpriseNameState" label="企业名称" />
                  <el-checkbox v-model="form.registeredAddressState" label="注册地址" />
                  <el-checkbox v-model="form.registeredCapitalState" label="注册资本" />
                  <el-checkbox v-model="form.ownershipState" label="企业类型" />
                  <el-checkbox v-model="form.liquidationExitState" label="股权清算退出" />
                  <el-checkbox v-model="form.businessScopeState" label="经营范围" />
                  <el-checkbox v-model="form.constitutionState" label="章程" />
                  <el-checkbox v-model="form.operatingPeriodEndState" label="经营期限" />
                  <el-checkbox v-model="form.legalRepresentativeState" label="法定代表人" />
                  <el-checkbox v-model="form.chairmanState" label="董事长备案" />
                  <el-checkbox v-model="form.directorState" label="董事备案" />
                  <el-checkbox v-model="form.supervisorState" label="监事备案" />
                  <el-checkbox v-model="form.generalManagerState" label="经理备案" />
                  <el-checkbox v-model="form.shareholderModifyState" label="股东变更" />
                  <el-checkbox v-model="form.newRegisteredState" label="新注册企业" />
                </el-form-item>
              </el-col>
              <el-col v-if="form.enterpriseNameState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>企业名称</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原企业名称">
                        <el-input v-model="form.enterpriseNameOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新企业名称">
                        <el-input v-model="form.enterpriseNameNew" minlength="1" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.operatingPeriodEndState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>经营期限</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原经营期限">
                        <el-date-picker
                          v-model="form.operatingPeriodEndOld"
                          type="date"
                          placeholder="选择日期"
                          style="width: 100%;"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新经营期限">
                        <el-date-picker
                          v-model="form.operatingPeriodEndNew"
                          type="date"
                          placeholder="选择日期【如果是长期，为空即可】"
                          style="width: 100%;"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.registeredAddressState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>注册地址</span>
                  </div>
                  <el-form-item label="原注册地址">
                    <el-input v-model="form.registeredAddressOld" />
                  </el-form-item>
                  <el-form-item label="新注册地址">
                    <el-input v-model="form.registeredAddressNew" minlength="1" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.liquidationExitState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>股权清算退出</span>
                  </div>
                  <el-form-item label="原备注">
                    <el-input v-model="form.liquidationExitOld" />
                  </el-form-item>
                  <el-form-item label="新备注">
                    <el-input v-model="form.liquidationExitNew" minlength="1" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.registeredCapitalState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>注册资本</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原资本(万元)" prop="registeredCapitalOld">
                        <el-input v-model="form.registeredCapitalOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新资本(万元)" prop="registeredCapitalNew">
                        <el-input v-model="form.registeredCapitalNew" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.ownershipState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>企业类型</span>
                  </div>
                  <el-form-item label="企业类型变更前">
                    <el-input v-model="form.ownershipOld" />
                  </el-form-item>
                  <el-form-item label="企业类型变更后">
                    <el-input v-model="form.ownershipNew" minlength="1" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.businessScopeState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>经营范围</span>
                  </div>
                  <el-form-item label="原经营范围">
                    <el-input v-model="form.businessScopeOld" type="textarea" rows="5" />
                  </el-form-item>
                  <el-form-item label="新经营范围">
                    <el-input v-model="form.businessScopeNew" type="textarea" rows="5" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.constitutionState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>章程</span>
                  </div>
                  <el-form-item label="原章程修改部分">
                    <el-input v-model="form.constitutionOld" type="textarea" rows="5" />
                  </el-form-item>
                  <el-form-item label="新章程添加部分">
                    <el-input v-model="form.constitutionNew" type="textarea" rows="5" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.legalRepresentativeState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>法定代表人</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原法定代表人">
                        <el-input v-model="form.legalRepresentativeOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新法定代表人">
                        <el-input v-model="form.legalRepresentativeNew" style="width:350px" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.chairmanState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>董事长备案</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原董事长">
                        <el-input v-model="form.chairmanOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新董事长">
                        <el-autocomplete
                          v-model="form.chairmanNew"
                          style="width:350px"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入姓名"
                          @select="handleChairmanSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.generalManagerState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>经理备案</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原经理">
                        <el-input v-model="form.generalManagerOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新经理">
                        <el-autocomplete
                          v-model="form.generalManagerNew"
                          style="width:350px"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入姓名"
                          @select="handleGeneralManagerSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.directorState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>董事备案</span>
                  </div>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="原董事">
                        <el-input v-model="form.directorOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="新董事" prop="director">
                        <el-autocomplete
                          v-model="directorValue"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          style="width: 100%;"
                          placeholder="请输入董事姓名"
                          @select="handleDirectorSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <el-tag
                            v-for="tag in directorTags"
                            slot="append"
                            :key="tag.name"
                            closable
                            @close="handleDirectorDelete(tag.id, tag.name)"
                          >{{ tag.name }}</el-tag>
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.supervisorState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>监事备案</span>
                  </div>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="原监事">
                        <el-input v-model="form.supervisorOld" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="新监事" prop="supervisor">
                        <el-autocomplete
                          v-model="supervisorValue"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          style="width: 100%;"
                          placeholder="请输入监事姓名"
                          @select="handleSupervisorSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <el-tag
                            v-for="tag in supervisorTags"
                            slot="append"
                            :key="tag.name"
                            closable
                            @close="handleSupervisorDelete(tag.id, tag.name)"
                          >{{ tag.name }}</el-tag>
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.newRegisteredState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>企业新注册</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="企业名称">
                        <el-input v-model="form.enterpriseNameNew" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="注册资本(万元)" prop="registeredCapitalNew">
                        <el-input v-model="form.registeredCapitalNew" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="法定代表人">
                        <el-input v-model="form.legalRepresentativeNew" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="经营期限">
                        <el-date-picker
                          v-model="form.operatingPeriodEndNew"
                          type="date"
                          placeholder="选择日期【如果是长期，为空即可】"
                          style="width: 100%;"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="注册地址">
                        <el-input v-model="form.registeredAddressNew" minlength="1" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="经营范围">
                        <el-input v-model="form.businessScopeNew" type="textarea" rows="5" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="董事长">
                        <el-autocomplete
                          v-model="form.chairmanNew"
                          style="width:100%"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入姓名"
                          @select="handleChairmanSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="经理">
                        <el-autocomplete
                          v-model="form.generalManagerNew"
                          style="width:100%"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入姓名"
                          @select="handleGeneralManagerSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="董事" prop="director">
                        <el-autocomplete
                          v-model="directorValue"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          style="width: 100%;"
                          placeholder="请输入董事姓名"
                          @select="handleDirectorSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <el-tag
                            v-for="tag in directorTags"
                            slot="append"
                            :key="tag.name"
                            closable
                            @close="handleDirectorDelete(tag.id, tag.name)"
                          >{{ tag.name }}</el-tag>
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="监事" prop="supervisor">
                        <el-autocomplete
                          v-model="supervisorValue"
                          popper-class="my-autocomplete"
                          :fetch-suggestions="querySearchAsync"
                          style="width: 100%;"
                          placeholder="请输入监事姓名"
                          @select="handleSupervisorSelect"
                        >
                          <i
                            slot="suffix"
                            class="el-icon-circle-plus-outline el-input__icon"
                            @click="handleIconClick"
                          />
                          <el-tag
                            v-for="tag in supervisorTags"
                            slot="append"
                            :key="tag.name"
                            closable
                            @close="handleSupervisorDelete(tag.id, tag.name)"
                          >{{ tag.name }}</el-tag>
                          <template slot-scope="{ item }">
                            <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                            <span class="addr">电话：{{ item.phone }}</span>
                            <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>
                <br>
              </el-col>

              <el-col v-if="form.shareholderModifyState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>股东变更</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>原股东</span>
                        </div>
                        <div class="block">
                          <el-row>
                            <el-col :span="24">
                              <el-button type="success" size="mini" icon="el-icon-plus" @click.native="addCapitalModifyOld">{{ $t('button.add') }}</el-button>
                              <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="editCapitalModifyOld">{{ $t('button.edit') }}</el-button>
                              <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="removeCapitalModifyOld">{{ $t('button.delete') }}</el-button>
                            </el-col>
                          </el-row>
                        </div>
                        <el-table
                          v-loading="listCapitalModifyOldLoading"
                          :data="listCapitalModifyOld"
                          element-loading-text="Loading"
                          border
                          fit
                          highlight-current-row
                          @current-change="handleCurrentCapitalModifyOldChange"
                        >
                          <!-- <el-table-column label="是否是新变更" width="60">
                            <template slot-scope="scope">
                              {{ scope.row.modifyStatusType }}
                            </template>
                          </el-table-column> -->
                          <el-table-column label="股东">
                            <template slot-scope="scope">
                              {{ scope.row.shareholder }}
                            </template>
                          </el-table-column>
                          <el-table-column label="认缴出资额（万元）" width="150">
                            <template slot-scope="scope">
                              {{ scope.row.subscribedCapitalContribution }}
                            </template>
                          </el-table-column>
                          <el-table-column label="认缴日期" width="150">
                            <template slot-scope="scope">
                              {{ scope.row.subscribedCapitalDate.replace(' 00:00:00','') }}
                            </template>
                          </el-table-column>
                          <el-table-column label="占比（%）" width="100">
                            <template slot-scope="scope">
                              {{ scope.row.proportion }}
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-card>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>变更后股东</span>
                        </div>
                        <div class="block">
                          <el-row>
                            <el-col :span="24">
                              <el-button type="success" size="mini" icon="el-icon-plus" @click.native="addCapitalModifyNew">{{ $t('button.add') }}</el-button>
                              <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="editCapitalModifyNew">{{ $t('button.edit') }}</el-button>
                              <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="removeCapitalModifyNew">{{ $t('button.delete') }}</el-button>
                            </el-col>
                          </el-row>
                        </div>
                        <el-table
                          v-loading="listCapitalModifyNewLoading"
                          :data="listCapitalModifyNew"
                          element-loading-text="Loading"
                          border
                          fit
                          highlight-current-row
                          @current-change="handleCurrentCapitalModifyNewChange"
                        >
                          <!-- <el-table-column label="是否是新变更" width="60">
                            <template slot-scope="scope">
                              {{ scope.row.modifyStatusType }}
                            </template>
                          </el-table-column> -->
                          <el-table-column label="股东">
                            <template slot-scope="scope">
                              {{ scope.row.shareholder }}
                            </template>
                          </el-table-column>
                          <el-table-column label="认缴出资额（万元）" width="150">
                            <template slot-scope="scope">
                              {{ scope.row.subscribedCapitalContribution }}
                            </template>
                          </el-table-column>
                          <el-table-column label="认缴日期" width="150">
                            <template slot-scope="scope">
                              {{ scope.row.subscribedCapitalDate.replace(' 00:00:00','') }}
                            </template>
                          </el-table-column>
                          <el-table-column label="占比（%）" width="100">
                            <template slot-scope="scope">
                              {{ scope.row.proportion }}
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-card>
                    </el-col>
                  </el-row>

                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="3" title="上传相关文件，注：只能上传pdf格式文件，且不超过100MB">
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    内部审批文件
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="accessoryFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="accessoryFilesRemove"
                      :on-success="accessoryFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.accessoryFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.accessoryRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>

              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    工商申请表
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="companyReferenceRegisterFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="companyReferenceRegisterFilesRemove"
                      :on-success="companyReferenceRegisterFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.companyReferenceRegisterFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.companyReferenceRegisterRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    股东会决议
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="shareholdersDecideFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="shareholdersDecideFilesRemove"
                      :on-success="shareholdersDecideFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.shareholdersDecideFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.shareholdersDecideRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    董事会决议
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="seniorManagementFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="seniorManagementFilesRemove"
                      :on-success="seniorManagementFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.seniorManagementFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.seniorManagementRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    公司章程
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="companyArticlesAssociationFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="companyArticlesAssociationFilesRemove"
                      :on-success="companyArticlesAssociationFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.companyArticlesAssociationFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.companyArticlesAssociationFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    任职免职书
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="appointDismissFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="appointDismissFilesRemove"
                      :on-success="appointDismissFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.appointDismissFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.appointDismissFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    住所使用证明
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="promiseFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="promiseFilesRemove"
                      :on-success="promiseFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.promiseFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.promiseFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    股权转让合同
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="delegationFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="delegationFilesRemove"
                      :on-success="delegationFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.delegationFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.delegationFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    核准文件
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="approvalFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="approvalFilesRemove"
                      :on-success="approvalFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.approvalFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.approvalFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    营业执照
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="businessLicenseFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="businessLicenseFilesRemove"
                      :on-success="businessLicenseFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.businessLicenseFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.businessLicenseFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    印章备案文件
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="sealFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="sealFilesRemove"
                      :on-success="sealFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.sealFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.sealFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    开户许可证
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="openAccountFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="openAccountFilesRemove"
                      :on-success="openAccountFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.openAccountFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.openAccountFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    机构信用代码证
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="orgCreditCodeFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="orgCreditCodeFilesRemove"
                      :on-success="orgCreditCodeFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.orgCreditCodeFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.orgCreditCodeFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    外商投资批准文件（批复和批准证书）或备案文件
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="authorizationFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="authorizationFilesRemove"
                      :on-success="authorizationFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.authorizationFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.authorizationFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    外商投资企业变更备案回执
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="companyModifyRegisterFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="companyModifyRegisterFilesRemove"
                      :on-success="companyModifyRegisterFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.companyModifyRegisterFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.companyModifyRegisterFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    质权合同
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="stockPledgeFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="stockPledgeFilesRemove"
                      :on-success="stockPledgeFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.stockPledgeFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.stockPledgeFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    清算报告
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="liquidationFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="liquidationFilesRemove"
                      :on-success="liquidationFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.liquidationFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.liquidationFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    清算组成员备案通知书
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="liquidationPersonFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="liquidationPersonFilesRemove"
                      :on-success="liquidationPersonFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.liquidationPersonFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.liquidationPersonFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-card class="box-card">
                  <span slot="header" class="clearfix">
                    清税证明
                  </span>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="tallageFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="tallageFilesRemove"
                      :on-success="tallageFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.tallageFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.tallageFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <span slot="header" class="clearfix">
                    公告报纸样张
                  </span>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="noticeFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="noticeFilesRemove"
                      :on-success="noticeFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.noticeFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.noticeFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    其它文件
                  </div>
                  <el-form-item label="" class="file-form-item">
                    <el-upload
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :file-list="otherFilesList"
                      :before-upload="handleBeforeUpload"
                      :on-remove="otherFilesRemove"
                      :on-success="otherFilesUploadSuccess"
                      :on-preview="hanglePreview"
                    >
                      <el-button size="small">点击上传</el-button>
                      <span slot="tip" class="el-upload__tip">&nbsp;</span>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-if="form.otherFiles === ''" label="无附件原因" class="no-file-form-item">
                    <el-select v-model="form.otherFilesRemark" placeholder="请选择">
                      <el-option
                        v-for="item in noAccessoryCauseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                &nbsp;
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="无附件备注原因">
                  <el-input v-model="form.remark" type="textarea" rows="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="1" title="填写申请人相关信息">
            <el-row>
              <el-col :span="16">
                <el-form-item label="单位" prop="affiliatedUnit">
                  <el-input v-model="form.affiliatedUnit" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请部门" prop="applyDepartment">
                  <el-input v-model="form.applyDepartment" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请人" prop="applicant">
                  <el-input v-model="form.applicant" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="form.applyTime"
                    type="datetime"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式">
                  <el-input v-model="form.applicantContact" minlength="1" />
                </el-form-item>
              </el-col>

              <!-- <el-col :span="8">
                <el-form-item label="申请类型">
                  <el-input v-model="form.applyType" minlength="1" />
                </el-form-item>
              </el-col> -->

            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
        <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="formCapitalModifyTitle"
      :visible.sync="formCapitalModifyVisible"
      width="80%"
    >
      <el-form ref="formCapitalModify" :model="formCapitalModify" :rules="rules" label-width="160px">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="所属企业编码">
              <el-input v-model="formCapitalModify.enterpriseCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更序号">
              <el-input v-model="formCapitalModify.serialIdModify" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否是新变更">
              <el-input v-model="formCapitalModify.modifyStatusType" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序号">
              <el-input v-model="formCapitalModify.serialNumber" minlength="1" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="所属企业名称">
              <el-input v-model="formCapitalModify.enterpriseName" :disabled="true" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :class="[isCapitalModifyAdd? 'dpShow' : 'dpHide']" :span="12">
            <el-form-item label="类型">
              <el-radio-group v-model="formCapitalModify.shareholderMold" @change="handleChangeRadio">
                <el-radio :label="1">企业股东</el-radio>
                <el-radio :label="2">自然人股东</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="股东" prop="shareholder">
              <el-input v-model="formCapitalModify.shareholder" :disabled="true" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :class="[formCapitalModify.shareholderMold*1===1 ? 'dpShow' : 'dpHide']" :span="12">
            <el-form-item label="企业股东">
              <el-autocomplete
                v-model="formCapitalModify.shareholder"
                popper-class="my-autocomplete"
                style="min-width:100%;line-height:10px;"
                :fetch-suggestions="querySearchCompanyAsync"
                :select-when-unmatched="true"
                placeholder="请输入股东名称"
                @select="handleBranchCompanySelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClickShareholder"
                />
                <template slot-scope="{ item }" style="width:300px">
                  <div class="name">{{ item.enterpriseName }}</div>
                  <span
                    class="addr"
                  >法人：{{ item.legalRepresentative }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span class="addr">地址：{{ item.businessAddress }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :class="[formCapitalModify.shareholderMold*1===2 ? 'dpShow' : 'dpHide']" :span="12">
            <el-form-item label="自然人股东">
              <el-autocomplete
                v-model="form.shareholder"
                style="width:350px"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入姓名"
                @select="handleNaturalPersonSelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClick"
                />
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                  <span class="addr">电话：{{ item.phone }}</span>
                  <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="认缴出资方式">
              <el-select v-model="formCapitalModify.subscribedCapitalType" placeholder="请选择">
                <el-option
                  v-for="item in subscribedCapitalTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认缴出资额（万元）" prop="subscribedCapitalContribution">
              <el-input v-model="formCapitalModify.subscribedCapitalContribution" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认缴出资日期">
              <el-date-picker
                v-model="formCapitalModify.subscribedCapitalDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实缴出资方式">
              <el-select v-model="formCapitalModify.realityCapitalType" placeholder="请选择">
                <el-option
                  v-for="item in realityCapitalTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实缴出资额（万元）" prop="realityCapitalContribution">
              <el-input v-model="formCapitalModify.realityCapitalContribution" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实缴出资日期">
              <el-date-picker
                v-model="formCapitalModify.realityCapitalDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="股东类型">
              <el-select v-model="formCapitalModify.shareholderType" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="formCapitalModify.status" placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经办人">
              <el-input v-model="formCapitalModify.responsiblePerson" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="占比（%）">
              <el-slider v-model="formCapitalModify.proportion" show-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveCapitalModify">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formCapitalModifyVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./companyModify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
    .dpShow {
  display: block;
}
.dpHide {
  display: none;
}
  .box-card {
    margin:10px;
  }
  .file-form-item {
    margin-left:-110px;
  }
  .no-file-form-item {
    float:right;
    margin-top:-55px;
  }

    .dp-row {
      padding: 5px;
    }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
}
</style>

