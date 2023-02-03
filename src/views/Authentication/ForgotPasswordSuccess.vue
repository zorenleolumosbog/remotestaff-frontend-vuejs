<script setup>
 import MaterialInput from "@/components/MaterialInput.vue";
 import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
 import MaterialButton from "@/components/MaterialButton.vue";
 import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
 import StandardModal from "@/components/Modals/StandardModal.vue";
 import MaterialAlert from "@/components/MaterialAlert.vue";
 import Loader from "@/components/Loader.vue";
 import api  from "@/static/config.json";

 const { type } = useWindowsWidth();
 const { width } = useWindowsWidth();
</script>

<script>
 import axios from 'axios';
 export default{
    data() {
        return{
            pageSlug: '',
            pageTitle: ''
        }
    },
    mounted(){
        switch(this.$route.params.registrantType) {
            case 'jobseeker':
                this.pageSlug = 'jobseeker',
                this.pageTitle = 'Jobseeker Forgot Password';
                break;
            case 'remote-contractor':
                this.pageSlug = 'remote-contractor',
                this.pageTitle = 'Remote Contractor Forgot Password';
                break;
            case 'admin':
                this.pageSlug = 'admin',
                this.pageTitle = 'Corporate Forgot Password';
                break;
            case 'client':
                this.pageSlug = 'client',
                this.pageTitle = 'Client Forgot Password';
                break;
            default:
                this.$router.push('/');
        }
     }
}
</script>


<template>

 <!-- Left Side Background -->
  <div class="container-fluid p-0 overflow-hidden">
      <div class="row" v-if="type =='desktop'">
         <div class="col-md-4 rs-background">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-5">
             <div class="container">
                 <div class="row">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="form-row py-7">
                                    <div class="offset-3 col-lg-6 px-5 mb-3">
                                        <div class="reset"><i class="fa fa-paper-plane my-3"></i></div>
                                        <h2 class="text-center font-color-success font-weight-bolder title mt-0 my-1">Email on the way!</h2>
                                    </div>
                                    <div class="offset-2 col-lg-8 px-1">
                                        <p class="text-center">
                                            If your email address exists in our system, you will receive an email with password reset instructions. 
                                            If the email doesn't show up soon, check your spam folder. 
                                            We sent it from no-reply@remotestaff.com
                                        </p>
                                    </div>
                                    <div class="offset-3 col-lg-6 my-4">
                                        <MaterialButton class="command-btn capitalize" @click="$router.push(`/login/${pageSlug}`)" variant="light" size="md">Return to Login</MaterialButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
      </div>
      <div v-else class="row">
         <div class="col-md-4 rs-background min-height-mobile" v-if="width < '768'">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-3" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-4 rs-background min-height-mobile-v2" v-else>
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-5">
             <div class="container">
                <div class="row">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="form-row py-3">
                                    <div class="col-lg-6 px-5 mb-3">
                                        <div class="reset"><i class="fa fa-paper-plane my-3"></i></div>
                                        <h2 class="text-center font-color-success font-weight-bolder title mt-0 my-1">Email on the way!</h2>
                                    </div>
                                    <div class="col-lg-8 px-1">
                                        <p class="text-center">
                                            If your email address exists in our system, you will receive an email with password reset instructions. 
                                            If the email doesn't show up soon, check your spam folder. 
                                            We sent it from no-reply@remotestaff.com
                                        </p>
                                    </div>
                                    <div class="col-lg-6 my-4">
                                        <MaterialButton class="btnColor command-btn" @click="$router.push(`/login/${pageSlug}`)" variant="light" size="md">Return to Login</MaterialButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
      </div>
      
  </div>
  
</template>

<style scoped>
a{
 cursor: pointer;
}
.rs-background{
 background-image: url('@/assets/img/landing-page-banner-thumb.f80af095.jpg');
 background-repeat: no-repeat;
 background-size: cover;
 display: block;
 /* width: 100%; */
 min-height: 100vh;
}
.margin-bottom{
 margin-bottom: 2%;
}

.min-height-mobile{
 min-height: 10vh !important;
 height:auto;
 width:100%;
}

.input-width-desktop{
 width:50%;
}

.min-height-mobile-v2{
 min-height: 100vh !important;
 height:auto;
}

.rs-logo{
  width:50%;
  height: 50% !important;
}

.btnColor{
  text-transform: capitalize;
}

.font-colors{
  color: #212529 !important;
}

.link-text:hover{
  color: blue;
}

.formInput{
  padding-top: 300px !important;
}

.small{
  font-size: small;
}

.login-title{
  font-size: xx-large;
  font-family: 'Inter-Bold' !important;
}

.separator{
 display: flex;
 align-items: center;
}

.separator span{
 padding: 0 1rem; /* creates the space */
}

.separator .line{
 flex: 1;
 height: 1px;
 background-color: rgb(150, 147, 147);
}
.error-font{
    color:red !important;
    font-size: x-small;
}

.reset{
    font-size: 70px !important;
    color: rgb(88, 219, 88);
    text-align: center;
}

.capitalize{
    text-transform: capitalize !important;
}
</style>