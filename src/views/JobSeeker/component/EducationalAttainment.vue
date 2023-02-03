<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import api  from "@/static/config.json";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import Loader from "@/components/Loader.vue";
    import AddIcon from "@/assets/img/add-icon.svg";
    import axios from "axios";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import { dom } from '@fortawesome/fontawesome-svg-core'
    dom.watch()
</script>
<script>
    export default {
        data(){
            return{
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                dialog: "",
                showEAModal: false,
                action: "add",
                ea_list: {},
                selected_data: {},
                countries: {},
                loader:{data:false},
                to_save: {
                    field: "",
                    gpa: "",
                    graddate: "",
                    institute: "",
                    licensecert: "",
                    location: "",
                    major: "",
                    degree_level: "",
                    semtrainings: "",
                    country_id:""
                },
                field_errors: {
                    field: {
                        name: "Field of Study",
                        error: false,
                    },
                    gpa: {
                        name: "GPA",
                        error: false,
                    },
                    graddate: {
                        name: "Graduation Date",
                        error: false,
                    },
                    institute: {
                        name: "Institure/University",
                        error: false,
                    },
                    licensecert: {
                        name: "Licensures or Certifications",
                        error: false,
                    },
                    location: {
                        name: "Location",
                        error: false,
                    },
                    major: {
                        name: "Major",
                        error: false,
                    },
                    degree_level: {
                        name: "Degree Level",
                        error: false,
                    },
                    semtrainings: {
                        name: "Trainings and Seminars",
                        error: false,
                    },
                    country_id: {
                        name: "Country",
                        error: false,
                    },
                },
                degree_level: {},
                field_of_study: {},
                location: {},
                loaderSaveUpdate: false,
                showModalSuccess: false,
                confirmModal: false,
                confirmClose: false,
                is_edit: "add",
                error_count: 0

            }
        },
        methods:{
            resetData(){
                this.to_save = {
                    field: "",
                    gpa: "",
                    graddate: "",
                    institute: "",
                    licensecert: "",
                    location: "",
                    major: "",
                    degree_level: "",
                    semtrainings: "",
                    country_id: ""
                }
            },
            reseterror(){
                this.error_count = 0;
                for (const x in this.field_errors){
                    this.field_errors[x]['error'] = false;
                }
            },
            toggleModal(action, data = {}) {

                this.getDegreeLevel();
                this.getFieldStudy();

                if(action == 'edit' && data){
                    this.to_save = data;
                    localStorage.setItem('EA_data',  JSON.stringify(data));

                    this.is_edit = "edit";
                    this.showViewModal = false;
                    this.reseterror();

                }else if(action == 'confirm' && this.is_edit == 'edit'){
                    const old_data = JSON.parse(localStorage.getItem('EA_data'));
                    const new_data = this.to_save;

                    // check updates
                    for (const x in new_data){
                        if (old_data[x] !== new_data[x]){
                            this.confirmClose = true;
                            this.confirmModal = true;
                            break; 
                        }
                    }

                }else if(action == 'yes'){
                    this.addUpdateEa('edit')
                    this.confirmModal = false;

                }else if(action == 'cancel'){
                    this.confirmModal = false;

                }else if(action == 'no'){
                    this.getEducationalAttainment();
                    this.confirmModal = false;
                    this.showEAModal = true;

                }else{
                    this.is_edit = "add";
                    this.resetData();
                    this.reseterror();
                }
                this.showEAModal = !this.showEAModal;
            },
            toggleConfirmModal(action, data = ""){
                this.confirm_delete = !this.confirm_delete;

                if (action == 'confirm'){
                    this.confirmClose = false;
                    this.selected_data = data;
                }else if(action == 'yes'){
                    this.confirmModal = !this.confirmModal;
                    this.deleteEa()
                }

                this.confirmModal = !this.confirmModal;
            },
            formatDate(value){
                if(!value) { return ""}
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
            formValidation(){
                const to_save = this.to_save;
                
                // check required
                const reuired_fields = ['degree_level','major','field','institute','country_id','graddate'];
                for(const x in this.field_errors){
                    this.field_errors[x]['error'] = (!to_save[x] && reuired_fields.includes(x)) ? true : false;
                }
                
            },
            checkTrue(has_error){
                return has_error.filter(value => value === true).length;
            },
            addUpdateEa(type){
                this.formValidation();

                // check errors
                const has_error = [];
                for(const x in this.field_errors){
                    has_error.push(this.field_errors[x]['error']);
                }

                this.error_count = this.checkTrue(has_error) 
                    ? this.checkTrue(has_error) : 0;
                if(!this.checkTrue(has_error)){

                    let data = {};

                    let graddate = this.to_save['graddate'] 
                        ? this.formatDate(this.to_save['graddate']) : "";

                    data['jobseeker_id']                    = this.USERID;
                    data['type']                            = type;
                    data['degree_level']                   = this.to_save['degree_level'];
                    data['major']                           = this.to_save['major'];
                    data['graddate']                        = graddate;
                    data['field']                           = this.to_save['field'];
                    data['institute']                       = this.to_save['institute'];
                    data['country_id']                        = this.to_save['country_id'];
                    data['gpa']                             = this.to_save['gpa'];
                    data['licensecert']                     = this.to_save['licensecert'];
                    data['semtrainings']                    = this.to_save['semtrainings'];

                    console.log(type, this.to_save['id'])

                    if(type == 'edit'){
                        data['id'] = this.to_save['id'];
                    }

                    this.loaderSaveUpdate = true;
                    this.toggleModal();
                    this.toggleModalSuccess();

                    axios.post(this.API_URL+'/update-educational/onboarding',data,{
                        headers: { Authorization: `Bearer ${this.TOKEN}` }
                    }).then((response)=>{
                        
                        if(response.data.success){
                            this.loaderSaveUpdate = false;
                            this.getEducationalAttainment();
                            this.resetData();
                            this.reseterror();
                        }
                    }).catch((err)=>{
                        if(err.response.status == 401){
                            localStorage.removeItem('userid');
                            localStorage.removeItem('token');
                            this.$router.push('/'); 
                        }else{
                            this.toggleModalSuccess();
                            this.toggleModal();
                        }
                    });

                }
            },
            getEducationalAttainment(){
                this.loader.data = true;
                axios.post(this.API_URL+'/get-educational/onboarding',{ 
                    jobseeker_id:this.USERID
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    this.loader.data = false;
                    if(response.data.data){
                        console.log(response.data.data)
                        this.ea_list = response.data.data;
                    }

                }).catch((err)=>{
                    this.loader.data = false;
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            getDegreeLevel(){
                axios.get(this.API_URL+'/get-degreelevel/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.degree_level = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            getFieldStudy(){
                axios.get(this.API_URL+'/get-fieldstudy/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.field_of_study = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            async getCountries(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/country',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{  
                    this.countries = response.data.data.data;
                    
               
                });
            },
            deleteEa(){

                let data = {};
                data['jobseeker_id'] = this.USERID;
                data['id'] = this.selected_data.id;

                this.loaderSaveUpdate = true;
                axios.post(this.API_URL+'/delete-educational/onboarding',data,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.success){
                        this.confirmModal = false;
                        this.loaderSaveUpdate = false;
                        this.getEducationalAttainment();
                    }
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },    
            toggleModalSuccess(){
                this.showModalSuccess = !this.showModalSuccess;
            },
        },
        mounted(){
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getEducationalAttainment();
            this.getCountries();
        }
    }
</script>


<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">

        <div class="row mx-0">
            <!--<div class="col-12 content-header p-4">-->
            <div class="col-12 pb-2">
                <!--<h3 id="module-title">Educational Attainment</h3>-->
                <MaterialButton v-if="!loader.data" variant="gradient" color="light" size="sm" style="margin-bottom: 0;" class="float-end command-btn" @click="toggleModal">
                    <span class="fas fa-plus fa-sm"></span>&nbsp;Add</MaterialButton>
            </div>
        </div>

        <StandardModal 
            @close="toggleModal('confirm')"
            :show="showEAModal" 
            hasClose="true"
            size="dialog-xl"
            isScrollable="true"
            hasHeader="true"
            hasFooter="true"
            title="Educational Attainment"
            >

            <template #body>
                <div class="form-group mb-2">
                    <label for="degree_level" class="labels my-0">Degree Level</label>
                    
                    <select name="degree_level" id="degree_level" class="input-group-outline form-select" v-model="to_save.degree_level">
                                    <option v-for="(item, index) in degree_level" 
                                        :value="item.id" 
                                        :key="index">
                                    {{item.description}}
                                    </option>
                    </select> 
                    <span v-if="field_errors.degree_level.error" class="error_msg">&nbsp;{{field_errors.degree_level.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <label for="major" class="labels my-0">Major</label>
                    <input type="text" class="input-group-outline form-control  p-2" id="major"  
                    v-model="to_save.major"
                    maxlength="20">
                    <span v-if="field_errors.major.error" class="error_msg">&nbsp;{{field_errors.major.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <label for="field" class="labels my-0">Field of Study</label>
                    <select name="field" id="field" class="input-group-outline form-select" v-model="to_save.field">
                                    <option v-for="(item, index) in field_of_study" 
                                        :value="item.id" 
                                        :key="index">
                                    {{item.description}}
                                    </option>
                    </select> 
                    <span v-if="field_errors.field.error" class="error_msg">&nbsp;{{field_errors.field.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <label for="institute" class="labels my-0">Institute/University</label>
                    <input type="text" class="input-group-outline form-control  p-2" id="institute"  
                    v-model="to_save.institute"
                    maxlength="20">
                    <span v-if="field_errors.institute.error" class="error_msg">&nbsp;{{field_errors.institute.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <label for="location" class="labels my-0">Country</label>
            
                    <select class="form-select form-select-md" v-model="to_save.country_id">
                                                <option :value="''"></option>
                                                <option v-for="c in countries.sort((a, b) => a.long_desc.localeCompare(b.long_desc))" :value="c.id">{{c.long_desc}}</option>
                                            </select>
                    <span v-if="field_errors.location.error" class="error_msg">&nbsp;{{field_errors.country_id.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <div class="input-group" >
                        <label>Graduation Date</label>
                        <Datepicker v-model="to_save.graddate" format="yyyy-MM-dd"  
                        :enableTimePicker="false"  style="width: 100% !important; background-color: bisque;">
                        </Datepicker>
                    </div>
                    <span v-if="field_errors.graddate.error" class="error_msg">&nbsp;{{field_errors.graddate.name}} is required.</span>
                </div>

                <div class="form-group mb-2">
                    <label for="gpa" class="labels my-0">GPA</label>
                    <input type="number" class="input-group-outline form-control  p-2" id="gpa"  
                    v-model="to_save.gpa"
                    maxlength="10">
                    <span v-if="field_errors.gpa.error" class="error_msg">&nbsp;{{field_errors.gpa.name}} is required.</span>
                </div>

                <div class="input-group input-group-static mb-4">
                    <label for="licensecert" class="">Licensures or Certifications</label>
                    <textarea v-model="to_save.licensecert"  name="licensecert" 
                    class="form-control" id="licensecert" placeholder="" rows="4"
                    style="background-color: #ededed; border-radius: 5px  !important;"
                    ></textarea>
                    <span v-if="field_errors.licensecert.error" class="error_msg">&nbsp;{{field_errors.licensecert.name}} is required.</span>
                </div>

                <div class="input-group input-group-static mb-4">
                    <label for="semtrainings" class="">Trainings and Seminars</label>
                    <textarea v-model="to_save.semtrainings"  name="semtrainings" 
                    class="form-control" id="semtrainings" placeholder="" rows="4"
                    style="background-color: #ededed; border-radius: 5px  !important;"
                    ></textarea>
                    <span v-if="field_errors.semtrainings.error" class="error_msg">&nbsp;{{field_errors.semtrainings.name}} is required.</span>
                </div>
            </template>

            <template #footer>
                <MaterialButton variant="gradient" color="light"  class="command-btn mb-0" @click="addUpdateEa(is_edit)">
                    Save
                </MaterialButton>
            </template>

        </StandardModal>


        <div class="row">
            <StandardModal 
                @close="showModalSuccess = !showModalSuccess"
                :show="showModalSuccess" 
                hasClose="true"
                size="dialog-sm"
                >

                <template #body>
                    <Loader v-if="loaderSaveUpdate"></Loader>
                    <div v-else>
                        <h5 style="text-align: center;color:black;">Successfully Saved.</h5>
                        <span>&nbsp;</span>
                    </div>
                </template>

            </StandardModal>
        </div>

        
        <div class="row">
            <StandardModal 
                @close="confirmModal = !confirmModal"
                :show="confirmModal" 
                :hasFooter=!loaderSaveUpdate
                size="dialog-sm"
                >
                
                    <template #body>
                        <Loader v-if="loaderSaveUpdate"></Loader>
                        
                        <h5 style="color:black" v-else-if="confirmClose">Do you want to save the changes you made?</h5>

                        <h5 style="color:black" v-else>Are you sure you want to delete this record?</h5>

                    </template>
                    
                    <template #footer>
                        <div v-if="confirmClose">
                            <MaterialButton  variant="gradient" size="sm" color="light" class="yes-btn mb-0" @click="toggleModal('yes')">
                                Yes
                            </MaterialButton>&nbsp;
                            <MaterialButton  variant="gradient" size="sm" color="light" class="no-btn mb-0" @click="toggleModal('no')">
                                no
                            </MaterialButton>&nbsp;
                            <MaterialButton  variant="gradient" size="sm" color="light" class="command-btn mb-0" @click="toggleModal('cancel')">
                                cancel
                            </MaterialButton>
                        </div>
                        <div v-else>
                            <MaterialButton  variant="gradient" size="sm" color="light" class="yes-btn mb-0" @click="toggleConfirmModal('yes')">
                                Yes
                            </MaterialButton>&nbsp;
                            <MaterialButton  variant="gradient" size="sm" color="light" class="no-btn mb-0" @click="toggleConfirmModal('no')">
                                no
                            </MaterialButton>
                        </div>
                    </template>

            </StandardModal>
        </div>
        

        <div class="row">
            <h5 v-if="ea_list.length < 1">No data found.</h5>
            <div class="col-sm-12 ea-content">
                <loader v-if="loader.data"></loader>
                <div class="table-responsive tableFixHead" v-for="x in ea_list" :key="x.id" v-if="!loader.data">
                    <table class="table table-striped table-fixed" >
                        <thead class="bg-header">
                            <tr>
                                <th>
                                    {{x.degree_level}}
                                </th>
                                <th style="text-align: right;">
                                    <MaterialButton variant="gradient" color="light" size="sm" class="command-btn mx-1 mb-0" @click="toggleModal('edit',x)">
                                        <i class="fas fa-edit"></i>&nbsp;Edit</MaterialButton>
                                    <span>&nbsp;&nbsp;</span>
                                    <MaterialButton variant="gradient" color="light" size="sm" class="command-btn mx-1 mb-0" @click="toggleConfirmModal('confirm', x)">
                                        <i class="fas fa-trash"></i>&nbsp;Delete</MaterialButton>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td>Degree Level</td>
                                <td>{{x.level}}</td>
                            </tr>
                            <tr >
                                <td>Field of Study</td>
                                <td>{{x.study_field}}</td>
                            </tr>
                            <tr >
                                <td>Major</td>
                                <td>{{x.major}}</td>
                            </tr>
                            <tr >
                                <td>Institute/University</td>
                                <td>{{x.institute}}</td>
                            </tr>
                            <tr >
                                <td>Country</td>
                                <td>{{x.country}}</td>
                            </tr>
                            <tr >
                                <td>Graduation Date</td>
                                <td>{{formatDate(x.graddate)}}</td>
                            </tr>
                            <tr >
                                <td>GPA</td>
                                <td>{{x.gpa}}</td>
                            </tr>
                            <tr >
                                <td>Licensures or Certifications</td>
                                <td>{{x.licensecert}}</td>
                            </tr>
                            <tr >
                                <td>Trainings and Seminars</td>
                                <td>{{x.semtrainings}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped>
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    textarea {
        padding: 10px !important;
    }
    #justify-content-between{
        justify-content: space-between !important;
        display: flex;
        margin: 0 10px;
    }
    #module-title {
        color: #002315;
        line-height: 1.375;
        font-weight: 600;
        letter-spacing: -0.05rem;
    }
    #modal-dialog {
        max-width: 600px;
    }
    .modal-dialog-small {
        max-width: 350px;
    }
    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    .change-color {
        filter: invert(94%) sepia(6%) saturate(0%) hue-rotate(48deg) brightness(105%) contrast(104%);
    }
    .thead{
        background-color: #002315 !important;
    }
    .btn-light{
        margin-bottom: 0; 
        padding: 3px 10px;
        box-shadow: unset;
        border-radius: 3px;
    }
    .btn-light:hover{
        background-color: #4caf50;
        box-shadow: unset
        
    }
    tbody tr td:first-child {
        width: 30% !important;
    }
    .btn-color{
        color:#000!important;
    }
    .btn-color:hover{
        color:#fff!important;
    }
    .table thead th{
        padding: 0.5rem 1.2rem;
    }
    .table tbody td{
        padding: 0.3rem 1.5rem;
    }
    .ea-content{
        max-height: 70vh;
        overflow-y: auto; /* Hide vertical scrollbar */
        overflow-x: hidden; /* Hide horizontal scrollbar */
    }
    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .error_msg {
        font-size: 0.9em;
        color: #9c0404;
    }
</style>