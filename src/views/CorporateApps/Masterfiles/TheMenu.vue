<template>
    <nav>
        <img class="mb-2 mt-auto" @click="$router.push('/admin/corporate-apps')" style="cursor: pointer;" height="58" :src="rsLogo" alt="rs-logo">
        <div class="accordion-container ms-4">
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Backoffice Masterfiles</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="organizational-unit?init=0">Manage Organizational Unit</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="geography-page?init=0">Manage Geographies</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="currency-page?init=0">Manage Currency</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="department?init=0">Manage Department</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="section?init=0">Manage Section</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="personnel-to-section?init=0">Assign Personnel per Section</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Application Settings</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="security-access-matrix?init=1">Security Access Matrix</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="registrant-expiry?init=1">Manage Registrant Expiry</router-link>
                        </li>
                        
                    </ul>
                </div>
            </div>
            
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Marketplace Settings</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="social-media?init=2">Manage Social Media</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="registrant-type?init=2">Manage Registrant Type</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="job-source?init=2">Manage Job Source</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="civil-status?init=2">Manage Civil Status</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="religion?init=2">Manage Religion</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="industry?init=2">Manage Industry</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="skill?init=2">Manage Skill</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="skill-level?init=2">Manage Skill Level</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="degree-level?init=2">Manage Degree Level</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="field-study?init=2">Manage Field of Study</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="internet-type?init=2">Manage Internet Type</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="ISP?init=2">Manage ISP</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="hardware-type?init=2">Manage Hardware Type</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="contract-status?init=2">Manage Contract Status</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="contract-service-type?init=2">Manage Contract Service Type</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="contract-type?init=2">Manage Contract Type</router-link>
                        </li>
                        <li class="nav-ite mmy-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="cancellation-reason-type?init=2">Manage Cancellation Reason</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="contract-note?init=2">Manage Contract Note</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Account Classification</button>
                </h2>
                <div class="ac-panel">
                    <ul class="nav nav-sm flex-column">
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="account-classification?init=3">Manage Account Classification</router-link>
                        </li>
                        <li class="nav-item my-n2">
                            <router-link class="nav-link sub-menu nav-menu-font" to="account-type?init=3">Manage Account Type</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link sub-menu nav-menu-font" to="invoice-item-type?init=3">Manage Invoice Item Type</router-link>
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
                this.setComponent({
                    value: to.params.slug
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
    .ac_ml {
        margin-left: 10%;
    }
</style>