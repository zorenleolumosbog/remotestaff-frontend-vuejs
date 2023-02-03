<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import axios from "axios";
    import api  from "@/static/config.json";
    export default {
        name: "TheAddEdit",
        props: ['show', 'countries', 'selectedData', 'selectedIndex'],
        components: {
            StandardModal,
            MaterialButton,
            axios
        },
        data () {
            return {
                API_URL : "",
                TOKEN : "",
                USERID : "",
                formData : [],
                clients: [],
                subcons: [],
                fieldErrors : {
                    client: {
                        error: false,
                        message: "Client is required",
                    },
                    subcon: {
                        error: false,
                        message: "Subcon is required",
                    },
                },
            }
        },
        methods : {

            handleChange ( field ) {

                const fieldLenght = this.formData[field].length;
                if ( fieldLenght === 0 ) {
                    this.fieldErrors[field].error = true;
                } else {
                    this.fieldErrors[field].error = false;
                }

            },

            formValidation () {
                
                const formData = this.formData;
                this.fieldErrors.client.error = !formData.client 
                    ? true : false;
                this.fieldErrors.subcon.error = !formData.subcon 
                    ? true : false;
                
            },

            checkTrue ( hasError ){
                
                return hasError.filter(value => value === true).length;

            },

            handleSubmit () {
                
                this.formValidation();

                // check errors
                const hasError = [];
                for(const x in this.fieldErrors){
                    hasError.push(this.fieldErrors[x]['error']);
                }

                if(!this.checkTrue(hasError)){
                    this.$emit( 'editProfile', this.formData )
                }

            },

            setDefaultValue () {
                console.log('hereee')
                console.log(this.selectedData);
                this.formData = {
                    id : this.selectedData['id'],
                    client : this.selectedData['link_client_id'],
                    subcon : this.selectedData['link_subcon_id'],
                }
            },

            getClients() {
                let _this = this

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/client-list',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    _this.clients = response.data.data
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        
                    }
                });
            },

            getSubcons() {
                let _this = this

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/subcon-list',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    _this.subcons = response.data.data
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        
                    }
                });
            }

        },
        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getClients();
            this.getSubcons();
            this.setDefaultValue();
        }
    }
</script>

<template>
    <StandardModal 
        @close="$emit( 'close' )"
        :show="show" 
        :hasFooter=true
        :hasHeader=true
        title="Client Profile"
        size="dialog-xxl"
        isScrollable="true"
        >

        <template #body>

            <form role="form" id="contact-form" method="post" autocomplete="off">
            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client" class="labels my-0">Client<span class="required-field">*</span></label>
                        <select id="client" class="form-select form-select-md" v-model="formData.client">
                            <option value="">Select Client</option>
                            <option v-for="(v, k) in clients" :value="v.id">{{v.client_name}}</option>
                        </select>
                        <span v-if="fieldErrors.client.error" class="error_msg">&nbsp;{{fieldErrors.client.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="subcon" class="labels my-0">Sub-contractor<span class="required-field">*</span></label>
                        <select id="subcon" class="form-select form-select-md" v-model="formData.subcon">
                            <option value="">Select Subcon</option>
                            <option v-for="(v, k) in subcons" :value="v.id">{{v.reg_firstname}} {{v.reg_lastname}}</option>
                        </select>
                        <span v-if="fieldErrors.subcon.error" class="error_msg">&nbsp;{{fieldErrors.subcon.message}}</span>
                    </div>
                </div>
            </div>
            </form>

        </template>

        <template #footer>
            <MaterialButton size="sm" variant="contained" class="command-btn mb-0"
                @click="handleSubmit">
                Update
            </MaterialButton><span>&nbsp;</span>
            <MaterialButton variant="contained" size="sm" class="no-btn mb-0" @click="$emit( 'close' )">
                Cancel
            </MaterialButton>
        </template>

    </StandardModal>
</template>

<style scoped>
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .action-btn {
        border-radius: 5px;
    }
    .btn-success {
        background-color: #5E44FF;
    }
    .action-btn:hover, .action-btn:focus-visible, .action-btn:focus, .action-btn:active {
        background: #2C16B2  !important;
    }
    .form-select {
        padding: 0.5rem 0.5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .required-field {
        color: red;
    }
    .error_msg {
        font-size: 0.9em;
        color: red;
    }
</style>