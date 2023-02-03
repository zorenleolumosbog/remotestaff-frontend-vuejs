<template>
    <div class="container-fluid div-border">
        <div class="col-md-12">
            <div class="row mt-3 mb-3">
                <div class="col-md-4">
                    <!-- <h3 class="menu-title">{{ details.title }}</h3> -->
                </div>
                <div class="col-md-8 my-2">
                    <MaterialButton @click="details.showDelete = !details.showDelete" :disabled="details.selectedRecords.length <= 0" variant ="light" size="sm" class="btn-icon command-btn mx-1 right-floater">
                        <div class="d-flex align-items-center">
                            <i class="icons fa fa-trash fa-lg mx-1" style="font-size: 15px;"></i>
                            Delete
                        </div>
                    </MaterialButton>
                    <MaterialButton @click="details.showEditConfirmation = !details.showEditConfirmation" :disabled="details.selectedRecords.length !== 1" variant ="light" size="sm" class="btn-icon command-btn mx-1 right-floater">
                        <div class="d-flex align-items-center">
                            <i class="icons fa fa-edit fa-lg mx-1" style="font-size: 15px;"></i>
                            Edit
                        </div>
                    </MaterialButton>
                    <MaterialButton @click="details.showAdd = !details.showAdd" variant ="light" size="sm" class="btn-icon command-btn mx-1 right-floater">
                        <div class="d-flex align-items-center">
                            <i class="icons fa fa-plus fa-lg mx-1" style="font-size: 15px;"></i>
                            Add
                        </div>
                    </MaterialButton>
                    <MaterialInput v-model="details.search" @keyup="getRecords" class="d-flex right-floater mx-1 size border" icon="search mx-2" placeholder="Search 201 File Type" size="sm"/>
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
                                        <th scope="col">201 File Type</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!details.showLoader">
                                    <template v-if="details.records.success">
                                        <tr :class="{'active-row': details.selectedRecords.includes(datum.id) }" v-for="datum in details.records.data.data" :key="datum.id" @click="setSeletedRecords(datum.id)">
                                            <!-- <th scope="row">{{ datum.id }}</th> -->
                                            <td data-sort='number' class="ps-3">{{ datum.id }}</td>
                                            <td>{{ datum.description }}</td>
                                        </tr>
                                        <tr data-sort-method='none'  height="40" v-for="tr in 10 - parseInt(details.records.data.data.length)" :key="tr">
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
                    <div class="right-floater">
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
    import TableSorting from "../../Widgets/TableSorting.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            TheLoader,
            AlertUnauthenticated,
            TheAdd,
            TheEdit,
            EditConfirmation,
            TheDelete,
            ThePagination,
            TableSorting
        },
        data() {
            return {
                details: {
                    title: 'Manage 201 File Type',
                    addTitle: 'Add 201 File Type',
                    editTitle: 'Edit 201 File Type',
                    showAdd: false,
                    showEdit: false,
                    showEditConfirmation: false,
                    showDelete: false,
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
                    url: api.DEV_API_URL + `/admin/manage-file?page=${self.details.pagination.current}&limit=${self.details.pagination.limit}&search=${self.details.search}`,
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
            setSeletedRecords(id) {
                if (!this.details.selectedRecords.includes(id)) {
                    this.details.selectedRecords.push(id);
                } else {
                    this.details.selectedRecords.splice(this.details.selectedRecords.indexOf(id), 1);
                }
            }
        },
        mounted() {
            this.getRecords();
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

    .div-border{
        border: 1px solid #dde1e1;
        border-radius: 5px;
        min-height: 640px !important;
        /* height: auto; */
    }

    .no-data{
        font-family: 'Inter-Light'  !important;
    }
</style>