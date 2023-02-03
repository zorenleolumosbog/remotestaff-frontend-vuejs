<template>
    <div class="col-lg-12 col-md-12 col-sm-12 mx-3">
        <div class="row container-fluid div-border pt-3 px-0">
            <div class="col-md-12 mt-3">
                <div class="row justify-content-center">
                    <div class="col-xl-12 col-md-12 text-center mb-3">
                        <h4 class="black-font profile" v-if="data.profile">{{ data.profile.reg_firstname }} {{ data.profile.reg_lastname }}</h4>
                        <h5 class="black-font id">ID: <span v-if="data.profile">{{ data.profile.reg_link_preregid }}</span></h5>
                        <h5 class="black-font last-login">Last Login: {{ toLocaleDateString(new Date()) }}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-12 mt-4 complete-footer">
                <div class="col-12 text-start px-0 d-grid gap-2 pe-1 mt-3 border-top">
                    <h6 class="contact text-center mt-1">Contact our Customer Care Team</h6> 
                </div>
                <div class="d-grid gap-2 col-5 mx-auto">
                    <!-- <button class="btn command-btn" type="button">Contact</button> -->
                    <MaterialButton class="command-btn" size="sm">Contact</MaterialButton>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
</script>

<script>
    import { Form } from 'vform';
    import api from "@/static/config.json";
    import axios from 'axios';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    export default {
        data() {
            return {
                data: {
                    profile: [],
                    validations: {
                        errors: [],
                        success: {
                            messsage: ""
                        }
                    }
                },
            }
        },
        components:{
            StandardModal,
            axios,
        },
        mounted() {
            this.getProfile();

            this.emitter.on("mapProfileName", profileInfo => {
                this.data.profile = profileInfo;
            });
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
                        self.data.profile = response.data.data;
                    }
                });
            },
            toLocaleDateString(date) {
                var date = new Date(date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };

                return date.toLocaleDateString('en', options);
            }
        }
    }
</script>

<style scoped>
    .profile{
        color:rgb(26, 26, 26)!important;
    }
   .id{
        font-family: 'Inter-Light' !important;
        color:rgb(26, 26, 26)!important;
    }
    .contact{
        /* color: rgb(221, 221, 221); */
        color: #7b809a;
        font-family: 'Inter-Light' !important;
        font-size: small !important;
    }
    .last-login{
        /* color: rgb(221, 221, 221); */
        color: #7b809a;
        font-family: 'Inter-Light' !important;
        font-size: small !important;
    }

    .div-border {
        border: 2px solid #dde1e1;
        border-radius: 5px;
        margin-bottom: 10px;
    }

</style>
<style scope src="../../../assets/css/standard-colors.css">
</style>