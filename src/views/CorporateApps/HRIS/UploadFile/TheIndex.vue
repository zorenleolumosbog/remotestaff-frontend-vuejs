
<script setup>
// components
import MaterialButton from "@/components/MaterialButton.vue";
import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
import MaterialAlert from "@/components/MaterialAlert.vue";
import api  from "@/static/config.json";
import MaterialInput from "@/components/MaterialInput.vue";
import setMaterialInput from "@/assets/js/material-input";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Loader from "@/components/Loader.vue";
import TheLoader from "@/components/Loader.vue";
import DelIcon from "@/assets/img/delete-icon.svg";
import EditIcon from "@/assets/img/edit-icon.svg";
import { dom } from '@fortawesome/fontawesome-svg-core';
import uploadUcon from "@/assets/img/upload-icon.svg";
import StandardModal from "@/components/Modals/StandardModal.vue";
// import StandardModal from "@/views/CorporateApps/HRIS/JobSource/StandardModal.vue";

// dom.watch()

</script>

<script>
    import axios from "axios";

    let file = '';


    export default {
        
        data() {
        
            return {
                isDisabled: true,
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                to_save: {
                    filetype: "",
                },
                historyModalShow: false,
                showViewModal: false,
                form: {},
                selected_data: {},
                field_errors: {
                    filetype: {
                        error: false,
                        message: "File type is Required.",
                    },
                    file: {
                        error: false,
                        message: "File is Required.",
                    },
                    fileExt: {
                        error: false,
                        message: "File extension is not correct.",
                    },
                },
                showModalSuccess: false,
                loaderSaveUpdate: false,
                is_edit: "add",
                confirm_modal: false,
                confirm_close: false,
                confirm_delete: false,
                order: 'asc',
                file: '',


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
                    search: ''
                },
                validations: {
                    errors: []
                }
            }
        },
        components:{
            axios,
            TheLoader
        },
        methods: {
            resetData(){
                this.to_save = {
                    filetype: "",
                    file: "",
                }
            },

            // From manage file data
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
            // -----

            formValidation(){

                const to_save = this.to_save;
                
                // check required

                    this.field_errors.filetype.error = !to_save.filetype 
                    ? true : false;

                    this.field_errors.file.error = this.file == "" ?  true  : false ;

            },
            checkTrue(has_error){
                return has_error.filter(value => value === true).length;
            },
            formatDate(value){
                var d = new Date(value),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');
            },
            addUpdateFileAttachment(type){
                
                this.field_errors.fileExt.error=false;

                this.formValidation();

                // check errors
                const has_error = [];
                for(const x in this.field_errors){
                    has_error.push(this.field_errors[x]['error']);
                }

                if(!this.checkTrue(has_error)){
                    let data = {};
                    let formData = new FormData();

                    localStorage.setItem("filetype", this.to_save['filetype']);

                    formData.append('file', this.file);
                    formData.append('filetype', this.to_save['filetype']);
                    formData.append('jobseeker_id', this.USERID);

                    if(type == 'edit'){
                        data['id'] = this.to_save['id'];
                    }
                    
                    this.loaderSaveUpdate = true;
                    this.toggleModal();
                    this.toggleModalSuccess();
                    axios.post(this.API_URL+'/upload-file/onboarding',
                         formData
                    ,{
                        headers: { Authorization: `Bearer ${this.TOKEN}`,'Content-Type': 'multipart/form-data' }
                    }).then((response)=>{
                        
                        if(response.data.success){
                            this.loaderSaveUpdate = false;
                            this.getFileAttachment();
                            this.resetData();
                            
                        }

                    }).catch((err)=>{
                        this.toggleModalSuccess();
                        this.toggleModal();
                        console.log(err.response);
                        if(err.response.status == 422){
                            var filetype = localStorage.getItem("filetype");
                            const data_file = err.response.data;
                            this.field_errors.fileExt.error=true;
                            this.field_errors.fileExt.message=data_file.file[0];
                            this.to_save.filetype =  filetype;
                        }     
                        if(err.response.status == 401){
                            localStorage.removeItem('userid');
                            localStorage.removeItem('token');
                            this.$router.push('/'); 
                        }

                    });
                }

            },  
           getFileAttachment(orderby){


                axios.post(this.API_URL+'/get-upload-file/onboarding',{ 
                    jobseeker_id:this.USERID,
                    order:orderby
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        console.log(response.data.data)
                        this.isDisabled = false;
                        this.form = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            deleteFromList(){

                let data = {};
                data['jobseeker_id'] = this.selected_data.filetype_201;
                data['id'] = this.selected_data.id;

                axios.post(this.API_URL+'/delete-upload-file/onboarding',data,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if(response.data.success){
                        this.showViewModal = false;
                        this.getFileAttachment();
                    }
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            toggleModal(action = false){
                
                if(action == 'edit'){
                    this.is_edit = "edit";
                    this.showViewModal = false;

                }else if(action == 'confirm' && this.is_edit == 'edit'){
                    const old_data = JSON.parse(localStorage.getItem('selected'));
                    const new_data = this.to_save;

                    // check updates
                    for (const x in new_data){
                        if (old_data[x] !== new_data[x]){
                            this.confirm_close = true;
                            this.confirm_modal = true;
                            break; 
                        }
                    }

                }else if(action == 'yes'){
                    this.addUpdateFileAttachment('edit')
                    this.confirm_modal = false;

                }else if(action == 'cancel'){
                    this.confirm_modal = false;

                }else if(action == 'no'){
                    this.getFileAttachment();
                    this.confirm_modal = false;
                    this.historyModalShow = true;

                }else{
                    this.is_edit = "add";
                    this.resetData();
                }
                this.historyModalShow = !this.historyModalShow;
            },
            toggleViewModal(data = ""){
                this.to_save = data ? data : "";
                localStorage.setItem('selected',  JSON.stringify(data));
                this.showViewModal = !this.showViewModal;
            },
            toggleModalSuccess(){
                this.showModalSuccess = !this.showModalSuccess;
            },
            toggleConfirmModal(action, data = ""){
                this.confirm_delete = !this.confirm_delete;

                if (action == 'confirm'){
                    this.confirm_close = false;
                    this.selected_data = data;
                }else if(action == 'yes'){
                    this.deleteFromList()
                }

                this.confirm_modal = !this.confirm_modal;
            },
            handleFileUpload(){
                //this.file = this.$refs.file.files[0];
               // console.log(this.$refs.file.files);
                console.log(this.$refs.file);
            },
            filterAttachment(){

                if(this.order=="desc"){
                    this.getFileAttachment('desc');
                    this.order="asc";
                }else{
                    this.getFileAttachment('asc');
                    this.order="desc";     
                }

            },

            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                    this.file = files[0];
                },

        },
        mounted () {
            setMaterialInput();
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getFileAttachment();
            this.getRecords();

        }
    }
</script>

<template>
    <div class="container-fluid p-3 div-border">
        <div class="row content-header p-4">
            <div class="col-md-10 col-sm-7 col-6">
                <!-- <h3 id="h5">Upload File</h3> -->
                <div class="file-notice">(Note: Uploaded File will only be stored for a certain amount of time.)</div>
            </div>
            <div class="col-md-2 col-sm-5 col-6 p-0">
                <MaterialButton variant="gradient" color="light" 
                class="black-font right-floater command-btn" 
                @click="toggleModal('add')">
                <img class="btn-icon" :src="uploadUcon" />&nbsp;<span class="btn-label">Upload</span></MaterialButton>
            </div>
        </div>
        <div class="row mb-1">
            <div class="col-md-12">
                <span @click="filterAttachment" id="filter"><i class="fas fa-filter"></i>Filter</span>
            </div>
        </div>
        <div class="row px-4 pt-1">
            <div class="col-md-12 col-sm-12 col-12">

                <div class="table-responsive">
                    <table class="table table-striped ">
                        <thead class="thead bg-header">
                            <tr>
                                <th>File Type</th>
                                <th>File Name</th>
                                <th>Date Added</th>
                                <th>Uploaded By</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <h5 v-if="form.length < 1">No file attachment data.</h5>
                            <tr v-for="x in form" class="file_attachment">
                                <td  @click="toggleViewModal(x)">
                                    {{x.filetype}}
                                </td>
                                <td  @click="toggleViewModal(x)">
                                    <a :href="x.path" download target="_blank">{{x.filename}}</a>
                                </td>
                                <td  @click="toggleViewModal(x)">
                                    {{x.dateuploaded}}
                                </td>
                                <td  @click="toggleViewModal(x)">
                                    {{x.uploadby}}
                                </td>
                                <td>
                                    <span class="right-floater"><a class="del_btn" @click="toggleConfirmModal('confirm', x)"><img :src="DelIcon" alt="" /></a></span>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
            <the-loader v-if="details.showLoader"></the-loader>
        </div>
       


            <Teleport to="body">
                <StandardModal 
                    :show="historyModalShow"
                    @close="toggleModal('confirm')"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="Upload File"
                    size='dialog-xl'
                    :isScrollable=true>
                    <template #body>
                               <form role="form" id="contact-form" method="post" autocomplete="off">
                                <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <label for="filetype" class="labels my-0">File type</label> 
                                                    <select v-model="to_save.filetype" class="input-group-outline form-select" id="filetype">   
                                                        <option value=""></option>
                                                        <option v-for="datum in details.records.data.data" :key="datum.id">
                                                            {{ datum.description }}
                                                        </option>
                                                    </select>
                                                    <span v-if="field_errors.filetype.error" class="error_msg">&nbsp;{{field_errors.filetype.message}}</span>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12">
                                                <div class="form-group mb-2 mt-2">
                                                    <label for="filetype" class="labels my-0">Upload</label><br/>
                                                    <input type="file" id="file" @change="onFileChange"/><br/>
                                                    <span v-if="field_errors.fileExt.error" class="error_msg">&nbsp;{{field_errors.fileExt.message}}</span>
                                                    <span v-if="field_errors.file.error" class="error_msg">&nbsp;{{field_errors.file.message}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                    </template>
                    <template #footer>
                        <MaterialButton variant="light" size="md" class="command-btn mb-0" @click="addUpdateFileAttachment(is_edit)">
                                Save
                        </MaterialButton>
                    </template>
                </StandardModal>
                <StandardModal 
                    :show="showModalSuccess"
                    @close="toggleModalSuccess"
                    :hasClose=true
                    :hasHeader='false'
                    :hasFooter='false'
                    title="Success"
                    size='dialog-sm'
                    :isScrollable=true>
                    <template #body>
                        <Loader v-if="loaderSaveUpdate"></Loader>
                        <h5 v-else="loaderSaveUpdate" class="text-center h-font">Successfully Uploaded.</h5><br />
                    </template>
                </StandardModal>
                <StandardModal 
                    :show="confirm_modal"
                    :hasClose=false
                    :hasHeader='false'
                    :hasFooter='!loaderSaveUpdate'
                    title="Success"
                    size='dialog-md'
                    :isScrollable=true>
                    <template #body>
                            <div class="modal-body mx 3">
                                <h5>Do you want to delete the changes you made?</h5>
                            </div>
                    </template>
                    <template #footer>
                        <div>
                            <MaterialButton size="sm" variant="contained" color="success" class="mb-0" @click="toggleConfirmModal('yes')">
                                Yes
                            </MaterialButton>&nbsp;
                            <MaterialButton size="sm" variant="contained" color="danger" class="mb-0" @click="toggleConfirmModal('no')">
                                no
                            </MaterialButton>&nbsp;
                            <MaterialButton size="sm" variant="contained" color="secondary" class="mb-0" @click="toggleModal('cancel')">
                                cancel
                            </MaterialButton>
                        </div>
                    </template>
                </StandardModal>
            </Teleport>        
        
    </div>
</template>
<style scoped>    .h-font{
        color:#002315;
        font-family: 'Inter' !important;
    }
    textarea {
        padding: 10px !important;
    }
    #modal-dialog-success {
        max-width: 300px;
    }
    #justify-content-between{
        justify-content: space-between !important;
        display: flex;
        margin: 0 10px;
    }
    #modal-dialog {
        max-width: 700px;
    }
    .table thead th {
        padding: 0.75rem 1.5rem 0.75rem 0.5rem!important;
    }
    td{color:black!important;}
    .thead{
        color:white!important;
        background-color: #002315;
        
    }
    .black-font{
        color:rgb(18, 17, 17);
    }
    .black-font:hover{
        color:#fff!important;
    }
    #h5{
        font-family: 'Inter-Bold' !important;
        color:#002315
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    .right-floater{
        float:right;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }

    .form-control.is_error{
        border-color: #bf0e00 !important;
        border-top-color: transparent !important;
        box-shadow: inset 1px 0 #bf0e00, inset -1px 0 #bf0e00, inset 0 -1px #bf0e00 !important;
    }
    .text-area{
        background-color: #ededed !important;
        border-radius: 5px !important;
    }
    .error_msg {
        font-size: 0.9em;
        color: #9c0404;
    }

    .work_history:hover {
        cursor: pointer;
        background-color: #dbdbdb;
    }
    #details{
        border: 1px solid #dbdbdb;
        border-radius: 10px !important;
    }
    #details div:nth-child(odd){
        background: grey;
    }
    #view_history_header{
        padding-right: 0px !important;
    }
    .top-edit-btn{
        border-radius: 3px; 
        margin-top: 1rem;
    }
    .modal-header{
        padding-top: 0px !important;
    }
    .text-header{
        background-color: #002315;
        color: #fff;
        padding: 5px 13px;
        border-radius: 5px 5px 0px 0px;
    }
    .text-body{
        color: rgb(26, 26, 26) !important;
        padding: 5px 13px;
        border-radius: 0px 0px 5px 5px;
        min-height: 150px;
        border: 1px solid #dbdbdb;
    }
    #details {
        border: 1px solid #dbdbdb;
        border-radius: 5px;
    }
    .change-color {
        filter: invert(94%) sepia(6%) saturate(0%) hue-rotate(48deg) brightness(105%) contrast(104%);
    }
    .del_btn{cursor:pointer;}

    #filter{display: block; cursor:pointer;}
    .file-notice{color:#dbdbdb; color:#AEAEAE; }

    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    .btn-label{color:#000;}
    .form-select{padding: 8px 8px;}
    .table > thead {
        color: #fff;
        /* background-color: #212529 !important; */
    }
    .action{text-align: center;}
    .pagination{float:right;}
    .wrap-filter{padding: 20px 23px!important;}

</style>