<!-- <script setup>
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
</script> -->
<script>
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import api from "@/static/config.json";
    import axios from "axios";
    import VueMultiselect from 'vue-multiselect';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    // import TheNavbar from "../components/TheNavbar.vue";
    // import TheSidebar from "../components/TheSidebar.vue";
    import TimeTracker from "../components/TimeTracker.vue";
    import Loader from "@/components/Loader.vue";
     
    export default {
        components: {
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
                invoice_net_amount: 0,
                total_per_page: 0,
                page_data: {
                    data_per_page: [],
                },
                value: [],
                selected : '',
                showBreakdown: false,
                showDateAlert: false,
                showFetchingLoader: false,
                showSendEmailSuccess: false,
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
                saveTempInvoice: false
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

                if (end_date == '' || start_date == '') {
                    alert("Select date range");
                    return false;
                }
                
                this.showFetchingLoader = true;
                let _this = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/get-temp-invoice-list?start_date='+start_date+'&end_date='+end_date+'&limit='+_this.pagination.limit+'&page='+_this.pagination.current,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(function (response) {
                    _this.showFetchingLoader = false
                    _this.generated_data_smry = response.data
                    _this.page_data.data_per_page = response.data.data.data
                    _this.total_per_page = response.data.total_per_page
                    _this.invoice_net_amount = response.data.total
                    _this.isGenerated = true
                    let export_btns = document.getElementsByClassName('export-btn');
                    for(var i = 0; i < export_btns.length; i++) {
                        export_btns[i].disabled = false;
                    }
                })
            },
            printInvoicePDF(id) {
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/print-pdf-invoice-per-client?id='+id,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: "blob"
                })
                .then(function (response) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Invoice.pdf");
                    link.click();
                })
            },
            sendInvoice(id) {
                this.showFetchingLoader = true;
                let _this = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/send-invoice?id='+id,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(function (response) {
                    _this.showFetchingLoader = false;
                    _this.generate();
                    _this.showSendEmailSuccess = true;
                    
                })
            },
            exportToPDF() {
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/export-pdf-invoice-list?start_date='+start_date+'&end_date='+end_date,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: "blob"
                })
                .then(function (response) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Invoice Summary.pdf");
                    link.click();
                })
            },
            exportToCSV() {
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/export-csv-invoice-list?start_date='+start_date+'&end_date='+end_date,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: "blob"
                })
                .then(function (response) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Invoice Summary.xlsx");
                    link.click();
                })
            },
            exportToHTML() {
                let start_date = this.acctg.start_date;
                let end_date = this.acctg.end_date;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/export-html-invoice-list?start_date='+start_date+'&end_date='+end_date,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: "blob"
                })
                .then(function (response) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Invoice Summary.html");
                    link.click();
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
                <div class = "col-md-12 row filters" style = "padding-right: 0">
                    <div class="col-sm-3 row date-container">
                        <div class = "col-md-12 date-label">Start Date:</div>
                        <div class = "col-md-12">
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
                    <div class="col-sm-3 row date-container">
                        <div class = "col-md-12 date-label">End Date:</div>
                        <div class = "col-md-12">
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
                    <div class="col-sm-2">
                        <MaterialButton @click="generate" size="md" class="btn-icon mx-1 yes-btn">
                            <div class="buttons d-flex align-items-center">
                                Fetch Data
                            </div>
                        </MaterialButton>
                    </div>
                    <div class="action-buttons col-sm-4">
                        <button class = "btn btn-md yes-btn export-btn" disabled @click="exportToPDF">PDF</button>&nbsp;&nbsp;
                        <button class = "btn btn-md yes-btn export-btn" disabled @click="exportToCSV">XLSX</button>&nbsp;&nbsp;
                        <button class = "btn btn-md yes-btn export-btn" disabled @click="exportToHTML">HTML</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive tableFixHead text-dark" >
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th class="col-md-1">Invoice ID</th>
                                <th class="col-md-3">Client Name</th>
                                <th class="col-md-2">Invoice Date</th>
                                <th class="col-md-2">No. of Subcon</th>
                                <th class="col-md-2">Total Amount</th>
                                <th class="col-md-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for = "datum in page_data.data_per_page">
                                <td class = "text-center">{{ datum.id }}</td>
                                <td>{{ datum.client_name }}</td>
                                <td class = "text-center">{{ datum.invoice_date }}</td>
                                <td class = "text-center">{{ datum.subcon_count }}</td>
                                <td class = "text-right">{{ datum.client_currency_code }} {{ datum.invoice_amount }}</td>
                                <td class = "text-center">
                                    <button class = "btn btn-sm yes-btn capitalize" @click="printInvoicePDF(datum.id)">PDF</button>&nbsp;
                                    <button class = "btn btn-sm yes-btn capitalize" @click="sendInvoice(datum.id)">{{ (datum.status_id != 3) ? 'Send' : 'Resend' }}</button>
                                </td>
                            </tr>
                            <tr v-if="!isGenerated || page_data.data_per_page.length == 0">
                                <td colspan = "6" class = "text-center">No Records Found</td>
                            </tr>
                        </tbody>
                        <tfoot v-if="isGenerated && page_data.data_per_page.length > 0">
                            <tr>
                                <td colspan = "5" class = "text-right">Subtotal Amount</td>
                                <td class = "text-right">AUD {{ total_per_page }}</td>
                            </tr>
                            <tr>
                                <td colspan = "5" class = "text-right">Total Net Invoice Amount</td>
                                <td class = "text-right">AUD {{ invoice_net_amount }}</td>
                            </tr>
                        </tfoot>
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

                    <div class="table-responsive tableFixHead text-dark" style = "margin-top: 20px">
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
                <div class = "pagination-container">
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
            v-if="showSendEmailSuccess"
            :show="showSendEmailSuccess"
            @close="showSendEmailSuccess=!showSendEmailSuccess"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message">Invoice has been sent to client.</h5><br>
            </template>

        </StandardModal>

        <StandardModal 
            v-if="showFetchingLoader"
            :show="showFetchingLoader"
            @close="showFetchingLoader=!showFetchingLoader"
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
    tfoot {
        font-weight: bold;
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
    table button {
        margin-bottom: 0 !important;
    }
    .buttons {
        text-transform: capitalize;
        font-size: 14px;
    }
    .btn-primary {
        background: #5E44FF !important;
    }
    .btn-primary:hover, .btn-primary:focus-visible, .btn-primary:focus, .btn-primary:active {
        background: #2C16B2;
        box-shadow: none;
    }
    
    .btn-primary:disabled {
        background-color: #7b6ee0;
        pointer-events: unset;
        cursor: not-allowed;
        box-shadow: none;
        color: #000;
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
        font-size: 14px;
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
    .action-buttons {
        display: flex;
        justify-content: end;
        padding-right: 0;
        margin-left: 47px;
    }
    .export-btn {
        width: 30%;
    }
    .yes-btn {
        padding: 6px 12px;
    }
    .date-container {
        display: flex; 
        flex-direction: column;
        margin-top: -25px;
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
    .multiselect__content-wrapper::-webkit-scrollbar {
        height: 10px;
    }
    .multiselect__placeholder {
        margin-bottom: 0 !important;
    }
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>