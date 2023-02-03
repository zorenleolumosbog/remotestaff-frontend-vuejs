<template>
    <the-loader v-if="details.showTabLoader"></the-loader>
    <div class="container-fluid" v-if="!details.showTabLoader">
        <template v-if="details.registrantTypes.success">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item" role="presentation" v-for="datum in details.registrantTypes.data.data.sort((a,b) => a.id - b.id)" :key="datum.id">
                    <button @click="getRecords(datum.id)" class="nav-link   " data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">{{ datum.description }}</button>
                </li>
            </ul>
        </template>
        <div class="tab-content mt-n3">
            <div class="col-md-12 px-3">
                <div class="row mt-3 mb-0">
                    <div class="col-md-4 py-3">
                        <!-- <h3 class="menu-title">{{ details.title }}</h3> -->
                    </div>
                    <div class="col-md-8 my-2 py-3">
                        <MaterialInput v-model="details.search" @keyup="getRecords(details.selectedRegistrantTypeId)" class="d-flex right-floater mx-1 size border" icon="search mx-2" placeholder="Search" size="sm"/>
                    </div>
                </div>
                <div class="row no-gutters">
                    <div class="scroll table-responsive-sm">
                        <div class="table-responsive tableFixHead text-dark" >
                            <div class="table-responsive">
                                <table id="table" class="table table-hover table-striped table-bordered">
                                    <thead class="bg-header">
                                        <tr>
                                            <th scope="col" class="ps-3">ID</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Date/Time Submitted</th>
                                            <th scope="col">is Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="!details.showLoader">
                                        <template v-if="details.records.success">
                                            <tr v-for="datum in details.records.data.data" :key="datum.id">
                                                <td>&nbsp;&nbsp;&nbsp;{{ datum.id}}</td>
                                                <td>{{ datum.email }}</td>
                                                <td>{{ datum.reg_firstname }} {{ datum.reg_lastname }}</td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datum.date_submitted }}</td>
                                                <td>
                                                    <div class="form-check form-switch d-inline-block">
                                                        <input :checked="datum.is_verified" type="checkbox" class="form-check-input" onclick="return false;">
                                                    </div>
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
            </div>
        </div>
    </div>
    <alert-unauthenticated 
        v-if="details.showAlertUnauthenticated.success" 
        :message="details.showAlertUnauthenticated.message">
    </alert-unauthenticated>
    <teleport to="body">
        <table-sorting v-if="!details.showTabLoader"></table-sorting>
    </teleport>
</template>
<script>
    import MaterialInput from "@/components/MaterialInput.vue";
    import ThePagination from "../../../Widgets/ThePagination.vue";
    import TheLoader from "@/components/Loader.vue";
    import AlertUnauthenticated from "../../../Widgets/AlertUnauthenticated.vue";
    import TableSorting from "../../../Widgets/TableSorting.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    export default {
        components: {
            MaterialInput,
            TheLoader,
            AlertUnauthenticated,
            ThePagination,
            TableSorting
        },
        data() {
            return {
                details: {
                    title: 'Verified',
                    showTabLoader: true,
                    showLoader: false,
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    },
                    selectedRegistrantTypeId: 1,
                    registrantTypes: {
                        success: false
                    },
                    records: {
                        success: false
                    },
                    pagination: {
                        current: 1,
                        limit: 10
                    },
                    search: ''
                },
                validations: {
                    errors: []
                }
            }
        },
        methods: {
            // currentPage(val) {
            //     this.details.pagination.current = val;
            //     this.getRecords(this.details.selectedRegistrantTypeId);
            // },

            currentPage(val) {
                this.details.pagination.current = val;
                this.details.showLoader = true;
                this.details.selectedRecords = [];
                this.getRecords(this.details.selectedRegistrantTypeId);
            },
            
            getRecords(registrantTypeId) {
                this.details.selectedRegistrantTypeId = registrantTypeId;

                if(!this.details.records.success) {
                    this.details.showLoader = true;
                }
                // if(this.details.search || this.details.pagination.current) {
                //     this.details.showLoader = true;
                // }
                if(this.details.search) {
                    this.details.pagination.current = 1
                    this.details.showLoader = true;
                    this.details.selectedRecords = [];
                }
                
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/registrant-report/verified/${self.details.selectedRegistrantTypeId}?page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&search=${self.details.search}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.records = response.data;;
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
            }
        },
        mounted() {
            let self = this;
            axios({
                method: 'get',
                url: api.DEV_API_URL + `/admin/registrant-type`,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(function (response) {
                self.details.registrantTypes = response.data;
                self.details.showTabLoader = false;

                self.getRecords(self.details.selectedRegistrantTypeId);
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
        height: 490px !important;
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

    .table-bordered{
        border: 1px #212529   solid !important;
    }
    .form-switch {
    padding-left: 3.5rem;
    opacity: 0.5 !important;
    }
    .form-switch .form-check-input:checked {
        background-color: #1E0B90;
    }
    .border {
        border: 1px solid #0B0724  !important;
        border-radius: 5px;
    }
    .active-row {
        background: rgb(207, 252, 207) !important;
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
    .menu-title{
        color: #212529 !important;
        font-family: 'Inter-Light' !important;
    }


    .nav-tabs .nav-link {
        font-size: 16px;
        color: var(--bs-nav-tabs-link-active-color);
        background-color: #d5d5dc;
        box-shadow: 3px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        color: #f2f2f2;
        font-weight: bold;
        border-color: 1px grey;
        background-color: #3E26D3;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .nav-tabs .nav-link.active{
        background-color: #f2f2f2;
        color:#212529;
    }
    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 625px !important;
        /* height: auto; */
    }
    .right-floater{
        float:right;
    }

    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    .size{
        min-width: 25%;
        width: auto;
    }
</style>