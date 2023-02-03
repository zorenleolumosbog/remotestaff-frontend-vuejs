<template>
    <div class="col-md-2 p-0 px-1 w-xl-10">
        <div class="date-label">Data Source:</div>
        <select class="form-control field input-date border form-select" v-model="searchParams.dataSource">
            <option value="archived">Archived</option>
            <option value="current">Current</option>
            <!-- <option value="none" selected>None</option> -->
        </select>
    </div>
    <div class="col-md-2 p-0 px-1 w-xl-15">
        <div class="date-label">Start Date:</div>
        <div class="input-group-date">
            <input type="date"
            onclick="this.showPicker()"
            onkeydown="return false" 
            :disabled="!details.minDate && !details.maxDate"
            :min="details.minDate"
            :max="details.maxDate"
            class="form-control field input-date" 
            id="startDate"
            v-model="searchParams.startDate"
            :format="format" 
            :enableTimePicker="false" 
            style="font-size: 12pt; margin-top: 2px !important;"
            />
        </div>
    </div>
    <div class="col-md-2 p-0 px-1 w-xl-15">
        <div class="date-label">End Date:</div>
        <div class="input-group-date">
            <input type="date"
            onclick="this.showPicker()"
            onkeydown="return false" 
            :disabled="!details.minDate && !details.maxDate"
            :min="details.minDate"
            :max="details.maxDate"
            class="form-control field input-date" 
            id="endDate"
            v-model="searchParams.endDate"
            :format="format" 
            :enableTimePicker="false" 
            style="font-size: 12pt; margin-top: 2px !important;"
            />
        </div>
    </div>
    <div class="col-md-2 px-1 w-xl-20">
        <span class="loader" v-if="small_loader"></span>
        <div class="date-label">Client:</div>
        <v-app>
             <v-select @option:selected="getSubcontractor" label="client_poc" :options="clients" :reduce="client_poc => client_poc.id" v-model="clientid"></v-select>
         </v-app>    
    </div>
    <div class="col-md-2 px-1 w-xl-20">
        <span class="loader" v-if="small_loader"></span>
        <div class="date-label">Remote Contractor:</div>
        <v-select @click="getSubcontractor()" style="font-size: 12pt; margin-top: 2px !important;" label="complete_name" :options="details.subcons" :reduce="complete_name => complete_name.id" v-model="searchParams.staff_value">
        </v-select>
    </div>
</template>
<script>
    import api from "@/static/config.json";
    import axios from "axios";
    import vSelect from "vue-select";

    export default {
        components: {
            vSelect
        },
        data() {
            return {
                details: {
                    minDate: null,
                    maxDate: null,
                    subcons: []
                },
                clients: '',
                clientid: ''
            };
        },
        inject: ['format', 'searchParams', 'client_value'],
        mounted(){
            this.getClients();
            this.$watch('searchParams.dataSource', (newVal) => {
                    this.searchParams.startDate = '';
                    this.searchParams.endDate = '';
                    this.searchParams.staff_value = '';

                    if(newVal === 'archived') {
                        this.details.minDate = '2022-11-01';
                        this.details.maxDate = '2023-01-15';
                        this.searchParams.dataSource = newVal;
                    }
                    if(newVal === 'current') {
                        this.details.minDate = '2023-01-16';
                        this.details.maxDate = '';
                        this.searchParams.dataSource = newVal;
                    }
                    if(newVal === 'none') {
                        this.details.minDate = null;
                        this.details.maxDate = null;
                        this.searchParams.dataSource = newVal;
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
        methods:{
            getSubcontractor() {
                if(this.details.subcons.length > 0) {
                    return;
                }

                let _this = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/client/get-subcontractors?client='+ _this.clientid +'&source='+_this.searchParams.dataSource,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                   let sort_names = response.data.data;
                   
                   sort_names.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
                    _this.details.subcons = sort_names;
                });
            },getClients() {
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
        }
    }
</script>
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
    .input-date:focus{
        border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); 
        border-radius: var(--vs-border-radius); 
        padding: 4px 10px!important;
    }
    .vs__dropdown-toggle{margin-bottom:25px;}
</style>