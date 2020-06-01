<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'App',
        data(){
            return {

            }
        },
        components:{
			
        }
    }
</script>
<style>
    @import "./assets/css/main.css";
    /*@import "./assets/css/color-dark.css";     深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
	@import "./assets/css/color-main.css";
    .el-upload--text {
        width: auto;
        height: auto;
        border-radius: 0;
        border: none
    }

    /*在子组件中无效放到全局中使用*/
    .hide .el-upload--picture-card {
        display: none!important;
    }
</style>