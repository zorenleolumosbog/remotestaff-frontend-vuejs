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
    // import TimeTracker from "../components/TimeTracker.vue";
    import { MonthPickerInput } from 'vue-month-picker';
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
            MonthPickerInput,
            Loader
        },
        data() {
            return {
                acctg: {
                    start_date: '',
                    end_date: '',
                    search: '',
                    month_year: ''
                },
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
                noDateAlert: false,
                timesheetGeneratedError: false,
                timesheetGeneratedSuccess: false,
                showLoader: false,
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
                
                let _this = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/get-temp-invoice-list?start_date='+start_date+'&end_date='+end_date+'&limit='+_this.pagination.limit+'&page='+_this.pagination.current,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(function (response) {
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
            setDate (date) {
                this.acctg.month_year = date.from.toLocaleDateString();
            },
            generateTimesheet() {
                if (this.acctg.month_year == '') {
                    this.noDateAlert = true;
                    return;
                }

                this.showLoader = true;
                let _this = this;
                
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/accounting/generate-timesheet?month_year='+this.acctg.month_year,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    console.log(response);
                    if (response.data.success) {
                        _this.showLoader = false;
                        _this.timesheetGeneratedSuccess = true;
                    }
                    else {
                        _this.showLoader = false;
                        _this.timesheetGeneratedError = true;
                    }
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        window.location.href = "login/admin";
                    }
                });
            }
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
                    <div class="col-sm-5 row">
                        <div class = "col-md-4 date-label">Select Date:</div>
                        <div class = "col-md-8">
                            <month-picker-input v-model="acctg.month_year" :no-default="true" @change="setDate"></month-picker-input>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <MaterialButton @click="generateTimesheet" size="md" class="btn-icon mx-1 yes-btn">
                            <div class="buttons d-flex align-items-center">
                                Create Timesheet
                            </div>
                        </MaterialButton>
                    </div>
                </div>
            </div>
        <!-- </template>
        <template #rightsidebar>
            <TimeTracker/>
        </template>
    </StandardLayout> -->

    <Teleport to="body">
        <StandardModal 
            v-if="timesheetGeneratedSuccess"
            :show="timesheetGeneratedSuccess"
            @close="timesheetGeneratedSuccess=!timesheetGeneratedSuccess"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message text-center">Timesheets successfully generated.</h5><br>
            </template>
        </StandardModal>
        <StandardModal 
            v-if="timesheetGeneratedError"
            :show="timesheetGeneratedError"
            @close="timesheetGeneratedError=!timesheetGeneratedError"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message text-center">Timesheets for selected date are already existing.</h5><br>
            </template>
        </StandardModal>
        <StandardModal 
            v-if="noDateAlert"
            :show="noDateAlert"
            @close="noDateAlert=!noDateAlert"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm">

            <template #body>
                <h5 class = "alert-message text-center">Please select a date.</h5><br>
            </template>
        </StandardModal>
        <StandardModal 
            v-if="showLoader"
            :show="showLoader"
            @close="showLoader=!showLoader"
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
    .month-picker__container {
        width: 320px !important;
        top: 40px !important;
    }
    .month-picker-input{border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); border-radius: var(--vs-border-radius);padding: 8px 8px !important;}
    .month-picker__month {
        padding: 0.45rem 0.25rem !important;
        font-size: 14px !important;
    }
    .month-picker__year button {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>