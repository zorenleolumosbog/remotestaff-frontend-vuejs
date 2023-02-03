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
                            <label for="description" class="form-label">Particular</label>
                            <input v-model="details.particular" type="text" class="input-group-outline form-control p-2" placeholder="Particular">
                            <template v-if="validations.errors.particular">
                                <span v-for="(error, index) in validations.errors.particular" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                        <div class="form-group mb-3">
                            <label for="country" class="form-label">No. of Hours</label>
                            <input @keyup="getBillableAmount" v-model="details.hoursRendered" type="number" class="input-group-outline form-control p-2" placeholder="No. of Hours">
                            <template v-if="validations.errors.hoursRendered">
                                <span v-for="(error, index) in validations.errors.hoursRendered" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                        <div class="form-group mb-3">
                            <label for="country" class="form-label">Hourly Rate</label>
                            <input @keyup="getBillableAmount" v-model="details.hourlyRate" type="number" class="input-group-outline form-control p-2" placeholder="Hourly Rate">
                            <template v-if="validations.errors.hourlyRate">
                                <span v-for="(error, index) in validations.errors.hourlyRate" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                        <div class="form-group mb-3">
                            <label for="description" class="form-label">Billable Amount</label>
                            <input v-model="details.billableAmount" type="number" class="input-group-outline form-control p-2" placeholder="Billable Amount">
                            <template v-if="validations.errors.billable_amt">
                                <span v-for="(error, index) in validations.errors.billable_amt" :key="index" class="error-font">{{ error }}</span>
                            </template>
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
    import { mapGetters } from 'vuex';
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import TheValidation from "./TheValidation.vue";
    import TheLoader from "../../Widgets/TheLoader.vue";
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
            AlertUnauthenticated,
            AlertBox,
            InputHasChangedConfirmation
        },
        data() {
            return {
                details: {
                    invoiceId: null,
                    invoiceItemTypeId: null,
                    particular: "",
                    billableAmount: null,
                    hoursRendered: null,
                    hourlyRate: null,
                    invoiceItemTypes: []
                },
                confirmations: {
                    showLoader: false,
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
            let self = this;
            axios({
                method: 'get',
                url: api.DEV_API_URL + '/admin/invoice-item-type',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                self.details.invoiceItemTypes = response.data.data.data;
            })
            .catch(function (errors) {
                if(errors.response.status === 401) {
                    self.confirmations.showAlertUnauthenticated.success = true;
                    self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                }
                if(errors.response.status === 422) {
                    self.validations.errors = errors.response.data.errors;
                }
            });

            this.getRecord();
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
            getBillableAmount() {
                this.details.billableAmount = (this.details.hoursRendered * this.details.hourlyRate).toFixed(2);
            },
            getRecord() {
                this.confirmations.showLoader = true;

                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/accounting/prepopulated-client-invoice-header-item-detail/${self.selectedId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.invoiceId = response.data.data.link_inv_hdr,
                    self.details.invoiceItemTypeId = response.data.data.link_invoice_item_type_id,
                    self.details.particular = response.data.data.particular,
                    self.details.hoursRendered = response.data.data.hours_rendered,
                    self.details.hourlyRate = response.data.data.rate_per_hour,
                    self.details.billableAmount = response.data.data.billable_amt

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
                    url: api.DEV_API_URL + '/accounting/update-prepopulated-client-invoice-header-item-detail/' + self.selectedId,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        invoice_hdr_id: self.details.invoiceId,
                        invoice_item_type_id: self.details.invoiceItemTypeId,
                        particular: self.details.particular,
                        hours_rendered: self.details.hoursRendered,
                        rate_per_hour: self.details.hourlyRate,
                        billable_amt: self.details.billableAmount
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