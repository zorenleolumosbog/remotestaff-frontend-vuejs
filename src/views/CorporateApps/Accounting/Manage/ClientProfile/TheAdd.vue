<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import axios from "axios";
    import api  from "@/static/config.json";
    export default {
        name: "TheAddEdit",
        props: ['show', 'countries', 'currencyOption'],
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
                formData : {
                    client_name : '',
                    client_poc: '',
                    client_poc_position : '',
                    client_addr_line1 : '',
                    client_addr_line2 : '',
                    client_country : '',
                    client_region : '',
                    client_state : '',
                    client_towncity : 0,
                    client_email : '',
                    client_phone : '',
                    client_ABN : '',
                    client_currency : 'AUD',
                },
                regions : [],
                states : [],
                townCities : [],
                fieldErrors : {
                    client_name: {
                        error: false,
                        message: "Client Name is required.",
                    },
                    client_poc: {
                        error: false,
                        message: "Point of Contact is required.",
                    },
                    client_poc_position: {
                        error: false,
                        message: "POC Position is required.",
                    },
                    client_email: {
                        error: false,
                        message: "Email is required.",
                    },
                    client_phone: {
                        error: false,
                        message: "Phone is required.",
                    },
                    client_ABN: {
                        error: false,
                        message: "ABN is required.",
                    },
                },
                currencies : ['AUD', 'USD', 'GBP', 'CAD', 'NZD'],
                countryLoader : false,
                stateLoader : false
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
                this.fieldErrors.client_name.error = !formData.client_name 
                    ? true : false;
                this.fieldErrors.client_poc.error = !formData.client_poc 
                    ? true : false;
                this.fieldErrors.client_poc_position.error = !formData.client_poc_position 
                    ? true : false;
                this.fieldErrors.client_email.error = !formData.client_email 
                    ? true : false;
                this.fieldErrors.client_phone.error = !formData.client_phone 
                    ? true : false;
                this.fieldErrors.client_ABN.error = !formData.client_ABN 
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
                    this.$emit( 'addProfile', this.formData )
                }

            },

            getRegionState ( e ) {
                this.countryLoader = true;
                this.townCities = [];
                axios.get(this.API_URL+'/admin/country/' + e.target.value,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        const data = response.data.data;
                        
                        this.formData.client_region = 0;
                        this.formData.client_state = 0;
                        this.formData.client_towncity = 0;

                        this.regions = data['regions'];
                        this.states = data['states'];

                        this.countryLoader = false;
                        
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },

            getStates ( e ) {
                
                this.formData.client_state = 0;
                this.formData.client_towncity = 0;

                for ( const x in this.regions ) {
                    if (this.regions[x].id == parseInt(e.target.value)) {
                        this.states = this.regions[x].states;
                        break;
                    }
                    
                }
            },

            getTownCities ( e ) {
                
                this.stateLoader = true;

                axios.get(this.API_URL+'/admin/state/' + e.target.value,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        const data = response.data.data;
                        
                        this.formData.client_towncity = 0;

                        this.townCities = data['towncities']

                        this.stateLoader = false;
                        
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            
            checkCount ( d ){
                return d.length > 0 ? false : true
            }
        },
        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
        }
    }
</script>

<template>
    <StandardModal 
        @close="$emit( 'close' )"
        :show="show" 
        :hasFooter=true
        :hasHeader=true
        :hasClose=true
        title="Client Profile"
        size="dialog-xxl"
        isScrollable="true"
        >

        <template #body>

            <form role="form" id="contact-form" method="post" autocomplete="off">
                
            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="clinet_name" class="labels my-0">Client Name <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control p-2" 
                            id="clinet_name"
                            v-model="formData.client_name"
                            maxlength="50"
                            @keyup="handleChange( 'client_name' )">
                        <span v-if="fieldErrors.client_name.error" class="error_msg">&nbsp;{{fieldErrors.client_name.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_poc" class="labels my-0">Point of Contact <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_poc"
                            v-model="formData.client_poc"
                            maxlength="50"
                            @keyup="handleChange( 'client_poc' )">
                        <span v-if="fieldErrors.client_poc.error" class="error_msg">&nbsp;{{fieldErrors.client_poc.message}}</span>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12">
                    <div class="form-group">
                        <label for="client_poc_position" class="labels my-0">POC Position <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_poc_position"
                            v-model="formData.client_poc_position"
                            maxlength="50"
                            @keyup="handleChange( 'client_poc_position' )">
                        <span v-if="fieldErrors.client_poc_position.error" class="error_msg">&nbsp;{{fieldErrors.client_poc_position.message}}</span>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_email" class="labels my-0">Email <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_email"
                            v-model="formData.client_email"
                            maxlength="50"
                            @keyup="handleChange( 'client_email' )">
                        <span v-if="fieldErrors.client_email.error" class="error_msg">&nbsp;{{fieldErrors.client_email.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_phone" class="labels my-0">Phone Number <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_phone"
                            v-model="formData.client_phone"
                            maxlength="50"
                            @keyup="handleChange( 'client_phone' )">
                        <span v-if="fieldErrors.client_phone.error" class="error_msg">&nbsp;{{fieldErrors.client_phone.message}}</span>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_ABN" class="labels my-0">ABN Number <span class="required-field">*</span></label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_ABN"
                            v-model="formData.client_ABN"
                            maxlength="50"
                            @keyup="handleChange( 'client_ABN' )">
                        <span v-if="fieldErrors.client_ABN.error" class="error_msg">&nbsp;{{fieldErrors.client_ABN.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_currency" class="labels my-0">Currency</label>
                        <select class="form-select form-select-md" v-model="formData.client_currency">
                            <option v-for="item in currencyOption" :value="item.id">
                                {{item.code}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_addr_line1" class="labels my-0">Address Line 1</label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_addr_line1"
                            v-model="formData.client_addr_line1"
                            maxlength="50">
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_addr_line1" class="labels my-0">Address Line 2</label>
                        <input type="text" class="input-group-outline form-control  p-2" 
                            id="client_addr_line1"
                            v-model="formData.client_addr_line2"
                            maxlength="50">
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="country" class="labels my-0">Country <i class="fas fa-spinner fa-pulse" v-if="countryLoader"></i></label>
                        <select id="country" class="form-select form-select-md" v-model="formData.client_country" 
                            @change="getRegionState">
                            <option value=""></option>
                            <option v-for="(v, k) in countries" :value="v.id">{{v.long_desc}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="region" class="labels my-0">Region</label>
                        <select id="country" class="form-select form-select-md" v-model="formData.client_region"
                            :disabled="checkCount(regions)"
                            @change="getStates">
                            <option value=""></option>
                            <option v-for="(v, k) in regions" :value="v.id">{{v.description}}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="state_province" class="labels my-0">State/Province<i class="fas fa-spinner fa-pulse" v-if="stateLoader"></i></label>
                        <select id="country" class="form-select form-select-md" v-model="formData.client_state"
                            @change="getTownCities" :disabled="checkCount(states)">
                            <option value=""></option>
                            <option v-for="(v, k) in states" :value="v.id">{{v.description}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="client_addr_line1" class="labels my-0">Town/City</label>
                        
                        <select id="country" class="form-select form-select-md" v-model="formData.client_towncity"
                        :disabled="checkCount(townCities)">
                            <option value=""></option>
                            <option v-for="(v, k) in townCities" :value="v.id">{{v.description}}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
            </div>

            </form>

        </template>

        <template #footer>
            <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0"
                @click="handleSubmit">
                Save
            </MaterialButton><span>&nbsp;</span>
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
    .form-select:disabled {
        background-color: #cacaca !important;
    }
</style>