
<script setup>
//components
import MaterialButton from "@/components/MaterialButton.vue";
import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
import MaterialAlert from "@/components/MaterialAlert.vue";
import api  from "@/static/config.json";
import MaterialInput from "@/components/MaterialInput.vue";
import setMaterialInput from "@/assets/js/material-input";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Loader from "@/components/Loader.vue";
import DelIcon from "@/assets/img/delete-icon.svg"
import EditIcon from "@/assets/img/edit-icon.svg"
import uploadUcon from "@/assets/img/upload-icon.svg";
import StandardModal from "@/components/Modals/StandardModal.vue";
import ThePagination from "../../CorporateApps/Widgets/ThePagination.vue";
import TableSorting from "../../CorporateApps/Widgets/TableSorting.vue";

</script>

<script>
    import axios from "axios";

    let file = '';


    export default {
        
        data() {
        
            return {
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                to_save: {
                    jobseeker_filetype: ""
                },
                fileattachModalShow: false,
                showViewModal: false,
                form: {},
                selected_data: {id:''},
                filetype_list: {},
                jb_filetype_list: {},
                field_errors: {
                    jobseeker_filetype: {
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
                successMsg: '',
                loaderSaveUpdate: false,
                is_edit: "add",
                confirm_modal: false,
                confirm_close: false,
                confirm_delete: false,
                order: 'asc',
                file: '',
                file_id: '',
                upload_label: '',
                pagination: {
                    current: 1,
                    limit: 10
                },
                search: '',
                records: {
                    success: false
                }
            }
        },
        components:{
            axios,
            Loader,
            ThePagination,
            TableSorting
        },
        methods: {
            resetData(){
                this.to_save = {
                    jobseeker_filetype: ""
                }
            },
            formValidation(){

                const to_save = this.to_save;
                
                // check required

                    this.field_errors.jobseeker_filetype.error = !to_save.jobseeker_filetype 
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
                this.field_errors.file.error=false;

                this.formValidation();

                // check errors
                const has_error = [];
                for(const x in this.field_errors){
                    has_error.push(this.field_errors[x]['error']);
                }

                if(!this.checkTrue(has_error)){
                    let data = {};
                    let formData = new FormData();

                    formData.append('file', this.file);
                    formData.append('jobseeker_filetype', this.to_save['jobseeker_filetype']);
                    formData.append('jobseeker_id', this.USERID);
                    formData.append('file_attachment', 1);

                    if(type == 'edit'){
                        data['id'] = this.to_save['id'];
                    }
                    
                    this.fileattachModalShow = false;
                    this.loaderSaveUpdate = true;
                    this.toggleModalSuccess();
                    this.isLoading = true;
                    
                   
                    axios.post(this.API_URL+'/upload-attachment/onboarding',
                         formData
                    ,{
                        headers: { Authorization: `Bearer ${this.TOKEN}`,'Content-Type': 'multipart/form-data' }
                    }).then((response)=>{
                        
                        if(response.data.success){
                            this.isLoading = false;
                            this.showModalSuccess = true;
                            this.successMsg = 'Successfully added.';
                            this.loaderSaveUpdate = false;
                            this.getFileAttachment();
                            this.resetData();
                        }

                    }).catch((err)=>{
                        this.toggleModal();
                        console.log(err.response);
                        if(err.response.status == 422){
                            this.fileattachModalShow = true;
                            this.showModalSuccess = false;
                            const data_file = err.response.data;
                            this.field_errors.file.error=true;
                            this.field_errors.file.message=data_file.file[0];
                        }     
                        if(err.response.status == 401){
                            localStorage.removeItem('userid');
                            localStorage.removeItem('token');
                            this.$router.push('/'); 
                        }

                    });
                }

            },  
           getFileAttachment(){

              let self = this;


                axios({
                    method: 'get',
                    url: self.API_URL+`/get-attachments/onboarding?page=${self.pagination.current}&limit=${self.pagination.limit}&search=${self.search}&jobseeker_id=${this.USERID}&orderby=${this.order}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.records = response.data;
                })
                .catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },
            getByFileType(){
                axios.get(this.API_URL+'/getbyfiletype/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.filetype_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
             },
            getByJbFileType(){
                axios.get(this.API_URL+'/getbyjbfiletype/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.jb_filetype_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
             },
             deleteFromList(id){
                let data = {};

                data['id'] = id;

                axios.post(this.API_URL+'/delete-attachments/onboarding',data,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if(response.data.success){
                        this.showViewModal = false;
                        this.showModalSuccess = true;
                        this.successMsg = 'Successfully deleted.';
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
                    this.fileattachModalShow = true;

                }else{
                    this.is_edit = "add";
                    this.resetData();
                }
                this.fileattachModalShow = !this.fileattachModalShow;

                this.getByFileType();
                this.getByJbFileType();
            },
            toggleViewModal(data = ""){
                this.successMsg = '';
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
                    this.deleteFromList(this.file_id);
                }

                this.confirm_modal = !this.confirm_modal;
            },
            handleFileUpload(event){
                this.file = event.target.files[0];
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
                this.field_errors.fileExt.error=false;
                this.field_errors.file.error=false;
                    var files = e.target.files || e.dataTransfer.files;
                    if (!files.length)
                        return;
                        this.file = files[0];
                        
                        if(files[0].size>10485760){
                            this.field_errors.file.error=true;
                            this.field_errors.file.message='File size should not be greater than 10MB.';
                        }
                         
                },

            deleteItem(item){
                this.file_id = item;
                this.toggleConfirmModal('confirm');
            },
            currentPage(val) {
                this.pagination.current = val;
                this.getFileAttachment();
            },
            changeLabel: function(e){
                var id = e.target.value;
                if(id==1){
                    this.upload_label = 'Please upload doc, docx, and pdf file only - Max 10Mb.';
                }else if(id==3 || id == 4 || id == 6 || id==7 || id==8 || id==9){
                    this.upload_label = 'Please upload doc, docx, pdf, png, jpeg, jpg, and gif file only - Max 10Mb.';
                }else if(id==2){
                    this.upload_label = 'Please upload png, jpeg, jpg, and gif file only - Max 10Mb.';
                }else if(id==10){
                    this.upload_label = 'Please upload doc, docx, pdf, png, jpeg, jpg, gif, MP3, AAC, ALAC, WAV, and AIFFI file only - Max 10Mb.';
                }else if(id==5){
                    this.upload_label = 'Please upload MP3, AAC, ALAC, WAV, and AIFFI file only - Max 10Mb.';
                }else{
                    this.upload_label = '';
                }
            }

        },
        mounted () {
            setMaterialInput();
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getFileAttachment();

        }
    }
</script>

<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">   
        <div class="row mb-1 px-4 pt-1 wrap-filter">
            <div class="col-md-8">
                <div class="file-notice">(Note: File attachments will only be stored for a certain amount of time.)</div>
            </div>
            <div class="col-md-4">
                <div class="row">
                    <div class="col-md-12 action-btn-wrap">
                        <MaterialButton variant="gradient" color="light" 
                        class="black-font right-floater command-btn" 
                        @click="toggleModal('add')">
                        <img class="btn-icon" :src="uploadUcon" />&nbsp;<span class="btn-label">Upload</span></MaterialButton>
                        <MaterialInput v-model="search" @keyup="getFileAttachment" id="search" class="d-flex right-floater mx-1 size border input-search" icon="search mx-2" placeholder="Search File Attachment" size="sm"/>
                    </div>
                </div>
               
                
            </div>
          
        </div>
        <div class="row px-4 pt-1">
            <div class="col-md-12 col-sm-12 col-12 p-0">

                <div class="table-responsive">
                    <table id="table" class="table table-hover table-striped table-bordered" v-if="!loader">
                                <thead class="bg-header">
                                    <tr>
                                        <th>File Type</th>
                                        <th class="adjust-width" scope="col">File Name</th>
                                        <th scope="col">Date Added</th>
                                        <th>Format</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="records.success">
                                        <tr v-for="datum in records.data.data" :key="datum.id">
                                            <td>
                                                {{datum.file_type}} 
                                            </td>
                                            <td>
                                                <a :href="datum.download" download target="_blank">{{datum.filename}}</a>
                                            </td>
                                            <td>
                                                {{datum.dateuploaded}}
                                            </td>
                                            <td>
                                                {{datum.fileext}}
                                            </td>
                                            <td class="action">
                                                <span><a class="del_btn" @click="deleteItem(datum.id)"><img :src="DelIcon" alt="" /></a></span>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                    </table>
                    <Loader v-if="loader"></Loader>
                    <the-pagination v-if="records.success" :records="records" @currentPage="currentPage"></the-pagination>
                </div>
                
            </div>
        </div>
        <teleport to="body">
             <table-sorting></table-sorting>
        </teleport> 
        <Teleport to="body">
                <StandardModal 
                    :show="fileattachModalShow"
                    @close="toggleModal('confirm')"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="File Attachment"
                    size='dialog-m'
                    :isScrollable=true>
                    <template #body>
                        <form role="form" id="contact-form" method="post" autocomplete="off">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <label for="filetype" class="labels my-0">File type</label> 
                                                    <select v-model="to_save.jobseeker_filetype" class="input-group-outline form-select" id="jobseeker_filetype" @change="changeLabel">
                                                        <option v-for="(item, index) in jb_filetype_list" 
                                                        :value="item.id" 
                                                        :key="index">
                                                            {{item.description}}
                                                        </option>
                                                    </select>
                                                    <div class="label-upload" v-if="upload_label">{{upload_label}}</div>
                                                    <span v-if="field_errors.jobseeker_filetype.error" class="error_msg">&nbsp;{{field_errors.jobseeker_filetype.message}}</span>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
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
                        <MaterialButton variant="gradient" color="white" size="sm" class="command-btn mb-0" @click="addUpdateFileAttachment(is_edit)">
                                Save
                        </MaterialButton>
                    </template>
                </StandardModal>

                <StandardModal 
                    @close="showModalSuccess = !showModalSuccess"
                    :show="showModalSuccess" 
                    :hasClose=true
                    size="dialog-sm"
                    >
                    <template v-if="isLoading" #body>
                        <Loader v-if="isLoading"></Loader>
                    </template>

                    <template v-if="!isLoading" #body>
                        <div style="text-align: center">
                            <h5>{{successMsg}}</h5>
                            <span>&nbsp;</span>
                        </div>
                    </template>

                </StandardModal>

                <StandardModal 
                    :show="confirm_modal" 
                    @close="confirm_modal = false"
                    :hasClose=true
                    :hasHeader=false
                    :hasFooter="!loader"
                    title="Dialog"
                    size="dialog-md"
                    :isScrollable=true>

                    <template #body>
                        <Loader v-if="loader"></Loader>
                        <h5 id="alert-message" v-if="!loader">Do you want to delete?</h5>
                    </template>
                    
                    <template #footer>
                        <MaterialButton size="sm" variant="contained" color="success" class="mb-0"  @click="toggleConfirmModal('yes')">
                            Yes
                        </MaterialButton>&nbsp;
                        <MaterialButton size="sm" variant="contained" color="danger" class="mb-0" v-if="!loader" @click="toggleConfirmModal('no')">
                            no
                        </MaterialButton>&nbsp;
                        <MaterialButton size="sm" variant="contained" color="dark" class="mb-0"  @click="toggleConfirmModal('cancel')" v-if="!loader">
                            cancel
                        </MaterialButton>
                    </template>

                </StandardModal>

            </Teleport>				

                
        
    </div>
</template>
<style scoped>
    .h-font{
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
    .label-upload{font-size: 10px; margin-top: 7px; color: green;}
    .input-search{padding: 6px!important; width: 60%;}  
    .action-btn-wrap{padding-right: 0!important;}  
</style>