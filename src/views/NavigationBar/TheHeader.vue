<script setup>
    import { RouterLink } from "vue-router";
    import { ref, watch } from "vue";
    import { useWindowsWidth } from "../../assets/js/useWindowsWidth";

    // images
    import profPic from "@/assets/img/blank.png";
    import ArrDark from "@/assets/img/down-arrow-dark.svg";
    import downArrow from "@/assets/img/down-arrow.svg";
    import DownArrWhite from "@/assets/img/down-arrow-white.svg";
    import rsLogo from "@/assets/img/v64_44.png";
    import msgIcon from "@/assets/img/mesage-ico.svg";
    import notifIcon from "@/assets/img/bell-ico.svg"
    import api  from "@/static/config.json";
    import axios from 'axios';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import MaterialButton from "@/components/MaterialButton.vue";

    const props = defineProps({
        transparent: {
            type: Boolean,
            default: false
        },
        light: {
            type: Boolean,
            default: false
        },
        dark: {
            type: Boolean,
            default: false
        },
        sticky: {
            type: Boolean,
            default: false
        },
        darkText: {
            type: Boolean,
            default: false
        },
        headerName:{
            type: String,
            default: '',
        }
    });

    // set rs logo
    function getRsLogo() {
        return rsLogo;
    }

    // set arrow  color
    function getArrowColor() {
        if (props.transparent && textDark.value) {
            return ArrDark;
        } else if (props.transparent) {
            return DownArrWhite;
        } else {
            return ArrDark;
        }
    }

    // set text color
    const getTextColor = () => {
        let color;
        if (props.transparent && textDark.value) {
            color = "text-dark";
        } else if (props.transparent) {
            color = "text-white";
        } else {
            color = "text-dark";
        }

        return color;
    };

    function logout() {
               const token = localStorage.getItem('token');
               const login_id = localStorage.getItem('login_id');
				axios.post(api.DEV_API_URL+'/logout',{
                    login_id : login_id
                },{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
				});

        localStorage.removeItem('userid');
        localStorage.removeItem('token');
    }

    // set nav color on mobile && desktop

    let textDark = ref(props.darkText);
    const { type } = useWindowsWidth();

    if (type.value === "mobile") {
        textDark.value = true;
    } else if (type.value === "desktop" && textDark.value == false) {
        textDark.value = false;
    }

    const getView  = () => {
        let set;
        if (type.value === "mobile") {
            set = 'container-fluid px-2';
        } else if (type.value === "desktop") {
            set = 'container-fluid px-1';
        }else {
            set = 'container';
        }
        return set

    }

    watch(
        () => type.value,
            (newValue) => {
                if (newValue === "mobile") {
                textDark.value = true;
                } else {
                textDark.value = false;
                }
            }
    );
</script>
<script>
    export default {
        data(){
            return{
                token:{data:''},
                ID:{data:''},
                data: {
                    profile: []
                },
                showChangePass:false,
                showError:false,
                showPasswordValidator:false,
                showForm:true,
                showSuccess:false,
                errorMessage:'',
                password:{
                    jobseeker_id:'',
                    old_password:'',
                    new_password:'',
                },
                confPassword:{data:'',},
                validatePass:{
                    eight:false,
                    uppercase:false,
                    specialChar:false,
                    number:false,
                    lowercase:false,
                },
                loader:false,
                validPassword:false,
                tabHeaderTitle: ''
            }
        },
        methods:{
            getProfile() {
                let self = this;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/get-profile/onboarding',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: localStorage.getItem('userid'),
                        info_type: 'basic',
                    }
                })
                .then(function (response) {
                    if(response.data.success) {
                        switch (true) {
                            case self.$route.name === 'jobseeker' && response.data.data.registrant_type === 1:
                            case self.$route.name === 'remote-contractor' && response.data.data.registrant_type === 2:
                            case self.$route.name === 'admin-corporate-apps' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-accounting' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-timesheet' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-masterfiles' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-rda' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'admin-corporate-apps-hris' && response.data.data.registrant_type === 3:
                            case self.$route.name === 'client' && response.data.data.registrant_type === 4:

                                self.emitter.emit("mapRegistrantType", response.data.data.registrant_type);
                                self.data.profile.name = response.data.data.reg_firstname;
                                break;
                        
                            default:
                                switch (self.$route.name) {
                                    case 'admin-corporate-apps':
                                    case 'admin-corporate-apps-accounting':
                                    case 'admin-corporate-apps-timesheet':
                                    case 'admin-corporate-apps-masterfiles':
                                    case 'admin-corporate-apps-rda':
                                        self.$router.push(`/login/admin`);
                                        break;

                                    default:
                                        self.$router.push(`/login/${self.$route.name}`);
                                        break;
                                }
                                break;
                        }
                    }
                }).catch(function (error) {
                    self.$router.push(`/login/${self.$route.name}`);
                });
            },
            getProfilePhoto() {
                let self = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/getfile/onboarding?jobseeker_id=${localStorage.getItem('userid')}&filetype=4`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                .then((response)=>{
                    if(response.data.success){
                        self.data.profile.avatar = response.data.data.url;
                    }
                });
            },
            logout(){
                const token = localStorage.getItem('token');
				axios.post(this.API_URL+'/logout',{},{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
					localStorage.removeItem('userid');
					localStorage.removeItem('token');
                    this.$router.push("/");
				});
			},
            close(){
                this.showChangePass = false;
                this.loader=false;
                this.validPassword=false;
                this.showError = false;
                this.password.jobseeker_id = '';
                this.password.old_password = '';
                this.password.new_password = '';
                this.confPassword.data = '';
                this.errorMessage = '';
            },
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
              let password = this.password.new_password;
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
                
                let password = this.password.new_password;
                let cPassword = this.confPassword.data;
                let oldPass = this.password.old_password;
                let isValid = this.validPassword;
                this.showError = false;
                this.errorMessage = '';
                if(!oldPass){
                    this.errorMessage = 'Old Password is required.';
                    this.showError =  true;
                }
                else if(!password && !cPassword){
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
                    this.errorMessage = 'The New Password and Confirm Password do not match.';
                    this.showError =  true;
                }
                else{
                    this.loader = true;
                    this.showForm = false;
                    
                    let value = this.password;
                    value.jobseeker_id = this.ID.data;
                    console.log(value);
                    let jtoken = this.token.data;
                    axios.post(this.API_URL+'/update-password/onboarding',
                    {
                        jobseeker_id:value.jobseeker_id,
                        new_password:value.new_password,
                        old_password:value.old_password
                    },{
                        headers:{
                            'Authorization': `Bearer ${jtoken}`
                        }
                    }
                    ).then((response)=>{
                        if(response.data.success){
                            this.loader = false;
                            this.showChangePass = false;
                            this.showForm = true;
                            this.showSuccess = true;
                            this.password.new_password = '';
                            this.password.old_password = '';
                            this.confPassword.data = '';
                            this.close();
                        }
                        else{
                            if(response.data.message == 'New Password is same with old password.'){
                                //this.errorMessage = response.data.message;
                                this.errorMessage = "Your new password cannot be the same as your current password.";
                            }
                            else{
                                this.errorMessage = "The Old Password you entered is incorrect.";
                            }
                            this.loader = false;
                            this.showChangePass = true;
                            this.showForm = true;
                            this.showError =  true;
                        }
                        
                    }).catch(error=>{
                        console.log(error);
                        this.errorMessage = "There's a problem in contacting the server.";
                        this.showError =  true;
                        this.showForm = true;
                        this.loader = false;
                    });
                }
            }
		},
        watch: {
            $route (){
                this.tabHeaderTitle = '';
            }
        },
        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.token.data = localStorage.getItem('token');
            this.ID.data = localStorage.getItem('userid');

            this.getProfile();
            this.getProfilePhoto();

            this.emitter.on("mapProfilePhoto", photo => {
                this.data.profile.avatar = photo;
            });

            this.emitter.on("mapProfileName", profileInfo => {
                this.data.profile.name = profileInfo.reg_firstname;
            });

            this.emitter.on("mapHeaderTitle", tabHeaderTitle => {
                this.tabHeaderTitle = tabHeaderTitle;
            });
        }
    }
</script>
<template>
    <nav
        class="navbar navbar-expand-lg top-0 "
        :class="{
        'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
            props.transparent,
        'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
            props.sticky,
        'navbar-light bg-white z-index-7': props.light,
        ' navbar-dark bg-gradient-dark z-index-30': props.dark
        }"
    >
        <div
        :class="getView()"
        >
            <h3>{{ tabHeaderTitle.length === 0 ? headerName : tabHeaderTitle }}</h3>
            <button
                class="navbar-toggler shadow-none ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navigation"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon mt-2" style="color:black">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
                </span>
            </button>
            <div
                class="collapse navbar-collapse  pt-3 pb-2 py-lg-0"
                id="navigation"
            >
                <ul class="navbar-nav navbar-nav-hover ms-auto">
                    <li v-if="data.profile.name" class="nav-item mx-2">
                        <span class="nav-link ps-2 d-flex align-items-center" style="color:rgb(26, 26, 26)!important; font-size:16pt; font-family:'Inter-Bold' !important;">Hi, {{ data.profile.name }}!</span>
                    </li>
                    <!-- <li v-if="data.profile.name" class="nav-item dropdown dropdown-hover mx-2">
                        <a
                        role="button"
                        class="nav-link ps-2 d-flex cursor-pointer align-items-center"
                        :class="getTextColor()"
                        id="dropdownMenuBlocks"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                      
                        <img 
                            :src="msgIcon"
                            height="20" 
                            alt="Avatar" 
                            loading="lazy"
                        />
                        </a>
                    </li>
                    <li v-if="data.profile.name" class="nav-item dropdown dropdown-hover mx-2">
                        <a
                        role="button"
                        class="nav-link ps-2 d-flex cursor-pointer align-items-center"
                        :class="getTextColor()"
                        id="dropdownMenuDocs"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        <img
                            :src="notifIcon"
                            height="20" 
                            alt="Avatar" 
                            loading="lazy"
                        />
                        </a>
                    </li> -->
                    <li class="nav-item dropdown dropdown-hover mx-2 d-lg-none">
                        <a
                        role="button"
                        class="nav-link ps-2 d-flex cursor-pointer align-items-center"
                        :class="getTextColor()"
                        id="dropdownMenuPages"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                        >
                        <img v-if="data.profile.avatar" :src="data.profile.avatar" class="rounded-circle"
                                height="30" alt="Avatar" loading="lazy" />
                        <img v-else :src="profPic" class="rounded-circle"
                                height="30" alt="Avatar" loading="lazy" />&nbsp;
                        My profile
                        <img
                            :src="getArrowColor()"
                            alt="down-arrow"
                            class="arrow ms-1 d-lg-none d-block ms-auto"
                        />
                        </a>
                        <div
                        class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
                        aria-labelledby="dropdownMenuPages"
                        >
                            
                            <RouterLink
                                :to="{ name: 'about' }"
                                class="dropdown-item border-radius-md"
                            >
                                <span>Change Password</span>
                            </RouterLink>
                            <a class="dropdown-item border-radius-md" @click="logout"><span>Log out</span></a>
                           <!-- <RouterLink
                                :to="{ name: 'about' }"
                                class="dropdown-item border-radius-md" @click="logout"
                            >
                                <span>Log out</span>
                            </RouterLink>-->
                        </div>
                    </li>
                </ul>
                
                <ul class="navbar-nav d-lg-block d-none">
                   
                    <li class="nav-item dropdown dropdown-hover mx-2">
                        <a class="nav-link d-flex align-items-center" href="#" id="navbarDropdownMenuLink"
                        role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                            <img v-if="data.profile.avatar" :src="data.profile.avatar" class="rounded-circle"
                                height="40" alt="Avatar" loading="lazy" />
                            <img v-else :src="profPic" class="rounded-circle"
                                height="40" alt="Avatar" loading="lazy" />
                        </a>
                    
                        <ul class="dropdown-menu" style="right: 0; left: auto;" aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <RouterLink
                                    @click="showChangePass=true"
                                    :to="{ name: '' }"
                                    class="dropdown-item border-radius-md"
                                >
                                    <span>Change Password</span>
                                </RouterLink>
                                <RouterLink
                                    @click="logout"
                                    :to="{ name: 'landing-page' }"
                                    class="dropdown-item border-radius-md"
                                >
                                    <span>Log out</span>
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                    
                </ul>
            </div>
           
        </div>
        
    </nav>
<!-- End Navbar -->
    <Teleport to="body">
        <StandardModal 
        :show="showChangePass" 
        @close="close()"
        :hasClose=true
        :hasHeader=false
        :hasFooter="!loader"
        title="Dialog"
        :size="(loader == true) ? 'dialog-sm':'dialog-md'"
        :isScrollable=true>
            <template #body>
                <Loader v-if="loader"></Loader>
                <div class="row px-2" v-if="!loader && showForm">
                    <div class="col-12">
                        <div class="text-center mb-3">
                            <h4 class="login-title text-center font-colors m-0">Change Password</h4>
                            <span class="font-color-success font-weight-bolder mt-1 mb-0">Enter your old and new password</span>
                            <div v-if="showError" class="alert alert-danger mt-2">
                                <span class="font-color-alert">{{errorMessage}}</span>
                            </div>
                        </div>  
                    </div>
                </div>  
                <div class="row" v-if="!loader && showForm">
                    <div class="col-12">
                        <div class="px-4" v-if="showPasswordValidator">
                            <ul>
                                <li class="validator-font-size" v-bind:class="{ checker: validatePass.eight }">Must be at least 8 characters long</li>
                                <li class="validator-font-size" v-bind:class="{ checker: validatePass.uppercase }">Must include at least one uppercase letter</li>
                                <li class="validator-font-size" v-bind:class="{ checker: validatePass.lowercase }">Must include at least one lowercase letter</li>
                                <li class="validator-font-size" v-bind:class="{ checker: validatePass.number }">Must include at least one number</li>  
                                <li class="validator-font-size" v-bind:class="{ checker: validatePass.specialChar }">Must include at least one non-alphanumeric character</li>
                            </ul> 
                        </div>
                    </div>
                </div>
                <div class="form-group mb-3 px-2" v-if="!loader && showForm">
                    <input
                        class="input-group-outline form-control p-2"
                        type="password"
                        v-model="password.old_password"
                        maxlength="150"
                        placeholder="Type your Old Password"
                    />
                    
                </div>
                <div class="form-group mb-3 px-2" v-if="!loader && showForm">
                    <input
                        class="input-group-outline form-control p-2"
                        type="password"
                        v-model="password.new_password"
                        maxlength="150"
                        placeholder="Type New Password"
                        @focusin="passFocus"
                        @focusout="passNonFocus"
                        @input="checkPassword"
                    />
                    
                </div>
                <div class="form-group px-2" v-if="!loader && showForm">
                    <input
                        class="input-group-outline form-control p-2"
                        type="password"
                        v-model="confPassword.data"
                        maxlength="150"
                        placeholder="Confirm New Password"
                    />
                    
                </div>
                
            </template>
            <template #footer>
                <MaterialButton variant="gradient" color="light" class="command-btn mb-0" @click="onResetPasswordPost" v-if="!loader && showForm">
                    Change Password
                </MaterialButton>
            </template>
        </StandardModal>
        <StandardModal 
            :show="showSuccess" 
            @close="showSuccess = false"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm"
            :isScrollable=true>

            <!--<template #title>
                <h5 class="modal-title"> Alert Header </h5>
            </template>-->

            <template #body>
                <div class="text-center">
                    <h5 id="h4">Successfully saved.</h5>
                    <span>&nbsp;</span>
                </div>
            </template>
            

            </StandardModal>
    </Teleport> 
</template>

<style scoped>
    .validator-font-size{
        font-size: small;
    }

    .navbar-brand {
        padding: 0 !important;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    #h4{
        color:#002315;
        font-family: 'Inter' !important;
    }
    .login-title{  font-size: xx-large; font-family: 'Inter-Bold' !important;  }
    .checker { color: #2ecc71 }
    ul.navbar-nav li.nav-item:not(:last-child) span:after {
        content: "";
    }
</style>