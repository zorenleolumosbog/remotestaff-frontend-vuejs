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
                    <div class="form-group mb-3">
                        <label for="country" class="form-label">Country</label>
                        <div class="d-flex flex-row">
                            <select v-model="details.countryId" @change="selectCountry" class="input-group-outline form-select form-control p-2" id="country">
                                <option selected value="">Choose Country</option>
                                <template v-for="country in countries" :key="country.id">
                                    <template v-if="country.with_region">
                                        <option :value="country.id">
                                            {{country.long_desc}}
                                        </option>
                                    </template>
                                </template>
                            </select>
                            <the-spinner class="mx-n3" v-if="confirmations.showSpinner.country"></the-spinner>
                        </div>
                        <template v-if="validations.errors.country_id">
                            <span v-for="(error, index) in validations.errors.country_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="region" class="form-label">Region</label>
                        <select v-model="details.regionId" @change="selectRegion" class="input-group-outline form-select form-control p-2" id="region">
                            <option selected value="">Choose Region</option>
                            <option v-for="region in geographies.regions" :value="region.id" :key="region.id" >{{region.description}}</option>
                        </select>
                        <template v-if="validations.errors.region_id">
                            <span v-for="(error, index) in validations.errors.region_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="state" class="form-label">State/Province</label>
                        <div class="d-flex flex-row">
                            <select v-model="details.stateId" @change="selectState" class="input-group-outline form-select form-control p-2" id="state">
                                <option selected value="">Choose State/Province</option>
                                <option v-for="state in geographies.states" :value="state.id" :key="state.id">{{state.description}}</option>
                            </select>
                            <the-spinner class="mx-n3" v-if="confirmations.showSpinner.state"></the-spinner>
                        </div>
                        <template v-if="validations.errors.state_id">
                            <span v-for="(error, index) in validations.errors.state_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="state" class="form-label">Town/City</label>
                        <select v-model="details.towncityId" class="input-group-outline form-select form-control p-2" id="state">
                            <option selected value="">Choose Town/City</option>
                            <option v-for="towncity in geographies.towncities" :value="towncity.id" :key="towncity.id">{{towncity.description}}</option>
                        </select>
                        <template v-if="validations.errors.towncity_id">
                            <span v-for="(error, index) in validations.errors.towncity_id" :key="index" class="error-font">{{ error }}</span>
                        </template>
                    </div>
                    <div class="form-group mb-3">
                        <label for="description" class="form-label">Baranggay/Village</label>
                        <input v-model="details.description" type="text" class="input-group-outline form-control p-2" id="description" placeholder="Description">
                        <template v-if="validations.errors.description">
                            <span v-for="(error, index) in validations.errors.description" :key="index" class="error-font">{{ error }}</span>
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
                    description: '',
                    countryId: null,
                    regionId: null,
                    stateId: null,
                    towncityId: null
                },
                geographies: {
                    withRegion: true,
                    countries: [],
                    regions: [],
                    states: [],
                    towncities: [],
                },
                confirmations: {
                    showLoader: false,
                    showSpinner: {
                        country: false,
                        state: false
                    },
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
                'setStates',
                'setTowncities'
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
                this.confirmations.showSpinner.country = true;
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

                        self.confirmations.showSpinner.country = false;
                    }
                })
                .catch(function (errors) {
                    self.confirmations.showSpinner.country = false;
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
            getTowncity() {
                this.confirmations.showSpinner.state = true;
                let self = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/state/${self.details.stateId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if(response.data.success) {
                        self.geographies.towncities = response.data.data.towncities;

                        self.confirmations.showSpinner.state = false;
                    }
                })
                .catch(function (errors) {
                    self.confirmations.showSpinner.state = false;
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },
            getRecord() {
                this.confirmations.showLoader = true;

                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/barangay/${self.selectedId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.description = response.data.data.description;
                    self.details.towncityId = response.data.data.towncity.id
                    self.details.stateId = response.data.data.towncity.state.id
                    self.details.regionId = response.data.data.towncity.state.region.id;
                    self.details.countryId = response.data.data.towncity.state.region.country.id;

                    self.validations.previousDetails = JSON.stringify(self.details);
                    self.confirmations.showLoader = false;
                    
                    self.getCountry();
                    self.getState();
                    self.getTowncity();
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
                    url: api.DEV_API_URL + '/admin/update-barangay/' + self.selectedId,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        towncity_id: self.details.towncityId,
                        description: self.details.description
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

                        if(data.validations.errors.towncity_id) {
                            self.validations.errors.country_id = [];
                            self.validations.errors.country_id.push(
                                "The Country is requried."
                            );
                            self.validations.errors.region_id = [];
                            self.validations.errors.region_id.push(
                                "The Region is requried."
                            );
                            self.validations.errors.state_id = [];
                            self.validations.errors.state_id.push(
                                "The State is requried."
                            );
                        }
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
                'states',
                'towncities'
            ]),
            selectCountry(){
                this.details.regionId = null;
                this.geographies.regions = [];
                this.details.stateId = null;
                this.geographies.states = [];
                this.details.towncityId = null;
                this.geographies.towncities = [];
                this.getCountry();
            },
            selectRegion() {
                this.details.stateId = null;
                this.geographies.states = [];
                this.details.towncityId = null;
                this.geographies.towncities = [];
                this.getState();
            },
            selectState() {
                this.details.towncityId = null;
                this.geographies.towncities = [];
                this.getTowncity();
            }
        }
    };
</script>
<style scoped>
    .form-switch .form-check-input:checked {
        background-color: #63ff43;
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