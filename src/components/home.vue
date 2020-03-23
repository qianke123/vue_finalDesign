<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="logo" src="../assets/picture/cloud.png" />
        <span>云端文件同步与共享服务平台</span>
      </div>
      <div>
        <el-tooltip class="item" effect="dark" content="退出后将回到登陆页面" placement="top">
          <el-button type="info" @click="logout()">退出</el-button>
        </el-tooltip>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <!-- 控制折叠 -->
        <div class="toggle-button" @click="toggle()">| | |</div>
        <el-menu :router="true" :collapse-transition="false" :collapse="isCollapse" background-color="#323744" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="/myfolder">
            <i class="el-icon-folder"></i>
            <span slot="title">我的文件</span>
          </el-menu-item>
          <el-menu-item index="/shareCenter">
            <i class="el-icon-cloudy"></i>
            <span slot="title">共享中心</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-soccer"></i>
              <span>可能感兴趣</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">喜好设置</el-menu-item>
              <el-menu-item index="3-2">随便看看</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">个人信息</el-menu-item>
              <el-menu-item index="4-2">我的收藏</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      var fileCloudToken = window.sessionStorage.getItem('fileCloudToken')
      window.sessionStorage.removeItem('fileCloudToken')
      console.log(fileCloudToken)
      this.$axios({
        method: 'post',
        url: '/user/userLogout',
        data: this.$qs.stringify({ fileCloudToken: fileCloudToken })
      }).then(res => {
        console.log(res)
      })
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.home-container {
  height: 100%;
}

.el-header, .el-footer {
  background-color: #373C41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
      color: white;
      font-size: 20px;
    }
  }
  .logo {
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
}

.el-aside {
  background-color: #323744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF2;
}

.toggle-button {
  background-color: #4C5468;
  color: white;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  // 鼠标放上去显示小手
  cursor: pointer;
}
</style>
