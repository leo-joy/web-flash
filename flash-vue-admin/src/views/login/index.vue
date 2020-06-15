<template>
  <div class="login-container" style="background-color:#ffffff; background-image: url(/img/login/img_logoshuiyin.png);">
    <div class="img_leftBuilding" />
    <div class="img_rightComputer" />
    <div class="img_wangge" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <h3 class="enTitle">{{ $t('login.enTitle') }}</h3>
        <!-- <lang-select class="set-language" /> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          :type="pwdType"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <br>
      <br>
      <el-button
        :loading="loading"
        type="primary"
        class="submit-button"
        @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}</el-button>
    </el-form>
  </div>
</template>

<script src="./login.js"></script>
<style rel="stylesheet/scss" lang="scss" src="./login.scss"></style>
