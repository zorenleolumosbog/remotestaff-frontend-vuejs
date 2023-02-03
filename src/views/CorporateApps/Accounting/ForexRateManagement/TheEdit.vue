<template>
    <template v-if="!confirmations.showLoader && !confirmations.alertBox.success">
        <teleport to="body">
            <standard-modal 
            :show=showEdit
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
                             <!-- <date-picker v-model:value="details.month_year" type="month"  value-type="YYYY/MM/DD" format="MMM-YYYY"  placeholder="Select month"></date-picker> -->
                             <date-picker v-model:value="details.month_year" type="month" value-type="YYYY-MM-DD" format="MMMM YYYY"></date-picker>
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
                    <material-button @click="update" variant="light" class="btn command-btn btn-md false false mb-0">
                        Update
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
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import InputHasChangedConfirmation from "../../Widgets/InputHasChangedConfirmation.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
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
                details: {
                    rate: "",
                    currencyId: null,
                    forexId: null,
                    currencyTypes: [],
                    forexTypes: [],
                    // month_year: '',
                    format: 'MM/dd/yyyy',


                    
                    start_date: '',
                    end_date: '',
                    search: '',
                    month_year: '09/10/2019', 
                    month: '2023-01-05'
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
                value4 : '2023/11/01'
            }
        },
        mounted() {          
            this.getRecord();

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
        provide() {
            return {
                details: this.details,
                validations: this.validations,
                confirmations: this.confirmations
            }
        },
        props: ['title', 'showEdit', 'selectedId'],
        methods: {
            ...mapActions([
                'setFilteredData',
                'setCountries',
                'setRegions',
                'setStates'
            ]),
            submitForm() {
                this.confirmations.showHasChangedComfirmation = false;
                this.update();
            },
            closeForm() {
                this.$emit("toggleShowEdit");
            },
            toggleShowHasChangedComfirmation() {
                this.confirmations.showHasChangedComfirmation = !this.confirmations.showHasChangedComfirmation;
            },
            removeAlertBox() {
                if(this.confirmations.inputHasChanged) {
                    this.confirmations.showHasChangedComfirmation = true;
                } else {
                    this.confirmations.alertBox.success = !this.confirmations.alertBox.success;
                    this.$emit("toggleShowEdit");
                }
            },
           
            getRecord() {
                this.confirmations.showLoader = true;

                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/accounting/get-forex-rate/${self.selectedId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    console.log(response);
                    self.details.rate = response.data.data.rate;
                    self.details.currencyId = response.data.data.currency_id;
                    self.details.forexId = response.data.data.forex_rate_type_id;
                    self.details.month_year = response.data.data.effective_month_year;
                    console.log('year/month=' + self.details.month_year)

                    self.validations.previousDetails = JSON.stringify(self.details);
                    self.confirmations.showLoader = false;
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
            update() {
                this.confirmations.showLoader = true;
                
                let self = this;
                axios({
                    method: 'put',
                    url: api.DEV_API_URL + '/accounting/update-forex-rate/' + self.selectedId,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        rate: self.details.rate,
                        currency_id: self.details.currencyId,
                        forex_rate_type_id: self.details.forexId,
                        effective_month_year: self.details.month_year,
                    }
                })
                .then(function (response) {
                    self.$emit("refresh");
                    self.confirmations.showLoader = false;
                    self.confirmations.inputHasChanged = false;
                    self.confirmations.alertBox.success = response.data.success;
                    self.confirmations.alertBox.message = response.data.message;
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
        border-radius: 5px;
        height: 40px !important;
        font-size: 14px !important;
    }

    .forex-rate-page .mx-datepicker {
    position: relative;
    display: inline-block;
    width: 100% !important;
}
</style>