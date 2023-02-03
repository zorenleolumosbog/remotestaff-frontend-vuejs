<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import axios from "axios";
    import api  from "@/static/config.json";
    import Multiselect from "@vueform/multiselect";
    import moment from 'moment';
    import Datepicker from '@vuepic/vue-datepicker';
    import vSelect from "vue-select";
    export default {
        name: "TheAddEdit",
        props: ['show', 'clientsOption', 'subcontractorsOption'],
        components: {
            StandardModal,
            MaterialButton,
            axios,
            Multiselect,
            moment,
            Datepicker,
            vSelect
        },
        data () {
            return {
                API_URL : "",
                TOKEN : "",
                USERID : "",
                formData : {
                    client_id	: '',
                    client_name : '',
                    link_client_subcon_pers: '',
                    basic_monthly_rate : '',
                    basic_weekly_rate : '',
                    basic_daily_rate : '',
                    basic_hourly_rate : '',
                    effective_date_from : '',
                    effective_date_to : '',
                    is_active : 1,
                },
                selectedClient : '',
                selectedSubcon : '',
                fieldErrors : {
                    client_id: {
                        error: false,
                        message: "Client is required.",
                    },
                    link_client_subcon_pers: {
                        error: false,
                        message: "Salary Type is required.",
                    },
                    basic_monthly_rate: {
                        error: false,
                        message: "Monthly Rate is required.",
                    },
                    basic_weekly_rate: {
                        error: false,
                        message: "Weekly Rate is required.",
                    },
                    basic_daily_rate: {
                        error: false,
                        message: "Daily Rate is required.",
                    },
                    basic_hourly_rate: {
                        error: false,
                        message: "Hourly Rate is required.",
                    },
                    effective_date_from: {
                        error: false,
                        message: "Date From is required.",
                    },
                    effective_date_to: {
                        error: false,
                        message: "Date To is required.",
                    },
                },
                clients : this.clientsOption
            }
        },
        methods : {

            handleChangeClient () {
                this.selectedSubcon = '';
                this.$emit('getSubcontractors', this.selectedClient);
            },

            handleChange ( field ) {

                let fieldLenght = 0;

                if ( this.formData[field] ) {
                    fieldLenght = this.formData[field].toString().length;
                }

                this.fieldErrors[field]['error'] = (fieldLenght === 0) ? true : false;
                
                const fielToValidateLenght = [
                    'basic_monthly_rate', 
                    'basic_weekly_rate', 
                    'basic_daily_rate',
                    'basic_hourly_rate'
                ]
                if ( fielToValidateLenght.includes( field ) ){

                    const x = field.split("_")[1];
                    const fieldName = x.charAt(0).toUpperCase() + x.slice(1);
                    
                    if ( fieldLenght > 12 ) {
                        this.fieldErrors[field]['error'] = true;
                        this.fieldErrors[field]['message'] = "Maximum of 12 digits are allowed.";
                    } else {
                        this.fieldErrors[field]['message'] = `${fieldName} Rate is required.`;
                    }

                }

            },

            formValidation () {
                
                const formData = this.formData;
                const date_from = this.formatDate(formData.effective_date_from);
                const date_to = this.formatDate(formData.effective_date_to);

                const requiredFields = [
                        'link_client_subcon_pers',
                        'basic_monthly_rate',
                        'basic_weekly_rate',
                        'basic_daily_rate',
                        'basic_hourly_rate',
                        'effective_date_from',
                        'effective_date_to'
                    ];

                for(const x in this.fieldErrors){
                    this.fieldErrors[x]['error'] = (!formData[x] && requiredFields.includes(x)) ? true : false;

                    this.handleChange( x );
                }
                

                if(formData.effective_date_from && (date_to < date_from)){
                    this.fieldErrors.effective_date_to.error = true;
                    this.fieldErrors.effective_date_to.message = "Date To should be equal to or greater than Date From.";
                }

            },

            checkTrue ( hasError ){
                
                return hasError.filter(value => value === true).length;

            },

            formatDate ( value ){

                if ( !value ) { return ""}
                var d = new Date(value),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');

            },

            handleSubmit () {
                
                this.formData['client_id'] = this.selectedClient ? this.selectedClient: '';
                this.formData['link_client_subcon_pers'] = this.selectedSubcon ? this.selectedSubcon: '';

                this.formValidation();

                // check errors
                const hasError = [];
                for(const x in this.fieldErrors){
                    hasError.push(this.fieldErrors[x]['error']);
                }

                if(!this.checkTrue(hasError)){
                    
                    this.formData['link_client_subcon_pers'] = this.selectedSubcon;
                    this.formData['basic_monthly_rate'] = this.formData['basic_monthly_rate'].toFixed(2);

                    this.formData['effective_date_from'] = this.formatDate(this.formData['effective_date_from']);
                    this.formData['effective_date_to'] = this.formatDate(this.formData['effective_date_to']);

                    this.$emit( 'addSubConRate', this.formData )
                }

            },

            handleSelect ( value ) { 
                this.fieldErrors[value]['error'] = false;
            },

            computeRate () {

                const monthly = this.formData.basic_monthly_rate;
                const daily = ((monthly * 12) / 52) / 5;
                const hourly = (((monthly * 12) / 52) / 5) / 8;
                const weekly = (hourly * 5) * 8;

                this.formData.basic_daily_rate = daily.toFixed(2);
                this.formData.basic_hourly_rate = hourly.toFixed(2);
                this.formData.basic_weekly_rate = weekly.toFixed(2);

            },

        },

        watch: {

            'formData.effective_date_to' (newVal, oldVal){

                if ( oldVal && !newVal ) {
                    this.fieldErrors.effective_date_to.error = true;
                    this.fieldErrors.effective_date_to.message = "Date To is required.";
                    return
                }

                const fromDate = this.formatDate(this.formData.effective_date_from);
                this.fieldErrors.effective_date_to.error = false;

                if ( this.formatDate(newVal) < fromDate ){
                    this.fieldErrors.effective_date_to.error = true;
                    this.fieldErrors.effective_date_to.message = "Date To should be equal to or greater than Date From.";
                
                } else {
                    this.fieldErrors.effective_date_to.error = false;

                }
            },
            
            'formData.effective_date_from' (newVal, oldVal){

                if ( oldVal && !newVal ) {
                    
                    const effectiveDateToError = this.fieldErrors.effective_date_to.error;
                    const effectiveDateToMessage =this.fieldErrors.effective_date_to.message
                    if (effectiveDateToError && !effectiveDateToMessage == "Date Ti is required.") {
                        this.fieldErrors.effective_date_to.error = false;
                    }

                    this.fieldErrors.effective_date_from.error = true;
                    this.fieldErrors.effective_date_from.message = "Date From is required.";
                    return
                }

                const toDate = this.formatDate(this.formData.effective_date_to);
                this.fieldErrors.effective_date_from.error = false;

                if ( toDate && this.formatDate(newVal) > toDate){
                    this.fieldErrors.effective_date_to.error = true;
                    this.fieldErrors.effective_date_to.message = "Date To should be equal to or greater than Date From.";

                } else {
                    this.fieldErrors.effective_date_to.error = false;

                }
            },

            'selectedClient' (newVal){
                this.fieldErrors.client_id.error = newVal ? false : true;
            },

            'selectedSubcon' (newVal){
                this.fieldErrors.link_client_subcon_pers.error = newVal ? false : true;
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
        title="Remote Contractor Rate"
        size="dialog-xxl"
        >
        <!-- isScrollable="true" -->

        <template #body>

            <form role="form" id="contact-form" method="post" autocomplete="off">
                
            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="clinet_name" class="labels my-0">Client<span class="required-field">*</span></label>
                        <Multiselect
                        v-model="selectedClient"
                        :searchable="true"
                        :options="clients"
                        @select="handleChangeClient"
                        label="name"
                        valueProp="id"
                        class="multiselect-subcon-rate"
                        />
                        <span v-if="fieldErrors.client_id.error" class="error_msg">&nbsp;{{fieldErrors.client_id.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="subcontractors" class="labels my-0">Remote Contractor<span class="required-field">*</span></label>
                        <Multiselect
                        v-model="selectedSubcon"
                        :searchable="true"
                        :options="subcontractorsOption"
                        label="name"
                        valueProp="id"
                        class="multiselect-subcon-rate"
                        />
                        <span v-if="fieldErrors.link_client_subcon_pers.error" class="error_msg">&nbsp;{{fieldErrors.link_client_subcon_pers.message}}</span>
                    </div>
                </div>
                
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="basic_monthly_rate" class="labels my-0">Monthly Rate<span class="required-field">*</span></label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="basic_monthly_rate"
                            v-model="formData.basic_monthly_rate"
                            maxlength="12"
                            @keyup="handleChange( 'basic_monthly_rate' ); computeRate()">
                        <span v-if="fieldErrors.basic_monthly_rate.error" class="error_msg">&nbsp;{{fieldErrors.basic_monthly_rate.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="basic_weekly_rate" class="labels my-0">Weekly Rate</label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="basic_weekly_rate"
                            v-model="formData.basic_weekly_rate"
                            maxlength="12"
                            @keyup="handleChange( 'basic_weekly_rate' )" disabled>
                        <!-- <span v-if="fieldErrors.basic_weekly_rate.error" class="error_msg">&nbsp;{{fieldErrors.basic_weekly_rate.message}}</span> -->
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="basic_daily_rate" class="labels my-0">Daily Rate</label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="basic_daily_rate"
                            v-model="formData.basic_daily_rate"
                            maxlength="12"
                            @keyup="handleChange( 'basic_daily_rate' )" disabled>
                        <!-- <span v-if="fieldErrors.basic_daily_rate.error" class="error_msg">&nbsp;{{fieldErrors.basic_daily_rate.message}}</span> -->
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="basic_hourly_rate" class="labels my-0">Hourly Rate</label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="basic_hourly_rate"
                            v-model="formData.basic_hourly_rate"
                            maxlength="12"
                            @keyup="handleChange( 'basic_hourly_rate' )" disabled>
                        <!-- <span v-if="fieldErrors.basic_hourly_rate.error" class="error_msg">&nbsp;{{fieldErrors.basic_hourly_rate.message}}</span> -->
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12 col-sm-6">
                    <div class="form-group" >
                        <label>Effective Date From<span class="required-field">*</span></label>
                        <Datepicker v-model="formData.effective_date_from" format="MMM. dd, yyyy"  
                        :enableTimePicker="false"  style="width: 100% !important; background-color: bisque;">
                        </Datepicker>
                        <span v-if="fieldErrors.effective_date_from.error" class="error_msg">&nbsp;{{fieldErrors.effective_date_from.message}}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group" >
                        <label>Effective Date To<span class="required-field">*</span></label>
                        <Datepicker v-model="formData.effective_date_to" format="MMM. dd, yyyy"  
                        :enableTimePicker="false"  style="width: 100% !important; background-color: bisque;">
                        </Datepicker>
                        <span v-if="fieldErrors.effective_date_to.error" class="error_msg">&nbsp;{{fieldErrors.effective_date_to.message}}</span>
                    </div>
                </div>
            </div>
            </form>

        </template>

        <template #footer>
            <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0"
                @click="handleSubmit">
                Save
            </MaterialButton>
        </template>

    </StandardModal>
</template>

<style scoped>
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .input-group-outline:disabled {
        line-height: unset !important;
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