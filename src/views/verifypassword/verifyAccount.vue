<script setup>
    import { onMounted } from "vue";
    
    // example components
    import logo from "@/assets/img/rs-logo-white.png";
    //Vue Material Kit 2 components
    import MaterialInput from "@/components/MaterialInput.vue";
    // material-input
    import setMaterialInput from "@/assets/js/material-input";
    import successLogo from "@/assets/img/Vectorcheck.svg";
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
            token: '',
            isverified:false,
            redirect_url: '',
            registrant_type:''
          };
        },
        methods:{
          
        },
        created: function(){
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const error = urlParams.get('error');
          const jobseeker_id = urlParams.get('id');
          const registrantType = urlParams.get('type');
          this.registrant_type = registrantType;
          localStorage.setItem('userid', jobseeker_id);
          const token = urlParams.get('token');
          localStorage.setItem('token', token);
          this.token = `/register/basic-info/${registrantType}?token=${token}`;

          if(error=="alreadyverify"){
            this.isverified = true;
            this.$router.push(`/login/${registrantType}`);
          }

          if(registrantType=='admin'){
            this.redirect_url = '/login/admin';
          }else if(registrantType=='jobseeker'){
            this.redirect_url = '/login/jobseeker';
          }else if(registrantType=='client'){
            this.redirect_url = '/login/client';
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
            <div class="col-md-8 pt-5">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <!-- <h3 class="login-title text-center font-colors mt-0 my-3">Account Verification</h3> -->
                            <div class="form-row py-3 my-7">
                                <div class="text-center">
                                    <Loader v-if="loader"></Loader>
                                </div>
                                <div class="col-lg-12 text-start"> <!--removed  :class="{'offset-3': type =='desktop'}"-->
                                    <div class="card-body text-center">
                                      
                                        <div v-if="!isverified">
                                          <img
                                              :src="successLogo"
                                              alt="title"
                                              loading="lazy"
                                              :style="{ height: '70px' }"> 
                                        <h2 class="font-color-success font-weight-bolder title">
                                          Email Verified!
                                        </h2>
                                        <p class="mb-4">Please fill up the registration form to fully verify your account.</p>
                                        <a :href="token" class="btn btn-md command-btn capitalize" variant="light">Proceed to Registration</a>
                                        </div> 
                                        <div v-if="isverified"> 
                                            <img
                                              :src="successLogo"
                                              alt="title"
                                              loading="lazy"
                                              :style="{ height: '70px' }"> 
                                            <h2 class="font-color-success font-weight-bolder title">
                                            Email Already Verified!
                                            </h2>
                                            <p class="mb-4 font-color-success ">Please fill up the registration form to fully verify your account.</p>
                                            <a :href="`/register/basic-info/${registrantType}`" class="btn command-btn btn-md capitalize" variant="light">Proceed to Registration</a>
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
      
      .proceed-btn{background: #63FF44; color:#000; font-weight: bold; padding: 10px 10px; width: 100%;  display: block; margin-bottom: 25px; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;}
      .proceed-btn:hover{color:#fff;}
      .title{margin-bottom: 22px!important; margin-top: 22px;}

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
     background-color: #76FF5B!important;
     color: #212529!important;
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
     font-size: xx-large!important;
     font-family: 'Inter-Bold' !important;
     margin-bottom: 80px!important;
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

.font-color-success{
    font-family: 'Inter-Light' !important;
}
.capitalize{
    text-transform: capitalize !important;
    font-weight:unset !important;
    font-size: 10pt !important;
}
  </style>