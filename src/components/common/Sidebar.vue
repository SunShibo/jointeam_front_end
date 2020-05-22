<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="(item,index) in items">
                <template v-if="item.ch.length!=0">
                    <el-submenu :index="item.index" :key="index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.menuName }}</span>
                        </template>
                        <template v-for="(subItem,subIndex) in item.ch">
                            <el-submenu v-if="subItem.ch.length!=0" :index="subItem.index" :key="subIndex">
                                <template slot="title">
                                    <i :class="subItem.icon"></i><span
                                        slot="title">{{ subItem.menuName }}</span>
                                </template>
                                <el-menu-item v-for="(threeItem,i) in subItem.ch" :key="i"
                                              :index="threeItem.index">
                                    {{ threeItem.menuName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subIndex">
                                <i :class="subItem.icon"></i><span slot="title">{{ subItem.menuName }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else="">
                    <el-menu-item :index="item.index" :key="index">
                        <i :class="item.icon"></i><span slot="title">{{ item.menuName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
//        props:['items'],
        data() {
            return {
                collapse: false,
                items: []
            }
        },
        computed: {
            onRoutes(){
                return this.$route.path.replace('/home', '');
            }
        },
        created(){
            this.items = JSON.parse(sessionStorage.getItem('me_u'));

            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
