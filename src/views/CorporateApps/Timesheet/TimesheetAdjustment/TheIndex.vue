<!-- <script setup>
    import StandardLayout from "./components/StandardLayout.vue";
    import DefaultNavbar from "../components/NavbarDefault.vue";
    import SideBar from "../components/SideBar.vue"
</script> -->
<script>
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import api from "@/static/config.json";
    import axios from "axios";
    // import DefaultNavbar from "../components/NavbarDefault.vue";
 
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import Loader from "@/components/Loader.vue";
    // import TheNavbar from "./components/TheNavbar.vue";
    // import TheSidebar from "./components/TheSidebar.vue";
    import vSelect from "vue-select";
     
    export default {
        components: {
            // DefaultNavbar,
            // TheNavbar,
            // TheSidebar,
            Datepicker,
            MaterialButton,
            MaterialInput,
            StandardModal,
            ThePagination,
            Loader,
            vSelect
        },
        data() {
            return {
                start_date: '',
                end_date: '',
                clients: '',
                staffs: '',
                TOKEN: '',
                search: '',
                total_hours:'',
                reg_ros_hours:'',
                format: 'MM/dd/yyyy',
                adj_total: 0,
                showModalSuccess : false,
                generated_data_smry: {},
                page_data: {
                    data_per_page: [],
                },
                client_value: '',
                staff_value: '',
                selected : '',
                timesheet_ids: '',
                clientId: '',
                clientName: '',
                isGenerated: false,
                pagination: {
                    current: 1,
                    limit: 20
                },
                getLoader : false,
                selected: null,
                records: {
                    success: false
                },
                history_records: {
                    success: false
                },
                form: {
                    adjusted_id: []
                },
                showModalHistory: false,
                showModalError: false,
                isLoading:false,
                error_msg:'',
                was_fetch:false,
                working_total:0,
                work_actual_hours:0,
                small_loader:false

            }
        },
        methods: {
            
            getClients() {
                let _this = this

                this.staff_value = '';

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/timesheet/client-list',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    _this.clients = response.data.data
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        window.location.href = "login/admin";
                    }
                });
            },
            getStaff() {
                let _this = this

                _this.staff_value = '';

                _this.small_loader=true;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/timesheet/staff-list?client='+_this.client_value,
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                })
                .then(function (response) {
                    _this.staffs = response.data.data;
                    _this.small_loader=false;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        window.location.href = "login/admin";
                    }
                });
            }, 
           getTimesheet(){
              
              this.form.adjusted_id = [];

              let self = this;
              this.was_fetch = true;

              if(this.start_date!=="" && this.end_date!==""){
                   var start_date = this.start_date;
                   var end_date = this.end_date;
              }else{
                  var start_date = '';
                  var end_date = '';
              }
              
                this.isLoading = true;
                this.showModalSuccess = true;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL +`/timesheet/get-timesheet?page=${self.pagination.current}&limit=${self.pagination.limit}&search=${self.search}&start_date=${start_date}&end_date=${end_date}&client_id=${self.client_value}&subcon_id=${self.staff_value}&orderby=${this.order}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.working_total = 0;
                    self.work_actual_hours = 0;
                    self.isLoading = false;
                    self.showModalSuccess = false;
                    self.records = response.data;
                    var populate = response.data.data;

                    for (const key in populate) {
                        if (populate.hasOwnProperty(key)) {
                            self.working_total += parseFloat(populate[key].reg_ros_hours);
                            self.work_actual_hours += parseFloat(populate[key].actual_hours_worked);
                            
                            self.form.adjusted_id[populate[key].date_worked] = populate[key].adjusted_hours;
                        }
                    }

                    
                    self.getTotal();
                
                    self.total_hours = response.data.total_hours;
                    self.reg_ros_hours = response.data.reg_ros_hours;
                });


                

            },
            generateTimeSheet(){

                if(this.start_date==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select start date.';
                }else if(this.end_date==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select end date.';
                }else if(this.start_date > this.end_date){
                    this.showModalError = true;
                    this.error_msg = 'End date should be greater than or equal to start date.';
                }else if(this.client_value==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select a Client.';
                }else if(this.staff_value==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select a Staff.';
                }else{
                    this.search = 1;
                    this.getTimesheet();
                    this.error_msg = '';
                    this.showModalError = false;
                }
            },
            adjust(){

                if(this.restrict_user_compliance()){
                    if(this.records.success){
                    this.was_fetch = false;
                    let data = {};

                    //extract timesheet ids

                    const timesheet_ids = [];

                    var p = this.form.adjusted_id;
                    var total = 0; 
                    for (var key in p) {
                        if (p.hasOwnProperty(key)) {
                            total += parseFloat(p[key]);
                            timesheet_ids.push([key,p[key]]);
                        }
                    }

                    const timesheet_ids_json = JSON.stringify(timesheet_ids);
                    
                    this.isLoading = true;
                    this.showModalSuccess = true;
                    
                    data['client_id']  = this.client_value;
                    data['subcon_id']  = this.staff_value;
                    data['date_from']  = this.start_date;
                    data['date_to']  = this.end_date;
                    data['adjusted_hours']  = this.adj_total;
                    data['adjust_data']  = timesheet_ids_json;


                    axios.post(api.DEV_API_URL+'/timesheet/save-timesheet',
                        data
                    ,{
                        headers: { Authorization: `Bearer ${this.TOKEN}` }
                        }).then((response)=>{
                            
                            if(response.data.success){
                                this.isLoading = false;
                                this.showModalSuccess = true
                            }
                        }).catch((err)=>{
                            if(err.response.status == 401){
                                localStorage.removeItem('userid');
                                localStorage.removeItem('token');
                                this.$router.push('/'); 
                            }
                        });    
                    }else{
                        this.showModalError = true;
                        this.error_msg = 'No records found.';
                    }
                }else{
                    this.showModalError = true;
                    this.error_msg = 'You have no Timesheet Adjustment permission.';
                }
            },
            getTotal(){

                var p = this.form.adjusted_id;
                var total = 0; 
                for (var key in p) {
                    if (p.hasOwnProperty(key)) {
                        console.log(p[key]);
                        if(p[key]!== null){
                            total += parseFloat(p[key]);
                        }
                        
                    }
                }
                

                this.adj_total = total;
            },
            currentPage(val) {
                this.pagination.current = val;
                this.getTimesheet();
            },showHistory(){

                axios.get(api.DEV_API_URL+'/timesheet/get-history',{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if(response.data.data){
                        this.history_records = response.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

                this.showModalHistory = true;

            },closeHistory(){
                this.showModalHistory = false;
            },closeModalError(){
                this.showModalError = false;
            },restrict_user_compliance(){
                var user_email = localStorage.getItem('user_email');

                const user = ["jimmar.repolido@remotestaff.com","mc.figueroa@remotestaff.com","rodz.painagan@remotestaff.com","yani.dominece@remotestaff.com","arthur.madrona@remotestaff.com", "joy.apuya@remotestaff.com","unica.ong@remotestaff.com","reina.resos@remotestaff.com","jade.tagolino@remotestaff.com","jade.tagolino@remotestaff.com","jam.latorre@remotestaff.com","diane.atienza@remotestaff.com","diane.atienza@remotestaff.com","darlene.palma@remotestaff.com","elaine.malonzo@remotestaff.com","raph.apolonio@remotestaff.com","ana.cruz@remotestaff.com","arlene.castillo@remotestaff.com","medz.polestico@remotestaff.com","lou.reyes@remotestaff.com","jacky.bacolod@remotestaff.com","zarah.olindan@remotestaff.com","charmaine.ibanez@remotestaff.com","eve.inting@remotestaff.com","abi.pabilena@remtoestaff.com","alex.mallari@remotestaff.com","cristina.reclamado@remotestaff.com","jerna.jariel@remotestaff.com","tine.custodio@remotestaff.com","lorein.asence@remotestaff.com","carlos.caday@remotestaff.com","mitzi.tabuena@remotestaff.com","rheena.bouffard@remotestaff.com"];

                if(user.includes(user_email)){
                    return true;
                }else{
                    return false;
                }
            }
        },
        mounted() {
            this.getClients();
            this.TOKEN = localStorage.getItem('token');
            this.working_total = 0;
            this.adj_total = 0;
            this.total_hours = 0;
        }
    }
</script>
<template>
    <!-- <StandardLayout>
        <template #header>
            <the-navbar></the-navbar>
        </template>
        <template #sidebar>
            <the-sidebar></the-sidebar>
        </template>
        <template #main> -->
            <div class="row">
                <div class = "col-md-12">
                    <div class="row">
                        <div class="col-md-2">
                             <div class="date-label">Start Date:</div>
                             <div class="input-group-date" id="datepicker1">
                                                                    <input type="date" 
                                                                           class="form-control field input-date" 
                                                                           id="date"
                                                                           v-model="start_date"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                              </div>
                            </div>
                        <div class="col-md-2">
                             <div class="date-label">End Date:</div>
                             <div class="input-group-date" id="datepicker2">
                                                                    <input type="date" 
                                                                           class="form-control field input-date" 
                                                                           id="date"
                                                                           v-model="end_date"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                              </div>
                        </div>
                        <div class="col-md-3">
                        <div class="date-label">Client:</div>
                        <v-app>
                             <v-select @option:selected="getStaff" label="client_poc" :options="clients" :reduce="client_poc => client_poc.id" v-model="client_value"></v-select>
                        </v-app>    
                    
                    </div>
                        <div class="col-md-3">
                            <span class="loader" v-if="small_loader"></span>
                            <div class="date-label">Staff:</div>
                            <v-app>
                                 <v-select  label="complete_name" :options="staffs" :reduce="complete_name => complete_name.id" v-model="staff_value"></v-select>
                            </v-app>  
                        </div>
                        <div class="col-md-2">
                            <div class="date-label">&nbsp;</div>
                            <MaterialButton  size="md" class="btn-icon mx-1 yes-btn" @click="generateTimeSheet">
                                <div class="buttons d-flex align-items-center"> Fetch Data </div>
                            </MaterialButton>
                        </div>
                    </div>
                </div>
               
            </div>

        
            <div class="row">
                <div class="table-responsive tableFixHead text-dark" >
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th class="col-md-1">Date</th>
                                <th class="col-md-3">Time In</th>
                                <th class="col-md-2">Time Out</th>
                                <th class="col-md-2">Actual Hours Work</th>
                                <th class="col-md-2">Adj. Hours</th>
                                <th class="col-md-2">Reg Work Hours</th>
                                <!--<th class="col-md-2">Diff Paid vs Adj Hrs</th>-->
                                <th class="col-md-2">Lunch Start</th>
                                <th class="col-md-2">Lunch Finish</th>
                                <th class="col-md-2">Lunch Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="records.success">
                                        <tr v-for="(datum, index) in records.data" :key="datum.id">
                                            <td>
                                                {{datum.date_worked}} 
                                            </td>
                                            <td v-html="datum.work_time_in">
                                            </td>
                                            <td v-html="datum.work_time_out">
                                            </td>
                                            <td>
                                                {{datum.actual_hours_worked}}
                                            </td>
                                            <td class="text-center">
                                                <input type="number" step=".01" class="adjusted_hours" v-model="form.adjusted_id[datum.date_worked]" @input="getTotal">
                                                
                                            </td>
                                            <td>
                                                {{datum.reg_ros_hours}}
                                            </td>
                                            <!--<td>
                                                
                                            </td>-->
                                            <td>
                                                {{datum.lunch_start}}
                                            </td>
                                            <td>
                                                {{datum.lunch_end}}
                                            </td>
                                            <td>
                                                {{datum.lunch_hours}}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                               &nbsp;
                                            </td>
                                            <td>
                                                &nbsp;
                                            </td>
                                            <td>
                                                &nbsp;
                                            </td>
                                            <td>
                                               {{work_actual_hours.toFixed(2)}}
                                            </td>
                                            <td class="text-center">
                                                {{adj_total.toFixed(2)}}
                                            </td>
                                            <td>
                                                {{working_total.toFixed(2)}}
                                            </td>
                                            <td>
                                                &nbsp;
                                            </td>
                                            <!--<td>
                                                &nbsp;
                                            </td>-->
                                            <td>
                                                &nbsp;
                                            </td>
                                            <td>
                                                &nbsp;
                                            </td>
                                        </tr>
                            </template>
                        </tbody>
                    </table>
                    <template v-if="!records.success">
                            <div class="text-center no-records">No records.</div>
                    </template>
                </div>
                
                <div class="row">
                    <div class="col-md-12 adjust-action">
                        <div class="row">
                            <div class="col-md-3">
                                &nbsp;
                            </div>
                            <div class="col-md-3">
                                <MaterialButton  size="md" class="btn-icon mx-1 yes-btn" @click="adjust">
                                    <div class="buttons d-flex align-items-center">Adjust</div>
                                </MaterialButton>
                            </div>
                            <div class="col-md-3">
                                <MaterialButton  size="md" class="btn-icon mx-1 yes-btn" @click="showHistory">
                                   <div class="buttons d-flex align-items-center">View History</div>
                                </MaterialButton>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
        <!-- </template>
    </StandardLayout> -->
    <Teleport to="body">
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
                        <h5> Successfully adjusted. </h5>
                        <span>&nbsp;</span>
                    </div>
                </template>

        </StandardModal>

        <StandardModal 
                        :show="showModalHistory"
                        @close="closeHistory"
                        :hasClose=true
                        :hasHeader='true'
                        :hasFooter='true'
                        title="TIMESHEET HISTORY"
                        size='dialog-xxxxl'
                        :isScrollable=true>
                        <template #body>
                            <div v-if="history_records.data">
                                <div v-for="(datum, index) in history_records.data" :key="datum.id">
                                    <div class="timesheet-header"><h6>Timesheet #{{datum.id}}. Reference Date: {{datum.tran_date}}</h6></div>
                                    <div class="timesheet-list">
                                        <ul class="time-list" v-for="(sdatum, sindex) in datum.dtl" :key="sdatum.id">
                                            <li>
                                                <div class="time-name">{{sdatum.sindex}}{{datum.reg_firstname}} {{datum.reg_lastname}}</div>
                                                <div class="time-desc">Adj_hrs from {{sdatum.work_total_hours}} to {{sdatum.adjusted_hours}}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <h5 class="text-center">No records found.</h5>
                            </div>
                        </template>
                        <template #footer>
                            &nbsp;
                        </template>
        </StandardModal>
        <StandardModal 
                        :show="showModalError"
                        @close="closeModalError"
                        :hasClose=true
                        :hasHeader='false'
                        :hasFooter='false'
                        title="Error"
                        size='dialog-sm'>
                        <template #body>
                            <h5 class="error-msg alert-message text-center">{{error_msg}}</h5>
                        </template>
                        <template #footer>
                            &nbsp;
                        </template>
        </StandardModal>
    </Teleport>
    
</template>

<style scoped>
    table td{
        color: black !important;
    }
    .table > thead {
        color: #fff;
        background-color: #002315;
    }
    .table thead th {   
        padding: 0.75rem 0.5rem;
        text-transform: none !important;
        text-align: center !important;
    }
    tbody {
        border-bottom: 1px solid lightgray !important;
    }
    th, td {
        border-left: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
    }
    h3 {
        font-family: arial;
        color: black;
        margin-bottom: 20px !important;
    }
    .input-text {
        font-size: 14px !important;
        color: black;
    }
    .buttons {
        text-transform: capitalize;
        font-size: 14px;
    }
    button {
        background: #5E44FF;
        height: 42px;
    }
    button:hover, button:focus-visible, button:focus, button:active {
        background: #2C16B2;
        box-shadow: none;
    }
    .search-bar {
        padding-right: 0;
    }
    .container-fluid {
        padding-right: 4rem !important;
        padding-left: 4rem !important;
    }
    .revenue-list {
        width: 30em;
        display: flex;
        padding: 20px;
    }
    .datepicker-label {
        font-size: 14px;
        padding-bottom: 5px;
    }
    .date-label {
        padding-top: 7px;
        padding-right: 0;
        font-size: 12px;
    }
    .text-right {
        text-align: right;
    }
    .text-center {
        text-align: center;
    }
    .text-left {
        text-align: left;
    }
    .pagination-container {
        height: 32px;
    }
    .select-client-container {
        padding: 0;
    }
    .yes-btn {
        padding: 0 10px;
        width: 100%;
    }
    .align-items-center {
        justify-content: center;
    }
    .select-client-dropdown-container {
        padding-left: 20px;
        padding-right: 0;
    }

    .no-records{width:100%; margin: 48px auto;  font-weight: bold; font-size: 18px;}

    .adjust-action{margin-top: 70px;}
    .vs--searchable{margin-bottom: 25px;}
    .adjusted_hours{width:70px;}

    .time-list {
        margin-top: 29px;
        list-style: decimal;
     }

     .time-list{
        margin-bottom: 20px;
     }

     .timesheet-header{margin-top: 14px;}

     .input-date{border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); border-radius: var(--vs-border-radius); padding: 4px 10px!important;}
     .error-msg{color:black;}
     @media (min-width: 992px)
     {
        .col-lg-3{display:none;}
        .col-lg-9{width:100%!important;}
    }
    .search-bar .form-control {
        height: 40px;
        font-size: 14px !important;
    }
    .dp__main.input-text.input-text .dp__input {
        font-size: 14px !important;
        color: black !important;
    }

    .modal-body{height: 133px;}

    .loader {
    width: 20px;
    height: 20px;
    border: 3px solid #63FF42;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    top: 72px;
    margin-left: 157px;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
</style>
<style src="vue-select/dist/vue-select.css"></style>