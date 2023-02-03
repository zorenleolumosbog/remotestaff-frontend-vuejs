 
 <script setup>
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
    import SocialAuthentication from "../../SocialAuthentication/TheJobseeker.vue";
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
                    axios.post(this.API_URL+'/login', this.user)
                    .then(({data}) => {
                        if(data.success==false){
                            this.loaderLogin=false;
                            this.showError=true;
                            this.color="danger";
                            this.msg=data.message;
                        }else{
                            this.loaderLogin=false;
                            localStorage.setItem('userid', data.user.id);
                            localStorage.setItem('token', data.token);
                            this.$router.push('/jobseeker/staff-overview');   
                        }
                    })
                    .catch((error) => {
                        
                    });
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
            :hasClose=true
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
         <div class="row" v-if="type =='desktop'">
            <div class="col-md-4 rs-background">
                <div class="justify-content-center" style="text-align: center;">
                    <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
                </div>
            </div>
            <div class="col-md-8 pt-5" v-if="!modals.fpModalShow">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <h3 class="login-title text-center font-colors mt-0 my-3">Jobseeker Login</h3>
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
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-md-6 col-sm-6 col-6 text-center">
                                                    <a href="javascript:void(0);" 
                                                    variant="gradient"
                                                    color="success"  @click="$router.push('/jobseeker/forgot-password')"
                                                    ><span class="font-colors link-text"><p class="others">Forgot Password?</p></span></a>
                                                </div>
                                                <div class="col-md-6 col-sm-6 col-6 text-center">
                                                    <a @click="$router.push('/register')"><span class="font-colors link-text"><p class="others" style="font-weight:bold">Not yet a Member?</p></span></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="offset-3 col-lg-6">
                                        <MaterialButton class="btnColor" @click="login" color="info" size="lg">Login</MaterialButton>
                                    </div>
                                    <div class="offset-3 col-lg-6 px-3">
                                        <div class="separator">
                                            <div class="line"></div>
                                            <span>Or</span>
                                            <div class="line"></div>
                                        </div>
                                        
                                    </div>
                                    <div class="offset-3 col-lg-6 px-4">
                                        <h6 class="text-center font-colors margin-bottom p-0">Login or sign up in seconds</h6>
                                        <SocialAuthentication ></SocialAuthentication>
                                    </div>
                                    
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
                            <h3 class="login-title text-center font-colors mt-0 my-3">Jobseeker Login</h3>
                            
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
                                                <div class="col-md-6 col-sm-6 col-6 text-center">
                                                    <a href="javascript:void(0);" 
                                                    variant="gradient"
                                                    color="success"  @click="$router.push('/jobseeker/forgot-password')"
                                                    ><span class="font-colors link-text"><p class="others">Forgot Password?</p></span></a>
                                                </div>
                                                <div class="col-md-6 col-sm-6 col-6 text-center">
                                                    <a @click="$router.push('/register')"><span class="font-colors link-text"><p class="others" style="font-weight:bold">Not yet a Member?</p></span></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <MaterialButton class="btnColor" @click="login" color="info" size="lg">Login</MaterialButton>
                                    </div>
                                    <div class="col-lg-6 px-4">
                                        <div class="separator">
                                            <div class="line"></div>
                                            <span>Or</span>
                                            <div class="line"></div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div class="col-lg-6 px-5">
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
 a{
    cursor: pointer;
 }
 .rs-background{
    background-image: url("https://ges-dev1.remotestaff.com/assets/landing-page-banner-thumb.f80af095.jpg");
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
 </style>