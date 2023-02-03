<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import Loader from "@/components/Loader.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import axios from "axios";
    import moment from 'moment';

    import { dom } from '@fortawesome/fontawesome-svg-core'
    dom.watch()

</script>

<script>
    export default {

        data () {

            return {
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                workHostoryList : [],
                formData : {
                    position : '',
                    employer_name : '',
                    start_date : '',
                    end_date : '',
                    country : ''
                },
                fieldErrors: {
                    companyName: {
                        error: false,
                        message: "",
                    },
                    position: {
                        error: false,
                        message: "",
                    },
                    startDate: {
                        error: false,
                        message: "",
                    },
                    endDate: {
                        error: false,
                        message: "",
                    },
                    country: {
                        error: false,
                        message: "",
                    }
                },
                countries : [],
                modalAddEdit : false,
                confirmModal : false,
                successModal : false,
                isBtnDisabled : true,
                actionType : '',
                confirmClose : '',
                loaderSaveUpdate : false,
            }
        },  

        methods : {
            getCountries () {
                axios.get(this.API_URL+'/country',{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        this.countries = response.data.data.data;
                    }

                });

            },

            getEmploymentHistory (){

                axios.post(this.API_URL+'/get-history/onboarding',{ 
                    jobseeker_id:this.USERID
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if(response.data.data){

                        const returnData = response.data.data

                        for ( const x in returnData ) {
                            returnData[x]['selected'] = false;
                        }

                        this.workHostoryList = returnData;

                    }

                }).catch((err)=>{

                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }

                });

            },

            formValidation(){
                
                const formData = this.formData;
                const start_date = this.formatDate(formData.start_date);
                const end_date = this.formatDate(formData.end_date);
                
                // check required
                this.fieldErrors.companyName.error = !formData.employer_name 
                    ? true : false;
                this.fieldErrors.companyName.message = !formData.employer_name 
                    ? "Company name is required." : "";
            
                this.fieldErrors.position.error = !formData.position 
                    ? true : false;
                this.fieldErrors.position.message = !formData.position 
                    ? "Position is required." : "";

                this.fieldErrors.country.error = !formData.country 
                    ? true : false;
                this.fieldErrors.country.message = !formData.country 
                    ? "Country is required." : "";
            

                // check dates
                // End Date should be greater than the Start Date.

                this.fieldErrors.startDate.error = !formData.start_date ? true : false;
                this.fieldErrors.startDate.message = !formData.start_date ? "Start date is required." : '';

                if ( !formData.end_date  ) {
                    
                    this.fieldErrors.endDate.error = true;
                    this.fieldErrors.endDate.message = "End date is required.";

                } else {

                    if(formData.start_date && (end_date < start_date)){
                        this.fieldErrors.endDate.error = true;
                        this.fieldErrors.endDate.message = "End Date should be equal to or greater than the Start Date.";
                    }else{
                        this.fieldErrors.endDate.error = false;
                        this.fieldErrors.endDate.message = "";
                    }
                    
                }

            },

            checkTrue ( hasError ){
                return hasError.filter(value => value === true).length;
            },
            
            addUpdateHistoryInfo ( type ){
                
                this.formValidation();

                // check errors
                const hasError = [];
                for(const x in this.fieldErrors){
                    hasError.push(this.fieldErrors[x]['error']);
                }

                if(!this.checkTrue(hasError)){
                
                    this.successModal = true;
                    this.loaderSaveUpdate = true;
                    this.modalAddEdit = false;
                    let data = this.formData;
                    
                    data['start_date'] = this.formatDate(data['start_date']);
                    data['end_date'] = this.formatDate(data['end_date']);

                    data['type'] = type
                    data['jobseeker_id'] = this.USERID;

                    axios.post(this.API_URL+'/update-history/onboarding',
                        data
                    ,{
                        headers: { Authorization: `Bearer ${this.TOKEN}` }
                    }).then((response)=>{
                        
                        if(response.data.success){

                            const data = response.data.data;
                            const coutryId = data.we_country_id;

                            for ( const x in this.countries ) {

                                if ( this.countries[x].id == coutryId ) {
                                    data['country_long_desc'] =  this.countries[x].long_desc;
                                    break;
                                }

                            }

                            if ( type == 'edit') {
                                this.workHostoryList[this.selectedIndex] = data;
                                this.confirmClose = false;

                            } else {
                                this.workHostoryList.push(data);
                            }

                            this.successModal = true;
                            this.loaderSaveUpdate = false;
                            this.isBtnDisabled = true,
                            this.resetData();
                            this.reseterror();

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
            
            deleteEmploymentHistory (){

                let data = {};
                const index = this.selectedIndex;
                data['jobseeker_id'] = this.USERID;
                data['id'] = this.workHostoryList[index].we_id;

                this.successModal = true;
                this.loaderSaveUpdate = true;

                axios.post(this.API_URL+'/delete-history/onboarding', data, {
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if(response.data.success){
                        this.loaderSaveUpdate = false;
                        this.workHostoryList.splice(index, 1)
                        this.isBtnDisabled = true;
                    }
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            formatDate ( value ){

                if ( !value ) { return ""}
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

            toggleModal ( action ) {
                
                if ( action == 'add' ) {
                    this.reseterror();
                    this.resetData();

                }else if ( action == 'edit' ) {
                    this.reseterror();

                } else if ( action == 'confirmClose' && this.actionType == 'edit') {
                    
                    const oldData = JSON.parse(localStorage.getItem('selectedWorkHistory'));
                    const newData = this.formData;
                    // check updates
                    for (const x in newData){
                        if (oldData[x] !== newData[x]){
                            this.confirmClose = true;
                            this.confirmModal = true;
                            break; 
                        }
                    }

                } else if (action == 'yes'){
                    this.addUpdateHistoryInfo('edit')
                    this.confirmModal = false;
                    this.confirmClose = false;
                    return

                } else if (action == 'cancel'){
                    this.confirmModal = false;
                    this.actionType = 'edit';
                    this.modalAddEdit = !this.modalAddEdit;
                    this.confirmClose = false;
                    return

                } else if (action == 'no'){
                    this.confirmModal = false;
                    this.confirmClose = false;
                    return
                }

                this.actionType = action;
                this.modalAddEdit = !this.modalAddEdit;

            },

            resetSelected (){

                for(const x in this.workHostoryList){
                    this.workHostoryList[x].selected = false;
                }

            },

            reseterror(){

                for (const x in this.fieldErrors){
                    this.fieldErrors[x]['message'] = "";
                    this.fieldErrors[x]['error'] = false;
                }

            },

            selectRow ( data ){
                
                this.resetSelected();

                this.isBtnDisabled = false;
                this.selectedIndex = data;
                this.workHostoryList[data].selected = true;
            },

            toggleConfirmModal ( action ) {
                
                if ( this.actionType == 'delete' && action == 'yes' ) {
                    this.deleteEmploymentHistory();
                }
                
                if ( this.actionType == 'edit' && action == 'yes' ) {
                    this.populateData();
                    this.toggleModal('edit');
                    this.actionType = 'edit';
                    this.confirmModal = !this.confirmModal;
                    
                    localStorage.setItem('selectedWorkHistory',  JSON.stringify(this.formData));

                    return
                }

                this.actionType = action;
                this.confirmModal = !this.confirmModal;

            },

            populateData () {

                const selectedData = this.workHostoryList[this.selectedIndex];
                
                this.formData = {
                    'position' : selectedData.we_position_held,
                    'employer_name' : selectedData.we_er_name,
                    'start_date' : selectedData.we_start_date,
                    'end_date' : selectedData.we_end_date,
                    'country' : selectedData.we_country_id,
                    'id' : selectedData.we_id
                }

            },

            resetData (){

                this.formData = {
                    'position' : '',
                    'employer_name' : '',
                    'start_date' : '',
                    'end_date' : '',
                    'country' : ''
                }

            },

            formatDisplayedDate ( value ) {
                if (value) {
                    return moment(String(value)).format( "MMM. DD, YYYY" );
                }

            }
        },

        computed: {

            getSelectedRow (){
                
                if ( this.actionType == 'add' ) {
                    return ''}
                
                const i = this.selectedIndex;

                return this.workHostoryList[i] ? this.workHostoryList[i] : "";

            },

            getSuccessMsg () {

                if ( this.actionType == 'add' ) {
                    return 'added'
                } else if ( this.actionType == 'edit' ) {
                    return 'updated'
                } else {
                    return 'deleted'
                }

            }
        },
        
        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getEmploymentHistory();
            this.getCountries();

        }
    }
</script>


<template>
<!--<div class="container-fluid p-0 div-border ">-->
<div class="container-fluid p-0">
    <!--<div class="row mx-0 content-header">-->
    <div class="row mx-0">
        <!--<div class="col-md-5 col-sm-5 col-12 p-md-4 py-sm-4 py-2">
            <h3>Work History</h3>
        </div>-->
        <!--<div class="col-md-12 col-sm-12 col-12 py-md-4 py-sm-4 py-2 ">-->
        <div class="col-md-12 col-sm-12 col-12">
            <span class="right-floater">
            <MaterialButton variant="gradient" color="light" size="md" class="mb-0 action-btn command-btn" 
                @click="toggleModal( 'add' )">
                <span class="fas fa-plus"></span>&nbsp;Add
            </MaterialButton>&nbsp;

            <MaterialButton variant="gradient" color="light" size="md" class="mb-0 action-btn command-btn" 
                :class="{disabled: isBtnDisabled}" @click="toggleConfirmModal( 'edit' )">
                <span class="fas fa-edit"></span>&nbsp;Edit
            </MaterialButton>&nbsp;

            <MaterialButton variant="gradient" color="light" size="md" class="mb-0 action-btn command-btn" 
                :class="{disabled: isBtnDisabled}" @click="toggleConfirmModal( 'delete' )">
                <span class="fas fa-trash"></span>&nbsp;Delete
            </MaterialButton>
            </span>
        </div>
    </div>

    <!--<div class="row px-4 pt-4">-->
    <div class="row pt-2">
        <div class="col-12">
            <div class="table-responsive tableFixHead">

            <table class="table table-striped table-fixed " >
                <thead class="thead bg-header">
                    <tr>
                        <th>Company Name</th>
                        <th>Position</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Country</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="workHostoryList.length == 0"><td style="text-align: center" colspan="5">No Info Available</td></tr>
                    <tr v-else v-for="(v, k) in workHostoryList" class="select_row" :class="{selected_row: v.selected}" @click="selectRow(k)">
                        <td>{{v.we_er_name}}</td>
                        <td>{{v.we_position_held}}</td>
                        <td>{{formatDisplayedDate(v.we_start_date)}}</td>
                        <td>{{formatDisplayedDate(v.we_end_date)}}</td>
                        <td>{{v.country_long_desc}}</td>
                    </tr>
                </tbody>
            </table>

            </div>
        </div>
    </div>

    <!-- modals =========== -->
    <div class="row px-4 pt-4">
        
        <StandardModal 
            @close="toggleModal( 'confirmClose' )"
            :show="modalAddEdit" 
            :hasFooter=true
            :hasHeader=true
            title="Work History"
            size="dialog-md"
            isScrollable="true"
            >
            
            <template #body>

                <form role="form" id="contact-form" method="post" autocomplete="off">
                    
                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="email_address" class="labels my-0">Company name</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                v-model="formData.employer_name"
                                maxlength="40">
                        </div>
                        <span v-if="fieldErrors.companyName.error" class="error_msg">&nbsp;{{fieldErrors.companyName.message}}</span>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="email_address" class="labels my-0">Position</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                v-model="formData.position"
                                maxlength="40">
                        </div>
                            <span v-if="fieldErrors.position.error" class="error_msg">&nbsp;{{fieldErrors.position.message}}</span>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-6">
                        <div class="form-group mb-2">
                            <div class="input-group" >
                                <label>Start Date</label>
                                <Datepicker v-model="formData.start_date" format="MMM. dd, yyyy"  
                                :enableTimePicker="false"  style="width: 100% !important; background-color: bisque;">
                                </Datepicker>
                            </div>
                            <span v-if="fieldErrors.startDate.error" class="error_msg">&nbsp;{{fieldErrors.startDate.message}}</span>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="form-group mb-2">
                            <div class="input-group" >
                                <label>End Date</label>
                                <Datepicker v-model="formData.end_date" format="MMM. dd, yyyy"  
                                :enableTimePicker="false" style="width: 100% !important;"></Datepicker>
                            </div>
                            <span v-if="fieldErrors.endDate.error" class="error_msg">&nbsp;{{fieldErrors.endDate.message}}</span>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="country" class="labels my-0">Country Location</label>
                            <select id="country" class="form-select form-select-md" v-model="formData.country">
                                <option v-for="(v, k) in countries" :value="v.id" :key="k">{{v.long_desc}}</option>
                            </select>
                            <span v-if="fieldErrors.country.error" class="error_msg">&nbsp;{{fieldErrors.country.message}}</span>
                        </div>
                    </div>
                </div>

                </form>
                
            </template>
            
            <template #footer>
                <MaterialButton size="sm" variant="contained" color="white" class="command-btn mb-0" @click="addUpdateHistoryInfo(actionType)">
                    Save
                </MaterialButton><span>&nbsp;</span>
                <MaterialButton variant="contained" color="white" size="sm" class="no-btn mb-0" @click="toggleModal">
                    Cancel
                </MaterialButton>
            </template>

        </StandardModal>

        <StandardModal 
            @close="successModal = !successModal"
            :show="successModal" 
            hasClose="true"
            size="dialog-sm"
            >
            
            <template #body>
                
                <Loader v-if="loaderSaveUpdate"></Loader>

                <h5 style="text-align: center" v-else class="alert-message" > Successfully {{ getSuccessMsg }}.</h5>
                <span>&nbsp;</span>
            
            </template>

        </StandardModal>

        <StandardModal 
            @close="toggleConfirmModal('no')"
            :show="confirmModal" 
            hasFooter="true"
            hasClose="true"
            size="dialog-md"
            >
            
            <template #body>

                <h5 v-if="actionType == 'delete'" class="alert-message" >You have selected {{ getSelectedRow.we_er_name }} to be deleted. Would you like to proceed?</h5>
            
                <h5 v-if="actionType == 'edit'" class="alert-message" >You have selected {{ getSelectedRow.we_er_name }} to be edited. Would you like to proceed?</h5>
            
                <h5 v-if="confirmClose" class="alert-message" >Do you want to save the changes you made?</h5>
            
            </template>
            
            <template #footer>

                <div v-if="confirmClose">
                    <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="toggleModal('yes')">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="toggleModal('no')">
                        no
                    </MaterialButton>&nbsp;
                    <!--<MaterialButton size="sm" variant="contained" color="white" class="mb-0" @click="toggleModal('cancel')">
                        cancel
                    </MaterialButton>-->
                </div>

                <div v-else>
                    <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="toggleConfirmModal('yes')">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="toggleConfirmModal('no')">
                        no
                    </MaterialButton>
                </div>

            </template>

        </StandardModal>
    </div>

</div>
</template>

<style scoped>
    h5{
        font-size:1rem;
    }
    #module-title {
        color: #002315;
        font-size: 1.5rem;
        line-height: 1.375;
        font-weight: 600;
        letter-spacing: -0.05rem;
    }
    .thead{
        color:white!important;
        background-color:#002315;
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    .action-btn{
        color: rgb(66, 66, 66) !important;
        border-radius: 5px;
    }
    /*.action-btn:hover{
        color: #fff !important;
        border-radius: 5px;
    }*/

    .right-floater{
        float:right;
    }
    .alert-message {
        padding-top: unset;
    }
    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .error_msg {
        color: red !important;
    }

    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>