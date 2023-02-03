<template>
    <!-- <template v-if="!confirmations.showLoader && !confirmations.alertBox.success"> -->
        <teleport to="body">
            <standard-modal 
            :show=showHistory
            @close=removeAlertBox
            :hasClose=true
            :hasHeader=true
            :hasFooter=false
            :title=title
            size="dialog-xxxxxl"
            :isScrollable=false>
                <template #body>
                    <!--if it needs search-->
                    <!-- <div class="row">
                        <div class="col-12">
                        <span class="right-floater my-2">
                            <MaterialInput v-model="details.search" @keyup="getRecords" class="d-flex mx-1 size border" icon="search mx-2" placeholder="Search Forex Rate" size="sm"/>
                        </span>
                        </div>
                    </div> -->
                    <div class="row">
                        <div class="scroll table-responsive-sm">
                            <div class="table-responsive tableFixHead text-dark" >
                                <div class="table-responsive">
                                    <table id="table" class="table history table-striped">
                                        <thead class="history-header">
                                            <tr>
                                                <th scope="col" class="col-md-1">Currency</th>
                                                <th scope="col" class="col-md-1">Peso Rate</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Admin</th>
                                                <th scope="col">Log</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="!details.showLoader">
                                            <template v-if="details.records.success">
                                                <!-- <tr :class="{'active-row': details.selectedRecords.includes(datum.id) }" v-for="datum in details.records.data.data" :key="datum.id" @click="setSeletedRecords(datum.id)"> -->
                                                <tr v-for="datum in details.records.data.data" :key="datum.id">
                                                    <!-- <th scope="row">{{ datum.id }}</th> -->
                                                    <td data-sort='number' class="ps-3">{{ datum.currency_description }}</td>
                                                    <td class="text-center">{{ datum.rate }}</td>
                                                    <td>{{ datum.date_created }} </td>
                                                    <td>{{ datum.reg_firstname }} {{ datum.reg_lastname }}</td>
                                                    <td> 
                                                        <span v-if="datum.isEdited==0">added</span> 
                                                        <span v-else>updated</span>
                                                        {{ datum.currency_description }} {{ datum.forex_description }} of {{ datum.rate }} for the month of {{ datum.effective_date }}
                                                    </td>
                                                </tr>
                                                <tr data-sort-method='none' height="40" v-for="tr in 10 - parseInt(details.records.data.data.length)" :key="tr">
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </template>
                                            <template v-if="!details.records.success">
                                                    <tr>
                                                        <td colspan="7" style="text-align: center; font-family: 'Inter-Bold' !important;">No data to display.</td>
                                                    </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                    <the-loader v-if="details.showLoader"></the-loader>
                                </div>
                            </div>
                            <div class="right-floater mt-n3">
                            <the-pagination v-if="details.records.success" :records="details.records" @currentPage="currentPage"></the-pagination>
                            </div>
                        </div>
                    </div>

                </template>
                <!-- <template #footer>
                    <material-button @click="ifDataExist" variant="light" class="btn command-btn btn-md false false mb-0">
                        Save
                    </material-button>
                </template> -->
            </standard-modal>
        </teleport>
    <!-- </template> -->
 
</template>
<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import TheValidation from "./TheValidation.vue";
    // import TheLoader from "../../Widgets/TheLoader.vue";
    import TheLoader from "../../../../components/Loader.vue";
    import TheSpinner from "../../Widgets/TheSpinner.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import InputHasChangedConfirmation from "../../Widgets/InputHasChangedConfirmation.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    import ThePagination from "../../Widgets/ThePagination.vue";
    import TableSorting from "../../Widgets/TableSorting.vue";


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
            ThePagination,
            TableSorting
        },
        data() {
            return {
                css:'monthPicker',
                details: {
                    showLoader: false,
                    records: {
                        success: false
                    },
                    pagination: {
                        current: 1,
                        limit: 10
                    },
                    selectedRecords: [],
                    search: '',
                },
            }
        },
        mounted() {      
            this.getRecords();      
        },
        props: ['title', 'showHistory'],
        methods: {
            // ...mapActions([
            //     'setFilteredData',
            //     'setCountries',
            //     'setRegions',
            //     'setStates'
            // ]),
            currentPage(val) {
                this.details.pagination.current = val;
                this.getRecords();
            },
            submitForm() {
                this.confirmations.showHasChangedComfirmation = false;
                this.store();
            },
            closeForm() {
                this.$emit("toggleShowHistory");
            },
            toggleShowHasChangedComfirmation() {
                this.confirmations.showHasChangedComfirmation = !this.confirmations.showHasChangedComfirmation;
            },
            removeAlertBox() {
                    this.$emit("toggleShowHistory");
            },

            getRecords() {
                if(!this.details.records.success) {
                    this.details.showLoader = true;
                }
                if(this.details.search || this.details.pagination.current) {
                    this.details.showLoader = true;
                    this.details.selectedRecords = [];
                }
                
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/accounting/forex-rate-history?page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&search=${self.details.search}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    console.log(response.data);
                    self.details.records = response.data;
                    console.log(self.details.records);
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
        },
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
    h5{
        color:#212529 !important;
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

    /**HISTORY CSS */

    table .history td{
        color: #212529 !important;
    } 
    .history tbody tr:hover td, .table tbody tr:hover th {
    background-color: #BAAFFF !important;
    }

    .history tbody tr:hover td, .table tbody tr:hover th {
    background-color: unset !important;
    }

    .history > thead {
        color: #6c757d;
        /* background-color:#212529 !important; */
        border: 1px #f2f2f2  solid !important;
    }

    .history thead th {
        padding: 0.75rem 0.5rem;
    }

    .history tbody tr:last-child td {
    /* border: 1px #f0f2f5 solid !important; */
    border: 1px #f2f2f2  solid !important;
    }

    .history-header {
    background-color: #dee2e6 !important;
    }

    .history-title{
        color: #6c757d !important;
        font-family: 'Inter-Bold' !important;
    }
    .table-bordered{
        border: 1px #212529   solid !important;
    }

    .form-switch {
        padding-left: 3.5rem;
        opacity: 0.5 !important;
    }
    .form-switch .form-check-input:checked {
        background-color: #5E44FF;
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

    .size{
        min-width: 25%;
        width: auto;
        margin-top:3px !important;
    }
    .right-floater{
        float:right;
    }
    .no-data{
        font-family: 'Inter-Light'  !important;
    }
    .div-border{
        border: 1px solid #dde1e1;
        border-radius: 5px;
        min-height: 620px !important;
        /* height: auto; */
    }
    .text-right {
        text-align: right;
    }
</style>