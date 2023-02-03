<script setup>

    // import TopNavBarVue from './component/TopNavBar.vue';
    import RsLogo from '@/assets/img/rs-logo-white.png';
    import rdaLogo from "@/assets/img/RDA.svg";
    import timesheetLogo from "@/assets/img/timesheet.svg";
    import accountingLogo from "@/assets/img/accounting.svg";
    import atsLogo from "@/assets/img/ATS.svg";
    import hrisLogo from "@/assets/img/hris.svg";
    import masterfilesLogo from "@/assets/img/masterfiles.svg";
    import MaterialButton from "@/components/MaterialButton.vue";
    import TheApps from "./TheApps.vue";

    import api  from "@/static/config.json";
    import axios from 'axios';
    import { RouterLink } from "vue-router";
    import { ref, watch } from "vue";
</script>

<script>
    import Cookies from 'js-cookie';

    export default {
        data(){
            return{
                token:{data:''},
                ID:{data:''},
                data: {
                    profile: []
                },
            }
        },
        methods: {
            getProfile() {
                let self = this;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/get-profile/onboarding',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: localStorage.getItem('userid'),
                        info_type: 'basic',
                    }
                })
                .then(function (response) {
                    if(response.data.success) {
                        switch (true) {
                            case self.$route.name === 'jobseeker' && response.data.data.registrant_type === 1:
                            case self.$route.name === 'remote-contractor' && response.data.data.registrant_type === 2:
                            case self.$route.name === 'admin-corporate-apps' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-accounting' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-timesheet' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-masterfiles' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-rda' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-hris' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'client' && response.data.data.registrant_type === 4:

                                self.emitter.emit("mapRegistrantType", response.data.data.registrant_type);
                                self.data.profile.name = response.data.data.reg_firstname;
                                break;
                        
                            default:
                                switch (self.$route.name) {
                                    case 'admin-corporate-apps':
                                    case 'admin-corporate-apps-accounting':
                                    case 'admin-corporate-apps-timesheet':
                                    case 'admin-corporate-apps-masterfiles':
                                    case 'admin-corporate-apps-rda':
                                        self.$router.push(`/login/admin`);
                                        break;

                                    default:
                                        self.$router.push(`/login/${self.$route.name}`);
                                        break;
                                }
                                break;
                        }
                    }
                }).catch(function (error) {
                    self.$router.push(`/login/${self.$route.name}`);
                });
            },
            logout() {
                localStorage.removeItem("userid");
                localStorage.removeItem("token");
                this.$router.push("/");
            }
        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.token.data = localStorage.getItem('token');
            this.ID.data = localStorage.getItem('userid');

            this.getProfile();

            this.emitter.on("mapProfileName", profileInfo => {
                this.data.profile.name = profileInfo.reg_firstname+ ' ' +profileInfo.reg_lastname;
            });
        },

        created: function(){
            if (Cookies.get('userid') !== undefined && Cookies.get('token') !== undefined) {
                localStorage.setItem('userid', Cookies.get('userid'));
                localStorage.setItem('token', Cookies.get('token'));
                Cookies.remove('userid', { domain: 'remotestaff.com' });
                Cookies.remove('token', { domain: 'remotestaff.com' });
            }

            let token = localStorage.getItem('token');
            if (!token) {
                this.$router.push('/');
            }
        },
    }
</script>

<template>


    <div class="corp-background" id="corp-background">
        <!-- <div class="second-bg"></div> -->
        <div class="overlay" id="overlay">
            <!-- <TopNavBarVue transparent /> -->
            <div class="navbar navbar-expand-lg top-0 z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3" aria-label="Main navigation">
                <nav class="container-fluid flex-wrap flex-md-nowrap" aria-label="Main navigation">
                    <div class="navbar-collapse collapse col-lg-12" id="bdNavbar">
                        <div class="col-lg-12 ">
                            <div class="d-grid gap-4 d-md-flex justify-content-md-end mt-2">
                            <p v-if="data.profile.name" class="me-md-2 mt-1" style="color:white; font-size: 16pt; font-family: 'Inter-Bold' !important;">Hi, {{ data.profile.name }}!</p>
                            <button @click="logout()" class="btn btn-md btn-white logout" type="button"><i class="fa fa-lg fa-sign-out mx-1" aria-hidden="true"></i>Logout</button>
                            </div>
                        </div>
                        <!-- <div class="col-lg-2">
                            <a @click="logout()" class="right-floater logout btn btn-white  btn-md mt-2 white-font flex-row flex-wrap ms-md-auto" href="#"><i class="fa fa-lg fa-sign-out mx-1" aria-hidden="true"></i>Logout</a>
                        </div> -->
                    </div>
                </nav>
            </div>
        
            <header >
                <div class="container">
                    <div class="row justify-content-center pt-7 pb-1">
                        <div class="col-lg-12 text-center mx-auto my-auto">
                            <img :src="RsLogo" alt="Remotestaff" loading="lazy" style="height: 70px;" />
                            <h1 class="text-center reduced" id="banner-header">Corporate Apps</h1>
                            <!-- <h4 class="text-center text-white reduced1" id="bannerSub-header">Empowering Remote Working Relationships</h4> -->
                        </div>
                    </div>
                    
                </div>
            </header>

            <div>
                <TheApps />
            </div>
            <!-- <footer>
                <div class="container">
                    <div class="row justify-content-center pt-3 pb-0">
                        <div class="col-lg-6 text-center mx-auto my-auto">
                            <p class="foot-info" id="foot-info">&copy; 2022 Copyright | All rights reserved and powered by the Technology Team version 0.0.1 | Released January 2023</p>
                        </div>
                    </div>
                    
                </div>
            </footer> -->
        </div>
    </div>
    
</template>

<style scope>
    @media only screen and (max-width: 1200px){
        #banner-header{
            white-space: nowrap; 
            font-size: 40pt;
        }
        .overlay{
            height: auto !important;
        }
    }
    /* @media only screen and (max-width: 1200px) and (min-width: 768px){
        #banner-header{
            white-space: nowrap; 
        }
    } */
    @media only screen and (max-width: 1400px) {
        /* #banner-header{
            white-space: normal; 
            font-size: 39pt;
        } */
        #foot-info{
            white-space: normal; 
            font-size: 11pt;
        }
        
    }
    @media only screen and (max-width: 1200px) {
        /* #banner-header{
            white-space: normal; 
            font-size: 39pt;
        } */
        #foot-info{
            white-space: normal; 
            font-size: 9pt;
        }
        
    }
    @media only screen and (max-width: 1000px) {
        #banner-header{
            white-space: normal; 
            font-size: 39pt;
        }
        #foot-info{
            white-space: normal; 
            font-size: 9pt;
        }
        
    }
    @media only screen and (max-width: 992px) {
        #banner-header{
            white-space: normal; 
            font-size: 39pt;
        }
        #foot-info{
            white-space: normal; 
            font-size: 13pt;
        }
       
       
    }
    @media only screen and (max-width: 768px) {
        #banner-header{
            white-space: normal; 
            font-size: 30pt;
        }
        #bannerSub-header{
            white-space: normal; 
            font-size: 15pt;
        }
        #foot-info{
            white-space: normal; 
            font-size: 10pt;
        }
       
    }
    @media only screen and (max-width: 600px) {
        #banner-header{
            white-space: normal; 
            font-size: 25pt;
        }

        #bannerSub-header{
            white-space: normal; 
            font-size: 15pt;
        }
        #foot-info{
            white-space: normal; 
            font-size: 10pt;
        }
       
    }
    @media only screen and (max-width: 550px) {
        #foot-info{
            white-space: normal; 
            font-size: 9pt;
        }
       
    }
    @media only screen and (max-width: 500px) {
        #foot-info{
            white-space: normal; 
            font-size: 8.5pt;
        }
       
    }
    @media only screen and (max-width: 480px) {
        #banner-header{
            white-space: normal; 
            font-size: 25pt;
        }
    }

    /* @media only screen and (min-width: 992px) {
        #overlay{
            padding-bottom: 55%;
        }
    }  temporary adjustment for oadding*/

    @media (min-height: 480px) and (min-width: 320px) {
        #overlay{
        width: 100%;
        min-height: 100vh;
        height: auto;
        }

        #corp-background{
        width:100%
        }
    }

    /* @media (min-height: 768px) and (min-width: 481px) {
        #bg-background{
        width:140vh;
        }
    } */




    @media only screen and (max-width: 1900px) {
        .overlay{
            padding-bottom:20%;
        }
       
    }
    @media only screen and (min-width: 1920px) {
        .corp-background{
            position:absolute;
        }
        .overlay{
            
            position:absolute;
        }
    }
    .padding-btn-when-small{
        padding:1%!important;
    }
    .bg-color-btn{
        background-color:  #66dd4e!important;
        color:black!important;
    }
    .add-padding{
        padding-top:1%!important;
        
    }
    .overlay {
        background-color: rgba(36, 36, 36, 0.028); 
        background-size:contain;
        display: block; 
        width:100%;
        height:100%;
    }
    .remove-box-shadow{
        box-shadow: none!important;
    }
    .corp-background{
        background-image: url('@/assets/img/corporate-apps-bg.gif'); 
        /* background: url('@/assets/img/landing-page-bannerdark-thumb.jpg') no-repeat center center fixed; */
        background-repeat: no-repeat; 
        background-size: cover;
        /* opacity: 0.5; */
        width:100%;
        height:100%;
        display: block;
    }
    
    .vl {
        border-left: 6px solid green;
        height: 100%;
    }

    .bg{
        
        padding-top: 5%;
        padding-bottom: 2%;
    }
    .bannerHeader{
        color: #fcfcfc; 
        font-family: 'Inter-Bold' !important;
        /* font-family: Arial, Helvetica, sans-serif; */
    }
    .bannerSubHeader{
        color: #fcfcfc; 
        /* font-family: Arial, Helvetica, sans-serif; */
    }
    .timezoneList{
        padding-top: 2%;
        /*padding-bottom: 2%;*/
        font-size: 12px;
    }
    .bgButtonLogin{
        background-color:  #002315; ;
    }
    h5{
        /* font-family: Arial, Helvetica, sans-serif;  */
        padding-top: 13px;
    }


    #banner-header{
        color: #fcfcfc;
        /* font-family: Arial,Helvetica,sans-serif; */
        font-family: 'Inter-Bold' !important;
        /* font-size: 55px; */
    }

    #bannerSub-header{
        color: #fcfcfc;
        /* font-family: Arial,Helvetica,sans-serif; */
        font-family: 'Inter-Light' !important;
        /* font-size: 30px; */
    }

    .foot-info{
        text-align: center;
        color: #fcfcfc;
        font-size:12pt;
    }

    .reduced{
        font-size: 55pt;
    }
    .reduced1{
        font-size: 22pt;
    }
    .logout:hover{
        background-image: linear-gradient(#3E26D3,#5E44FF);
        color : white !important;
    }
    .right-floater{
        float:right !important;
    }
</style>
 