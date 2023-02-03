<!-- <script setup>
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
    import DefaultNavbar from "../components/NavbarDefault.vue";
    import SideBar from "../components/SideBar.vue"
</script> -->
<script>
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import api from "@/static/config.json";
    import axios from "axios";
    // import DefaultNavbar from "../components/NavbarDefault.vue";
    import VueMultiselect from 'vue-multiselect';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import Loader from "@/components/Loader.vue";
    // import TheNavbar from "../components/TheNavbar.vue";
    // import TheSidebar from "../components/TheSidebar.vue";
    // import TimeTracker from "../components/TimeTracker.vue";
     
    export default {
        components: {
            // DefaultNavbar,
            // TheNavbar,
            // TheSidebar,
            Datepicker,
            MaterialButton,
            MaterialInput,
            VueMultiselect,
            StandardModal,
            ThePagination,
            Loader
        },
        data() {
            return {
                acctg: {
                    start_date: '',
                    end_date: '',
                    search: ''
                },
                format: 'dd/MM/yyyy',
                clients: '',
                generated_data_smry: {},
                page_data: {
                    data_per_page: [],
                },
                value: [],
                selected : '',
                showBreakdown: false,
                showDateAlert: false,
                showApproval: false,
                showApprovalConfirmation: false,
                showExistingInvoiceAlert: false,
                showPreprocessingLoader: false,
                showNoTimesheetAlert: false,
                clientsWithInvoices: [],
                clientId: '',
                clientName: '',
                billableHours: 0,
                isGenerated: false,
                pagination: {
                    current: 1,
                    limit: 20
                },
                timesheet_details: {},
                timesheet_data_per_page: [],
                timesheetPagination: {
                    current: 1,
                    limit: 20
                },
                saveTempInvoice: false,
                getLoader : false,
            }
        },
        methods: {
            currentPage(val) {
                this.pagination.current = val;
                this.saveTempInvoice = false;
                this.generate();
            },
            timesheetCurrentPage(val) {
                this.timesheetPagination.current = val;
                this.getTimesheet();
            },
            refreshList() {
                this.generated_data_smry = {};
                this.page_data.data_per_page = [];
                this.isGenerated = false;
                this.saveTempInvoice = true;
                this.value = [];
            },
            approveInvoice(id) {
                this.clientId = id;
                this.showApproval = true;
            },
            processInvoiceApproval() {
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;
                let client = this.clientId;
                
                let _this = this;

                this.showApproval = false;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/approve-invoice?client='+client+'&start_date='+start_date+'&end_date='+end_date,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(function (response) {
                    _this.saveTempInvoice = false;
                    _this.showApproval = false;
                    _this.showApprovalConfirmation = true;
                    _this.generate();
                })
            },
            closeModal() {
                this.showApproval = false;
                this.showApprovalConfirmation = false;
            },
            validateStartDate: function (event) {
                if (this.acctg.end_date != '') {
                    if (this.acctg.start_date > this.acctg.end_date) {
                        this.showDateAlert = true;
                    }
                }

                this.saveTempInvoice = true;
                this.value = [];
                this.getClients();
            },
            validateEndDate: function (event) {
                if (this.acctg.end_date < this.acctg.start_date) {
                    this.showDateAlert = true;
                }

                this.saveTempInvoice = true;
                this.value = [];
                this.getClients();
            },
            generate() {
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;
                let client = this.value;
                console.log(this.saveTempInvoice);

                let client_ids = [];
                for (var key in client) {
                    var obj = client[key];
                    for (var prop in obj) {
                        if (!client_ids.includes(obj['id'])) {
                            client_ids.push(obj['id']);
                        }
                    }
                }

                if (end_date < start_date) {
                    this.showDateAlert = true;
                    return false;
                }

                if (end_date == '' || start_date == '' || client_ids.length == 0) {
                    alert("Select date range and client");
                    return false;
                }
                
                this.showPreprocessingLoader = true;
                let _this = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/invoice?save_temp_invoice='+_this.saveTempInvoice+'&client='+client_ids+'&start_date='+start_date+'&end_date='+end_date+'&limit='+_this.pagination.limit+'&page='+_this.pagination.current,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(function (response) {
                    if (response.data.success) {
                        _this.showPreprocessingLoader = false
                        _this.generated_data_smry = response.data
                        _this.page_data.data_per_page = response.data.data.data
                        _this.isGenerated = true
                        _this.saveTempInvoice = false;
                    }
                    else {
                        _this.showPreprocessingLoader = false
                        if (response.data.message == 'existing client') {
                            _this.showExistingInvoiceAlert = true
                            _this.clientsWithInvoices = response.data.clients_with_invoice
                        }
                        else {
                            _this.showNoTimesheetAlert = true
                        }
                    }
                })
            },
            toggleTimesheetModal(client_id, client_name, billable_hours){
                this.showBreakdown = true;
                this.clientName = client_name;
                this.billableHours = billable_hours;
                this.clientId = client_id;
                this.timesheetPagination.current = 1;

                this.getTimesheet();
            },
            getTimesheet() {
                this.getLoader = true;
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;
                let client_id = this.clientId;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/timesheet-details?client='+client_id+'&start_date='+start_date+'&end_date='+end_date+'&limit='+this.timesheetPagination.limit+'&page='+this.timesheetPagination.current,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then((response) => {
                    this.timesheet_details = response.data
                    this.timesheet_data_per_page = response.data.data.data
                    this.getLoader = false;
                });
            },
            getClients() {
                let _this = this

                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/client?start_date='+start_date+'&end_date='+end_date,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    _this.clients = response.data.data
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        window.location.href = "login/admin";
                    }
                });
            },
        },
        mounted() {
            this.getClients();
        }
    }
</script>
<template>
    <!-- <StandardLayout>
        <template #header>
            <the-navbar></the-navbar>
        </template>
        <template #leftsidebar>
            <the-sidebar></the-sidebar>
        </template>
        <template #main> -->
            <div class="row">
                <div class = "col-md-12 datepicker-label">
                    Period of services rendered by subcontractors
                </div>
                <div class = "col-md-12 row filters" style = "padding-right: 0">
                    <div class="col-sm-3 row">
                        <div class = "col-md-5 date-label">Start Date:</div>
                        <div class = "col-md-7">
                            <!-- <Datepicker class = "input-text" v-model="acctg.start_date" :format="format" @closed="validateStartDate"
                            :enableTimePicker="false" style="width: 100% !important; background-color: bisque;" placeholder = "Select date from"></Datepicker> -->
                            <div class="input-group-date" id="datepicker1">
                                                                    <input type="date" 
                                                                           class="form-control field input-date" 
                                                                           @change="validateStartDate"
                                                                           id="date"
                                                                           v-model="acctg.start_date"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 row">
                        <div class = "col-md-4 date-label">End Date:</div>
                        <div class = "col-md-8">
                            <!-- <Datepicker class = "input-text" v-model="acctg.end_date" :format="format" @closed="validateEndDate"
                            :enableTimePicker="false" style="width: 100% !important; background-color: bisque;" placeholder = "Select date to"></Datepicker> -->
                            <div class="input-group-date" id="datepicker2">
                                                                    <input type="date" 
                                                                           class="form-control field input-date" 
                                                                           @change="validateEndDate"
                                                                           id="date"
                                                                           v-model="acctg.end_date"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                              </div>
                        </div>
                    </div>
                    <div class="row col-sm-5 client-options-div">
                        <div class="col-md-5 select-client-container">
                            <MaterialButton @click="refreshList" size="md" class="btn-icon mx-1 yes-btn">
                                <div class="buttons d-flex align-items-center">
                                    Select Clients
                                </div>
                            </MaterialButton>
                        </div>
                        <div class="col-md-7 select-client-dropdown-container">
                            <VueMultiselect v-model="value" :options="clients" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" :options-limit="12000" placeholder="" label="client_poc" track-by="id" selectLabel = "" deselectLabel = "" selectedLabel = "" open-direction="bottom">
                                <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length && !isOpen">{{ values.length }} options selected</span></template>
                            </VueMultiselect>
                        </div>
                    </div>
                    <div class="col-sm-1">
                        <MaterialButton @click="generate" size="md" class="btn-icon mx-1 yes-btn generate-btn">
                            <div class="buttons d-flex align-items-center">
                                Generate
                            </div>
                        </MaterialButton>
                    </div>
                    <!-- <div class="col-sm-2 search-bar">
                        <MaterialInput class="d-flex right-floater mx-1 border col-md-12" v-model = "acctg.search" icon="search mx-2" placeholder="Search" size="sm"/>
                    </div> -->
                </div>
            </div>
            <div class="row">
                <div class="table-responsive tableFixHead text-dark" >
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th class="col-md-1">Client ID</th>
                                <th class="col-md-3">Client Name</th>
                                <th class="col-md-2">Industry</th>
                                <th class="col-md-2">No. of Subcon</th>
                                <th class="col-md-2">Billable Hours</th>
                                <th class="col-md-1">Review</th>
                                <th class="col-md-1">Approve</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for = "datum in page_data.data_per_page">
                                <td class = "text-center">{{ datum.link_client_id }}</td>
                                <td>{{ datum.client_name }}</td>
                                <td> </td>
                                <td class = "text-right"> {{ datum.subcon_count }}</td>
                                <td class = "text-right">{{ datum.work_total_hours }}</td>
                                <td class = "text-center"><button class = "btn btn-sm yes-btn capitalize" style="width:unset" @click="toggleTimesheetModal(datum.link_client_id, datum.client_name, datum.work_total_hours)">Review</button></td>
                                <td class = "text-center"><button class = "btn btn-sm yes-btn capitalize" style="width:unset" @click="approveInvoice(datum.link_client_id)">Approve</button></td>
                            </tr>
                            <tr v-if="!isGenerated || page_data.data_per_page.length == 0">
                                <td colspan = "7" class = "text-center">No Generated Data</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <the-pagination v-if="isGenerated && page_data.data_per_page.length > 0" :records="generated_data_smry" @currentPage="currentPage" style = "float:right"></the-pagination>
                </div>
            </div>
        <!-- </template>
        <template #rightsidebar>
            <TimeTracker/>
        </template>
    </StandardLayout> -->

    <Teleport to="body">
        <StandardModal 
            v-if="showBreakdown"
            :show="showBreakdown"
            @close="showBreakdown=!showBreakdown"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-xxl"
            :isScrollable=true>
            <template #body>
                <div class="text-center">
                    <div class = "text-left"><strong>Client:</strong> {{ clientName }}</div>
                    <div class = "text-left"><strong>Total Billable Hours:</strong> {{ billableHours }}</div>

                    <Loader v-if="getLoader"></Loader>

                    <div  v-if="!getLoader" class="table-responsive tableFixHead text-dark" style = "margin-top: 20px">
                        <table class="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th class="col-md-3">Name</th>
                                    <th class="col-md-3">Date</th>
                                    <th class="col-md-3">Time In</th>
                                    <th class="col-md-3">Time Out</th>
                                    <th class="col-md-3">Total Work Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for = "datum in timesheet_data_per_page">
                                    <td>{{ datum.reg_firstname }} {{ datum.reg_lastname }}</td>
                                    <td>{{ datum.date_worked }}</td>
                                    <td>{{ datum.work_time_in }}</td>
                                    <td>{{ datum.work_time_out }}</td>
                                    <td class = "text-right">{{ datum.work_total_hours }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="!getLoader" class = "pagination-container">
                    <the-pagination :records="timesheet_details" @currentPage="timesheetCurrentPage" style = "float:right"></the-pagination>
                </div>
            </template>
        </StandardModal>

        <StandardModal 
            v-if="showDateAlert"
            :show="showDateAlert"
            @close="showDateAlert=!showDateAlert"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message">End date should be greater than or equal to start date.</h5><br>
            </template>

        </StandardModal>

        <StandardModal 
            v-if="showExistingInvoiceAlert"
            :show="showExistingInvoiceAlert"
            @close="showExistingInvoiceAlert=!showExistingInvoiceAlert"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"  
            size="dialog-md">

            <template #body>
                <h5 class = "alert-message">
                    The system has detected that clients [{{ clientsWithInvoices }}] already generated an invoice.
                </h5><br>
            </template>
        </StandardModal>

        <StandardModal 
            v-if="showNoTimesheetAlert"
            :show="showNoTimesheetAlert"
            @close="showNoTimesheetAlert=!showNoTimesheetAlert"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"  
            size="dialog-md">

            <template #body>
                <h5 class = "alert-message">
                    Preprocessing cannot proceed. Please create timesheets for that period first.
                </h5><br>
            </template>
        </StandardModal>

        <StandardModal 
            v-if="showApproval"
            :show="showApproval"
            @close="showApproval=!showApproval"
            :hasClose=true
            :hasHeader=false
            :hasFooter=true
            title="Dialog"  
            size="dialog-md">

            <template #body>
                <h5 class = "alert-message">
                    Approving this will push data to invoice header and detail. Would you like to proceed?
                </h5>
            </template>

            <template #footer>
                <MaterialButton size="sm" variant="contained" class="command-btn mb-0"
                    @click="processInvoiceApproval">
                    Yes
                </MaterialButton><span>&nbsp;</span>
                <MaterialButton variant="contained" size="sm" class="no-btn mb-0" @click="closeApprovalModal">
                    No
                </MaterialButton>
            </template>
        </StandardModal>

        <StandardModal 
            v-if="showApprovalConfirmation"
            :show="showApprovalConfirmation"
            @close="showApprovalConfirmation=!showApprovalConfirmation"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"  
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message">
                    Pre-processed invoice has been approved.
                </h5>
            </template>
        </StandardModal>

        <StandardModal 
            v-if="showPreprocessingLoader"
            :show="showPreprocessingLoader"
            @close="showPreprocessingLoader=!showPreprocessingLoader"
            :hasClose=false
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <Loader></Loader>
            </template>
        </StandardModal>
    </Teleport>
</template>

<style scoped>
    table td{
        color: black !important;
    }
    .table > thead {
        color: #fff;
        background-color: #002315;
    }
    .table thead th {   
        padding: 0.75rem 0.5rem;
        text-transform: none !important;
        text-align: center !important;
    }
    tbody {
        border-bottom: 1px solid lightgray !important;
    }
    th, td {
        border-left: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
    }
    tr {
        vertical-align: middle !important;
    }
    h3 {
        font-family: arial;
        color: black;
        margin-bottom: 20px !important;
    }
    .input-text {
        font-size: 14px !important;
        color: black;
    }
    .buttons {
        text-transform: capitalize;
        font-size: 14px;
    }
    button {
        background: #5E44FF;
        height: 42px;
    }
    table button {
        margin-bottom: 0 !important;
    }
    button:hover, button:focus-visible, button:focus, button:active {
        background: #2C16B2;
        box-shadow: none;
    }
    .search-bar {
        padding-right: 0;
    }
    .container-fluid {
        padding-right: 4rem !important;
        padding-left: 4rem !important;
    }
    .revenue-list {
        width: 30em;
        display: flex;
        padding: 20px;
    }
    .datepicker-label {
        font-size: 14px;
        padding-bottom: 5px;
    }
    .date-label {
        padding-top: 7px;
        padding-right: 0;
        font-size: 12px;
    }
    .text-right {
        text-align: right;
    }
    .text-center {
        text-align: center;
    }
    .text-left {
        text-align: left;
    }
    .pagination-container {
        height: 32px;
    }
    .select-client-container {
        padding: 0;
    }
    .yes-btn {
        padding: 0 10px;
        width: 100%;
    }
    .generate-btn {
        width: unset;
    }
    .align-items-center {
        justify-content: center;
    }
    .select-client-dropdown-container {
        padding-left: 20px;
        padding-right: 0;
    }
    .input-date{border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); border-radius: var(--vs-border-radius);padding: 4px 4px !important;}
</style>
<style>
    .search-bar .form-control {
        height: 40px;
        font-size: 14px !important;
    }
    .dp__main.input-text.input-text .dp__input {
        font-size: 14px !important;
        color: black !important;
    }
    .multiselect__tags {
        padding: 8px 20px 0 8px !important;
        max-height: 40px;
        overflow-y: auto;
    }
    /* .multiselect__tags::before {
        content: 'Select Clients';
    } */
    .multiselect__content {
        font-size: 14px;
    }
    .multiselect__option {
        padding: 0 12px !important;
    }
    .multiselect__option:hover, .multiselect__option--highlight {
       background: none !important;
       color: #35495e !important;
    }
    .multiselect__option--selected {
        background: #ffffff !important;
        font-weight: 400 !important;
    }
    .multiselect__option span::before{
        background-image: url('https://img.icons8.com/ios-filled/2x/unchecked-checkbox.png');
        background-size: 15px 15px;
        display: inline-block;
        width: 15px; 
        height: 15px;
        margin-right: 5px;
        margin-top: 10px;
        content:"";
    }
     .multiselect__option--selected span::before{
        background-image: url('https://img.icons8.com/ios-filled/2x/checked-checkbox.png');
        background-size: 15px 15px;
        display: inline-block;
        width: 15px; 
        height: 15px;
        margin-right: 5px;
        margin-top: 10px;
        content:"";
    }
    .multiselect__tags-wrap {
        /* display: inline-flex !important; */
        display: none !important;
        overflow-x: hidden;
    }
    .multiselect__tags::-webkit-scrollbar {
        display: none !important;
        /* height: 6px; */
    }
    .multiselect__content-wrapper {
        top: 100% !important;
    }
    .multiselect__content-wrapper::-webkit-scrollbar {
        height: 10px;
    }
    .multiselect__placeholder {
        margin-bottom: 0 !important;
    }
    /* .multiselect__input {
        display: none !important;
    } */
    .multiselect__content-wrapper::-webkit-scrollbar {
        -webkit-appearance: none !important;
        width: 7px !important;
        height: 7px !important;
    }
    .multiselect__content-wrapper::-webkit-scrollbar-thumb {
        border-radius: 4px !important;
        background-color: rgba(0,0,0,.5) !important;
        -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5) !important;
    }
    
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>