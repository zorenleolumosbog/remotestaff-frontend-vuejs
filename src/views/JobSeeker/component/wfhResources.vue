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
                wl_list: {},
                nettype_list: {},
                isp_list: {},
                bandwidth_list: {},
                hardware_list: {},
                selected_data: {},
                invalid_url: false,
                to_save: {
                    wfr_workenv: "",
                    wfr_nettype: "",
                    wfr_isp: "",
                    wfr_internet_plan: "",
                    wfr_plan_bandwidth: "",
                    wfr_speedtest_url: "",
                    wfr_comp_hardwaretype: "",
                    wfr_comp_brandname: "",
                    wfr_comp_processor: "",
                    wfr_comp_os: "",
                },
                field_errors: {
                    wfr_workenv: {
                        name: "Work Environment",
                        error: false,
                    },
                    wfr_nettype: {
                        name: "Internet Type",
                        error: false,
                    },
                    wfr_isp: {
                        name: "ISP",
                        error: false,
                    },
                    wfr_internet_plan: {
                        name: "Internet Plan",
                        error: false,
                    },
                    wfr_plan_bandwidth: {
                        name: "Plan bandwidth",
                        error: false,
                    },
                    wfr_speedtest_url: {
                        name: "Speed test",
                        error: false,
                    },
                    wfr_comp_hardwaretype: {
                        name: "Hardware Type",
                        error: false,
                    },
                    wfr_comp_brandname: {
                        name: "Brandname",
                        error: false,
                    },
                    wfr_comp_processor: {
                        name: "Computer Processor",
                        error: false,
                    },
                    wfr_comp_os: {
                        name: "Operating System",
                        error: false,
                    }

                },
                loaderSaveUpdate: false,
                showModalSuccess: false,
                confirm_modal: false,
                confirm_close: false,
                is_edit: "add",
                error_count: 0

            }
        },
        methods:{
            resetData(){
                this.to_save = {
                    wfr_workenv: "",
                    wfr_nettype: "",
                    wfr_isp: "",
                    wfr_internet_plan: "",
                    wfr_plan_bandwidth: "",
                    wfr_speedtest_url: "",
                    wfr_comp_hardwaretype: "",
                    wfr_comp_brandname: "",
                    wfr_comp_processor: "",
                    wfr_comp_os: "",
                }
            },
            reseterror(){
                this.error_count = 0;
                for (const x in this.field_errors){
                    this.field_errors[x]['error'] = false;
                }
            },
            toggleModal(action, data = {}) {

                this.getNetType();
                this.getISP();
                this.getHardware();

                if(action == 'edit' && data){
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
                    this.addUpdateWr('edit')
                    this.confirm_modal = false;

                }else if(action == 'cancel'){
                    this.confirm_modal = false;

                }else if(action == 'no'){
                    this.getWFHRef();
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
                    this.deleteEa()
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
                const reuired_fields = ['wfr_workenv','wfr_nettype','wfr_isp','wfr_internet_plan','wfr_plan_bandwidth','wfr_speedtest_url','wfr_comp_hardwaretype','wfr_comp_brandname','wfr_comp_processor','wfr_comp_os'];
                for(const x in this.field_errors){
                    this.field_errors[x]['error'] = (!to_save[x] && reuired_fields.includes(x)) ? true : false;
                }
                
            },
            checkTrue(has_error){
                return has_error.filter(value => value === true).length;
            },
            addUpdateWr(type){
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

                    data['jobseeker_id']                    = this.USERID;
                    //data['type']                            = type;
                    data['work_env']                   = this.to_save['wfr_workenv'];
                    data['net_type']                           = this.to_save['wfr_nettype'];
                    data['isp']                           = this.to_save['wfr_isp'];
                    data['internet_plan']                        = this.to_save['wfr_internet_plan'];
                    data['plan_bandwidth']                           = this.to_save['wfr_plan_bandwidth'];
                    data['speedtest_url']                       = this.to_save['wfr_speedtest_url'];
                    data['hardware_type']                        = this.to_save['wfr_comp_hardwaretype'];
                    data['brand_name']                             = this.to_save['wfr_comp_brandname'];
                    data['processor']                     = this.to_save['wfr_comp_processor'];
                    data['os']                     = this.to_save['wfr_comp_os'];
    
                 
                    if(type == 'add'){
                        data['id'] = this.to_save['wfr_id'];
                    }

                    this.loaderSaveUpdate = true;
                    this.toggleModal();
                    this.toggleModalSuccess();

                    axios.post(this.API_URL+'/update-wfhres/onboarding',data,{
                        headers: { Authorization: `Bearer ${this.TOKEN}` }
                    }).then((response)=>{
                        
                        if(response.data.success){
                            this.loaderSaveUpdate = false;
                            this.getWFHRef();
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
            getWFHRef(){

                axios.post(this.API_URL+'/get-wfhres/onboarding',{ 
                    jobseeker_id:this.USERID
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.wl_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            deleteEa(){

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
                        this.getWFHRef();
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
            getNetType(){
                axios.get(this.API_URL+'/get-nettype/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.nettype_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            getISP(){
                axios.get(this.API_URL+'/get-isp/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.isp_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            getHardware(){
                axios.get(this.API_URL+'/get-hardware/onboarding',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.hardware_list = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },isValidUrl() {
                
               var str = this.to_save.wfr_speedtest_url;
               try {
                new URL(str);
                     this.invalid_url = false;
                } catch (err) {
                    this.invalid_url = true;
                }     
                
            }
        },
        mounted(){
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getWFHRef();
        }
    }
</script>
<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">
        <div class="row mx-0">
            <!--<div class="col-12 content-header p-4">-->
            <div class="col-12 p-0 pb-2">
                <!--<h3 id="module-title">Work From Home Resources</h3>-->
             
                <MaterialButton variant="gradient" color="white" class="float-end command-btn m-0" @click="toggleModal('edit',wl_list)">
                    <img :src="editIcon" />&nbsp;Edit</MaterialButton>    
            </div>
        </div>

        <Teleport to="body">
                <StandardModal 
                    :show="showEAModal"
                    @close="toggleModal('confirm')"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="Work from Home Resources"
                    size='dialog-xl'
                    :isScrollable=true>
                    <template #body>
                        <div class="form-group mb-2">
                                <label for="wfr_workenv" class="labels my-0">Work Environment</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="wfr_workenv"  
                                v-model="to_save.wfr_workenv"
                                maxlength="20">
                                <span v-if="field_errors.wfr_workenv.error" class="error_msg">&nbsp;{{field_errors.wfr_workenv.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_workenv" class="labels my-0">Internet Type</label>
                                <select name="wfr_nettype" id="wfr_nettype" class="input-group-outline form-select" v-model="to_save.wfr_nettype">
                                    <option v-for="(item, index) in nettype_list" 
                                        :value="item.id" 
                                        :key="index">
                                    {{item.description}}
                                    </option>
                                </select> 
                                <span v-if="field_errors.wfr_nettype.error" class="error_msg">&nbsp;{{field_errors.wfr_nettype.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_isp" class="labels my-0">ISP</label>
                                <select name="wfr_isp" id="wfr_isp" class="input-group-outline form-select" v-model="to_save.wfr_isp">
                                    <option v-for="(item, index) in isp_list" 
                                        :value="item.id" 
                                        :key="index">
                                    {{item.description}}
                                    </option>
                                </select> 
                                <span v-if="field_errors.wfr_isp.error" class="error_msg">&nbsp;{{field_errors.wfr_isp.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_internet_plan" class="labels my-0">Internet Plan</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="wfr_internet_plan"  
                                v-model="to_save.wfr_internet_plan"
                                maxlength="20">
                                <span v-if="field_errors.wfr_internet_plan.error" class="error_msg">&nbsp;{{field_errors.wfr_internet_plan.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_plan_bandwidth" class="labels my-0">Plan Bandwidth</label>
                                <input type="number" class="input-group-outline form-control  p-2" id="wfr_plan_bandwidth"  
                                v-model="to_save.wfr_plan_bandwidth" maxlength="20">
                                <span v-if="field_errors.wfr_plan_bandwidth.error" class="error_msg">&nbsp;{{field_errors.wfr_internet_plan.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="speedtest_url" class="labels my-0">Speed test URL</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="speedtest_url"  
                                v-model="to_save.wfr_speedtest_url"
                                maxlength="150" @blur="isValidUrl">
                                <span v-if="field_errors.wfr_speedtest_url.error" class="error_msg">&nbsp;{{field_errors.wfr_speedtest_url.name}} is required.</span>
                                <span v-if="invalid_url" class="error_msg">&nbsp;Invalid Url.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_comp_hardwaretype" class="labels my-0">Hardware Type</label>
                                <select name="wfr_comp_hardwaretype" id="wfr_comp_hardwaretype" class="input-group-outline form-select" v-model="to_save.wfr_comp_hardwaretype">
                                    <option v-for="(item, index) in hardware_list" 
                                        :value="item.id" 
                                        :key="index">
                                    {{item.description}}
                                    </option>
                                </select> 
                                <span v-if="field_errors.wfr_comp_hardwaretype.error" class="error_msg">&nbsp;{{field_errors.wfr_comp_hardwaretype.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_workenv" class="labels my-0">Brand Name</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="wfr_comp_brandname"  
                                v-model="to_save.wfr_comp_brandname"
                                maxlength="20">
                                <span v-if="field_errors.wfr_comp_brandname.error" class="error_msg">&nbsp;{{field_errors.wfr_comp_brandname.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_workenv" class="labels my-0">Processor</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="wfr_comp_processor"  
                                v-model="to_save.wfr_comp_processor"
                                maxlength="20">
                                <span v-if="field_errors.wfr_comp_processor.error" class="error_msg">&nbsp;{{field_errors.wfr_comp_processor.name}} is required.</span>
                            </div>
                            <div class="form-group mb-2">
                                <label for="wfr_comp_os" class="labels my-0">Operating System</label>
                                <input type="text" class="input-group-outline form-control  p-2" id="wfr_comp_os"  
                                v-model="to_save.wfr_comp_os"
                                maxlength="20">
                                <span v-if="field_errors.wfr_comp_os.error" class="error_msg">&nbsp;{{field_errors.wfr_comp_os.name}} is required.</span>
                            </div>
                    </template>
                    <template #footer>
                        <MaterialButton variant="gradient" color="success" size="sm" class="mb-0" @click="addUpdateWr(is_edit)">
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
                    size='dialog-md'
                    :isScrollable=true>
                    <template #body>
                        <Loader v-if="loaderSaveUpdate"></Loader>
                        <h4 v-else="loaderSaveUpdate" class="text-center">Successfully Saved.</h4><br />
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

        
       
        <div class="row">
            <h5 v-if="wl_list.length < 1">No data found.</h5>
            <div class="col-sm-12 ea-content">
                
                <div class="table-responsive tableFixHead">
                    <table class="table table-striped table-fixed" >
                        <tr class="bg-header">
                            <td style="color: #fff!important;"><br></td>
                            <td></td>
                        </tr>
                        <tbody>
                            <tr>
                                <td>Home Working Environment</td>
                                <td>
                                    {{wl_list.wfr_workenv}}
                                    <span v-if="(wl_list.wfr_workenv == null )||(wl_list.wfr_workenv =='')"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>Internet Type</td>
                                <td>
                                    {{wl_list.net_type}}
                                    <span v-if="(wl_list.net_type == null )||(wl_list.net_type =='')"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>ISP</td>
                                <td>
                                    {{wl_list.isp}}
                                    <span v-if="(wl_list.isp == null )||(wl_list.isp =='')"></span></td>
                            </tr>
                            <tr>
                                <td>Internet Plan</td>
                                <td>
                                    {{wl_list.wfr_internet_plan}}
                                    <span v-if="(wl_list.wfr_internet_plan == null )||(wl_list.wfr_internet_plan =='')"></span></td>
                            </tr>
                            <tr>
                                <td>Plan Bandwidth</td>
                                <td>
                                    {{wl_list.wfr_plan_bandwidth}}
                                    <span v-if="(wl_list.wfr_plan_bandwidth == null )||(wl_list.wfr_plan_bandwidth =='')"></span></td>
                            </tr>
                            <tr>
                                <td>Speed test URL</td>
                                <td>
                                    {{wl_list.wfr_speedtest_url}}
                                    <span v-if="(wl_list.wfr_speedtest_url == null )||(wl_list.wfr_speedtest_url =='')"></span></td>
                            </tr>
                            <tr>
                                <td>Hardware Type</td>
                                <td>{{wl_list.hardware}}
                                    <span v-if="(wl_list.hardware == null )||(wl_list.hardware=='')"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>Brand Name</td>
                                <td>
                                    {{wl_list.wfr_comp_brandname}}
                                    <span v-if="(wl_list.wfr_comp_brandname == null )||(wl_list.wfr_comp_brandname=='')"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>Processor</td>
                                <td>
                                    {{wl_list.wfr_comp_processor}}
                                    <span v-if="(wl_list.wfr_comp_processor == null )||(wl_list.wfr_comp_processor=='')"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>Operating System</td>
                                <td>{{wl_list.wfr_comp_os}}
                                    <span v-if="(wl_list.wfr_comp_os == null )||(wl_list.wfr_comp_os=='')"></span>
                                </td>
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
    .btn-color{
        color:rgb(14, 13, 13)!important;
    }
    .btn-color:hover{
        color:#fff!important;
    }
    tbody tr td:first-child {
        width: 30% !important;
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