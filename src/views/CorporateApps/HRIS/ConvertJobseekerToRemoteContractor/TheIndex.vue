<template>
    <div class="container-fluid div-border">
        <div class="col-md-12">
            <div class="row mt-3 mb-auto">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-sm-12">
                            <small class="label">Jobseeker</small>
                            <template v-if="details.jobseeker.success">
                                <v-select :options="details.jobseeker.data.data" label="complete_name" v-model="details.selectedJobseeker" style="margin-top: 2px !important;" ></v-select>
                            </template>
                            <template v-else>
                                <v-select style="margin-top: 2px !important;"></v-select>
                            </template>
                        </div>

                        <div class="col-lg-3 col-md-6 col-sm-12">
                            <small class="label">Client</small>
                            <template v-if="details.client.success">
                                <v-select :options="details.client.data.data" label="complete_name" v-model="details.selectedClient" style="margin-top: 2px !important;" ></v-select>
                            </template>
                            <template v-else>
                                <v-select style="margin-top: 2px !important;"></v-select>
                            </template>
                        </div>

                        <div class="col-lg-2 col-md-6  col-sm-12">
                            <small class="label">Date to Convert</small>
                            <input type="date" class="form-control field" v-model="details.convertDate" style="font-size: 12pt; margin-top: 2px !important;"/>
                        </div>

                        <div class="col-lg-2 col-md-6 col-sm-12">
                            <MaterialButton @click="details.showConvertConfirmation = true" :disabled="!details.selectedJobseeker || !details.selectedClient" variant ="light" size="sm" style="margin-top: 25px !important;" class="btn-icon command-btn left-floater w-100">
                                <div class="d-flex align-items-center justify-content-center">
                                    <i class="icons fa fa-exchange fa-lg mx-1" style="font-size: 15px;"></i>
                                    Convert
                                </div>
                            </MaterialButton>
                        </div>

                        <div class="col-lg-2 col-md-12 col-sm-12">
                            <MaterialInput v-model="details.search" @keyup="getRecords" class="d-flex right-floater border mb-2" icon="search mx-2" placeholder="Search User" size="sm" style="margin-top: 27px !important;"  />
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
                                        <th scope="col" class="ps-3">ID</th>
                                        <th scope="col">Remote Contractor Name</th>
                                        <th scope="col">Registrant Type</th>
                                        <th scope="col">Client</th>
                                        <th scope="col">Schedule</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!details.showLoader">
                                    <template v-if="details.records.success">
                                        <tr v-for="datum in details.records.data.data" :key="datum.id">
                                            <!-- <th scope="row">{{ datum.id }}</th> -->
                                            <td data-sort='number' class="ps-3">{{ datum.id }}</td>
                                            <td>{{ datum.complete_name }}</td>
                                            <td>{{ datum.registrant_type.description }}</td>
                                            <td>
                                                <ul v-if="datum.contract">
                                                    <template v-for="client in datum.contract.clients" :key="client.id">
                                                        <li v-if="client.basic_info">ID:{{ client.link_client_id }} Name: {{ client.basic_info.client_poc }}</li>
                                                    </template>
                                                </ul>
                                            </td>
                                            <td>{{ datum.contract.date_contracted }}</td>
                                            <td>
                                                <div class="form-check form-switch d-inline-block">
                                                    <input :checked="true" type="checkbox" class="form-check-input" onclick="return false;">
                                                </div>
                                            </td>
                                        </tr>
                                        <tr data-sort-method='none' height="40" v-for="tr in 10 - parseInt(details.records.data.data.length)" :key="tr">
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
                                                <td colspan="6" style="text-align: center; font-family: 'Inter-Bold' !important;">No data to display.</td>
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
    <alert-unauthenticated 
        v-if="details.showAlertUnauthenticated.success" 
        :message="details.showAlertUnauthenticated.message">
    </alert-unauthenticated>
    <the-add 
    v-if="details.showAdd" 
        :title="details.addTitle" 
        :showAdd="details.showAdd" 
        @toggleShowAdd="removeAddForm" 
        @refresh="getRecords">
    </the-add>
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
        @refresh="getRecords">
    </the-edit>
    <the-delete 
        v-if="details.showDelete" 
        :showDelete="details.showDelete" 
        :selectedIds="details.selectedRecords" 
        @toggleShowDelete="removeDeleteForm" 
        @refresh="getRecords">
    </the-delete>
    <teleport to="body">
        <table-sorting></table-sorting>
    </teleport>
    <!-- <the-loader v-if="details.showConversionLoader"></the-loader> -->
    <teleport to="body">
        <standard-modal 
        :show=details.showConversionLoader
        :hasClose=false
        :hasHeader=false
        :hasFooter=false
        :title=title
        size="dialog-sm"
        :isScrollable=true>
            <template #body>
                <loader></loader>
            </template>
        </standard-modal>
    </teleport>
    <alert-box v-if="details.alertBox.success" :showAlertBox="details.alertBox.success" :message="details.alertBox.message" @toggleShowAlertBox="removeAlertBox"></alert-box>
    <template>
        <teleport to="body">
            <standard-modal 
            :show=details.showConvertConfirmation
            @close='details.showConvertConfirmation = false'
            :hasClose=true
            :hasHeader=false
            :hasFooter=true
            size="dialog-lg"
            :isScrollable=true>
                <template #body>
                    <h6 class="text-center alert-message-modal">You are about to convert  Jobseeker to Remote Contractor.</h6>
                    <h6 class="text-center alert-message-modal">Do you want to continue?</h6>
                </template>
                
                <template #footer>
                    <material-button @click="convertJobseekerToRemoteWorker()" size="sm" variant="light" class="command-btn mb-0 me-2">
                        Yes
                    </material-button>
                    <material-button @click="details.showConvertConfirmation = false" size="sm" variant="light" class="no-btn mb-0">
                        No
                    </material-button>
                </template>
            </standard-modal>   
        </teleport>
    </template>
</template>
<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import TheAdd from "./TheAdd.vue";
    import TheEdit from "./TheEdit.vue";
    import EditConfirmation from "../../Widgets/EditConfirmation.vue";
    import TheDelete from "./TheDelete.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import TheLoader from "@/components/Loader.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
    import TableSorting from "../../Widgets/TableSorting.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    import vSelect from "vue-select";

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            TheLoader,
            vSelect,
            AlertUnauthenticated,
            AlertBox,
            TheAdd,
            TheEdit,
            EditConfirmation,
            TheDelete,
            ThePagination,
            TableSorting,
            StandardModal,
            Loader
        },
        data() {
            return {
                details: {
                    title: 'Manage Registrant Type',
                    addTitle: 'Add Registrant Type',
                    editTitle: 'Edit Registrant Type',
                    showAdd: false,
                    showEdit: false,
                    showEditConfirmation: false,
                    showDelete: false,
                    showLoader: false,
                    showConversionLoader: false,
                    showConvertConfirmation: false,
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    },
                    alertBox: {
                        success: false,
                        message: ''
                    },
                    selectedJobseeker: null,
                    selectedClient: null,
                    convertDate: '',
                    jobseeker: {
                        success: false
                    },
                    client: {
                        success: false
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
                validations: {
                    errors: []
                }
            }
        },
        methods: {
            currentPage(val) {
                this.details.pagination.current = val;
                this.details.showLoader = true;
                this.details.selectedRecords = [];
                
                this.getRecords();
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
            removeAlertBox() {
                this.details.alertBox.success = !this.details.alertBox.success;
                this.$emit("toggleShowAdd");
            },
            getRecords() {
                if(!this.details.records.success) {
                    this.details.showLoader = true;
                }
                if(this.details.search) {
                    this.details.pagination.current = 1
                    this.details.showLoader = true;
                    this.details.selectedRecords = [];
                }
                
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/admin/remote-contractor-registrant?with_clients=true&with_clients_count=1&page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&search=${self.details.search}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.records = response.data;
                    
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
            getJobseeker() {
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/admin/jobseeker-registrant',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.jobseeker = response.data;
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
            getClient() {
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/admin/client-registrant',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.client = response.data;
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
            convertJobseekerToRemoteWorker() {
                this.details.showConvertConfirmation = false;
                this.details.showConversionLoader = true;

                let self = this;
                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/admin/convert-jobseeker-to-remote-contractor-registrant',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: self.details.selectedJobseeker.id,
                        client_id: self.details.selectedClient.id,
                        convert_date: self.details.convertDate
                    }
                })
                .then(function (response) {
                    self.details.selectedJobseeker = null;
                    self.details.showConversionLoader = false;

                    self.details.alertBox.success = response.data.success;
                    self.details.alertBox.message = `<span style='color:#050312;'>Successfully converted  ${response.data.data.reg_firstname} ${response.data.data.reg_lastname}</span> to Remote Contractor Status.</span>`;
                    // self.details.alertBox.message = `<span style='color:#050312;'>Successfully converted  ${response.data.data.reg_firstname} ${response.data.data.reg_lastname}</span> to Remote Contractor. Status will take effect on <span style='color:#050312;'>${self.details.convertDate}.</span>`;

                    self.details.selectedClient = null;
                    self.getJobseeker();
                    self.getRecords();
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
            setSeletedRecords(id) {
                if (!this.details.selectedRecords.includes(id)) {
                    this.details.selectedRecords.push(id);
                } else {
                    this.details.selectedRecords.splice(this.details.selectedRecords.indexOf(id), 1);
                }
            }
        },
        mounted() {
            this.details.convertDate = new Date().toJSON().slice(0, 10);
            this.getJobseeker();
            this.getClient();
            this.getRecords();
        }
    };
</script>

<style scoped>

.shh{
    display: inline-flex;
}
.label{
    font-size:small;
}
.field{
    /* min-width: 70% !important;
    width: auto; */
    border:0.1em rgba(60, 60, 60, .26);
    border-radius: 3px;
    /* border-bottom: 1px solid #7b809a; */
    padding: 5px 10px;
    outline: 0.1em solid rgba(60, 60, 60, .26);
}

.field:focus{
    /* min-width: 70% !important;
    width: auto; */
    border:0.1em rgba(60, 60, 60, .26);
    /* border-bottom: 1px solid #7b809a; */
    padding: 5px 10px;
    outline:0.1em solid rgba(60, 60, 60, .26);
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
    h5{
        color: #212529 !important;
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
        font-size: medium;
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
    .left-floater{
        float:left;
    }

    .div-border{
        border: 1px solid #dde1e1;
        border-radius: 5px;
        min-height: 620px !important;
        /* height: auto; */
    }

    .no-data{
        font-family: 'Inter-Light'  !important;
    }
</style>