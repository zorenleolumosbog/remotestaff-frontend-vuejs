<template>
    <nav>
        <img class="mb-2 mt-auto" @click="$router.push('/admin/corporate-apps')" style="cursor: pointer;" height="58" :src="rsLogo" alt="rs-logo">
        <h5 class="mb-2 mt-auto"><strong>HR Information System</strong></h5>
        <div class="accordion-container ms-4">
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Manage</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="manage-file?init=0">201 File Type</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Transact</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="upload-file?init=1">Upload 201 Files</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Report</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="contracts?init=2">Contracts</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Utility</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="convert-jobseeker-to-remote-contractor?init=3">Convert Jobseeker to Remote Contractor</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="assign-more-client-to-remote-contractor?init=3">Assign More Client to Remote Contractor</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup>
    import rsLogo from "@/assets/img/rs-logo-white.png";
</script>
<script>
    import { mapActions } from 'vuex';
    import * as bootstrap from "bootstrap/dist/js/bootstrap";
    import Accordion from 'accordion-js';
    import 'accordion-js/dist/accordion.min.css';
    
    export default {
        watch: {
            $route (to, from){
                let params = to.params.slug

                if ( params == "contracts" && to.query['id'] ) {
                    params = "contract"
                }

                this.setComponent({
                    value: params
                });
                
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
            ...mapActions(['setComponent'])
        },
        mounted() {
            const urlParams = new URLSearchParams(window.location.search);
            const initIndex = parseInt(urlParams.get('init'));
            new Accordion('.accordion-container', {
                openOnInit: [initIndex],
                showMultiple: true
            });
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
    nav {
        padding: 10px 15px;
        /* background-color: #002316; */
        background-color: #0B0724;
        height: 650px;
        border-radius: 5px;
    }
    nav ul{
        font-size: 14px;
        margin-left: -12px;
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

    h5,
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

    /* Style the buttons that are used to open and close the accordion panel */
    .ac {
        margin-top: unset;
        border: unset;
        background-color: transparent;
        box-sizing: unset;
    }
    .ac .ac-trigger {
        font: inherit;
        font-family: Arial, Helvetica, sans-serif;
        color: #fff;
        font-size: 15px;
        font-weight: normal;
        line-height: 1.5em;
    }
    .ac .ac-trigger::after {
        content: "+";
        right: 0px;
        left: -8px;
    }
</style>