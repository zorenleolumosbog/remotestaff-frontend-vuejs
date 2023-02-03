<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import api  from "@/static/config.json";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import Loader from "@/components/Loader.vue";
    import editIcon from "@/assets/img/edit-icon.svg";
    import axios from "axios";
    import { dom } from '@fortawesome/fontawesome-svg-core'
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import { VMoney } from 'v-money';

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
                wp_list: {},
                availability: ['Please Select','Immediate','1-week notice','2-week notice','4-week notice','No longer available'],
                employment_preference: ['Please Select','Full Time','Part Time'],
                working_model: ['Please Select','Office Based','Home Based','Office Based and Home Based'],
                timezone: ['Please Select','Asia/Manila','America/New_York','Australia/Sydney','Canada/Central','Europe/Amsterdam'],
                selected_data: {},
                notice_list: {},
                timezone_list: {},
                was_save: false,
                partime : '',
                error_show:false,
                fulltime : '',
                maxCharacters: 9,
                to_save: {
                    wp_availability: "",
                    wp_emp_preference: "",
                    wp_timezone: "",
                    wp_latest_job_title: "",
                    wp_workingmodel: "",
                    wp_fulltime_agreedsalary: "",
                    wp_parttime_agreedsalary: "",
                    wp_years_of_exp: "",
                },
                field_errors: {
                    wp_availability: {
                        name: "Availability",
                        error: false,
                    },
                    wp_emp_preference: {
                        name: "Employee Reference",
                        error: false,
                    },
                    wp_timezone: {
                        name: "Timezone",
                        error: false,
                    },
                    wp_latest_job_title: {
                        name: "Latest job title",
                        error: false,
                    },
                    wp_workingmodel: {
                        name: "Working Model",
                        error: false,
                    },
                    wp_fulltime_agreedsalary: {
                        name: "Full time agreed salary",
                        error: false,
                    },
                    wp_parttime_agreedsalary: {
                        name: "Part time agreed salary",
                        error: false,
                    },

                    wp_years_of_exp: {
                        name: "Years of experience",
                        error: false,
                    },

                },
                loaderSaveUpdate: false,
                showModalSuccess: false,
                confirm_modal: false,
                confirm_close: false,
                is_edit: "add",
                error_count: 0,
                moneyConfig: {
                    // The character used to show the decimal place.
                    decimal: '.',
                    // The character used to separate numbers in groups of three.
                    thousands: ',',
                    // The currency name or symbol followed by a space.
                    prefix: '',
                    // The suffix (If a suffix is used by the target currency.)
                    suffix: '',
                    // Level of decimal precision. REQUIRED
                    precision: 2,
                    // If mask is false, outputs the number to the model. Otherwise outputs the masked string.
                    masked: false
                }

            }
        },
        components:{
            VMoney
        },
        methods:{
            resetData(){
                this.to_save = {
                    wp_availability: "",
                    wp_emp_preference: "",
                    wp_timezone: "",
                    wp_latest_job_title: "",
                    wp_workingmodel: "",
                    wp_fulltime_agreedsalary: "",
                    wp_parttime_agreedsalary: "",
                    wp_years_of_exp: "",
                }
            },
            reseterror(){
                this.error_count = 0;
                for (const x in this.field_errors){
                    this.field_errors[x]['error'] = false;
                }
            },
            toggleModal(action, data = {}) {

                // check errors
                const has_error = [];
                for(const x in this.field_errors){
                    has_error.push(this.field_errors[x]['error']);
                }

                 
                if(this.checkTrue(has_error)){
                    this.error_show = true;
                }else{
                    this.error_show = false;
                }

                if(action == 'edit' && data){
                    this.error_show = false;
                    
                    console.log(data);
                    this.to_save = data;
                    localStorage.setItem('WR_data',  JSON.stringify(data));

                    this.is_edit = "edit";
                    this.showViewModal = false;
                    this.reseterror();

                }else if(action == 'confirm' && this.is_edit == 'edit'){
                    const old_data = JSON.parse(localStorage.getItem('WR_data'));
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
                    this.addUpdateWp('edit')
                    this.confirm_modal = false;

                }else if(action == 'cancel'){
                    this.confirm_modal = false;

                }else if(action == 'no'){
                    this.getWorkPref();
                    this.confirm_modal = false;
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
                    this.confirm_close = false;
                    this.selected_data = data;
                }else if(action == 'yes'){
                    this.confirm_modal = !this.confirm_modal;
                    this.deleteWp()
                }

                this.confirm_modal = !this.confirm_modal;
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
                const reuired_fields = ['wp_availability','wp_emp_preference','wp_latest_job_title','wp_workingmodel','wp_fulltime_agreedsalary','wp_parttime_agreedsalary','wp_years_of_exp','wp_timezone'];
                for(const x in this.field_errors){
                    this.field_errors[x]['error'] = (!to_save[x] && reuired_fields.includes(x)) ? true : false;
                }
                
            },
            checkTrue(has_error){
                return has_error.filter(value => value === true).length;
            },
            addUpdateWp(type){
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

                    var fulltime = this.to_save['wp_fulltime_agreedsalary'];
                    var partime = this.to_save['wp_parttime_agreedsalary'];
                    fulltime = fulltime.split(',').join('');
                    partime = partime.split(',').join('');

                    data['jobseeker_id']                    = this.USERID;
                    //data['type']                            = type;
                    data['availability']                   = this.to_save['wp_availability'];
                    data['emp_preference']                           = this.to_save['wp_emp_preference'];
                    data['timezone']                        = this.to_save['wp_timezone'];
                    data['latest_job_title']                           = this.to_save['wp_latest_job_title'];
                    data['workingmodel']                       = this.to_save['wp_workingmodel'];
                    data['fulltime_agreedsalary']                        = fulltime;
                    data['parttime_agreedsalary']                             = partime;
                    data['years_of_exp']                     = this.to_save['wp_years_of_exp'];
    
                 
                    if(type == 'add'){
                        data['id'] = this.to_save['wp_id'];
                    }

                    this.loaderSaveUpdate = true;
                    this.toggleModal();
                    this.toggleModalSuccess();

                    axios.post(this.API_URL+'/update-workref/onboarding',data,{
                        headers: { Authorization: `Bearer ${this.TOKEN}` }
                    }).then((response)=>{
                        
                        if(response.data.success){
                            this.loaderSaveUpdate = false;
                            this.was_save = true;
                            this.getWorkPref();
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
            getWorkPref(){

                axios.post(this.API_URL+'/get-workref/onboarding',{ 
                    jobseeker_id:this.USERID
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.wp_list = response.data.data;
                        this.display_list = response.data.data;
                        var partime = response.data.data.wp_parttime_agreedsalary;
                        var fulltime = response.data.data.wp_fulltime_agreedsalary;
                       this.partime = partime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                       this.fulltime = fulltime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            deleteWp(){

                let data = {};
                data['jobseeker_id'] = this.USERID;
                data['id'] = this.selected_data.ea_id;

                this.loaderSaveUpdate = true;
                axios.post(this.API_URL+'/delete-wfhres/onboarding',data,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.success){
                        this.confirm_modal = false;
                        this.loaderSaveUpdate = false;
                        this.getWorkPref();
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
            onlyFulltime ($event) {
                var dot = 0;
                var salary = this.to_save.wp_fulltime_agreedsalary;
            },
            onlyPartime ($event) {
                var dot = 0;
                var salary = this.to_save.wp_parttime_agreedsalary;
            }
            ,forPartime(){
                var full = this.to_save.wp_fulltime_agreedsalary;
                full = full.split(',').join('');
                var partime_total = (full/2).toFixed(2);
                this.to_save.wp_parttime_agreedsalary = partime_total.toLocaleString("en-US");
            },
            updateValue(event) {
               const value = event.target.value
               console.log(value, this.amount)
               if (String(value).length <= 10) {
                   this.amount = value
                }
            this.$forceUpdate()
            },
            getNoticePeriod(){
                axios.get(this.API_URL+'/getworkrefnotice/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.notice_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
             },
            getTimezone(){

                axios.get(this.API_URL+'/getworkreftimezone/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.timezone_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
             }
        },
        mounted(){
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getWorkPref();
            this.getNoticePeriod();
            this.getTimezone();
        },
        computed: {
             charactersRemaining: function () {
              return this.maxCharacters - this.text.length;
            }
        }
    }
</script>

<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">
        <div class="row mx-0">
            <!--<div class="col-12 content-header p-4">-->
            <div class="col-12 p-0 pb-2">
                <!--<h3 id="module-title">Work Preference</h3>-->
                <MaterialButton variant="gradient" color="white" size="sm" class="mb-0 action-btn float-end command-btn" 
                        :class="{disabled: is_disabled_email}" @click="toggleModal('edit',wp_list)">
                        <span class="fas fa-edit"></span>&nbsp;Edit
                </MaterialButton>
            </div>
        </div>
        
        <div class="row">
            <Teleport to="body">
                <StandardModal 
                    :show="showEAModal"
                    @close="toggleModal('confirm')"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="Work Preference"
                    size='dialog-xl'
                    :isScrollable=true>
                    <template #body>
                        <div class="row mt-0 stick-alert">
                    <div class="col-12">
                           <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" v-if="error_show">
                                Your form could not be saved. Please complete all the marked fields.
                            </MaterialAlert>
                    </div>
                     </div>
                        <div class="form-group mb-2">
                            <label for="wp_latest_job_title" class="labels my-0">Latest Job Title</label>
                            <input type="text" class="input-group-outline form-control  p-2" id="wp_latest_job_title"  
                            v-model="to_save.wp_latest_job_title"
                            maxlength="50">
                            <span v-if="field_errors.wp_latest_job_title.error" class="error_msg">&nbsp;{{field_errors.wp_latest_job_title.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wp_availability" class="labels my-0">Availability to Start</label><br/>
                            <select name="wp_availability" id="wp_availability" class="input-group-outline form-select" v-model="to_save.wp_availability">
                                <option v-for="(item, index) in notice_list" 
                                    :value="item.id" 
                                    :key="index">
                                   {{item.description}}
                                </option>
                            </select> 
                            <span v-if="field_errors.wp_availability.error" class="error_msg">&nbsp;{{field_errors.wp_availability.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wp_availability" class="labels my-0">Employment Preference</label><br/>    
                            <select name="wp_emp_preference" id="wp_emp_preference" class="input-group-outline form-select" v-model="to_save.wp_emp_preference">
                                <option value="1">Full Time</option>
                                <option value="2">Part Time</option>
                            </select>

                            <span v-if="field_errors.wp_emp_preference.error" class="error_msg">&nbsp;{{field_errors.wp_emp_preference.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wfr_workenv" class="labels my-0">Preferred Working Timezone</label><br/>
                            <select name="wp_timezone" id="wp_timezone" class="input-group-outline form-select" v-model="to_save.wp_timezone">
                                <option v-for="(item, index) in timezone_list" 
                                    :value="item.id" 
                                    :key="index">
                                   {{item.description}}
                                </option>
                            </select>
                            <span v-if="field_errors.wp_timezone.error" class="error_msg">&nbsp;{{field_errors.wp_timezone.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wfr_workenv" class="labels my-0">Working Model</label><br/>
                            <select name="wp_workingmodel" id="wp_workingmodel" class="input-group-outline form-select" v-model="to_save.wp_workingmodel">
                                <option value="1">Office Based</option>
                                <option value="2">Home Based</option>
                                <option value="3">Office Based and Home Based</option>
                            </select>
                            <span v-if="field_errors.wp_workingmodel.error" class="error_msg">&nbsp;{{field_errors.wp_workingmodel.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wp_fulltime_agreedsalary" class="labels my-0">Full Time Agreed Salary</label>
                            <input v-model="to_save.wp_fulltime_agreedsalary" v-money="moneyConfig" class="input-group-outline form-control  p-2" id="wp_fulltime_agreedsalary" maxlength="12" @blur="forPartime"/>
                            <span v-if="field_errors. wp_fulltime_agreedsalary.error" class="error_msg">&nbsp;{{field_errors. wp_fulltime_agreedsalary.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wfr_workenv" class="labels my-0">Part time Agreed Salary</label>
                            <input v-model="to_save.wp_parttime_agreedsalary" v-money="moneyConfig" class="input-group-outline form-control  p-2" id="wp_parttime_agreedsalary" maxlength="12"/>
                            <span v-if="field_errors.wp_parttime_agreedsalary.error" class="error_msg">&nbsp;{{field_errors.wp_parttime_agreedsalary.name}} is required.</span>
                        </div>
                        <div class="form-group mb-2">
                            <label for="wfr_workenv" class="labels my-0">Years of Experience</label>
                            <input type="number" class="input-group-outline form-control  p-2" id="wp_years_of_exp"  
                            v-model="to_save.wp_years_of_exp"
                            maxlength="12" @input="updateValue">
                            <span v-if="field_errors.wp_years_of_exp.error" class="error_msg">&nbsp;{{field_errors.wp_years_of_exp.name}} is required.</span>
                        </div>
                    </template>
                    <template #footer>
                        <MaterialButton variant="gradient" color="white" size="sm" class="command-btn mb-0" @click="addUpdateWp(is_edit)">
                                Save
                        </MaterialButton>
                    </template>
                </StandardModal>
                

                <!-- Success Loader -->
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
                        <h5> Successfully updated. </h5>
                        <span>&nbsp;</span>
                    </div>
                </template>

            </StandardModal>

            <StandardModal 
            :show="confirm_modal" 
            @close="toggleModal('cancel')"
            :hasClose=true
            :hasHeader=false
            :hasFooter="!loader"
            title="Dialog"
            size="dialog-md"
            :isScrollable=true>
            <template #body>
                <Loader v-if="loader"></Loader>
                <h5 id="alert-message" v-if="!loader">Do you want to save the changes you made?</h5>
            </template>
            
            <template #footer>
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0"  @click="toggleModal('yes')">
                    Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" v-if="!loader" @click="toggleModal('no')">
                    no
                </MaterialButton>&nbsp;
                <!--<MaterialButton size="sm" variant="contained" color="dark btn-secondary btn-cancel" class="mb-0"  @click="toggleModal('cancel')" v-if="!loader">
                    cancel
                </MaterialButton>-->
            </template>

            </StandardModal>
                
            </Teleport>
           
        </div>
        <div class="row ">
        <div class="col-md-12">
            <h5 v-if="wp_list.length < 1">No data found.</h5>
            <table class="table table-striped">
                    <tbody>
                        <tr>
                            <td class="col-sm-6 first-col-width" style="width: 20%;">
                                Latest Job Title
                            </td>
                            <td class="col-sm-6" style="width: 80%;">
                                <div>{{wp_list.wp_latest_job_title}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Availability to Start
                            </td>
                            <td>
                                <div>{{availability[wp_list.wp_availability]}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Preferred Working Timezone
                            </td>
                            <td>
                                <div>{{timezone[wp_list.wp_timezone]}}</div>
                            </td>
                        </tr>   
                        <tr>
                            <td>
                                Employment Preference
                            </td>
                            <td>
                                <div>{{employment_preference[wp_list.wp_emp_preference]}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Working Model
                            </td>
                            <td>
                                <div>{{working_model[wp_list.wp_workingmodel]}}</div>
                            </td>
                        </tr>   
                        <tr>
                            <td>
                                Full Time Agreed Salary
                            </td>
                            <td>
                                <div>{{fulltime}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Part Time Agreed Salary
                            </td>
                            <td>
                                <div>{{partime}}</div>
                            </td>
                        </tr>
                    </tbody>
                </table> 
            </div>
        </div>


   </div>
</template>
<style scoped>

     textarea {
        padding: 10px !important;
    }
    .modal-dialog-small {
        max-width: 300px;
    }
    #justify-content-between{
        justify-content: space-between !important;
        display: flex;
        margin: 0 10px;
    }
   
    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    .table thead th {
        padding: 0.75rem 1.5rem 0.75rem 0.5rem!important;
    }
    td{color:black!important;}
    .thead{
        color:white!important;
        background-color: #002315;
        
    }
    #h5{
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

    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    
    .action-btn{
        color:#212529!important;
        border-radius: 5px;
    }
    /*.action-btn:hover{
        color: #fff !important;
        border-radius: 5px;
    }*/
    .btn-cancel{
        background-color: #7b809a;
    }
</style>