 
 <script setup>
 import MaterialInput from "@/components/MaterialInput.vue";
 import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
 import MaterialButton from "@/components/MaterialButton.vue";
 import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
 import SocialAuthentication from "../SocialAuthentication/TheJobseeker.vue";
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
                 registrant_type: ''
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
             modals:{
                 fpModalShow: false,
                 cmModalShow: false
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
         cancel(){  
            this.modals.cmModalShow = false;
            this.showError=false;
         },
         login() {

             this.showPopupError=false;
             if(this.user.email == "" && this.user.password  == ""){
                 this.showError=true;
                 this.color="danger";
                 this.msg="Email and Password are required.";   
             }else if(this.user.email == ""){
                 this.showError=true;
                 this.color="danger";
                 this.msg="Email is required.";   
             }else if(this.user.password == ""){
                 this.showError=true;
                 this.color="danger";
                 this.msg="Password is required.";   
             }else{
                 this.loaderLogin=true;
                 this.user.registrant_type = this.$route.params.registrantType;
                 axios.post(this.API_URL+'/login', this.user)
                 .then(({data}) => {
                     if(data.success==false){
                        
                        this.loaderLogin=false;
                        this.showError=true;
                        this.color="danger";

                        if(this.$route.params.registrantType === 'jobseeker'
                        || this.$route.params.registrantType === 'remote-contractor'  
                        || this.$route.params.registrantType === 'admin' 
                        || this.$route.params.registrantType === 'client') {
                            if(!data.basic_info){
                                localStorage.setItem('userid', data.user_id);

                                switch (true) {
                                    case data.unverified:
                                    this.msg = data.message;
                                        
                                        break;
                                    case this.$route.params.registrantType === 'jobseeker' && data.registrant_type_id === 1:
                                    case this.$route.params.registrantType === 'remote-contractor' && data.registrant_type_id === 2:
                                    case this.$route.params.registrantType === 'admin' && data.registrant_type_id === 3:
                                    case this.$route.params.registrantType === 'client' && data.registrant_type_id === 4:
                                        this.modals.cmModalShow = !this.modals.cmModalShow
                                        this.showError=false;
                                        // this.msg= 'You have not yet successfully finished the 2nd Step Registration. Please accomplish the registration form to fully verify your account.';
                                        
                                        break;
                                    default:
                                        this.setInvalidPillarAccessMessage(data);

                                        break;
                                }
                            }else{
                                this.msg=data.message;
                            }
                        } else {
                            this.showError=true;
                            this.color="danger";
                            this.msg=data.message;
                            
                        }

                     }else{
                         this.loaderLogin=false;

                         switch(this.$route.params.registrantType) {
                             case 'jobseeker':
                                this.setLocalStorage(data,this.$route.params.registrantType)
                                this.$router.push('/jobseeker/staff-overview');
                                break;
                             case 'remote-contractor':
                                this.setLocalStorage(data,this.$route.params.registrantType)
                                this.$router.push('/remote-contractor/contractor-overview');
                                break;
                             case 'admin':
                                this.setLocalStorage(data,this.$route.params.registrantType)
                                this.$router.push('/admin/corporate-apps');
                                break;
                            case 'client':
                                this.setLocalStorage(data,this.$route.params.registrantType)
                                this.$router.push('/client/landing-page');
                                break;    
                             default:
                                this.$router.push('/');
                         }
                     }
                 })
                 .catch((error) => {
                     
                 });
             }

         },
         setInvalidPillarAccessMessage(data) {
            switch(this.$route.params.registrantType) {
                case 'jobseeker':
                    if(data.registrant_type_id === 4) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Client Account Detected. This pillar is intended for Jobseeker Accounts only.";
                    }
                    else if(data.registrant_type_id === 2) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Remote Contractor Account Detected. This pillar is intended for Jobseeker Accounts only.";
                    }
                    else if(data.registrant_type_id === 3) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Corporate Apps Account Detected. This pillar is intended for Jobseeker Accounts only.";
                    }
                    else {
                        this.showError=true;
                        this.color="danger";
                        this.msg=data.message;
                    }
                    break;
                case 'remote-contractor':
                    if(data.registrant_type_id === 4) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Client Account Detected. This pillar is intended for Remote Contractor Accounts only.";
                    }
                    else if(data.registrant_type_id === 1) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Jobseeker Account Detected. This pillar is intended for Remote Contractor Accounts only.";
                    }
                    else if(data.registrant_type_id === 3) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Corporate Apps Account Detected. This pillar is intended for Remote Contractor Accounts only.";
                    }
                    else {
                        this.showError=true;
                        this.color="danger";
                        this.msg=data.message;
                    }
                    break;
                case 'admin':
                    if(data.registrant_type_id === 4) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Client Account Detected. This pillar is intended for Corporate Apps Accounts only.";
                    }
                    else if(data.registrant_type_id === 2) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Remote Contractor Account Detected. This pillar is intended for Corporate Apps Accounts only.";
                    }
                    else if(data.registrant_type_id === 1) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Jobseeker Account Detected. This pillar is intended for Corporate Apps Accounts only.";
                    }
                    else {
                        this.showError=true;
                        this.color="danger";
                        this.msg=data.message;
                    }
                    break;
                case 'client':
                    if(data.registrant_type_id === 3) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Corporate Apps Account Detected. This pillar is intended for Client Accounts only.";
                    }
                    else if(data.registrant_type_id === 2) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Remote Contractor Account Detected. This pillar is intended for Client Accounts only.";
                    }
                    else if(data.registrant_type_id === 1) {
                        this.showError=true;
                        this.color="danger";
                        this.msg="Jobseeker Account Detected. This pillar is intended for Client Accounts only.";
                    }
                    else {
                        this.showError=true;
                        this.color="danger";
                        this.msg=data.message;
                    }
                    break;    
                default:
                    this.$router.push('/');
            }
         },
         setLocalStorage(data,reg_type) {

            localStorage.setItem('userid', data.user.id);
            localStorage.setItem('user_email', data.user.email);
            localStorage.setItem('token', data.token);
            localStorage.setItem('timetracker_token', api.TIMETRACKER_TOKEN);
            localStorage.setItem('login_id', data.login_id);
            localStorage.setItem('registrant_type', reg_type);
           

            if(reg_type=="client"){
                localStorage.setItem('client_id', '');

                //Get Client Token
                axios({
                        method: 'get',
                        url: api.DEV_API_URL + '/client/get-client-id?userid='+data.user.id,
                        headers: { Authorization: `Bearer ${data.token}` }
                })
                .then(function (response) {    
                    if(response.data.success){
                        localStorage.setItem('client_id', response.data.client_id);
                    }
                    
                });
                
            }else{
                localStorage.setItem('client_id', data.client_id);
                localStorage.setItem('client_id_legacy', data.client_id_legacy);
                localStorage.setItem('client_name', data.client_name);
                localStorage.setItem('client_list', data.client_list);
            }

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
                 email: this.user.reset_email
             })
                 .then(({data}) => {
                     if(data.success){
                         this.loaderReset=false;
                         this.showResetPass=false;
                         this.showResetSuccess=true;
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

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const invalid_email = urlParams.get('invalid_email');
        const provider = urlParams.get('provider');
        const registrant_type_id = urlParams.get('registrant_type_id');
        const invalid_access = urlParams.get('invalid_access');
        if(invalid_email === "true") {
            this.showError=true;
            this.color="danger";
            this.msg=`Your ${provider} Account Registration that is only associated with your Phone Number is not allowed. Please use an Account with a valid email address to register.`;
        } else if (registrant_type_id !== null && invalid_access === "true") {
            if(this.$route.params.registrantType === 'remote-contractor') {
                var data = {
                    registrant_type_id: parseInt(registrant_type_id),
                    message: "Sorry, only verified Remote Contractors are allowed to log in."
                }
            } else {
                var data = {
                    registrant_type_id: parseInt(registrant_type_id),
                    message: "The account you entered is incorrect. Please try again."
                }
            }

            this.setInvalidPillarAccessMessage(data);
        }

        // if(localStorage.getItem('userid') && localStorage.getItem('token')) {
        //     let self = this;
        //     axios({
        //         method: 'post',
        //         url: api.DEV_API_URL + '/get-profile/onboarding',
        //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        //         data: {
        //             jobseeker_id: localStorage.getItem('userid'),
        //             info_type: 'basic',
        //         }
        //     })
        //     .then(function (response) {
        //         switch(self.$route.params.registrantType) {
        //             case 'jobseeker':
        //                 self.$router.push('/jobseeker/staff-overview');
        //             break;
        //             case 'remote-contractor':
        //                 self.$router.push('/remote-contractor/staff-overview');
        //             break;
        //             case 'admin':
        //                 self.$router.push('/admin/corporate-apps');
        //             break;
        //             default:
        //             this.$router.push('/');
        //         }
        //     })
        // }

        switch(this.$route.params.registrantType) {
            case 'jobseeker':
                this.pageSlug = 'jobseeker',
                this.pageTitle = 'Jobseeker Login';
                break;
            case 'remote-contractor':
                this.pageSlug = 'remote-contractor',
                this.pageTitle = 'Remote Contractor Login';
                break;
            case 'admin':
                this.pageSlug = 'admin',
                this.pageTitle = 'Corporate Apps Login';
                break;
            case 'client':
                this.pageSlug = 'client',
                this.pageTitle = 'Client Login';
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
         :show="loaderLogin" 
         @close="loaderLogin = false"
         :hasClose=false
         title="Test Alert"
         size="dialog-sm"
         :isScrollable=true>
             <template #body>
                 <Loader v-if="loaderLogin"></Loader>
             </template>
         </StandardModal>
         
         <StandardModal 
         
         :hasClose=true
         title="Reset Password"
         :size="(loaderReset == true) ? 'dialog-sm':'dialog-md'"
         :isScrollable=true>

             <template #body>
                 <Loader v-if="loaderReset"></Loader>
                     <form role="form" @submit.prevent v-if="!loaderReset">
                         <div v-if="showResetPass">    
                             <div class="text-center">
                                 <h3 class="text-black">Forgot Password</h3>
                                 <p class="text-black">Enter your email address to reset your password.</p>
                             </div>
                                     <MaterialAlert v-bind:color="popupColor" fontWeight="bold" v-if="showPopupError">
                                         <span v-text="msgPopup"></span>
                                     </MaterialAlert>
                             
                                 <input id="reset_email" type="email" class="form-control form-control-md" placeholder="Email Address" required v-model="user.reset_email"  />
                                         
                                 <br/>
                                 <div class="form-row">
                                     <div class="form-group col-md-12">
                                         <MaterialButton color="success" fullWidth @click="sendReset()">Send Request</MaterialButton>
                                     </div>
                                 </div>
                                 <div class="form-row">
                                     <div class="form-group col-md-12">
                                         <MaterialButton color="light" fullWidth @click="toggleModal('fpModalShow')"
                                         aria-label="Close">Cancel</MaterialButton>
                                     </div>
                                 </div>
                                 <!--<button type="button" class="btn-savechanges-popup btn btn-success btn-md false">
                                     Request
                                 </button>
                                 <button type="button" class="btn-close-popup btn btn-danger btn-md false" @click="closeModal">
                                     Cancel
                                 </button>-->
                         </div>  
                     </form>
                     <div v-if="showResetSuccess">
                         <div class="text-center">
                             <h3 class="text-black">Request Granted!</h3>
                             <p class="text-black">Check your email to create your new password.</p>
                         </div>
                         
                     </div>

             </template>

         </StandardModal>
     </Teleport>

     <Teleport to="body">
        <StandardModal 
        :show="modals.cmModalShow" 
        @close="modals.cmModalShow = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-lg"
        :isScrollable=true>

        <template #body>
                <div class="center my-1 justify-content-right">
                    <span class="" style="font-size:70px"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>
                    <p class="mb-n1" style="font-family:'Inter-Bold' !important; font-size:18px;">You have been initially onboarded by the system.</p><br/>
                    <small class="" style="font-family:'Inter-Light' !important; color: #212529; font-size: medium;">However, the second stage of the registration process requires you to completely provide the fundamental demographic data about yourself. <br/><br/>
                     If you wish to proceed in completing your second stage registration, click "Proceed". <br/>If you are not ready at this time, click "Cancel"</small>
                </div>
                <!-- <material-button @click="modals.rpModalShow = false" size="xs" variant="contained" color="success" class="mb-0 me-2 btn-center">
                    Ok
                </material-button> -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-center my-3">
                <button @click="$router.push(`/register/basic-info/${pageSlug}`)" class="btn command-btn btn-sm my-2" type="button" variant="contained">Proceed</button>
                <!-- <button data-dismiss="modal" class="btn btn-alert btn-sm my-2" type="button" variant="contained">Cancel</button> -->
                <button @click="cancel()" class="btn no-btn btn-sm my-2" type="button" variant="contained">Cancel</button>
                </div>
            </template>

        </StandardModal>
    </Teleport>
      <div class="row" v-if="type =='desktop'">
         <div class="col-md-4 rs-background">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-7" v-if="!modals.fpModalShow">
             <div class="container">
                 <div class="row">
                     <div class="col-12 text-center">
                         <h3 class="login-title text-center font-colors mt-0 my-3">{{ pageTitle }}</h3>
                         <div class="form-row py-3">
                                 <div class="offset-3 col-lg-6">
                                     <MaterialAlert v-if="showError" v-bind:color="color" fontWeight="bold">
                                         <span v-text="msg"></span>
                                     </MaterialAlert>
                                 </div>
                                 <div class="offset-3 col-lg-6">
                                     <MaterialInput class="input-group-static " label="" type="text" placeholder="Email Address" id="email" v-model="user.email" @blur="checkEmail('login')"/>
                                 </div>
                                 <div class="offset-3 col-lg-6 py-3">
                                     <MaterialInput class="input-group-static " label="" type="password" placeholder="Password" id="password" v-model="user.password"/>
                                 </div>
                                 <div class="offset-3 col-lg-6 py-1">
                                     <div class="container-fluid gx-5">
                                         <div class="row">
                                             <div class="col-md-6 col-sm-6 col-6">
                                                 <a v-if="pageSlug != 'remote-contractor' && pageSlug != 'client' && pageSlug != 'admin'" @click="$router.push(`/register/${pageSlug}`)">
                                                    <span class="font-colors link-text">
                                                        <p class="others float-start">Not yet a Member?</p>
                                                    </span>
                                                </a>
                                             </div>
                                             <div class="col-md-6 col-sm-6 col-6">
                                                <a href="javascript:void(0);" 
                                                variant="gradient"
                                                color="success"  @click="$router.push(`/forgot-password/${pageSlug}`)">
                                                    <span class="font-colors link-text">
                                                        <p class="others float-end">Forgot Password?</p>
                                                    </span>
                                                </a>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                 <div class="offset-3 col-lg-6">
                                     <MaterialButton class="command-btn capitalize" @click="login" variant="light" size="md">Login</MaterialButton>
                                 </div>
                                 <template v-if="pageSlug != 'client' && pageSlug != 'admin'">
                                    <div class="offset-3 col-lg-6 px-3 mt-3 mb-3">
                                        <div class="separator">
                                            <div class="line"></div>
                                            <span>Or</span>
                                            <div class="line"></div>
                                        </div>
                                        
                                    </div>
                                    <div class="offset-3 col-lg-6 px-4">
                                        <h6 class="text-center font-colors margin-bottom p-0 mb-3" v-if="pageSlug == 'jobseeker'">Login or sign up in seconds</h6>
                                        <h6 class="text-center font-colors margin-bottom p-0 mb-3" v-else>Login in seconds</h6>
                                        <SocialAuthentication ></SocialAuthentication>
                                    </div>
                                </template>
                                 
                             </div>
                         
                     </div>
                 </div>
             </div>
         </div>
         
         <div v-if="modals.fpModalShow" class="col-md-8 pt-5">
         </div>
      </div>
      <div v-else class="row" >
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
                     <div class="col-12 text-center">
                         <h3 class="login-title text-center font-colors mt-0 my-3">{{ pageTitle }}</h3>
                         
                             <div class="form-row py-3">
                                 <div class="col-lg-6">
                                     <MaterialAlert v-if="showError" v-bind:color="color" fontWeight="bold">
                                         <span v-text="msg"></span>
                                     </MaterialAlert>
                                 </div>
                                 <div class="col-lg-6">
                                     <MaterialInput class="input-group-static " label="" type="text" placeholder="Email Address" id="email" v-model="user.email" @blur="checkEmail('login')"/>
                                 </div>
                                 <div class="col-lg-6 py-3">
                                     <MaterialInput class="input-group-static " label="" type="password" placeholder="Password" id="password" v-model="user.password"/>
                                 </div>
                                 <div class="col-lg-6 py-1">
                                     <div class="container">
                                         <div class="row">
                                             <div class="col-md-6 col-sm-6 col-6">
                                                 <a href="javascript:void(0);" 
                                                 variant="gradient"
                                                 color="success"  @click="$router.push(`/forgot-password/${pageSlug}`)"
                                                 ><span class="font-colors link-text"><p class="others" style="text-align:left">Forgot Password?</p></span></a>
                                             </div>
                                             <div class="col-md-6 col-sm-6 col-6 text-center">
                                                 <a @click="$router.push(`/register/${pageSlug}`)"><span class="font-colors link-text"><p class="others" style="text-align:right">Not yet a Member?</p></span></a>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                 <div class="col-lg-6">
                                     <MaterialButton class="command-btn capitalize" @click="login" variant="light" size="md">Login</MaterialButton>
                                 </div>
                                 <div class="col-lg-6 px-4">
                                     <div class="separator">
                                         <div class="line"></div>
                                         <span>Or</span>
                                         <div class="line"></div>
                                     </div>
                                     
                                     
                                 </div>
                                 <div class="col-lg-6 px-4 py-4">
                                     <h6 class="text-center font-colors margin-bottom p-0">Login or sign up in seconds</h6>
                                     <SocialAuthentication></SocialAuthentication>
                                     
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
 font-weight:unset !important;
 font-size: 10pt !important;
}

.others{
 color:#5E44FF !important;
}
.others:hover{
 font-weight: bold;
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
  background-color: #5E44FF;
  color: #f2f2f2;
}
.btnColor:hover{
  text-transform: capitalize;
  background-color: #5E44FF;
  color: #f2f2f2;
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
  font-family: 'Inter-Light' !important;
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
</style>