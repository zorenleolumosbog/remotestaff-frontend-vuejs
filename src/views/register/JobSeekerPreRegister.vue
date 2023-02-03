<script setup>
    import { onMounted } from "vue";
    
    // example components
    import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
    import Header from "@/examples/Header.vue";
    
    //Vue Material Kit 2 components
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialSwitch from "@/components/MaterialSwitch.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import RSNavbar from "@/views/home/RSNavbar.vue";
    
    // material-input
    import setMaterialInput from "@/assets/js/material-input";
    import axios from 'axios';
    import Loader from "@/components/Loader.vue";
    import api  from "@/static/config.json";
    //import { validate } from "json-schema";
    import SocialAuthentication from "../SocialAuthentication/TheJobseeker.vue";

    onMounted(() => {
      setMaterialInput();
    });
    </script>
    <script>
      export default {
        data(){
          return{
            user: { 
              email: '',
              password:'',
              cpassword:'',
            },
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
                  password_confirm:cPassword}

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
          }
         
        },
        created: function(){
          this.API_URL = api.DEV_API_URL;
          /*axios.get("/src/static/config.json").then(response => {
                this.API_URL = response.data.DEV_API_URL;
          });*/
        }
      }
      
    </script>
    <template>
      <RSNavbar/>
      <Header>
        <div
          class="page-header align-items-start min-vh-100 bg-reg"
          
          loading="lazy"
        >
          <span class="mask bg-gradient-dark opacity-6"></span>
          <div class="container my-auto">
            <div class="row">
              <div class="col-lg-4 col-md-8 col-12 mx-auto">
                <div class="container-fluid p-0">
                  <h1
                        class="text-white font-weight-bolder text-center font-type-header mb-4"
                      >
                        Jobseeker Sign Up
                      </h1>
                </div>
                <div class="card z-index-0 fadeIn3 fadeInBottom">
                 <div class="card-body">
                    <div class="text-center">
                      <Loader v-if="loader"></Loader>
                    </div>
                    <div v-show="showError" class="alert alert-danger"><span class="font-color-alert">{{errorMessage}}</span></div>
                    <div v-show="showForm">
                      <form role="form" class="text-start" @submit.prevent="onCreatePost">
                        <MaterialInput
                          id="email"
                          class="input-group-outline my-3"
                          :label="{ text: 'Email*', class: 'form-label' }"
                          type="email"
                          v-model="user.email"
                        />
                        <MaterialInput
                          id="password"
                          class="input-group-outline mb-3"
                          :label="{ text: 'Password*', class: 'form-label' }"
                          type="password"
                          v-model="user.password"
                          @focusin="passFocus"
                          @focusout="passNonFocus"
                          @input="checkPassword"

                        />
                        <MaterialInput
                          id="confirmpassword"
                          class="input-group-outline mb-3"
                          :label="{ text: 'Confirm Password*', class: 'form-label' }"
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
                        <div class="text-center">
                          <MaterialButton
                            class="my-4 mb-2"
                            variant="gradient"
                            color="success"
                            type="submit"
                            fullWidth
                            
                            >Sign Up</MaterialButton
                          >
                        </div>
                        <p class="mt-4 text-sm text-center">
                          Already a member?
                          <a
                            
                            @click="$router.push('/jobseeker/login')"
                            class="text-success text-gradient font-weight-bold"
                            >Log In Now</a
                          >
                        </p>
                      </form>
                    </div>
                    <!-- Social Authentication -->
                    <br>
                    <div class="form-row" v-show="showForm">
                      <div class="form-group col-md-12">
                        <social-authentication  :buttonTextPrefix="'Register via'"></social-authentication>
                      </div>
                    </div>

                    <div v-show="showSuccess">
                        <div class="text-center">
                          <h4 class="font-color-success">Almost There!</h4>
                          <p class="font-color-success">
                            Please check your email<br>
                            to verify and continue.
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </Header>
    </template>
    <style scope>
        a{
          cursor:pointer;
        }
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
        .font-type-header{
          font-size: 240%;
          font-family :Arial, Helvetica, sans-serif;
        }
        /*.checker{
            display:none;
        }*/
        .checker { color: #2ecc71 }
        
    </style>