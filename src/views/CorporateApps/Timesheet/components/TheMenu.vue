<template>
    <ul class="list-unstyled mt-3">
        <li class="nav-item mb-2">
            <img  @click="$router.push('/admin/corporate-apps')" style="cursor: pointer;" height="58" :src="rsLogo" alt="rs-logo">
        </li>
        <li class="nav-item mb-2">
            <a class="nav-link" id="reports" @click="toggleCollapse('sidebar'); changeIcon();">
                <!-- <small class="icon"> {{ !show1 ? '-' : '+' }}</small> -->
                <v-icon class="icon">{{icon}}</v-icon>
                <span class="nav-link-text main-menu nav-menu-font">Manage</span>
            </a>    
            <div :class="classArrs['sidebar']" :style="styleObjs['sidebar']" id="sidebar-products" ref="sidebar">
                <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                        <router-link class="nav-link sub-menu nav-menu-font" to="organizational-unit?show=true&ref=sidebar">Settings</router-link>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
<!-- </div> -->
</template>
<script>
    import { mapActions } from 'vuex';
    import * as bootstrap from "bootstrap/dist/js/bootstrap";
    
    export default {
        data() {
            return {
                classArrs: {
                    sidebar:['collapse'],
                    more:['collapse'],
                    other:['collapse'],
                    acct:['collapse']
                },
                styleObjs: {
                    sidebar:{},
                    more:{},
                    other:{},
                    acct:{}
                },
                icon: "+",
                icon2: "+",
                icon3: "+",
                icon4: "+"
            };
        },
        watch: {
            $route (to, from){
                if (this.$route.query?.show) {
                    this.classArrs[this.$route.query?.ref] = ['collapse', 'show'];

                    const menus = ["sidebar", "more", "other", "acct"].filter(e => e !== this.$route.query?.ref);

                    for (const menu of menus) {
                      this.classArrs[menu] = ['collapse', false];
                    }

                    if (this.$route.query?.ref === 'sidebar'){
						this.icon = "-";
                        this.icon2 = "+";
                        this.icon3 = "+";
                        this.icon4 = "+";
                    } else if (this.$route.query?.ref === 'more'){
                        this.icon = "+";
						this.icon2 = "-";
                        this.icon3 = "+";
                        this.icon4 = "+";
                    } else if (this.$route.query?.ref === 'other'){
                        this.icon = "+";
                        this.icon2 = "+";
						this.icon3 = "-";
                        this.icon4 = "+";
                    } else if (this.$route.query?.ref === 'acct'){
                        this.icon = "+";
                        this.icon2 = "+";
                        this.icon3 = "+";
						this.icon4 = "-";
                    }
                }

                this.setComponent({
                    value: to.params.slug
                    
                });
                // console.log('asdasdas');
                const app = document.getElementById('app');
                app.tabIndex = '-1';
                app.focus();

                let offcanvas = document.getElementById('offcanvas'); 
                let bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        },
        methods: {
            ...mapActions(['setComponent']),

            changeIcon() {
            this.icon = (this.icon === "+" ? "-" : "+")
            },
            changeIcon2() {
                this.icon2 = (this.icon2 === "+" ? "-" : "+")
            },
            changeIcon3() {
                this.icon3 = (this.icon3 === "+" ? "-" : "+")
            },
            changeIcon4() {
                this.icon4 = (this.icon4 === "+" ? "-" : "+")
            },

            toggleCollapse(ref) {
                let show = this.classArrs[ref].indexOf('show')>-1?false:'show'
                this.classArrs[ref] = ['collapsing']
                setTimeout(() => {
                    if (show){
                        let height = this.$refs[ref].firstChild.clientHeight + 'px';
                        this.styleObjs[ref] = { height }
                    }
                    else {
                        this.styleObjs[ref] = {}  
                    }
                }, 10)
                setTimeout(() => {
                    this.classArrs[ref] = ['collapse', show]
                }, 340)
            },
        },
        mounted() {
            if (this.$route.query?.show) {
                this.classArrs[this.$route.query?.ref] = ['collapse', 'show'];
                if (this.$route.query?.ref === 'sidebar'){
                    this.changeIcon();
                } else if (this.$route.query?.ref === 'more'){
                    this.changeIcon2();
                } else if (this.$route.query?.ref === 'other'){
                    this.changeIcon3();
                } else if (this.$route.query?.ref === 'acct'){
                    this.changeIcon4();
                }
            }
            

        },
       
    }
</script>
<style scoped>
    .icon{
        font-size: 20px;
        /* font-weight: bold; */
        color: white;
    }

    .sub-menu{
        font-size: 11.9px;
        margin-left: 15px;
    }

    .main-menu{
        font-size: 13px;
        font-weight: normal;
        font-family: 'Inter-Light' !important;
    }
    .parent{
        background-color: unset;
        border: unset;
        font-family: 'Inter-Light' !important;   
        padding-left: 10px;
    }
    nav ul{
        font-size: 14px;
        /* font-weight:bold; */
    }

    nav a{
        color: white;
        margin-left: 0.5em;
        font-family: 'Inter-Light' !important;
        font-size: 12px;
    }

    nav a:focus{
        color: #BAAFFF;
    }

    nav .btn::before {
        width: 2em;
    }
    nav a:hover,
    nav button:hover,
    nav button:focus { /* Sidebar Menu Hover */
        /* color: #63ff43 !important; */
        color: #BAAFFF!important;
        background-color: unset;
        font-weight: bold;
    }
    nav .btn:focus {
        box-shadow: unset;
    }
    nav .btn::before {
        transform-origin: 0.9em 50%;
    }

    nav .btn{
        color: white;
    }

    nav .btn[aria-expanded="true"] {
        color: white;
    }

    nav .btn::before {
        width: 2em;
        color: white;
        content:none;
    }
    
    .mb-1{
        font-size: 13px;
    }

    a.router-link-active.router-link-exact-active {
        color: #BAAFFF;
        font-weight: bold;
    }
</style>>