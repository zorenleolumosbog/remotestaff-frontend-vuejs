 
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
    export default {
        data(){
          return{
            user: { 
              email: '',
              password:'',
              cpassword:'',
            },
            pageSlug: '',
            pageTitle: '',
            showError:false,
            errorMessage:'',
            showSuccess:false,
            API_URL:'',
            loader: false,
            showForm: true,
            showPasswordValidator:false,
            validatePass:{
                eight:false,
                uppercase:false,
                specialChar:false,
                number:false,
                lowercase:false,
            },
            validPassword:false,
            isDisabled:false
          };
        },
        methods:{
          passFocus(){
            if(this.validPassword){
              this.showPasswordValidator=false;
            }
            else{
              this.showPasswordValidator=true;
            }
          },
          passNonFocus(){
              this.showPasswordValidator=false;
              if(this.validPassword == false){
                this.errorMessage = 'Please enter a valid password.';
                this.showError =  true;
              }
          },
          checkPassword(){
            if(this.validPassword){
              this.showPasswordValidator=false;
              this.showError = false;
              this.errorMessage = '';
            }
            else{
              this.showPasswordValidator=true;
            }
            let password = this.user.password;
            const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
              if(password.length < 8){
                  this.validatePass.eight = false;
              }
              else{
                this.validatePass.eight = true;
              }

              this.validatePass.number = /\d/.test(password);
              this.validatePass.uppercase = /[A-Z]/.test(password);
              this.validatePass.specialChar = format.test(password);
              this.validatePass.lowercase = /[a-z]/.test(password);

              if(this.validatePass.eight
              &&this.validatePass.eight 
              &&this.validatePass.uppercase
              &&this.validatePass.specialChar
              &&this.validatePass.lowercase){
                this.validPassword = true;
                this.showPasswordValidator=false;
                this.showError = false;
                this.errorMessage = '';
              }
              else{
                this.validPassword = false;
                this.showPasswordValidator=true;
              }
          },
          onCreatePost(){
            let email = this.user.email;
            let password = this.user.password;
            let cPassword = this.user.cpassword;
            let isValid = this.validPassword;

            this.showError = false;
            this.errorMessage = '';
            if(!email){
              this.errorMessage = 'Email is required.';
              this.showError =  true;
            }
            else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
              this.errorMessage = 'Please enter a valid email address.';
              this.showError =  true;
            }
            else if(!password){
              this.errorMessage = 'Password is required.';
              this.showError =  true;
            } 
            else if(!isValid){
              this.errorMessage = 'Please enter a valid password.';
              this.showError =  true;
            }
            else if(!cPassword){
              this.errorMessage = 'Confirm Password is required.';
              this.showError =  true;
            }
            else if((cPassword != password)){
              this.errorMessage = 'Passwords do not match.';
              this.showError =  true;
            }
            else{
              this.loader = true;
              this.showForm = false;

              axios.post(this.API_URL+'/register/onboarding',
              { 
                  email:email,
                  password:password,
                  password_confirm:cPassword,
                  registrant_type: this.$route.params.registrantType
                }

                ).then((response)=>{
                
                this.showForm = false;
                this.showError =  false;
                this.showSuccess = true;
                this.loader = false;
              }).catch((error)=>{
                if(error.response.status == 422){
                  this.errorMessage = 'Email is already taken.';
                  this.showError =  true;
                }
                else{
                  this.errorMessage = "There's a problem on contacting the server";
                  this.showError =  true;
                }
                this.loader = false;
                this.showForm = true;
                this.showSuccess = false;
              });
            }
          },
          signUp(){
                this.isDisabled = true;
          }
         
        },
        mounted(){
            this.API_URL = api.DEV_API_URL;

            switch(this.$route.params.registrantType) {
              case 'jobseeker':
                  this.pageSlug = 'jobseeker',
                  this.pageTitle = 'Jobseeker Registration';
                  break;
              case 'admin':
                  this.pageSlug = 'admin',
                  this.pageTitle = 'Corporate Apps Registration';
                  break;
              case 'client':
                  this.pageSlug = 'client',
                  this.pageTitle = 'Client Registration';
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
        <div class="row">
            <template v-if="type =='desktop'">
                <div class="col-md-4 rs-background">
                    <div class="justify-content-center" style="text-align: center;">
                        <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
                    </div>
                </div>
            </template>
            <template v-else>
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
            </template>
            <div class="col-md-8 pt-7">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <h3 class="login-title text-center font-colors mt-0 my-3">{{ pageTitle }}</h3>
                            <div class="form-row py-3">
                                <div class="text-center">
                                    <Loader v-if="loader"></Loader>
                                </div>
                                <div class="col-lg-6 text-start" :class="{'offset-3': type =='desktop'}">
                                    <MaterialAlert v-if="showError" class="alert alert-danger" fontWeight="bold">
                                        <span class="font-color-alert">{{errorMessage}}</span>
                                    </MaterialAlert>
                                    <template v-if="!showSuccess && !loader">
                                        <form role="form" @submit.prevent="onCreatePost">
                                            <MaterialInput
                                            id="email"
                                            class="input-group-static py-3"
                                            :label="{ text: 'Email Address*', class: 'form-label' }"
                                            type="email"
                                            v-model="user.email"
                                            />
                                            <MaterialInput
                                            id="password"
                                            class="input-group-static py-3"
                                            :label="{ text: 'Password*', class: 'form-label' }"
                                            type="password"
                                            v-model="user.password"
                                            maxlength="150"
                                            @focusin="passFocus"
                                            @focusout="passNonFocus"
                                            @input="checkPassword"
                                            />
                                            <MaterialInput
                                            id="confirmpassword"
                                            class="input-group-static py-3"
                                            maxlength="150"
                                            :label="{ text: 'Confirm Password*', class: 'form-label' }"
                                            type="password"
                                            v-model="user.cpassword"
                                            />
                                            <div v-if="showPasswordValidator" class="alert alert-light py-2">
                                                <ul>
                                                    <li v-bind:class="{ checker: validatePass.eight }">Must be at least 8 characters long</li>
                                                    <li v-bind:class="{ checker: validatePass.uppercase }">Must include at least one uppercase letter</li>
                                                    <li v-bind:class="{ checker: validatePass.lowercase }">Must include at least one lowercase letter</li>
                                                    <li v-bind:class="{ checker: validatePass.number }">Must include at least one number</li>  
                                                    <li v-bind:class="{ checker: validatePass.specialChar }">Must include at least one non-alphanumeric character</li>
                                                </ul> 
                                            </div>
                                            <div class="text-center">
                                                <MaterialButton @click.once="signUp"
                                                    class="command-btn capitalize"
                                                    variant="light" 
                                                    size="md"
                                                    type="submit"
                                                    :disabled='isDisabled'
                                                    >Sign Up
                                                </MaterialButton>
                                            </div>
                                            <p class="mt-4 text-sm text-center already">
                                                Already a member?
                                                <a @click="$router.push(`/login/${pageSlug}`)">
                                                    <span class="already mt-4 text-sm">Log In Now</span>
                                                </a>
                                            </p>
                                        </form> 
                                        <!-- Social Authentication -->
                                        <br>
                                        <div class="form-row">
                                            <div class="px-3">
                                                <div class="separator">
                                                    <div class="line"></div>
                                                    <span>Or</span>
                                                    <div class="line"></div>
                                                </div>
                                            </div>
                                            <div class="text-center px-4 py-4">
                                                <h6 class="font-colors margin-bottom p-0">Login or sign up in seconds</h6>
                                                <SocialAuthentication ></SocialAuthentication>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <!--If successful 1st step registration-->
                                <div class="col-12 text-center" v-if="showSuccess"> 
                                    <h3 class="login-title text-center font-colors mt-7 my-3"></h3>
                                    <div class="form-row py-3">
                                        <div class="text-center">
                                            <div class="reset"><i class="fa fa-paper-plane my-3">{{ pageTitle = '' }}</i></div>
                                            <h4 class="font-color-success">Almost There!</h4>
                                            <p class="font-color-success">
                                                Please check your email to verify and continue.
                                            </p>
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
    font-weight:unset !important;
    font-size: 10pt !important;
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
     background-color: #76FF5B;
     color: #212529;
 }
 
 .btnColor:hover{
     text-transform: capitalize;
     background-color: #76FF5B;
     color:#212529;
 }

 .already{
  color:#5E44FF;
 }
 
 .already:hover{
  color:#5E44FF;
  font-weight: bold;
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
.reset{
    font-size: 100px !important;
    color: rgb(88, 219, 88);
    text-align: center;
}
 </style>