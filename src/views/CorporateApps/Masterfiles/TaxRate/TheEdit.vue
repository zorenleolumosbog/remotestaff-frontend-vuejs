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
            size="dialog-l"
            :isScrollable=true>
                <template #body>
                    <div class="row">
                        <div class="form-group mb-3">
                            <label for="country" class="form-label">Country</label>
                            <div class="d-flex flex-row">
                                <select v-model="details.countryId" @change="selectCountry" class="input-group-outline form-select form-control p-2" id="country">
                                    <option selected value="">Choose Country</option>
                                    <option v-for="country in countries" :value="country.id" :key="country.id" >{{country.long_desc}}</option>
                                </select>
                                <the-spinner class="mx-n3" v-if="confirmations.showSpinner"></the-spinner>
                            </div>
                            <template v-if="validations.errors.country_id">
                                <span v-for="(error, index) in validations.errors.country_id" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                    </div>
                    <div v-if="details.stateApplied && geographies.withRegion" class="form-group mb-3">
                        <label for="region" class="form-label">Region</label>
                        <select v-model="details.regionId" @change="selectRegion" class="input-group-outline form-select form-control p-2" id="region">
                            <option selected value="">Choose Region</option>
                            <option v-for="region in geographies.regions" :value="region.id" :key="region.id" >{{region.description}}</option>
                        </select>
                        <template v-if="validations.errors.region_id">
                            <span v-for="(error, index) in validations.errors.region_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div v-if="details.stateApplied" class="form-group mb-3">
                        <label for="state" class="form-label">State</label>
                        <select v-model="details.stateId" class="input-group-outline form-select form-control p-2" id="state">
                            <option selected value="">Choose State</option>
                            <option v-for="state in geographies.states" :value="state.id" :key="state.id">{{state.description}}</option>
                        </select>
                        <template v-if="validations.errors.state_id">
                            <span v-for="(error, index) in validations.errors.state_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="tax_type" class="form-label">Tax Type</label>
                        <select v-model="details.taxTypeId" class="input-group-outline form-select form-control p-2" id="tax_type">
                            <option selected value="">Choose Tax Type</option>
                            <option v-for="taxType in details.taxTypes" :value="taxType.id" :key="taxType.id">{{taxType.long_desc}}</option>
                        </select>
                        <template v-if="validations.errors.tax_type_id">
                            <span v-for="(error, index) in validations.errors.tax_type_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="description" class="form-label">Tax Rate Description</label>
                        <input v-model="details.description" type="text" class="input-group-outline form-control p-2" id="description" placeholder="">
                        <template v-if="validations.errors.description">
                            <span v-for="(error, index) in validations.errors.description" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="rate" class="form-label">Rate</label>
                        <input v-model="details.rate" type="text" class="input-group-outline form-control p-2" id="rate" placeholder="">
                        <template v-if="validations.errors.rate">
                            <span v-for="(error, index) in validations.errors.rate" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="state_applied" class="form-label">State Applied?</label>
                    </div>
                    <div class="col">
                        <div class="d-inline-block me-3">No</div>
                        <div class="form-check form-switch d-inline-block" >
                            <input type="checkbox" v-model="details.stateApplied" :value="1" class="form-check-input" id="is_hq">
                            <label for="state_apply" class="form-check-label">Yes</label>
                        </div>
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
            InputHasChangedConfirmation
        },
        data() {
            return {
                details: {
                    description: "",
                    rate: "",
                    countryId: null,
                    regionId: null,
                    stateId: null,
                    taxTypeId: null,
                    taxTypes: null,
                    stateApplied: false
                },
                geographies: {
                    withRegion: true,
                    countries: [],
                    regions: [],
                    states: [],
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
                }
            }
        },
        mounted() {
            this.getRecord();

            let self = this;
            axios({
                method: 'get',
                url: api.DEV_API_URL + '/admin/tax-type',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                self.details.taxTypes = response.data.data.data;
                self.validations.previousDetails = JSON.stringify(self.details);
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

            axios({
                method: 'get',
                url: api.DEV_API_URL + '/admin/country',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                if (response.data.success) {
                    self.setCountries({
                        value: response.data.data.data
                    });
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
            getCountry() {
                this.confirmations.showSpinner = true;
                let self = this;
                let regions = [];
                let states = [];

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/country/${self.details.countryId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if(response.data.success) {
                        if(response.data.data.with_region) {
                            response.data.data.regions.forEach(function(region) {
                                regions.push(region);
                                region.states.forEach(function(state) {
                                    states.push(state);
                                });
                            });
                        } else {
                            response.data.data.states.forEach(function(state) {
                                states.push(state);
                            });
                        }

                        self.setRegions({
                            value: regions
                        });
                        self.setStates({
                            value: states
                        });

                        self.getRegionOrState();

                        self.confirmations.showSpinner = false;
                    }
                })
                .catch(function (errors) {
                    self.confirmations.showSpinner = false;
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },
            getRegionOrState() {
                this.setFilteredData({
                    key: 'id',
                    needle: this.details.countryId,
                    heystack: this.countries
                });
                
                if(this.filteredData.length > 0) {
                    this.geographies.withRegion = this.filteredData[0].with_region;

                    if (this.geographies.withRegion) {
                        this.setFilteredData({
                            key: 'link_country_id',
                            needle: this.details.countryId,
                            heystack: this.regions
                        });

                        this.geographies.regions = this.filteredData;
                    } else {
                        this.setFilteredData({
                            key: 'link_country_id',
                            needle: this.details.countryId,
                            heystack: this.states
                        });

                        this.geographies.states = this.filteredData;
                    }
                }
            },
            getState() {
                this.setFilteredData({
                    key: 'link_region_id',
                    needle: this.details.regionId,
                    heystack: this.states
                });

                if(this.filteredData.length > 0) {
                    this.geographies.states = this.filteredData;
                }
            },
            getRecord() {
                this.confirmations.showLoader = true;

                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/tax-rate/${self.selectedId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.taxTypeId = response.data.data.link_tax_type_id;
                    self.details.description = response.data.data.description;
                    self.details.rate = response.data.data.rate;
                    self.details.stateApplied = response.data.data.state_applied ? true : false;

                    if(!self.details.stateApplied) {
                        self.details.countryId = response.data.data.country.id;
                    } else {
                        if(response.data.data.state.region) {
                            self.details.stateId = response.data.data.state.id;
                            self.details.regionId = response.data.data.state.region.id;
                            self.details.countryId = response.data.data.state.region.country.id;
                            self.geographies.withRegion = response.data.data.state.region.country.with_region;
                        } else {
                            self.details.countryId = response.data.data.state.country.id;
                            self.details.stateId = response.data.data.state.id;
                        }
                    }

                    self.validations.previousDetails = JSON.stringify(self.details);
                    self.confirmations.showLoader = false;
                    
                    self.getCountry();
                    self.getState();
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
                    url: api.DEV_API_URL + '/admin/update-tax-rate/' + self.selectedId,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        country_id: self.details.countryId,
                        state_id: self.details.stateId,
                        tax_type_id: self.details.taxTypeId,
                        description: self.details.description,
                        state_applied: self.details.stateApplied,
                        rate: self.details.rate,
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
</style>