<script setup>

    import TopNavBarVue from './component/TopNavBar.vue';
    import RsLogo from '@/assets/img/rs-logo-white.png';
    import JobseekerLogo from "@/assets/img/jobseeker-ico.png";
    import BusinessLogo from "@/assets/img/bizdev-ico.png";
    import ClientLogo from "@/assets/img/client-manager-ico.png";
    import StaffLogo from "@/assets/img/contracted-staff-ico.png";
    import AdminLogo from "@/assets/img/in-house-adm-ico.png";
    import PartnerLogo from "@/assets/img/referal-partner-ico.png";
    import MaterialButton from "@/components/MaterialButton.vue";
    import RSLogin from "./LoginPanel.vue";
</script>

<template>


    <div class="bg-background" id="bg-background">
        <div class="overlay" id="overlay">
            <TopNavBarVue transparent />
        
            <header >
                <div class="container">
                    <div class="row justify-content-center pt-7 pb-1">
                        <div class="col-lg-12 text-center mx-auto my-auto">
                            <img :src="RsLogo" alt="Remotestaff" loading="lazy" style="height: 70px;" />
                            <h1 class="text-center reduced" id="banner-header">Global Enterprise Solutions</h1>
                            <h4 class="text-center text-white reduced1" id="bannerSub-header">Empowering Remote Working Relationships</h4>
                        </div>
                    </div>
                    
                </div>
            </header>

            <div>
                <RSLogin />
            </div>
            <footer>
                <div class="container">
                    <div class="row justify-content-center pt-3 pb-0">
                        <div class="col-lg-6 text-center mx-auto my-auto">
                            <p class="foot-info" id="foot-info">&copy; 2022 Copyright | All rights reserved and powered by the Technology Team version 0.0.1 | Released January 2023</p>
                        </div>
                    </div>
                    
                </div>
            </footer>
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

    @media (min-height: 480px) and (min-width: 320px) {
        #overlay{
        width: 100%;
        min-height: 100vh;
        height: auto;
        }

        #bg-background{
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
        .bg-background{
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
        /* background-color: rgba(0,0,0,0.5);  */
        background-size: cover;
        display: block; 
        width:100%;
        height:100%;
    }
    .remove-box-shadow{
        box-shadow: none!important;
    }
    .bg-background{
        background-image: url('/src/assets/img/ges-main-bg.gif'); 
        background-repeat: no-repeat; 
        background-size: cover;
        
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
</style>
 