<template>
    <div class="container-fluid p-2 pt-3">
        <div class="col-xl-12">
            <div class="row ps-2">
                <start-end-date></start-end-date>
                <div class="col-md-2 p-0">
                    <div class="date-label">&nbsp;</div>
                    <MaterialButton :disabled="!searchParams.staff_value || !searchParams.startDate || !searchParams.endDate" size="sm" class="btn-icon mx-1 command-btn" @click="details.pagination.current = 1; getTimeSheet()">
                        <div class="buttons d-flex align-items-center"> Fetch </div>
                    </MaterialButton>
                </div>
            </div>
            <div class="row">
                <div class="scroll table-responsive-sm" v-if="searchParams.dataSource === 'current'">
                    <div class="table-responsive tableFixHead">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover table-striped">
                                <thead class="bg-header">
                                    <tr>
                                        <th scope="col" class="text-center">Date</th>
                                        <th scope="col" class="text-center">Time In</th>
                                        <th scope="col" class="text-center">Time Out</th>
                                        <th scope="col" class="text-center">Actual Hours Work</th>
                                        <th scope="col" class="text-center">Adj. Hours</th>
                                        <th scope="col" class="text-center">Reg Work Hours</th>
                                        <th scope="col" class="text-center">Lunch Start</th>
                                        <th scope="col" class="text-center">Lunch Finish</th>
                                        <th scope="col" class="text-center">Lunch Hours</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!details.showLoader">
                                    <template v-if="details.records.success">
                                        <tr v-for="(datum, index) in details.records.data.data" :key="index">
                                            <td>{{ getToLocaleDateString(datum.date_worked, datum.work_time_in) }}</td>
                                            <td class="text-end">
                                                <ul v-for="work in datum.works" :key="work.id">
                                                    <li>{{ getToLocaleTimeString(work.date_worked, work.work_time_in) }}</li>
                                                </ul>
                                            </td>
                                            <td class="text-end">
                                                <ul v-for="work in datum.works" :key="work.id">
                                                    <li>{{ getToLocaleTimeString(work.date_worked, work.work_time_out) }}</li>
                                                </ul>
                                            </td>
                                            <td class="text-end">{{ getActualHoursWork(datum.works_sum_work_total_hours, datum.lunch ? datum.lunch.work_total_hours : 0) }}</td>
                                            <td class="text-end"></td>
                                            <td class="text-end">0.00</td>
                                            <td class="text-end">{{ datum.lunch ? getToLocaleTimeString(datum.date_worked, datum.lunch.work_time_in) : null }}</td>
                                            <td class="text-end">{{ datum.lunch ? getToLocaleTimeString(datum.date_worked, datum.lunch.work_time_out) : null }}</td>
                                            <td class="text-end">{{ datum.lunch ? datum.lunch.work_total_hours : null }}</td>
                                        </tr>
                                        <tr data-sort-method='none' height="40" v-for="tr in 10 - parseInt(details.records.data.data.length)" :key="tr">
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </template>
                                    <template v-if="!details.records.success">
                                        <tr>
                                            <td colspan="9">No info available.</td>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot class="bg-header" v-if="details.records.success">
                                    <tr data-sort-method='none'>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="text-end">{{ details.records.total_actual_work_hours }}</td>
                                        <td class="text-end">{{ details.records.total_adjusted_hours }}</td>
                                        <td class="text-end">{{ details.records.total_regular_work_hours }}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <the-loader v-if="details.showLoader"></the-loader>
                        </div>
                    </div>
                    <div class="right-floater mt-n3">
                        <the-pagination v-if="details.records.success" :records="details.records" @currentPage="currentPage"></the-pagination>
                    </div>
                </div>
                <div class="scroll table-responsive-sm" v-else>
                    <div class="table-responsive tableFixHead">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover table-striped">
                                <thead class="bg-header">
                                    <tr>
                                        <th scope="col" class="text-center">Date</th>
                                        <th scope="col" class="text-center">Time In</th>
                                        <th scope="col" class="text-center">Time Out</th>
                                        <th scope="col" class="text-center">Actual Hours Work</th>
                                        <th scope="col" class="text-center">Adj. Hours</th>
                                        <th scope="col" class="text-center">Reg Work Hours</th>
                                        <th scope="col" class="text-center">Lunch Start</th>
                                        <th scope="col" class="text-center">Lunch Finish</th>
                                        <th scope="col" class="text-center">Lunch Hours</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!details.showLoader">
                                    <template v-if="details.records.success">
                                        <tr v-for="(datum, index) in details.records.data.data" :key="index">
                                            <td>{{ datum.date_worked }}</td>
                                            <td class="text-end">
                                                <ul v-for="timein, index in splitText(datum.work_time_in, '<br />')" :key="index">
                                                    <li>{{ getToLocaleTimeStringFromLegacy(datum.date_worked, timein) }}</li>
                                                </ul>
                                            </td>
                                            <td class="text-end">
                                                <ul v-for="timeout, index in splitText(datum.work_time_out, '<br />')" :key="index">
                                                    <li>{{ getToLocaleTimeStringFromLegacy(datum.date_worked, timeout) }}</li>
                                                </ul>
                                            </td>
                                            <td class="text-end">{{ datum.actual_hours_worked }}</td>
                                            <td class="text-end">{{ datum.adjusted_hours }}</td>
                                            <td class="text-end">{{ datum.reg_ros_hours }}</td>
                                            <td class="text-end">{{ datum.lunch_start ? getToLocaleTimeStringFromLegacy(datum.date_worked, datum.lunch_start) : null }}</td>
                                            <td class="text-end">{{ datum.lunch_end ? getToLocaleTimeStringFromLegacy(datum.date_worked, datum.lunch_end) : null }}</td>
                                            <td class="text-end">{{ datum.lunch_hours }}</td>
                                        </tr>
                                        <tr data-sort-method='none' height="40" v-for="tr in 10 - parseInt(details.records.data.data.length)" :key="tr">
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </template>
                                    <template v-if="!details.records.success">
                                        <tr>
                                            <td colspan="10">No info available.</td>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot class="bg-header" v-if="details.records.success">
                                    <tr data-sort-method='none'>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="text-end">{{ details.records.total_actual_work_hours }}</td>
                                        <td class="text-end">{{ details.records.total_adjusted_hours }}</td>
                                        <td class="text-end">{{ details.records.total_regular_work_hours }}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <the-loader v-if="details.showLoader"></the-loader>
                        </div>
                    </div>
                    <div class="right-floater mt-n3">
                        <the-pagination v-if="details.records.success" :records="details.records" @currentPage="currentPage"></the-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <alert-unauthenticated 
        v-if="details.showAlertUnauthenticated.success" 
        :message="details.showAlertUnauthenticated.message">
    </alert-unauthenticated>
</template>
<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import TheLoader from "@/components/Loader.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import StartEndDate from "../Inputs/StartEndDate.vue";
    import api from "@/static/config.json";
    import axios from "axios";
    import vSelect from "vue-select";

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            TheLoader,
            AlertUnauthenticated,
            ThePagination,
            StartEndDate,
            vSelect
        },
        data() {
            return {
                format: 'MM/dd/yyyy',
                searchParams:{
                    dataSource: 'current',
                    startDate:'',
                    endDate:'',
                    subcon:'',
                    staff_value: '',
                },
                client_value: '',
                subcons:[],
                details: {
                    showLoader: false,
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    },
                    records: {
                        success: false
                    },
                    pagination: {
                        current: 1,
                        limit: 10
                    },
                    selectedRecords: [],
                    search: ''
                },
                confirmations: {
                    showSubconSpinner: false,
                },
                validations: {
                    errors: []
                }
            }
        },
        watch: {
            'searchParams.dataSource'(newVal) {
                this.details.records.success = false;
            }
        },
        provide() {
            return {
                format: this.format,
                searchParams: this.searchParams,
                client_value : localStorage.getItem('client_id'),
                subcons: this.subcons,
            }
        },
        mounted() {
            this.client_value = localStorage.getItem('client_id');
        },
        methods: {
            currentPage(val) {
                this.details.pagination.current = val;
                this.getTimeSheet();
            },
            splitText(time, separator) {
                return time.split(separator);
            },
            getToLocaleTimeStringFromLegacy(date, time) {
                if(!time) {
                    return null;
                }

                var date = new Date(date + ' ' + time + ' UTC+08:00');
                return date.toLocaleTimeString('en-US');
            },
            getToLocaleDateString(date, time) {
                if(!time) {
                    return null;
                }

                if (new Date(date) <= new Date('2023-01-24')) {
                    console.log(date);
                    return date;
                }

                var date = new Date(date + ' ' + time + ' UTC');
                return date.toLocaleDateString('fr-CA');
            },
            getToLocaleTimeString(date, time) {
                if(!time) {
                    return null;
                }

                var date = new Date(date + ' ' + time + ' UTC');
                return date.toLocaleTimeString('en-US');
            },
            getActualHoursWork(totalHoursWork, totalLunchHours) {
                return (totalHoursWork - totalLunchHours).toFixed(2);
            },
            getTimeSheet() {
                this.details.records.success = false;
                this.details.showLoader = true;

                let self = this;

                if(this.searchParams.dataSource === 'current'){
                    axios({
                        method: 'get',
                        url: api.DEV_API_URL + `/client/remote-contractor-timesheet?page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&start_date=${self.searchParams.startDate}&end_date=${self.searchParams.endDate}&client_id=${self.client_value}&remote_contractor_id=${self.searchParams.staff_value}`,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        self.details.records = response.data;
                        
                        self.details.showLoader = false;
                    });
                } else {
                    axios({
                        method: 'get',
                        url: api.DEV_API_URL + `/timesheet/get-timesheet-report?page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&start_date=${self.searchParams.startDate}&end_date=${self.searchParams.endDate}&client_id=${self.client_value}&subcon_id=${self.searchParams.staff_value}`,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        self.details.records = response.data;
                        
                        self.details.showLoader = false;
                    });
                }
            },
            getTotalHours(timein, timeout) {
                let [h1, m1] = timein.split(':')
                let [h2, m2] = timeout.split(':')

                return ((+h1 + (+m1 / 60)) - (+h2 + (+m2 / 60)))
            }
        }
    };
</script>

<style scoped>
    .date-label {
        padding-top: 7px;
        padding-right: 0;
        font-size: 12px;
    }
    .table-container {
        border-left: 0.1em solid #dee2e6;
        border-right: 0.1em solid #dee2e6;
        border-bottom: 0.1em solid #dee2e6;
        border-top: 0.1em solid #dee2e6;
        border-color: #dee2e6;
        /* height: 461px; */
        height: 57vh;
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

    .table-bordered{
        border: 1px #212529   solid !important;
    }

    tbody {
        border-bottom: 1px solid lightgray !important;
    }
    th, td {
        border-left: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
        border-bottom: 1px solid lightgray !important;
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

    .border-table {
        border: 1px black !important;
    }
    .active-row {
        background: #BAAFFF !important;
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
    .container-fluid {
        width: 100% !important;
    }
    .size{
        min-width: 30%;
        width: auto;
        margin-top:3px !important;
    }

    .right-floater{
        float:right;
    }
    .no-data{
        font-family: 'Inter-Light'  !important;
    }
    .input-date,
    .form-control,
    .form-control:focus {
        border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color);
        border-radius: var(--vs-border-radius);
        padding-left: 5px;
        padding-right: 5px;
    }
    table ul li {
        margin-bottom: -20px;
    }
    .table tfoot td {
        color: #ffffff !important;
    }
    ul {
        list-style-type: none;
    }
</style>