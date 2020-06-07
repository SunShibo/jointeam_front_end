<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">数字化云管家管理后台</div>
            <!--model为表单数据 rules为表单规则-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入手机号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :loading="$store.state.requestLoading" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 请不要把用户名轻易泄露给他人！</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus.js'

    export default {
        data: function () {
            return {
                ruleForm: {
                    mobile: '666666',
                    password: '666666'
                },
                rules: {
                    username: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {//提交表单
                this.$axios.post('/admin/adminLogin', {
                    ...this.ruleForm
                }).then(res => {
                    console.log(res);
                    if (res.success) {
                        sessionStorage.setItem('ms_uid', res.data.admin.id);  //保存用户ID
						
                        localStorage.setItem('ms_u', JSON.stringify({  //保存用户信息
                            name: res.data.admin.name,
                            phoneNumber: res.data.admin.phoneNumber,
                            roleName: res.data.admin.roleName
                        }));
                        //保存菜单
                        console.log(res);
                        sessionStorage.setItem('me_u', JSON.stringify(res.data.menu));
                        //判断菜单第一个元素是否有二级页面
                        const href = res.data.menu[0].pid!=0 ? res.data.menu[0].index : res.data.menu[0].ch[0].index;
                        this.$router.push({name: href});//跳转
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: url(../../assets/img/illust_37855635_20200604_125819.jpg) no-repeat;
        background-size: 100% 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
