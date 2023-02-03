<template>
    <template v-if="!confirmations.showLoader && !confirmations.alertBox.success">
        <teleport to="body">
            <standard-modal 
            :show=showAdd
            @close=removeAlertBox
            :hasClose=true
            :hasHeader=true
            :hasFooter=true
            :title=title
            size="dialog-md"
            :isScrollable=false>
                <template #body>
                    <div class="form-group mb-3">
                        <label for="tax_type" class="form-label">Currency</label>
                        <select v-model="details.currencyId" class="input-group-outline form-select form-control p-2" id="Currency">
                            <!-- <option selected value="">Choose Currency</option> -->
                            <option v-for="currencyType in details.currencyTypes" :value="currencyType.id" :key="currencyType.id">{{currencyType.description}}</option>
                        </select>
                        <template v-if="validations.errors.currency_id">
                            <span v-for="(error, index) in validations.errors.currency_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>

                    <div class="form-group mb-3">
                        <label for="rate" class="form-label">New Rate</label>
                        <input v-model="details.rate" type="text" class="input-group-outline form-control p-2" id="rate" placeholder="">
                        <template v-if="validations.errors.rate">
                            <span v-for="(error, index) in validations.errors.rate" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>

                    <div class="form-group forex-rate-page mb-3">
                        <label for="rate" class="form-label">Effective Month/Year Applied</label>
                        <!-- <input type="month" class="input-group-outline form-control field" 
                            id="month_year"
                            v-model="details.month_year"
                            :enableTimePicker="false" 
                            style="font-size: 12pt; margin-top: 2px !important;"
                             /> -->
                             <!-- <month-picker-input v-model="month" @change="setDate"></month-picker-input> {{ details.month_year }} -->
                             <date-picker v-model:value="details.month_year" auto type="month"  value-type="YYYY-MM-DD" format="MMMM YYYY"  placeholder=""></date-picker>
                             
                        <template v-if="validations.errors.month_year">
                            <span v-for="(error, index) in validations.errors.month_year" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>

                    <div class="form-group mb-3">
                        <label for="tax_type" class="form-label">Forex Type</label>
                        <select v-model="details.forexId" class="input-group-outline form-select form-control p-2" id="forex_rate_type">
                            <!-- <option selected value="">Choose Forex Rate Type</option> -->
                            <option v-for="forexType in details.forexTypes" :value="forexType.id" :key="forexType.id">{{forexType.description}}</option>
                        </select>
                        <template v-if="validations.errors.forex_id">
                            <span v-for="(error, index) in validations.errors.forex_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                </template>
                <template #footer>
                    <material-button @click="ifDataExist" variant="light" class="btn command-btn btn-md false false mb-0">
                        Save
                    </material-button>
                </template>
            </standard-modal>
        </teleport>
    </template>
    <input-has-changed-confirmation 
        v-if="!confirmations.showLoader && !confirmations.alertBox.success"
        :showHasChangedComfirmation="confirmations.showHasChangedComfirmation" 
        @submitForm="submitForm" 
        @closeForm="closeForm" 
        @toggleShowHasChangedComfirmation="toggleShowHasChangedComfirmation">
    </input-has-changed-confirmation>
    <alert-unauthenticated v-if="confirmations.showAlertUnauthenticated.success" :message="confirmations.showAlertUnauthenticated.message"></alert-unauthenticated>
    <the-loader v-if="confirmations.showLoader"></the-loader>
    <alert-box v-if="confirmations.alertBox.success" :showAlertBox="confirmations.alertBox.success" :message="confirmations.alertBox.message" @toggleShowAlertBox="removeAlertBox"></alert-box>
    <teleport to="body">
        <the-validation></the-validation>
    </teleport>


    <Teleport to="body">
        <StandardModal 
        :show="modals.cmModalShow" 
        @close="modals.cmModalShow = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-sm"
        :isScrollable=true>

        <template #body>
                <div class="center my-1 justify-content-right">
                    <span class="" style="font-size:30px"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span><br/>
                    <!-- <p class="mb-n1" style="font-family:'Inter-Bold' !important; font-size:18px;">You have been initially onboarded by the system.</p><br/> -->
                    <small class="" style="font-family:'Inter-Light' !important; color: #212529; font-size: medium;">Current Forex Rate will be overwritten. Would you like to proceed? <br/><br/></small>
                    <small class="" style="font-family:'Inter-Light' !important; color: #212529; font-size: medium;">If you wish to proceed, click "Proceed". <br/>If you are not ready at this time, click "Cancel"</small>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center my-3">
                <button @click="store()"  class="btn command-btn btn-sm my-2" type="button" variant="contained">Proceed</button>
                <!-- <button data-dismiss="modal" class="btn btn-alert btn-sm my-2" type="button" variant="contained">Cancel</button> -->
                <button @click="cancel()" class="btn no-btn btn-sm my-2" type="button" variant="contained">Cancel</button>
                </div>
            </template>

        </StandardModal>
    </Teleport>
</template>
<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import TheValidation from "./TheValidation.vue";
    import TheLoader from "../../Widgets/TheLoader.vue";
    import TheSpinner from "../../Widgets/TheSpinner.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import InputHasChangedConfirmation from "../../Widgets/InputHasChangedConfirmation.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    import { MonthPickerInput } from 'vue-month-picker';
    import DatePicker from 'vue-datepicker-next';
    import 'vue-datepicker-next/index.css';

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            StandardModal,
            TheValidation,
            TheLoader,
            TheSpinner,
            AlertUnauthenticated,
            AlertBox,
            InputHasChangedConfirmation,
            MonthPickerInput,
            DatePicker
        },
        data() {
            return {
                css:'monthPicker',
                details: {
                    rate: '',
                    currencyId: null,
                    forexId: null,
                    currencyTypes: [],
                    forexTypes: [],
                    // month_year: '',
                    format: 'MM/dd/yyyy',

                    start_date: '',
                    end_date: '',
                    search: '',
                    month_year: ''
                },
                confirmations: {
                    showLoader: false,
                    showSpinner: false,
                    inputHasChanged: false,
                    showHasChangedComfirmation: false,
                    alertBox: {
                        success: false,
                        message: ''
                    },
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    }
                },
                validations: {
                    previousDetails: "",
                    errors: []
                },
                modals:{
                 cmModalShow: false
                },
            
            }
        },
        provide() {
            return {
                details: this.details,
                validations: this.validations,
                confirmations: this.confirmations
            }
        },
        mounted() {            
            let self = this;

            //get currency
            axios({
                method: 'get',
                url: api.DEV_API_URL + '/admin/currency',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                if (response.data.success) {
                    self.details.currencyTypes = response.data.data.data;
                    self.validations.previousDetails = JSON.stringify(self.details);
                }
            })
            .catch(function (errors) {
                self.confirmations.showLoader = false;
                if(errors.response.status === 401) {
                    self.confirmations.showAlertUnauthenticated.success = true;
                    self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                }
                if(errors.response.status === 422) {
                    self.validations.errors = errors.response.data.errors;
                }
            });

            //get forex rate type
            axios({
                method: 'get',
                url: api.DEV_API_URL + '/accounting/forex-rate-type',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                if (response.data.success) {
                    self.details.forexTypes = response.data.data.data;
                    self.validations.previousDetails = JSON.stringify(self.details);
                }
            })
            .catch(function (errors) {
                self.confirmations.showLoader = false;
                if(errors.response.status === 401) {
                    self.confirmations.showAlertUnauthenticated.success = true;
                    self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                }
                if(errors.response.status === 422) {
                    self.validations.errors = errors.response.data.errors;
                }
            });

        },
        props: ['title', 'showAdd', 'existingData'],
        methods: {
            ...mapActions([
                'setFilteredData',
                'setCountries',
                'setRegions',
                'setStates'
            ]),
            submitForm() {
                this.confirmations.showHasChangedComfirmation = false;
                this.store();
            },
            closeForm() {
                this.$emit("toggleShowAdd");
            },
            toggleShowHasChangedComfirmation() {
                this.confirmations.showHasChangedComfirmation = !this.confirmations.showHasChangedComfirmation;
            },
            removeAlertBox() {
                if(this.confirmations.inputHasChanged) {
                    this.confirmations.showHasChangedComfirmation = true;
                } else {
                    this.confirmations.alertBox.success = !this.confirmations.alertBox.success;
                    this.$emit("toggleShowAdd");
                }
            },

            setDate (date) {
                this.details.month_year = date.from.toLocaleDateString();
            },
            // setDate (date) {
            //     this.acctg.month_year = date.from.toLocaleDateString();
            // },

            cancel(){  
            this.modals.cmModalShow = false;
            // this.showError=false;
            },

            // formatDate(d_date){
            //     var date = new Date(d_date);
            //     var dateFormat = (date.getMonth()+1) + "-" + date.getDate() + "-"  + date.getFullYear();
            //     return dateFormat;
            // },
            ifDataExist(){
                let self = this;

                let existing = this.existingData.filter(function (e) {
                    let text = e.effective_month_year;
                    let _month_year = text.substring(0, 10);

                    console.log(self.details.currencyId + ' currency ' + e.currency_id);
                    console.log(self.details.forexId + ' rate type ' + e.forex_rate_type_id);
                    console.log(self.details.month_year + ' ' + _month_year);
                    // console.log(typeof self.details.month_year );

                    return self.details.currencyId===e.currency_id && 
                           self.details.forexId===e.forex_rate_type_id &&
                           self.details.month_year===_month_year;
                });

                if(existing.length){
                    console.log('found');
                    this.modals.cmModalShow = true;
                }
                else{
                    console.log('not found');
                    this.store();
                }

                return;
            },
           
            store() {
                // return
                let self = this;
                this.confirmations.showLoader = true;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/accounting/store-forex-rate',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        rate: self.details.rate,
                        currency_id: self.details.currencyId,
                        forex_rate_type_id: self.details.forexId,
                        effective_month_year: self.details.month_year,
                    }
                    
                })
                .then(function (response) {
                    console.log(response)
                    self.$emit("refresh");
                    self.confirmations.showLoader = false;
                    self.confirmations.inputHasChanged = false;
                    self.confirmations.alertBox.success = response.data.success;
                    self.confirmations.alertBox.message = response.data.message;
                    self.modals.cmModalShow = false;
                    // self.details.showAdd = false;
                })
                .catch(function (errors) {
                    console.log(errors)
                    self.confirmations.showLoader = false;
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                    
                    const element = document.querySelector(".error-font:first-of-type");
                    element?.scrollIntoView({ behavior: "smooth" });
                });
            }
        },
        computed: {
            ...mapGetters([
                'filteredData',
                'countries',
                'regions', 
                'states'
            ]),
            selectCountry(){
                this.details.regionId = null;
                this.geographies.regions = [];
                this.details.stateId = null;
                this.geographies.states = [];
                this.getCountry();
            },
            selectRegion() {
                this.details.stateId = null;
                this.geographies.states = [];
                this.getState();
            }
        }
    };
</script>
<style scoped>
    .form-switch .form-check-input:checked {
        background-color: #5E44FF;
    }
    .error-font{
        color:red !important;
        font-size: small;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .input-group-outline:disabled {
        background-color: #c9c8c8 !important;
        border-color: #c9c8c8 !important;
    }
    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .field{
        padding: 0.5rem 0.5rem !important;
    }


</style>

<style>
    .forex-rate-page .mx-input{
        background: #ededed !important;
        border: 0.5px #ededed !important;
        border-radius: 5px !important;
        height: 40px !important;
        font-size: 14px !important;
    }

    .forex-rate-page .mx-datepicker {
    position: fixed;
    display: inline-block;
    width: 100% !important;
    }

    .mx-datepicker-popup {
    position: fixed !important;
    }

    .mx-datepicker-main {
    font: 14px/1.5 'Inter-Light' !important;
    color: black;
    background-color: #ededed;
    border: 1px solid #e8e8e8;
    }
    /**Possible to be removed haha */
    /* .mx-datepicker-popup {
    top:540px !important;
    position: fixed !important;
    margin-top: 1px;
    margin-bottom: 1px;
    box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
    z-index: 2001;
    }
    .mx-datepicker-main {
    font: 14px/1.5 'Inter-Light' !important;
    color: black;
    background-color: #ededed;
    border: 1px solid #e8e8e8;
    } */

</style>