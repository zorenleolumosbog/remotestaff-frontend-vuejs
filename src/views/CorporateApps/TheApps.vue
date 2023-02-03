<script setup>
    // example components
    import HorizontalTeamCard1 from "./../../examples/cards/teamCards/HorizontalTeamCard1.vue";
    import CenteredBlogCard from "./../../examples/cards/blogCards/CenteredBlogCard.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
    import BackgroundBlogCard from "@/examples/cards/blogCards/BackgroundBlogCard.vue";
    import rda from "@/assets/img/rda-ico.svg";
    import timesheet from "@/assets/img/operations-icon.svg";
    import accounting from "@/assets/img/accounting-ico.svg";
    import ats from "@/assets/img/ats-ico.svg";
    import hris from "@/assets/img/hris-ico.svg";
    import masterfiles from "@/assets/img/masterfiles-ico.svg";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import Loader from "@/components/Loader.vue";
    import api  from "@/static/config.json";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import SocialAuthentication from "../SocialAuthentication/TheJobseeker.vue";
    defineProps({
    email: {
        type: String,
        default: "",
    },
    size: {
        type: String,
        default: "md",
    },
    });

    function getClasses(size, success, error) {
        let sizeValue, isValidValue;

        sizeValue = size && `form-control-${size}`;

        if (error) {
            isValidValue = "is-invalid";
        } else if (success) {
            isValidValue = "is-valid";
        } else {
            isValidValue = "";
        }

        return `${sizeValue} ${isValidValue}`;
    }

    
</script>
<script>
    import axios from 'axios'

    export default {
        data(){
            return{
                job_login:false,
                bd_login:false,
                cm_login:false,
                cs_login:false,
                ia_login:false,
                rp_login:false,
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
                    jobModalShow: false,
                    bdModalShow: false,
                    cmModalShow: false,
                    csModalShow: false,
                    iaModalShow: false,
                    rpModalShow: false,
                    fpModalShow: false,
                },
                showModalError : false
            }
            
        },
        components: {
            axios
        },
        methods:{
            toggleModal(modalName){
                console.log(modalName)
                let display_none = "display: block;";
                let display = "display: block; background-color: rgb(93 93 93 / 50%);";

                if(modalName == "jobModalShow"){
                    this.user.email = "";
                    this.user.password = "";
                    this.showError = false;
                    this.modals.jobModalShow = !this.modals.jobModalShow

                }else if(modalName == "bdModalShow"){
                    this.modals.bdModalShow = !this.modals.bdModalShow

                }else if(modalName == "cmModalShow"){
                    this.modals.cmModalShow = !this.modals.cmModalShow

                }else if(modalName == "csModalShow"){
                    this.modals.csModalShow = !this.modals.csModalShow

                }else if(modalName == "iaModalShow"){
                    this.modals.iaModalShow = !this.modals.iaModalShow
                    
                }else if(modalName == "rpModalShow"){
                    this.modals.rpModalShow = !this.modals.rpModalShow
                    
                }else {
                   
                    this.modals.jobModalShow = false

                    this.modals.fpModalShow = !this.modals.fpModalShow
                    
                    this.showPopupError=false;
                    this.user.reset_email='';
                    this.showResetSuccess=false;
                    this.showResetPass = true;
                }
            },
            changeJob(event){
                this.job_login=true;
            },
            changeBD(event){
                this.bd_login=true;
            },
            changeCM(event){
                this.cm_login=true;
            },
            changeCS(event){
                this.cs_login=true;
            },
            changeIA(event){
                this.ia_login=true;
            },
            changeRP(event){
              this.rp_login=true;
            }, login() {

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
                            this.$router.push('/jobseeker/staff-overview');    // /admin ->push to admin panel
                        }
                    })
                    .catch((error) => {
                          
                    });
               }
                
            }, checkEmail($event){
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
            },checkPass(){
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
                }    ,    
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
            resetAll(){
                this.job_login=false;
                this.bd_login=false;
                this.cm_login=false;
                this.cs_login=false;
                this.ia_login=false;
                this.rp_login=false;
            },
            showResetPassResetAll(){
                this.showResetPass = true
                this.job_login=false;
                this.bd_login=false;
                this.cm_login=false;
                this.cs_login=false;
                this.ia_login=false;
                this.rp_login=false;
            },
            restrict_user_rda(){

                var user_email = localStorage.getItem('user_email');

                const user = ["arthur.admin.remotestaff@yopmail.com","ryann.ang@remotestaff.com","zoren.lumosbog@remotestaff.com","jimmar.repolido@remotestaff.com", "arthur.madrona@remotestaff.com", "joy.apuya@remotestaff.com", "rica@remotestaff.com", "angel.reyes@remotestaff.com", "jana.sybil@remotestaff.com", "tina.papango@remotestaff.com", "rox.dapitan@remotestaff.com"];
                
                if(user.includes(user_email)){
                    this.$router.push('/admin/corporate-apps/rda-dashboard/landing-page');
                }else{
                    this.showModalError = true;
                }

            },

            restrict_user_master(){

                var user_email = localStorage.getItem('user_email');

                const user = ["arthur.admin.remotestaff@yopmail.com","ryann.ang@remotestaff.com","zoren.lumosbog@remotestaff.com","jouie.baclig@remotestaff.com","jimmar.repolido@remotestaff.com", "arthur.madrona@remotestaff.com", "joy.apuya@remotestaff.com", "rodz.painagan@remotestaff.com", "rica@remotestaff.com", "angel.reyes@remotestaff.com", "jana.sybil@remotestaff.com", "tina.papango@remotestaff.com", "rox.dapitan@remotestaff.com","allan.pedernal@remotestaff.com","normaneil.macutay@remotestaff.com"];
                
                if(user.includes(user_email)){
                    this.$router.push('/admin/corporate-apps/masterfiles/landing-page')
                }else{
                    this.showModalError = true;
                }

            }
            ,
            restrict_user_hris(){

                var user_email = localStorage.getItem('user_email');

                const user = ["arthur.admin.remotestaff@yopmail.com","ryann.ang@remotestaff.com","zoren.lumosbog@remotestaff.com","jouie.baclig@remotestaff.com","jimmar.repolido@remotestaff.com", "arthur.madrona@remotestaff.com", "joy.apuya@remotestaff.com","regie.aba@remotestaff.com","cristina.reclamado@remotestaff.com","jerna.jariel@remotestaff.com","tine.custodio@remotestaff.com","lorein.asence@remotestaff.com","carlos.caday@remotestaff.com","mitzi.tabuena@remotestaff.com", "rica@remotestaff.com", "angel.reyes@remotestaff.com", "jana.sybil@remotestaff.com", "tina.papango@remotestaff.com", "rox.dapitan@remotestaff.com"];

                if(user.includes(user_email)){
                    this.$router.push('/admin/corporate-apps/hris/landing-page');
                }else{
                    this.showModalError = true;
                }

            },
            restrict_user_acctng(){

            var user_email = localStorage.getItem('user_email');

            const user = ["arthur.admin.remotestaff@yopmail.com","ryann.ang@remotestaff.com","zoren.lumosbog@remotestaff.com","jouie.baclig@remotestaff.com","jimmar.repolido@remotestaff.com", "arthur.madrona@remotestaff.com","rodz.painagan@remotestaff.com", "joy.apuya@remotestaff.com","juliesse.rasco@remotestaff.com","chique.javal@remotestaff.com","otie.bondoc@remotestaff.com","azel.aguilar@remotestaff.com","fred.bueno@remotestaff.com","sha.corilla@remotestaff.com","monica.estavillo@remotestaff.com","leigh.gonzalo@remotestaff.com","rona.rano@remotestaff.com","ness.rillera@remotestaff.com","margie.olita@remotestaff.com", "rica@remotestaff.com", "angel.reyes@remotestaff.com", "jana.sybil@remotestaff.com", "tina.papango@remotestaff.com", "rox.dapitan@remotestaff.com"];

            if(user.includes(user_email)){
                
                this.$router.push('/admin/corporate-apps/accounting/landing-page')
            
            }else{
                this.showModalError = true;
            }

            },
            closeModalError(){
                this.showModalError = false;
            }

        },
        created: function(){
            this.API_URL = api.DEV_API_URL;
        }
    };
</script>
<template>
    <section class="py-1">
      <div class="container-fluid">
      <div class="container">
        <div class="row link-margin justify-content-center">
            <div class="col-lg-4"> <!--col-lg-4 changed-->
                <div class="row padding-link" id="padding-link">
                <a v-on:click="toggleModal('cmModalShow')" class="link link-padding" 
                    variant="gradient"
                    color="success">
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=ats
                        :profile="{ name: 'Applicant Tracking System', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                </a>
                </div>
            </div> 
          <div class="col-lg-4">
            <div class="row padding-link" id="padding-link">
                
                <a @click="restrict_user_acctng" class="link link-padding"
                    variant="gradient"
                    color="success"
                >
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=accounting
                        :profile="{ name: 'Accounting', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                </a>
               
              
            </div>
          </div>
          <div class="col-lg-4">
            <div class="row padding-link" id="padding-link">
                <a  v-on:click="$router.push('/admin/corporate-apps/timesheet/landing-page')" class="link link-padding"
                    variant="gradient"
                    color="success"
                >
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=timesheet
                        :profile="{ name: 'Operations', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                </a>
            </div>
           </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-4">
                <div class="row padding-link" id="padding-link">
                    <a v-on:click="restrict_user_hris"  class="link link-padding"
                    variant="gradient"
                    color="success"
                    >
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=hris
                        :profile="{ name: 'HR Information System', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                    </a>
                </div>
            </div>
            <div class="col-lg-4 ">
                <div class="row padding-link" id="padding-link">
                <a v-on:click="restrict_user_rda" class="link link-padding"
                    variant="gradient"
                    color="success"
                >
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=rda
                        :profile="{ name: 'Reports, Dashboard & Analytics', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                </a>
            </div>
            </div>
            <div class="col-lg-4">
                <div class="row padding-link" id="padding-link">
                <a v-on:click="restrict_user_master" class="link link-padding"
                    variant="gradient"
                    color="success"
                >
                    <HorizontalTeamCard1
                        id="card-height"
                        :image=masterfiles
                        :profile="{ name: 'Masterfiles Management', link: '' }"
                        :position="{ label: '', color: '' }"
                        description=""
                    />
                </a>
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <Teleport to="body">
        <StandardModal 
        :show="modals.jobModalShow" 
        @close="modals.jobModalShow = false"
        :hasClose=true
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>

        <template #body>

            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" v-if="!loaderLogin">Jobseeker Login</h4>
            <Loader v-if="loaderLogin"></Loader>

            <div v-if="!loaderLogin">
                <form role="form" class="form-login" @submit.prevent="login">
                                        
                    <MaterialAlert v-if="showError" v-bind:color="color" fontWeight="bold">
                        <span v-text="msg"></span>
                    </MaterialAlert>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <input id="bgBackgroundTextJob" type="email" class="form-control form-control-md" placeholder="Email" isrequired="false"  v-model="user.email"
                                @blur="checkEmail('login')" required />
                            </div>
                    </div>
                    <div class="form-row pt-2">
                        <div class="form-group col-md-12">
                            <input id="bgBackgroundPass" type="password" class="form-control form-control-md" placeholder="Password" isrequired="false" v-model="user.password"/>
                        </div>
                    </div>
                    <br>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <div class="btn-right">     
                                <MaterialButton color="success" @click="login" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                            </div>
                        </div>
                    </div>
                
                </form>
                
                <!-- Social Authentication -->
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <social-authentication class="socialButtons" :buttonTextPrefix="'Login via'"></social-authentication>
                    </div>
                </div>
                
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-6 text-center">
                            <a href="javascript:void(0);" 
                            variant="gradient"
                            color="success"  @click="toggleModal('fpModalShow')"
                            ><span class="font-colors link-text"><p class="others">Forgot Password?</p></span></a>
                        </div>
                        <div class="col-md-6 col-sm-6 col-6 text-center">
                            <a href="/register"><span class="font-colors link-text"><p class="others" style="font-weight:bold">Not yet a Member?</p></span></a>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        </StandardModal>
    </Teleport>


    <Teleport to="body">
        <StandardModal 
        :show="modals.bdModalShow" 
        @close="modals.bdModalShow = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>

        <!-- <template #body>

            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" >Business Developer <br>Login</h4>
                <form role="form">
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <MaterialInput
                                class="input-group-static"
                                label=""
                                type="text"
                                placeholder="Email"
                                id="bgBackgroundBDEmail"
                            />
                        </div>
                    </div>
                    <div class="form-row pt-2">
                        <div class="form-group col-md-12">
                            <MaterialInput
                                class="input-group-static"
                                label=""
                                type="password"
                                placeholder="Password"
                                id="bgBackgroundBDPassword"
                            />
                        </div>
                    </div>
                    <br>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <div class="btn-right">
                                <MaterialButton color="success" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                            </div>
                            
                        </div>
                    </div>
                </form>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-6 text-center">
                            <a href="#"><span class="font-colors link-text"><p class="others">Forgot Password?</p></span></a>
                        </div>
                        <div class="col-md-6 col-sm-6 col-6 text-center">
                            <a href="#"><span class="font-colors link-text"><p class="others" style="font-weight:bold">Not yet a Member?</p></span></a>
                        </div>
                    </div>
                    
                </div>

        </template> -->

            <template #body>
                <div class="center my-1">
                <h4 class="alert-message">Lined-up for Development</h4>
                </div>
                <!-- <material-button @click="modals.rpModalShow = false" size="xs" variant="contained" color="success" class="mb-0 me-2 btn-center">
                    Ok
                </material-button> -->
                <div class="d-grid gap-2 col-4 mx-auto bottom-gap">
                <button @click="modals.bdModalShow = false" class="btn bg-gradient-light btn-sm my-0 false false w-auto black-font command-btn" type="button" variant="contained">Ok</button>
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
        size="dialog-md"
        :isScrollable=true>

        <!-- <template #body>
            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" >Client / Manager<br>Login</h4>
            <form role="form">
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="text"
                            placeholder="Email"
                            id="bgBackgroundCMEmail"
                        />
                    </div>
                </div>
                <div class="form-row pt-2">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="password"
                            placeholder="Password"
                            id="bgBackgroundCMPassword"
                        />
                    </div>
                </div>
                <div class="form-row pt-1">
                    <div class="form-group col-md-12">
                        <select class="form-select form-select-lg mb-3 selectBorder" aria-label="Default select example" >
                            <option selected>Main Acct. Holder</option>
                            <option>Manager</option>
                        </select>
                    </div>
                </div>
                
            </form>
            <div class="container-fluid p-0">
                <div class="row">
                    <div class="col-md-6 col-sm-7 col-7 pt-2">
                        <a href="#">
                            <span class="link-text-left font-colors link-text"><p class="others">Forgot Password?</p></span>
                        </a>
                    </div>
                    <div class="col-md-6 col-sm-5 col-5">
                        <div class="btn-right">
                            <MaterialButton color="success" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                        </div>
                    </div>
                </div>
            </div>

        </template> -->

            <template #body>
                <div class="center my-1">
                <h4 class="alert-message">Lined-up for Development</h4>
                </div>
                <!-- <material-button @click="modals.rpModalShow = false" size="xs" variant="contained" color="success" class="mb-0 me-2 btn-center">
                    Ok
                </material-button> -->
                <div class="d-grid gap-2 col-4 mx-auto bottom-gap">
                <button @click="modals.cmModalShow = false" class="btn bg-gradient-light btn-sm my-0 false false w-auto black-font command-btn" type="button" variant="contained">Ok</button>
                </div>
            </template>

        </StandardModal>
    </Teleport>


    <Teleport to="body">
        <StandardModal 
        :show="modals.csModalShow" 
        @close="modals.csModalShow = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>

        <!-- <template #body>
            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" >Contracted Staff <br>Login</h4>
            <form role="form">
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="text"
                            placeholder="Email"
                            id="bgBackgroundCSEmail"
                        />
                    </div>
                    
                </div>
                <div class="form-row pt-2">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="password"
                            placeholder="Password"
                            id="bgBackgroundCSPassword"
                        />
                    </div>
                </div>
                <br>
            </form>
            <div class="container-fluid p-0">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-6">
                        <MaterialCheckbox >Trial Staff</MaterialCheckbox>
                    </div>
                    <div class="col-md-6 col-sm-6 col-6">
                        <div style="float:right;">
                            <MaterialButton color="success" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                        </div>
                        
                    </div>
                </div>
            </div>
            <br>
            <div class="text-center">
                <a href="#"><span class="text-center font-colors top-margin link-text"><p class="others">Forgot Password?</p></span></a>
            </div>

        </template> -->
            <template #body>
                <div class="center my-1">
                <h4 class="alert-message">Lined-up for Development</h4>
                </div>
                <!-- <material-button @click="modals.rpModalShow = false" size="xs" variant="contained" color="success" class="mb-0 me-2 btn-center">
                    Ok
                </material-button> -->
                <div class="d-grid gap-2 col-4 mx-auto bottom-gap">
                <button @click="modals.csModalShow = false" class="btn bg-gradient-light btn-sm my-0 false false w-auto black-font command-btn" type="button" variant="contained">Ok</button>
                </div>
            </template>

        </StandardModal>
    </Teleport>


    <Teleport to="body">
        <StandardModal 
        :show="modals.iaModalShow" 
        @close="modals.iaModalShow = false"
        :hasClose=true
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>

        <template #body>
            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" >In-House Admin <br>Login</h4>
            <form role="form">
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="text"
                            placeholder="Email"
                            id="bgBackgroundIAEmail"
                        />
                    </div>
                    
                </div>
                <div class="form-row pt-2">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="password"
                            placeholder="Password"
                            id="bgBackgroundIAPassword"
                        />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-12" >
                        <div class="text-center">
                            
                        </div>
                        
                    </div>
                    
                </div>
                <div class="form-row">
                    <div class="form-group col-md-12">
                        
                    </div>
                </div>
                
                <br>
                
            </form>
            <div class="container-fluid p-0">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-7" >
                        <MaterialCheckbox id="lar">Log In as Recruiter</MaterialCheckbox>
                    </div>
                    <div class="col-md-6 col-sm-6 col-5 ">
                        <div style="float:right">
                            <MaterialButton color="success" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                        </div>
                        
                    </div>

                </div>
            </div>
            <div class="text-center">
                <a href="#"><span class="text-center font-colors top-margin link-text"><p class="others">Forgot Password?</p></span></a>
            </div>

        </template>

        </StandardModal>
    </Teleport>


    <Teleport to="body">
        <StandardModal 
        :show="modals.rpModalShow" 
        @close="modals.rpModalShow = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>

        <!-- <template #body>
            <h4 class="login-modal-title text-center font-colors title mt-auto mb-3" >Referral Partner<br>Login</h4>
            <form role="form">
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <MaterialInput
                            class="input-group-static"
                            label=""
                            type="text"
                            placeholder="Email"
                            id="bgBackgroundRPEmail"
                        />
                    </div>
                </div>
                <div class="form-row pt-2">
                    <div class="form-group col-md-12">
                            <MaterialInput
                            class="input-group-static"
                            label=""
                            type="password"
                            placeholder="Password"
                            id="bgBackgroundRPPassword"
                        />
                    </div>
                </div>
                <br>
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <div class="btn-right">
                            <MaterialButton color="success" style="text-transform:capitalize; color:black; font-size: small;">Login</MaterialButton>
                        </div>
                    </div>
                </div>
                
            </form>
            <div class="container">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-6 text-center">
                        <a href="#"><span class="text-center font-colors top-margin bottom-Margin link-text"><p class="others">Forgot Password?</p></span></a>
                    </div>
                    <div class="col-md-6 col-sm-6 col-6 text-center">
                        <a href="#"><span class="text-center font-colors bottom-Margin link-text"><p class="others" style="font-weight:bold">Not yet a Member?</p></span></a>
                    </div>
                </div>
            </div>

        </template> -->

            <template #body>
                <div class="center my-1">
                <h4 class="alert-message">Lined-up for Development</h4>
                </div>
                <!-- <material-button @click="modals.rpModalShow = false" size="xs" variant="contained" color="success" class="mb-0 me-2 btn-center">
                    Ok
                </material-button> -->
                <div class="d-grid gap-2 col-4 mx-auto bottom-gap">
                <button @click="modals.rpModalShow = false" class="btn bg-gradient-light btn-sm my-0 false false w-auto black-font command-btn" type="button" variant="contained">Ok</button>
                </div>
            </template>

        </StandardModal>
    </Teleport>
    

    <Teleport to="body">
        <StandardModal 
        :show="modals.fpModalShow" 
        @close="modals.fpModalShow = false"
        :hasClose=true
        title="Test Alert"
        size="dialog-md"
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


        <StandardModal 
                        :show="showModalError"
                        @close="closeModalError"
                        :hasClose=true
                        :hasHeader='false'
                        :hasFooter='false'
                        title="Error"
                        size='dialog-sm'>
                        <template #body>
                            <h5 class="error-msg alert-message text-center">Insufficient privilege.<br/><br/></h5>
                        </template>
                        <template #footer>
                            &nbsp;
                        </template>
        </StandardModal>
        
    </Teleport>

    </section>
</template>

<style scope>
.bottom-gap{
    margin-bottom: 14px;
    margin-top: 14px;
}
.container .link #card-height{
        height: 90px !important;
        justify-content:center;
   }
    .container .link:hover .card{
        transform: scale(1.02);
        transition: 0.3s;
        /* background-color:  #37b61a; */
        color : white !important;
        background-image: linear-gradient(#3E26D3,#5E44FF);
        /* background-image: linear-gradient(#45781E,#7EE53E); */
        /*background-image: linear-gradient(to bottom right, #56b93f, rgb(178, 174, 174));*/
   }
   .container .link:hover .card span{
    transform: scale(1.02);
        transition: 0.3s;
        /* background-color:  #37b61a; */
        /* background-image: linear-gradient(#7EE53E, #45781E); */
        color : white !important;
        /*background-image: linear-gradient(to bottom right, #31f505, rgb(178, 174, 174))*/;
        
   }

   .container .link .card .border-radius-md{
        margin-bottom: 0;
        margin-left: 20%;
   }
    .close-btn-position-over{
        position:static!important;
    }
    h3.title{margin-bottom:10%;}
    #custom-css-ts{
        padding: 0!important;
        margin:0!important;
    }
    
    .text-black{
       color:black!important; 
    }
    .font-colors{ /**Changed from 1.4em*/
        font-family: 'Inter-Bold' !important;
        font-size: 1.4em;       
    }
    .top-margin-adjusted{
        margin-top:2%;
    }
    .top-margin{
        margin-top: 10%;
    }
    .bottom-Margin{
        margin-bottom: 15%;
    }
    .link-margin{
        margin-bottom:2px; /**Changed */
    }
    .link-padding{
        padding:0!important;
    }
    .padding-link{
        padding:2%; /*changed*/
        transition: padding 0.5s;
    }
    .padding-link:hover{
        
        padding:2%;
        
    }

    @media only screen and (max-width: 992px) {
        #padding-link{
            padding:0.9%;
            padding-left: 8%;
            padding-right: 8%;
        }
       
    }
    @media only screen and (max-width: 768px) {
        #padding-link{
            padding:0.9%;
            padding-left: 10%;
            padding-right: 10%;
        }
       
    }
    .padding-bot{
        padding-bottom:3%;
    }
    .link-text-left{
        text-align:left!important;
    }
    .link-text-right{
        text-align:right!important;
    }
    .btn-right{
        text-align:right!important;
    }
    .link{
        transition: 0.3s;
        cursor: pointer;
        border: 8px solid none; /** Changed from 8px to 0 */
        border-radius:21px;
    }
    .link:hover{
        border-color: #1A580E;
        
    }
    /* .link:active{
        border-color:#1A580E;
    } */
    .link-text{
        color: #002315;
        transition :0.3s;
    }
    .link-text:hover{
        /* color: #63f542; */
        background-image: linear-gradient(#45781E,#7EE53E);
    }
    .selectBorder{
        border: none;
    }
    .center{
        text-align: center;
    }

    .others{
        letter-spacing: 0px; 
        font-size:small;
    }
    
    .login-modal-title{
        font-family: 'Inter-Bold' !important;
        /* font-size: large; */
    }

    .alert-message{
        color:#212529 !important;
    }

    .btn-center{
        text-align: center;
    }

    
    
    
    #reset_email{background:#F5F5F5; padding: 15px 18px; color: #000!important;}
    
    #bgBackgroundResPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
    }
   #bgBackgroundTextJob{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundPass{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundBDEmail{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundBDPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundCMEmail{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundCMPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundCSEmail{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundCSPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundIAEmail{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundIAPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundRPEmail{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }
   #bgBackgroundRPPassword{
        background:#F5F5F5; padding: 15px 18px; color: #000!important;
   }

   
</style>