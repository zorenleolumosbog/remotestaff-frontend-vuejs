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
     data(){
         return{   
            user: {
                email: '',
                password: '',
                reset_email: '',
            },
            pageSlug: '',
            pageTitle: '',
            showError:false,
            showPopupError:false,
            showResetSuccess:false,
            msg:'',
            msgPopup:'',
            color:'',
            popupColor:'',
            showResetPass: true,
            API_URL:'',
            loaderReset: false,
            loaderLogin: false,
            registant_type: '',
            modals:{
                fpModalShow: false,
            }
         }
     },
     methods:{
         toggleModal(modalName){
             console.log(modalName)
             let display_none = "display: block;";
             let display = "display: block; background-color: rgb(93 93 93 / 50%);";

             this.modals.fpModalShow = !this.modals.fpModalShow
                 
             this.showPopupError=false;
             this.user.reset_email='';
             this.showResetSuccess=false;
             this.showResetPass = true;
             
         },
         
         checkEmail($event){
             var $event_value;
             this.showPopupError=false;
             this.showError=false;


             if($event=="login"){
                 $event_value = this.user.email;
             }else if($event=="reset"){
                 $event_value = this.user.reset_email;
             }

             if(!this.ValidateEmail($event_value)){
                 if($event=="login"){
                     this.showError=true;
                     this.color="danger";
                     this.msg="Enter a valid email.";
                 }else if($event=="reset"){
                     this.showPopupError=true;
                     this.showError=false;
                     this.popupColor="danger";
                     this.msgPopup="Enter a valid email.";   
                 }
                 
                 
             }else{
                 this.showError=false;
                 this.showPopupError=false;     
             }
         },
         checkPass(){
             if(!this.CheckPassword(this.user.password)){
                 this.showError=true;
                 this.color="danger";
                 this.msg="Enter a valid password.";
             }else{
                 this.showError=false;     
             }
         },
         ValidateEmail(inputText)
         {
             const regex_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

             if (regex_pattern.test(inputText)) {
                 return true;
             }
             else {
                 return false;
             }
         },
         CheckPassword(inputText) 
         { 
                 const regex_pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                 if(regex_pattern.test(inputText)) 
                 { 
                 return true;
                 }
                 else
                 { 
                 return false;
                 }
         } ,    
         sendReset(){
         // console.log(this);
         if(!this.ValidateEmail(this.user.reset_email)){
             this.showPopupError=true;
             this.showError=false;
             this.popupColor="danger";
             this.msgPopup="Enter a valid email.";

             return;
         }

         console.log(this);

         if(this.user.reset_email==""){
             this.showPopupError=true;
             this.popupColor="danger";
             this.msgPopup="Email is required.";
         }else if(!this.ValidateEmail(this.user.reset_email)){
             this.showPopupError=true;
             this.popupColor="danger";
             this.msgPopup="Enter a valid email.";

         }else{
             this.loaderReset=true;
             axios.post(this.API_URL+'/reset-password', {
                 email: this.user.reset_email,
                 registrant_type:this.registant_type
             })
                 .then(({data}) => {
                     if(data.success){
                         this.loaderReset=false;
                         this.showResetPass=false;
                         this.showResetSuccess=true;
                         this.$router.push(`/confirmation/${this.pageSlug}`);
                     }else{
                         this.loaderReset=false;
                         this.showPopupError=true;
                         this.showResetPass=true;
                         this.popupColor="danger";
                         this.msgPopup=data.message;
                     }
                 })
                 .catch((error) => {
                     console.log(error);
                     this.showResetPass=true;
                     this.loaderReset=false;
                     var error_msg = error.response.data;
                     this.showPopupError=true;
                     this.popupColor="danger";
                     this.msgPopup=error_msg['email'][0];
                 });
         }


         },
     },
     mounted(){
        this.API_URL = api.DEV_API_URL;

        switch(this.$route.params.registrantType) {
            case 'jobseeker':
                this.pageSlug = 'jobseeker',
                this.pageTitle = 'Forgot your password?';
                this.registant_type = 1;
                break;
            case 'remote-contractor':
                this.pageSlug = 'remote-contractor',
                this.pageTitle = 'Forgot your password?';
                this.registant_type = 2;
                break;
            case 'admin':
                this.pageSlug = 'admin',
                this.pageTitle = 'Forgot your password?';
                this.registant_type = 3;
                break;
            case 'client':
                this.pageSlug = 'client',
                this.pageTitle = 'Forgot your password?';
                this.registant_type = 4;
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
     <Teleport to="body">
         <StandardModal 
         :show="loaderReset" 
         @close="loaderReset = false"
         :hasClose=false
         title="Test Alert"
         size="dialog-sm"
         :isScrollable=true>
             <template #body>
                 <Loader></Loader>
             </template>
         </StandardModal>
         
         
     </Teleport>
      <div class="row" v-if="type =='desktop'">
         <div class="col-md-4 rs-background">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-5">
             <div class="container">
                 <div class="row">
                    <div class="col">  
                        <MaterialButton variant="light" @click="$router.push(`/login/${pageSlug}`)" size="md" class="btn-icon mx-1 command-btn capitalize left-floater">
                            <div class="buttons d-flex align-items-center">
                                <i class="icons fa fa-sm fa-less-than mx-2"></i>
                                Return to login
                            </div>
                        </MaterialButton>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="form-row py-7">
                                    <div class="offset-3 col-lg-6 px-5 mb-3 mt-5">
                                        <h2 class="text-center font-color-success font-weight-bolder title mt-0 my-1">{{ pageTitle }}</h2>
                                    </div>
                                    <div class="text-center col-lg-12 px-1">
                                        <p class="notice text-center">Don't worry. Just enter the email address you registered with and we'll send a reset link to your email address.</p>
                                    </div>
                                    <!--<div class="offset-3 col-lg-6 px-5">
                                        <MaterialAlert v-bind:color="popupColor" fontWeight="bold" v-if="showPopupError">
                                            <span v-text="msgPopup"></span>
                                        </MaterialAlert>
                                    </div>-->
                                    <div class="offset-3 col-lg-6 px-5">
                                        <MaterialInput class="input-group-static " label="" type="text" placeholder="Email Address" id="email" required v-model="user.reset_email"/>
                                        <span class="error-font" style="float:left !important; font-size: 10pt; font-family: 'Inter-Light' !important;" v-if="showPopupError" v-text="msgPopup"></span>
                                    </div>
                                    <div class="offset-3 col-lg-6 my-5">
                                        <MaterialButton class="command-btn capitalize" @click="sendReset()" variant="light" size="md">Send me the link</MaterialButton>
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
                    <div class="col">
                        <MaterialButton variant="light" @click="$router.push(`/login/${pageSlug}`)" size="md" class="btn-icon mx-1 command-btn capitalize left-floater">
                            <div class="d-flex align-items-center">
                                <i class="icons fa fa-2x fa-less-than mx-2"></i>
                                Return to login
                            </div>
                        </MaterialButton>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="form-row py-7">
                                    <div class="col-lg-6 px-5 mb-3">
                                        <h2 class="text-center font-color-success font-weight-bolder title mt-0 my-1">{{ pageTitle }}</h2>
                                    </div>
                                    <div class="col-lg-8 px-1">
                                        <p class="notice text-center">Don't worry. Just enter the email address you registered with and we'll send a reset link to your email address.</p>
                                    </div>
                                    <!--<div class="offset-3 col-lg-6 px-5">
                                        <MaterialAlert v-bind:color="popupColor" fontWeight="bold" v-if="showPopupError">
                                            <span v-text="msgPopup"></span>
                                        </MaterialAlert>
                                    </div>-->
                                    <div class="col-lg-6 px-5">
                                        <MaterialInput class="input-group-static " label="" type="text" placeholder="Email Address" id="email" required v-model="user.reset_email"/>
                                        <span class="error-font" style="float:left !important;" v-if="showPopupError" v-text="msgPopup"></span>
                                    </div>
                                    <div class="col-lg-6 my-4">
                                        <MaterialButton class="command-btn capitalize" @click="sendReset()" size="md" variant="light">Send me the link</MaterialButton>
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

.capitalize{
    text-transform: capitalize !important;
    font-weight:normal !important;
    font-size: 10pt !important;
}
.notice{
    font-family: 'Inter-Light' !important;
}
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
  font-family: 'Inter-Light' !important;
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
</style>