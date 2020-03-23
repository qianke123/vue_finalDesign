<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区-->
      <div class="avatar_box">
        <img src="../assets/picture/cloud.png" />
      </div>
      <!-- 登录表单区-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <a href="" style="text-decoration-line: none;">
            <span style="margin-right: 55px;">还没有账号? 点击注册。</span>
          </a>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        /* 表单属性的双向绑定 */
        username: 'zhangsan',
        password: '111'
      },
      loginFormRules: {
        /* 表单属性的校验，与prop相关 */
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 重置表单 */
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    /* 登录验证功能 */
    login () {
      /* 表单的预验证 vaild是返回值 */
      this.$refs.loginFormRef.validate(vaild => {
        console.log(this.loginForm)
        if (!vaild) return false
        this.$axios({
          method: 'post',
          url: '/user/validateUserByName',
          data: this.$qs.stringify(this.loginForm)
        }).then((res) => {
          console.log(res)
          if (res.data.status === '2') {
            window.sessionStorage.setItem('fileCloudToken', res.data.fileCloudToken)
            this.$router.push('/home')
          } else if (res.data.status === '1') {
            this.$message.error('密码错误！')
            return false
          } else {
            this.$message.error('不存在该用户！')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0px;
    padding: 0 40px;
    width: 100%;
    /* 盒子模型的溢出处理*/
    box-sizing: border-box;
    .btns {
      float: right;
    }
  }
}
</style>
