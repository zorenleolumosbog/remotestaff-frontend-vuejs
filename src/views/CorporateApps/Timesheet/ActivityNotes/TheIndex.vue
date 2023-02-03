<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import Loader from "@/components/Loader.vue";
    import axios from "axios";
    import api from "@/static/config.json";
    import StandardModal from "@/components/Modals/StandardModal.vue";
</script>
<script>
    import StartEndDate from "../Inputs/StartEndDate.vue";
    
    export default {
        components: {
            StartEndDate
        },
        data(){
            return{
                format: {data:'yyyy-MM-dd'},
                searchParams:{
                    startDate:'',
                    endDate:'',
                    subcon:'',
                    staff_value:'',
                    dataSource:'current',
                },
                client_value: '',
                subcons:[],
                pagination: {
                    current: 1,
                    limit: 10,
                },
                showLoader:false,
                //client_value: 11,
                //staff_value:'',
                subcons:[],
                records: {
                    success: false,
                },
                showModalError: false,
                error_msg:'',
            }
            
        },
        provide() {
            return {
                format: this.format,
                searchParams: this.searchParams,
                client_value : localStorage.getItem('client_id'),
                subcons: this.subcons,

            }
        },
        methods:{
            getSubcontractor() {
                let _this = this

                _this.staff_value = '';

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/timesheet/staff-list?client='+localStorage.getItem('client_id'),
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    _this.subcons = response.data.data;
                    console.log(_this.subcons);
                });
            }, 
            currentPage(val) {
                this.pagination.current = val;
                this.getRecords();
            },
            fetchNewData(){
                this.records.success = false;
                this.pagination.current = 1;
                this.getRecords();
            },
            fetchActivityNotes(){
                if(this.searchParams.startDate==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select start date.';
                }else if(this.searchParams.endDate==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select end date.';
                }else if(this.searchParams.startDate > this.searchParams.endDate){
                    this.showModalError = true;
                    this.error_msg = 'End date should be greater than or equal to start date.';
                }else if(this.searchParams.staff_value==""){
                    this.showModalError = true;
                    this.error_msg = 'Please Select Staff.';
                }else{
                    this.fetchNewData();
                    this.error_msg = '';
                    this.showModalError = false;
                }
                
            },
            closeModalError(){
                this.showModalError = false;
            },
            getRecords() {
                let data = this.searchParams;
                data.clientValue = this.client_value;
                data.currentPage = this.pagination.current;
                data.limit = this.pagination.limit;
                
                
              
                this.showLoader = true;
                //console.log(this.records);
                if(data.dataSource == 'archived'){
                    let self = this;
                    console.log(data.staff_value);
                    axios({
                        method: 'get', 
                        url: api.DEV_API_URL+`/client/get-activity-notes?
                        page=${data.currentPage}&limit=${data.limit}
                        &subcon_id=${data.staff_value}&client_id=${data.clientValue}
                        &start_date=${data.startDate}&end_date=${data.endDate}
                        `,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        //console.log(response);
                        self.records.success = response.data.success;
                        self.records.data = response.data.data;
                        self.showLoader = false;
                        //console.log(this.records.success);
                    })
                    .catch(function (errors) {
                        self.showLoader = false;
                        self.records.success = false;
                        console.log(errors);
                    });
                }
                else if(data.dataSource == 'current'){
                    let self = this;
                    /*axios({
                        method: 'get', 
                        url: api.TIMETRACKER_API_URL+`/activitynotes/?
                        p=${data.currentPage}&page_size=${data.limit}
                        &subcon_id=${data.staff_value}&client_id=${data.clientValue}
                        &start=${data.startDate}&end=${data.endDate}
                        `,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        console.log(response);
                        self.records.success = response.data.success;
                        self.records.data = response.data.data;
                        self.showLoader = false;
                        //console.log(this.records.success);
                    })
                    .catch(function (errors) {
                        self.showLoader = false;
                        self.records.success = false;
                        console.log(errors);
                    });*/
                    //console.log(localStorage.getItem('timetracker_token'));
                    //data.clientValue = localStorage.getItem('client_ges_id');
                    //console.log(data.clientValue);
                    axios.get(api.TIMETRACKER_API_URL+'/activitynotes/',{
                    params:{
                        page_size:data.limit,
                        p:data.currentPage,
                        subcon_id:data.staff_value,
                        client_id:data.clientValue,
                        start:data.startDate,
                        end:data.endDate

                    },
                    headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` }
                    }).then(function (response) {
                        //console.log(response.data);
                        //self.records.success = true;
                        let data = []
                        //self.records.data = [];
                        self.records.success = true;
                        
                        self.showLoader = false;
                        //self.details.records.success = true;
                        self.records.data = response.data; 
                        //console.log(self.records.data);
                    })
                    .catch(function (errors) {
                        self.showLoader = false;
                        self.records.success = false;
                        console.log(errors);
                    });
                    /*axios({
                        method: 'get', 
                        url: api.TIMETRACKER_API_URL+`/activitynotes/?
                        p=${data.currentPage}&page_size=${data.limit}
                        &subcon_id=16479&client_id=1
                        &start=${data.startDate}&end=${data.endDate}
                        `,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        console.log(response.data);
                        //self.records.success = true;
                        let data = []
                        //self.records.data = [];
                        self.records.success = true;
                        
                        self.showLoader = false;
                        //self.details.records.success = true;
                        self.records.data = response.data; 
                        //console.log(self.records.data);
                    })
                    .catch(function (errors) {
                        self.showLoader = false;
                        self.records.success = false;
                        console.log(errors);
                    });*/
                    /*axios({
                        method: 'get', 
                        url: api.TIMETRACKER_API_URL+`/activitynotes/?
                        p=${data.currentPage}&page_size=${data.limit}
                        &subcon_id=16479&client_id=1
                        &start=${data.startDate}&end=${data.endDate}
                        `,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        console.log(response.data.results);
                        //self.records.success = true;
                        let data = []
                        //self.records.data = [];
                        self.records.success = true;
                        for(var i =0; i < response.data.results.length; i++){
                            let insertObject = {
                                formatted_date:response.data.results[i].date_worked,
                                activity_note_requested:'',
                                activity_note:response.data.results[i].description+'\n'+response.data.results[i].call_with,
                                activity_note_status:response.data.results[i].percentage+'%',
                                activity_note_responded:response.data.results[i].submit_time,
                            };
                            data.push(insertObject);
                        }
                        self.showLoader = false;
                        //self.details.records.success = true;
                        self.records.data = data; 
                        //console.log(self.records.data);
                    })
                    .catch(function (errors) {
                        self.showLoader = false;
                        self.records.success = false;
                        console.log(errors);
                    });*/
                }
                
            },
            filterTime(value) {
                //console.log('hey');
                //let self = this;
                let data = value;
                let string;
                let hr,mins,secs;
                if(data == ''){
                    return '';
                }
                else{
                    try{
                        string = data.split(',');
                        //console.log(string);
                    }catch(e){
                        return 'Invalid date format';
                    }
                    hr = parseInt(string[string.length-3]) < 10 ? '0'+string[string.length-3] : string[string.length-3];
                    mins = parseInt(string[string.length-2]) < 10 ? '0'+string[string.length-2] : string[string.length-2];
                    secs = parseInt(string[string.length-1]) < 10 ? '0'+string[string.length-1] : string[string.length-1];

                }
                return hr+':'+mins+':'+secs;
            },
            convertTime(date,time) {
                //console.log('hey');
                //let self = this;
                //let data = value;
                //let time;
                //let hr,mins,secs;
                var date; 
                
                if(time == ''){
                    return '';
                }
                else{
                    try{
                        date = new Date(date + ' ' + time + ' UTC');
                        //console.log(string);
                    }catch(e){
                        return 'Invalid date format';
                    }
                    

                }
                return date.toLocaleTimeString('en-AU');
            },
            convertTimeArchived(date) {
                //console.log('hey');
                //let self = this;
                //let data = value;
                //let time;
                //let hr,mins,secs;
                var date; 
                
                if(date == ''){
                    return '';
                }
                else{
                    try{
                        date = new Date(date);
                        //console.log(string);
                    }catch(e){
                        return 'Invalid date format';
                    }
                    

                }
                //return date.toLocaleTimeString('en-AU');
                return date.toLocaleTimeString('en-AU');
            },
        },
        mounted(){
            this.client_value = localStorage.getItem('client_id');
        }
    }
    
</script>
<template>
    <div class="container-fluid p-3">
        <div class="row">
            <start-end-date></start-end-date>
            <div class="col-md-2 p-0">
                <div class="date-label">&nbsp;</div>
                <MaterialButton :disabled="!searchParams.staff_value" size="sm" class="btn-icon mx-1 command-btn" @click="fetchActivityNotes">
                    <div class="buttons d-flex align-items-center"> Fetch </div>
                </MaterialButton>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 p-0 px-1">
                <div class="table-responsive tableFixHead text-light" >
                    <table class="table table-hover table-striped">
                        <thead class="bg-header text-light">
                            <th class="col-md-1">Date</th>
                            <th class="col-md-1">Time</th>
                            <th class="col-md-3">Activity Notes</th>
                            <th class="col-md-1">Status</th>
                            <th class="col-md-2">Time Responded</th>
                        </thead>
                        <tbody v-if="!showLoader">
                            <tr v-if="records.success && searchParams.dataSource == 'archived'" v-for="record in records.data.data">
                                <td>{{record.formatted_date}}</td>
                                <td class="text-end">{{convertTimeArchived(record.requested)}}</td>
                                <td>{{record.note}}</td>
                                <td>{{record.status}}</td>
                                <td class="text-end">{{convertTimeArchived(record.responded)}}</td>
                            </tr>
                            <!--<tr v-if="records.success && searchParams.dataSource == 'current'" v-for="record in records.data">
                                <td>{{record.formatted_date}}</td>
                                <td class="text-end">{{filterTime(record.activity_note_requested)}}</td>
                                <td>{{record.activity_note}}</td>
                                <td>{{record.activity_note_status}}</td>
                                <td class="text-end">{{record.activity_note_responded}}</td>
                            </tr>-->
                            <tr v-else-if="records.success && searchParams.dataSource == 'current'" v-for="record in records.data.results">
                                <td>{{record.date_worked}}</td>
                                <td class="text-end"></td>
                                <td>{{record.description }} <br>{{record.call_with}}</td>
                                <td>{{record.percentage}}%</td>
                                <td class="text-end">{{convertTime(record.date_worked,record.submit_time)}}</td>
                            </tr>
                            <tr v-else>
                                <td colspan="5">No info available.</td>
                            </tr>
                        </tbody>
                    </table>
                    <Loader v-if="showLoader"></Loader>
                </div>
                <div class="right-floater mt-n3">
                    <the-pagination v-if="records.success && !showLoader" :records="records" @currentPage="currentPage">
                    </the-pagination>
                </div>
                
            </div>
        </div>
    </div>
   
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
   
</template>
<style scoped>
.date-label {
    padding-top: 7px;
    padding-right: 0;
    font-size: 12px;
}
.input-date{
    border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); 
    border-radius: var(--vs-border-radius); 
    padding: 4px 10px!important;
}
tbody {
    border-bottom: 1px solid lightgray !important;
}
th, td {
    border-left: 1px solid lightgray !important;
    border-right: 1px solid lightgray !important;
}
</style>