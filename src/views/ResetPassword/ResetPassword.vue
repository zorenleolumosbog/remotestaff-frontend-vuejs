<script setup>
    import { onMounted } from "vue";
    import axios from 'axios';
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import Header from "@/examples/Header.vue";
    import logo from "@/assets/img/rs-logo-white.png";
    import successLogo from "@/assets/img/Vectorcheck.svg";
    import setMaterialInput from "@/assets/js/material-input";
    import Loader from "@/components/Loader.vue";
    import api  from "@/static/config.json";
    import { useWindowsWidth } from "@/assets/js/useWindowsWidth";

    const { type } = useWindowsWidth();
    const { width } = useWindowsWidth();
    onMounted(() => {
      setMaterialInput();
    });
</script>
<script>
    export default {
        data(){
            return{
                API_URL:'',
                user:{
                  password:'',
                  cpassword:'',
                },
                showError:false,
                errorMessage:'',
                showSuccess:false,
                showForm:true,
                loader:false,
                token:'',
                showPasswordValidator:false,
                validatePass:{
                    eight:false,
                    uppercase:false,
                    specialChar:false,
                    number:false,
                    lowercase:false,
                },
                validPassword:false,
            }
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
            onResetPasswordPost(){
                
                let password = this.user.password;
                let cPassword = this.user.cpassword;
                let isValid = this.validPassword;
                this.showError = false;
                this.errorMessage = '';
                if(!password && !cPassword){
                  this.errorMessage = 'Password and Confirm Password are required.';
                    this.showError =  true;
                }
                else if(!password){
                    this.errorMessage = 'Password is required.';
                    this.showError =  true;
                }
                else if(!cPassword){
                    this.errorMessage = 'Confirm Password is required.';
                    this.showError =  true;
                }
                else if(!isValid){
                    this.errorMessage = 'Please enter a valid password.';
                    this.showError =  true;
                }
                else if((cPassword != password)){
                    this.errorMessage = 'Passwords do not match.';
                    this.showError =  true;
                }
                else{
                    this.loader = true;
                    this.showForm = false;
                    const params = new Proxy(new URLSearchParams(window.location.search), {
                        get: (searchParams, prop) => searchParams.get(prop),
                    });
                    let value = params.token
                        axios.post(this.API_URL+'/change-password',
                    {token:value,password:password}
                    ).then((response)=>{
                        console.log(response);
                        this.loader = false;
                        this.showSuccess = true;
                    }).catch(error=>{
                        this.errorMessage = "There's a problem in contacting the server";
                        this.showError =  true;
                        this.showForm = true;
                        this.loader = false;
                    });
                }
            }
        },
        created: function(){
            this.API_URL = api.DEV_API_URL
            /*axios.get("/src/static/config.json").then(response => {
                    this.API_URL = response.data.DEV_API_URL;
            });*/
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
                      <div class="col-6 text-center form-main">
                          <h3 class="login-title text-center font-color-success title mt-0 my-2" v-if="!showSuccess">Create Your New Password</h3>
                          <span class="font-color-success font-weight-bolder title mt-1 mb-0" v-if="!showSuccess">Please enter your new password</span>
                          <div class="form-row py-3">
                            <div v-show="showError" class="alert alert-danger"><span class="font-color-alert">{{errorMessage}}</span></div>
                  <div v-show="showForm">
                    <form role="form" class="text-start" @submit.prevent="onResetPasswordPost">
                     
                      <MaterialInput
                        id="password"
                        class="input-group-static mb-3"
                        label=""
                        placeholder="Password"
                        type="password"
                        v-model="user.password"
                        @focusin="passFocus"
                        @focusout="passNonFocus"
                        @input="checkPassword"
                      />
                      <MaterialInput
                        id="confirmpassword"
                        class="input-group-static mb-3"
                        placeholder="Confirm Password"
                        label=""
                        type="password"
                        v-model="user.cpassword"
                      />
                      <div v-if="showPasswordValidator" class="alert alert-light">
                            <ul>
                                <li v-bind:class="{ checker: validatePass.eight }">Must be at least 8 characters long</li>
                                <li v-bind:class="{ checker: validatePass.uppercase }">Must include at least one uppercase letter</li>
                                <li v-bind:class="{ checker: validatePass.lowercase }">Must include at least one lowercase letter</li>
                                <li v-bind:class="{ checker: validatePass.number }">Must include at least one number</li>  
                                <li v-bind:class="{ checker: validatePass.specialChar }">Must include at least one non-alphanumeric character</li>
                            </ul> 
                        </div>
                      <div class="confirm">
                        <MaterialButton
                            class="command-btn capitalize btnColor mt-3"
                            color="light"
                            type="submit"
                            size="md"
                            
                            >Confirm</MaterialButton
                          >
                      </div>
                      
                    </form>
                  </div>
                  <div v-show="showSuccess" class="wrap-success">
                    <div class="text-center">
                            <img
                                :src="successLogo"
                                alt="title"
                                loading="lazy"
                                :style="{ height: '70px' }"> 
                          <h2 class="font-color-success mt-4 mb-3">Success!</h2>
                          <p class="font-color-success mb-4">You can now login with your new password.
                        </p>
                            <div class="container">
                                <a href="/">
                                    <MaterialButton
                                        class="command-btn capitalize btnColor"
                                        color="light"
                                        type="submit"
                                        size="md"
                                        
                                        >Back to Login</MaterialButton
                                    >
                                </a>
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
  <style scope>
      .bg-reg{
          background-image: url('/src/assets/img/reg-bg-thumb.jpg'); 
          background-repeat: no-repeat; 
          background-size: 100% 100%;
          padding-top: 5%;
          padding-bottom: 5%;
      }
      .font-color-alert{
          color:white;
      }
      .font-color-success{
          color:#002315; 
      }
      .checker { color: #2ecc71 }
      .form-main{margin: 0 auto; margin-top: 70px!important;}
      .confirm{ text-align: center; margin-top: 15px;}
      /* .confirm button{color:#fff!important; background-color: #5E44FF!important; } */
      .login-title{  font-size: xx-large; font-family: 'Inter-Light' !important;  }
      .wrap-success{margin-top:80px;}
      .btn-back{width: 65%!important;}
  </style>