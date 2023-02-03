<template>
    <div class="container-fluid py-1">
        <div class="col-md-12">
            <div class="row">
                <div class = "col-md-12 row filters" style = "padding-right: 0">
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">Client:</div>
                        <div class ="col-md-7">
                            <template v-if="details.clients.success">
                                <v-select :options="details.clients.data" class="disable-input" label="client_poc" v-model="details.selectedClient" style="margin-top: 2px !important;" ></v-select>
                            </template>
                            <template v-else>
                                <v-select style="margin-top: 2px !important;"></v-select>
                            </template>
                        </div>
                    </div>
                    <div class="col-sm-6 row mb-2">
                        <div class = "col-md-5 date-label">Transaction Date:</div>
                        <div class = "col-md-7">
                            <div class="input-group-date" id="datepicker1">
                                <input type="date" 
                                    class="form-control field input-date" 
                                    id="date"
                                    v-model="details.transactionDate"
                                    :enableTimePicker="false" 
                                    style="font-size: 12pt; margin-top: 2px !important;"
                                    />
                                <span class="input-group-append">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class = "col-md-12 row filters" style = "margin-bottom: 20px; padding-right: 0">
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">Amount:</div>
                        <div class ="col-md-7">
                            <MaterialInput class="input-amount disable-input" label="" type="text" placeholder="" id="amount" v-model="details.amount"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class = "col-md-12 row filters" style = "margin-bottom: 10px; padding-right: 0">
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">Name on Card:</div>
                        <div class ="col-md-7">
                            <MaterialInput class="input-amount disable-input" label="" type="text" placeholder="" id="amount" v-model="details.cardName"/>
                        </div>
                    </div>
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">Card Number:</div>
                        <div class ="col-md-7">
                            <MaterialInput class="input-amount disable-input" label="" type="text" placeholder="" id="amount" v-model="details.cardNumber"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class = "col-md-12 row filters" style = "margin-bottom: 10px; padding-right: 0">
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">Expiry Date:</div>
                        <div class ="col-md-7">
                            <MaterialInput class="input-amount disable-input" label="" type="text" placeholder="" id="amount" v-model="details.expiryDate"/>
                        </div>
                    </div>
                    <div class="col-sm-6 row">
                        <div class ="col-md-5 date-label">CVV:</div>
                        <div class ="col-md-7">
                            <MaterialInput class="input-amount disable-input" label="" type="text" placeholder="" id="amount" v-model="details.cvv"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="scroll table-responsive-sm">
                    <div class="table-responsive tableFixHead text-dark" >
                        <div class="table-responsive">
                            <table id="table" class="table table-hover table-striped table-bordered">
                                <thead class="bg-header">
                                    <tr>
                                        <!-- <th scope="col"></th> -->
                                        <th scope="col">&nbsp;&nbsp;&nbsp;Invoice ID</th>
                                        <th scope="col">Invoice Date</th>
                                        <th scope="col">Due Date</th>
                                        <th scope="col">Invoice Amount</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!details.showLoader">
                                    <template v-if="details.invoiceDetails.success">
                                        <tr :class="{'active-row': details.selectedRecords.includes(datum.id) }" v-for="datum in details.invoiceDetails.data.data" :key="datum.id" @click="setSeletedRecords(datum)">
                                            <!-- <td><input type="checkbox"/></td> -->
                                            <td>{{ datum.id }}</td>
                                            <td>{{ datum.invoice_date }}</td>
                                            <td>{{ datum.due_date }}</td>
                                            <td>{{ datum.invoice_amount }}</td>
                                        </tr>
                                        <!-- <tr data-sort-method='none' height="40" v-for="tr in 10 - parseInt(Object.keys(details.invoiceDetails.data.data).length)" :key="tr">
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr> -->
                                    </template>
                                    <template v-if="!details.invoiceDetails.success">
                                            <tr>
                                                <td colspan="7" style="text-align: center; font-family: 'Inter-Bold' !important;">No data to display.</td>
                                            </tr>
                                    </template>
                                </tbody>
                            </table>
                            <the-loader v-if="details.showLoader"></the-loader>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-xl-12">
                            <div class="right-floater mt-n3">
                                <the-pagination v-if="details.invoiceDetails.success" :records="details.invoiceDetails" @currentPage="currentPage"></the-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row pull-right">
                <div class="col-sm-3 pull-right">
                    <MaterialButton @click="generate" size="md" class="btn-icon mx-1 yes-btn">
                        <div class="buttons d-flex align-items-center">
                            Submit Payment
                        </div>
                    </MaterialButton>
                </div>
            </div>
        </div>
    </div>
    <alert-unauthenticated 
        v-if="details.showAlertUnauthenticated.success" 
        :message="details.showAlertUnauthenticated.message">
    </alert-unauthenticated>
    <edit-confirmation 
        v-if="details.showEditConfirmation"
        :showEditConfirmation="details.showEditConfirmation"
        @showEdit="details.showEdit = true"
        @toggleShowEditConfirmation="removeEditConfirmation">
    </edit-confirmation>
    <the-edit 
        v-if="details.showEdit" 
        :title="details.editTitle" 
        :showEdit="details.showEdit" 
        :selectedId="details.selectedRecords[0]" 
        @toggleShowEdit="removeEditForm" 
        @refresh="getClientInvoiceDetails">
    </the-edit>
    <teleport to="body">
        <table-sorting></table-sorting>

        <StandardModal 
            v-if="details.showDueDateSuccess"
            :show="details.showDueDateSuccess"
            @close="details.showDueDateSuccess=!details.showDueDateSuccess"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message text-center">Due date successfully updated.</h5><br>
            </template>

        </StandardModal>

        <StandardModal 
            v-if="details.showDueDateEditLoader"
            :show="details.showDueDateEditLoader"
            @close="details.showDueDateEditLoader=!details.showDueDateEditLoader"
            :hasClose=false
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <Loader></Loader>
            </template>
        </StandardModal>
    </teleport>
</template>
<script>
    import { mapActions } from 'vuex';
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import EditConfirmation from "../../Widgets/EditConfirmation.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import Loader from "@/components/Loader.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import TableSorting from "../../Widgets/TableSorting.vue";
    import api from "@/static/config.json";
    import axios from "axios";
    import vSelect from "vue-select";
    import StandardModal from "@/components/Modals/StandardModal.vue";

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            Loader,
            AlertUnauthenticated,
            EditConfirmation,
            ThePagination,
            TableSorting,
            vSelect,
            StandardModal
        },
        data() {
            return {
                details: {
                    title: 'Manage Item to Invoice',
                    addTitle: 'Add item to Invoice',
                    editTitle: 'Edit Invoice Item',
                    showAdd: false,
                    showEdit: false,
                    disableActionButton: true,
                    showEditConfirmation: false,
                    showDelete: false,
                    showLoader: false,
                    showDueDateEditLoader: false,
                    showDueDateSuccess: false,
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    },
                    amount: 0,
                    transactionDate: '',
                    selectedClient: null,
                    selectedInvoice: null,
                    clients: {
                        success: false
                    },
                    invoices: {
                        success: false
                    },
                    invoiceDetails: {
                        success: false
                    },
                    pagination: {
                        current: 1,
                        limit: 10
                    },
                    selectedRecords: [],
                    search: ''
                },
                validations: {
                    errors: []
                }
            }
        },
        watch: {
            'details.selectedClient'(newVal) {
                this.details.selectedInvoice = null;
                this.details.invoices = {
                    success: true,
                    data: newVal.invoice_headers
                };
            }
        },
        methods: {
            ...mapActions([
                "setCountries",
            ]),
            currentPage(val) {
                this.details.pagination.current = val;
                this.getClientInvoiceDetails();
            },
            removeAddForm() {
                this.details.showAdd = !this.details.showAdd;
            },
            removeEditConfirmation() {
                this.details.showEditConfirmation = !this.details.showEditConfirmation;
            },
            removeEditForm() {
                this.details.showEdit = !this.details.showEdit;
            },
            removeDeleteForm() {
                this.details.showDelete = !this.details.showDelete;
                this.details.selectedRecords = [];

            },
            getClients() {
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/prepopulated-client-invoice-header',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.clients = response.data;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.details.showAlertUnauthenticated.success = true;
                        self.details.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },
            updateDueDate() {
                let self = this;
                self.details.showDueDateEditLoader = true;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/accounting/update-invoice-due-date?id=${self.details.selectedInvoice.id}&due_date=${self.details.dueDate}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.showDueDateEditLoader = false;
                    self.details.showDueDateSuccess = true;
                })
            },
            getInvoices() {
                let client = localStorage.getItem('client_id');
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/accounting/get-unpaid-invoices?${client}&page=${self.details.pagination.current}&limit=${self.details.pagination.limit}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    console.log(response);
                    self.details.invoiceDetails = response.data;
                    self.details.showLoader = false;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.details.showAlertUnauthenticated.success = true;
                        self.details.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },
            setSeletedRecords(datum) {
                if (!this.details.selectedRecords.includes(datum.id)) {
                    this.details.selectedRecords.push(datum.id);
                } else {
                    this.details.selectedRecords.splice(this.details.selectedRecords.indexOf(datum.id), 1);
                }

                if(this.details.selectedRecords.length === 1) {
                    this.details.disableActionButton = false;
                } else {
                    this.details.disableActionButton = true;
                }
                this.setAmount();
                // console.log(this.details.invoiceDetails.data.data);
                // console.log(this.details.selectedRecords);
            },
            setAmount() {
                let invoices = this.details.invoiceDetails.data.data;
                let totalAmount = 0;
                for (var key in invoices) {
                    if (this.details.selectedRecords.includes(invoices[key].id)) {
                        totalAmount = +totalAmount + +invoices[key].invoice_amount;
                    }
                }
                this.details.amount = totalAmount;

            }
        },
        mounted() {
            this.getClients();
            this.getInvoices();
            this.details.selectedClient = localStorage.getItem('client_name');
            let disable_input = document.getElementsByClassName('disable-input');
            for(var i = 0; i < disable_input.length; i++) {
                disable_input[i].disabled = true;
            }
        }
    };
</script>

<style scoped>
    .table-container {
        border-left: 0.1em solid #dee2e6;
        border-right: 0.1em solid #dee2e6;
        border-bottom: 0.1em solid #dee2e6;
        border-top: 0.1em solid #dee2e6;
        border-color: #dee2e6;
        /* height:auto; */
        height: 461px !important;
        /* height: 53vh; */
    }
    table td{
        color: #212529 !important;
    }
    .table tbody tr:hover td, .table tbody tr:hover th {
    background-color: #BAAFFF !important;
    }
    .table > thead {
        color: #fff;
        /* background-color:#212529 !important; */
        border: 1px #212529  solid !important;
    }
    .table thead th {
        padding: 0.75rem 0.5rem;
    }

    .table tbody tr:last-child td {
    /* border: 1px #f0f2f5 solid !important; */
    border: 1px #212529   solid !important;
    }

    .table-bordered{
        border: 1px #212529   solid !important;
    }
    .form-switch .form-check-input:checked {
        background-color: #63ff43;
    }
    .border {
        border: 1px solid #002316 !important;
        border-radius: 5px;
    }
    .active-row {
        background: #BAAFFF !important;
    }
    .container-fluid {
    width: 100% !important;
    }

    .icons{
    font-size: 15px !important;
    }

    .buttons{
    color: #212529 !important;
    font-size: 12px !important;
    }
    .buttons:hover{
    color: #f2f2f2 !important;
    }
    .menu-title{
        color: #212529 !important;
        font-family: 'Inter-Bold' !important;
    }
    .size{
        min-width: 25%;
        width: auto;
        margin-top:3px !important;
    }
    .right-floater{
        float:right;
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
        min-height: 630px;
        height: auto;
    }
    .no-data{
        font-family: 'Inter-Light'  !important;
    }

    .yes-btn {
        padding: 8px 8px !important;
    }
    .input-date {border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); border-radius: var(--vs-border-radius);padding: 4px 4px !important;}
    .input-amount {border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); border-radius: var(--vs-border-radius); height: 35px; padding-left: 10px;}

    .pull-right {
        display: flex;
        justify-content: flex-end;
    }

</style>