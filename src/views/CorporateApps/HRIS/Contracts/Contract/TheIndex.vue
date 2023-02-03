
<script>
import api  from "@/static/config.json";
import Avatar from "@/assets/img/blank.png";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue"
import { useRoute } from 'vue-router'
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import axios from "axios";

export default {
    components : {
        MaterialInput,
        MaterialButton,
        DatePicker,
        axios
    },
    data() {
        return {
            API_URL: '',
            avatar: Avatar,
            contractDetails : {
                staff_salary : {
                    effective_date_from : '',
                    effective_date_to : ''
                },
                clientSched : {
                    from : '',
                    to : ''
                },
                workStatus : 'full-time',
                workSched : {
                    monday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    tuesday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    wednesday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    thursday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    friday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    saturday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    },
                    sunday : {
                        selected : false,
                        workTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        },
                        lunchTime : {
                            from : '',
                            to : '',
                            hr : '',
                            isDisabledTo : true
                        }
                    }
                },
                total : {
                    days: 0.00,
                    workingHours: 0.00,
                    lunchHours: 0.00
                }
            },
            isDisabledAll : false,
            difftime : '',
            currencyOption : []
        }
    },
    methods : {

        convertTodate ( time ) {
            const defaultDate = new Date('January 1, 2023,'+time);
            let newDate = new Date();
            newDate.setTime(defaultDate.getTime());
            
            return newDate
        },

        setContractDetails ( data ) {
            let contractDetails = this.contractDetails;

            for ( const x in data ) {
                console.log(x);
                if ( x == 'subcon_sched' || x =='client_sched' ) continue;
                contractDetails[x] = data[x];
            }

            const subconSched = data.subcon_sched;
            if ( subconSched ) {
                let dayArray = ['mon','tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                let dayArray2 = ['monday','tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

                for ( const x in dayArray ){
                    contractDetails['workSched'][dayArray2[x]] = {
                        selected : subconSched[dayArray[x]+'_start'] ? true : false,
                        workTime : {
                            from : this.convertTodate(subconSched[dayArray[x]+'_start']),
                            to : this.convertTodate(subconSched[dayArray[x]+'_finish']),
                            hr : subconSched[dayArray[x]+'_number_hrs'],
                            isDisabledTo : subconSched[dayArray[x]+'_start'] ? false : true
                        },
                        lunchTime : {
                            from : this.convertTodate(subconSched[dayArray[x]+'_start_lunch']),
                            to : this.convertTodate(subconSched[dayArray[x]+'_finish_lunch']),
                            hr : subconSched[dayArray[x]+'_lunch_number_hrs'],
                            isDisabledTo :  subconSched[dayArray[x]+'_start'] ? false : true
                        }
                    }
                    
                }

                contractDetails['total']['days'] = subconSched['working_days'];
                contractDetails['total']['workingHours'] = subconSched['working_hours'];

                this.getTotal('lunchTime');
            }

            if ( data.client_sched ) {
                const clientSched = data.client_sched;
                contractDetails['clientSched']['from'] = this.convertTodate(clientSched['client_start_work_hour']);
                contractDetails['clientSched']['to'] = this.convertTodate(clientSched['client_finish_work_hour']);
            }

        },

        getContract () {
            const urlParams = new URLSearchParams(window.location.search);
            const contractId = parseInt(urlParams.get('id'));
            
            axios.get(this.API_URL+'/admin/subcontractor/'+contractId,{
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{
                if ( response.data.success ) {
                    const data = response.data.data;
                    this.setContractDetails(data)
                }
            }).catch((err)=>{
                console.log(err)
                if(err.response.status == 401){
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');
                    this.$router.push('/'); 
                }
            });
        },

        getCurrency () {
            axios({
                method: 'get',
                url: this.API_URL+`/admin/currency?page=1&limit=50&search=`,
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{
                if ( response.data.success ) {
                    this.currencyOption = response.data.data.data
                }

            }).catch((err)=>{
                console.log(err)
                if(err.response.status == 401){
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');
                    this.$router.push('/'); 
                }
            });
        },

        timeDiff ( day, type ) {

            this.contractDetails['workSched'][day]['selected'] = true;
            this.contractDetails['workSched'][day][type]['isDisabledTo'] = false;

            this.contractDetails['workSched'][day][type]['hr'] = this.computeTimeDiff( day, type );

            this.lessLunchTime(day);

            // compute total hours
            this.getWorkDay(day);
            this.getTotal(type);
        },

        computeTimeDiff ( day, type ) {

            const start = this.contractDetails['workSched'][day][type]['from'];
            let end = this.contractDetails['workSched'][day][type]['to'];
            
            const workHour = this.contractDetails.workStatus == "part-time" 
                            ? 5 : 9 // reg job type hour plus 1 hour

            if ( end == '' ) {
                const hr = type == 'workTime' ? workHour : 1;
                const newDate = new Date(start);
                end = newDate.setHours(newDate.getHours() + hr);
                this.contractDetails['workSched'][day][type]['to'] = new Date(end);
            }

            // compute work hour
            const ms = end - start;

            let seconds = Math.floor(ms / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);

            seconds = seconds % 60;
            minutes = (minutes % 60) / 60;
            hours = hours % 24;

            if ( hours < 0  ) {
                hours = hours + 24;
            }

            return (hours + minutes).toFixed(2)
        },

        lessLunchTime ( day ) {

            const workingHours = parseFloat(this.computeTimeDiff( day, 'workTime' ));
            const lunchHours = this.contractDetails['workSched'][day]['lunchTime']['hr'];
            
            if ( lunchHours ) {
                this.contractDetails['workSched'][day]['workTime']['hr'] = (workingHours - lunchHours).toFixed(2);
                this.getTotal ( 'workTime' )
            }
        },

        getWorkDay ( day ) {

            const selected = this.contractDetails['workSched'][day]['selected'];

            if ( selected === false ) {
                
                const totalWorkingHours = this.contractDetails['total']['workingHours'];
                const totallunchHours = this.contractDetails['total']['lunchHours'];
                const workingHours = this.contractDetails['workSched'][day]['workTime']['hr'];
                const lunchHours = this.contractDetails['workSched'][day]['lunchTime']['hr'];

                if (workingHours) {
                    this.contractDetails['total']['workingHours'] = (parseFloat(totalWorkingHours) - parseFloat(workingHours)).toFixed(2);
                }

                if (lunchHours) {
                    this.contractDetails['total']['lunchHours'] = (parseFloat(totallunchHours) - parseFloat(lunchHours)).toFixed(2);
                }

                const totalDay = this.contractDetails['total']['days'] ;
                this.contractDetails['total']['days'] = totalDay - 1;

                this.contractDetails['workSched'][day]['workTime'] = {
                            from : '', to : '',hr : '', isDisabledTo : true, isDeducted : false};
                this.contractDetails['workSched'][day]['lunchTime'] = {
                            from : '', to : '',hr : '', isDisabledTo : true};
            } else {

                const contractDetails = this.contractDetails['workSched']
                let totalDay = 0;
                for ( const x in contractDetails ) {
                    console.log(day, contractDetails[x]['selected'])
                    if ( contractDetails[x]['selected'] ) {
                        totalDay += 1;
                    }
                }
                this.contractDetails['total']['days'] = totalDay;

            }

        },

        getTotal ( type ) {
            
            let workHours = 0.00;
            let lunchHours = 0.00;
            const workSched = this.contractDetails['workSched'];
            
            for ( const x in workSched ) {
                if ( type == 'workTime' && workSched[x][type]['hr'] != '' ) {
                    workHours = (workHours + parseFloat(workSched[x][type]['hr']));
                } 
                
                if ( type == 'lunchTime' && workSched[x][type]['hr'] != '' ) {
                    lunchHours += parseFloat(workSched[x][type]['hr']);
                }
            }

            if ( type == 'workTime' ) {
                this.contractDetails['total']['workingHours'] = workHours.toFixed(2);
            } else {
                this.contractDetails['total']['lunchHours'] = lunchHours.toFixed(2);
            }

        },

    },

    watch : {

    }, 

    mounted() {
        this.API_URL = api.DEV_API_URL;
        this.TOKEN = localStorage.getItem('token');
        this.USERID = localStorage.getItem('userid');
        this.getContract();
        this.getCurrency();
    }

}
</script>

<template>

<div class="container-fluid div-border p-3">
    <div class="row ">
        <div class="col-md-12 mb-3">
            <fieldset disabled> 
            <div class="row d-flex">
                <div class="col-md-12">
                    <div class="d-flex text-black">
                        <div class="flex-shrink-0 ">
                            <img 
                                :src="avatar"
                                alt="Profile Picture"
                                loading="lazy"
                                id="profilePic"
                                class="img-fluid img-border mt-2"
                            />
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-0"> {{ contractDetails.reg_firstname }} {{ contractDetails.reg_lastname }} </h5>
                            <span>ID: {{ contractDetails.id }} </span>
                            <div class="row">
                                <div class="col-md-5 ps-md-2">
                                    <label for="personal-email" class="label my-0">Personal Email</label>
                                    <input type="text" id="personal-email" class="input-group-outline form-control  p-2" 
                                    v-model="contractDetails.personal_email">
                                    <label for="staff_email" class="label my-0">Staff Email</label>
                                    <input type="text" id="staff_email" class="input-group-outline form-control  p-2"
                                    v-model="contractDetails.staff_email" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="col-md-5">
                    <div class="row">
                        <div class="col-md-12 ps-md-2">
                            <label for="created_by_client" class="label my-0">Created by Client</label>
                            <input type="text" id="created_by_client" class="input-group-outline form-control  p-2">
                        </div>
                        <div class="col-md-12 ps-md-2">
                            <label for="contract_status" class="label my-0">Contract Status</label>
                            <input type="number" id="contract_status" class="input-group-outline form-control  p-2">
                        </div>
                        <div class="col-md-12 ps-md-2">
                            <label for="job_designation" class="label my-0">Job Designation</label>
                            <input type="number" id="job_designation" class="input-group-outline form-control  p-2">
                        </div>
                    </div>
                </div> -->
            </div>
            </fieldset>
        </div>
        <div class="col-sm-12">
            <fieldset :disabled="isDisabledAll">
            <div class="row">
                <div class="col-md-12 ps-md-2 pt-2">
                <fieldset class="border rounded-3 p-3">
                    <legend class="float-none w-auto px-3">Saff Salary</legend>
                    <div class="row">
                        <div class="col-md-auto pe-0">
                            <label for="staff_salary_curr" class="label my-0">Currency</label>
                            <select class="form-select form-select-md" id="staff_salary_curr" style="width:110px">
                                <option value=""></option>
                                <option v-for="item in currencyOption" :value="item.id">
                                    {{item.code}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-auto">
                            <label for="staff_salary_monthly" class="label my-0">Monthly</label>
                            <input type="number" id="staff_salary_monthly" class="input-group-outline form-control p-2">
                        </div>
                        <div class="col-md-auto">
                            <label for="staff_salary_weekly" class="label my-0">Weekly</label>
                            <input type="text" id="staff_salary_weekly" class="input-group-outline form-control p-2" disabled>
                        </div>
                        <div class="col-md-auto">
                            <label for="staff_salary_daily" class="label my-0">Daily</label>
                            <input type="text" id="staff_salary_daily" class="input-group-outline form-control p-2" disabled>
                        </div>
                        <div class="col-md-auto">
                            <label for="staff_salary_hourly" class="label my-0">Hourly</label>
                            <input type="text" id="staff_salary_hourly" class="input-group-outline form-control p-2" disabled>
                        </div>
                    </div>
                    <div class="row pt-3">
                        <div class="col-md-auto">
                            <label for="effective_date_from" class="label my-0">Effective Date From</label><br/>
                            <date-picker
                                v-model:value="contractDetails.staff_salary.effective_date_from"
                                class="contract-date-picker"
                                popup-class="contract-date-picker-popup"
                                value-type="date"
                                format="YYYY-MM-DD"
                                type="date"
                                placeholder="Select date"
                            ></date-picker>
                        </div>
                        <div class="col-md-auto">
                            <label for="effective_date_to" class="label my-0">Effective Date To</label><br/>
                            <date-picker
                                v-model:value="contractDetails.staff_salary.effective_date_to"
                                class="contract-date-picker"
                                popup-class="contract-date-picker-popup"
                                value-type="date"
                                format="YYYY-MM-DD"
                                type="date"
                                placeholder="Select date"
                            ></date-picker>
                        </div>
                    </div>
                </fieldset>
                </div>
                <!-- <div class="col-md-6 ps-md-2">
                    <label for="payment" class="label my-0">Payment</label>
                    <input type="number" id="payment" class="input-group-outline form-control  p-2">
                </div> -->
            </div>
            <div class="row">
                <div class="col-md-12 ps-md-2 pt-2">
                <fieldset class="border rounded-3 p-3">
                    <legend class="float-none w-auto px-3">Client Price</legend>
                    <div class="row">
                        <div class="col-md-auto pe-0">
                            <label for="client_price_curr" class="label my-0">Currency</label>
                            <select class="form-select form-select-md" id="client_price_curr" style="width:110px">
                                <option value=""></option>
                                <option v-for="item in currencyOption" :value="item.id">
                                    {{item.code}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-auto">
                            <label for="client_price_monthly" class="label my-0">Monthly</label>
                            <input type="number" id="client_price_monthly" class="input-group-outline form-control p-2">
                        </div>
                        <div class="col-md-auto">
                            <label for="client_price_weekly" class="label my-0">Weekly</label>
                            <input type="text" id="client_price_weekly" class="input-group-outline form-control p-2" disabled>
                        </div>
                        <div class="col-md-auto">
                            <label for="client_price_daily" class="label my-0">Daily</label>
                            <input type="text" id="client_price_daily" class="input-group-outline form-control p-2" disabled>
                        </div>
                        <div class="col-md-auto">
                            <label for="client_price_hourly" class="label my-0">Hourly</label>
                            <input type="text" id="client_price_hourly" class="input-group-outline form-control p-2" disabled>
                        </div>
                    </div>
                    <div class="row pt-3">
                        <div class="col-md-auto pe-0">
                            <label for="ref_rate" class="label my-0">Currency</label>
                            <select class="form-select form-select-md" id="ref_rate" style="width:110px">
                                <option value=""></option>
                                <option v-for="item in currencyOption" :value="item.id">
                                    {{item.code}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-auto">
                            <label for="ref_rate" class="label my-0">Reference Rate</label>
                            <input type="number" id="ref_rate" class="input-group-outline form-control  p-2">
                        </div>
                    </div>
                </fieldset>
                </div>
                <!-- <div class="col-md-6 ps-md-2">
                    <label for="staff" class="label my-0">Contract Status</label>
                    <input type="number" id="staff" class="input-group-outline form-control  p-2">
                </div> -->
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="extra_hours" class="label my-0">Extra Hours</label>
                    <select class="form-select form-select-md" id="extra_hours">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="bp_comm" class="label my-0">DB Comm</label>
                    <select class="form-select form-select-md" id="bp_comm">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="approve_overtime" class="label my-0">Approve Overtime</label>
                    <select class="form-select form-select-md" id="approve_overtime">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="aff_comm" class="label my-0">Aff Comm</label>
                    <select class="form-select form-select-md" id="aff_comm">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="overtime_week" class="label my-0">Overtime Weekly Limit</label>
                    <select class="form-select form-select-md" id="overtime_week">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="flexi" class="label my-0">Flexi</label>
                    <select class="form-select form-select-md" id="flexi">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="work_status" class="label my-0">Work Status</label>
                    <select class="form-select form-select-md" id="work_status">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="work_start_date" class="label my-0">Work Start Date</label>
                    <input type="text" id="work_start_date" class="input-group-outline form-control  p-2">
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="client_timezone" class="label my-0">Client Timezone</label>
                    <select class="form-select form-select-md" id="client_timezone">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 ps-md-2">
                    <label for="prepaid_start_date" class="label my-0">Prepaid Start Date</label>
                    <input type="text" id="prepaid_start_date" class="input-group-outline form-control  p-2">
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="staff_timezone" class="label my-0">Staff Timezone</label>
                    <select class="form-select form-select-md" id="staff_timezone">
                        <option value=""></option>
                        <option value="asd">Php</option>
                        <option value="asd">Aud</option>
                    </select>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12 ps-md-2 pt-2">
                    <div class="row">
                        <label class="label my-0">Client Working Hours</label>
                        <div class="col-auto pe-0">
                            <date-picker :disabled="isDisabledAll"
                                class="contract-time-picker"
                                v-model:value="contractDetails.clientSched.from"
                                :time-picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45',
                                    format: 'hh:mm a'
                                }"
                                value-type="date"
                                popup-class="contract-time-picker-popup"
                                format="hh:mm a"
                                type="time"
                                placeholder="hh:mm a"
                            />
                        </div>
                        <div class="col-auto pe-0" style="text-align: center;"><h4 class="mb-0">-</h4></div>
                        <div class="col-auto pe-0">
                            <date-picker :disabled="isDisabledAll"
                                class="contract-time-picker"
                                v-model:value="contractDetails.clientSched.to"
                                :time-picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:30',
                                    format: 'hh:mm a'
                                }"
                                value-type="date"
                                popup-class="contract-time-picker-popup"
                                format="hh:mm a"
                                type="time"
                                placeholder="hh:mm a"
                            />
                        </div>
                        <div class="col-auto pe-0" style="text-align: left;"><label class="label my-0">Preferred Working Hours</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12">
                <fieldset class="border rounded-3 p-3">
                    <legend class="float-none w-auto px-3">Work Schedule</legend>
                    <div class="table-responsive">
                    <table id="table" class="table">
                        <thead>
                        <tr class=" text-dark">
                            <th> Day</th>
                            <th> Working Time </th>
                            <th> Lunch Time </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="pe-3">
                                <div class="row">
                                    <div class="col-auto mt-1">
                                    <input class="form-check-input mt-1" type="checkbox" id="monday" v-model="contractDetails.workSched.monday.selected"
                                    @change="getWorkDay('monday')"/>
                                    <label class="label mt-0" for="monday">Monday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.monday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('monday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.monday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.monday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('monday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" 
                                        v-model="contractDetails.workSched.monday.workTime.hr" disabled>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.monday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('monday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.monday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.monday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('monday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.monday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3">
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="tuesday" v-model="contractDetails.workSched.tuesday.selected"
                                    @change="getWorkDay('tuesday')"/>
                                    <label class="label mt-0" for="tuesday">Tuesday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.tuesday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('tuesday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.tuesday.workTime.isDisabledTo" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.tuesday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('tuesday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.tuesday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.tuesday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('tuesday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.tuesday.lunchTime.isDisabledTo" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.tuesday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('tuesday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.tuesday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3 day-container">
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="wednesday" v-model="contractDetails.workSched.wednesday.selected"
                                    @change="getWorkDay('wednesday')"/>
                                    <label class="label mt-0" for="wednesday">Wednesday</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.wednesday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('wednesday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.wednesday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.wednesday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('wednesday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.wednesday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.wednesday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('wednesday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.wednesday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.wednesday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('wednesday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.wednesday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3"  day-container>
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="thursday" v-model="contractDetails.workSched.thursday.selected"
                                    @change="getWorkDay('thursday')"/>
                                    <label class="label mt-0" for="thursday">Thursday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.thursday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('thursday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.thursday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.thursday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('thursday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.thursday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.thursday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('thursday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.thursday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.thursday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('thursday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.thursday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3"  day-container>
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="friday" v-model="contractDetails.workSched.friday.selected"
                                    @change="getWorkDay('friday')"/>
                                    <label class="label mt-0" for="friday">Friday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.friday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('friday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.friday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.friday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('friday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.friday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.friday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('friday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.friday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.friday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('friday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.friday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3"  day-container>
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="saturday" v-model="contractDetails.workSched.saturday.selected"
                                    @change="getWorkDay('saturday')"/>
                                    <label class="label mt-0" for="saturday">Saturday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.saturday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('saturday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.saturday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.saturday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('saturday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.saturday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.saturday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('saturday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.saturday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.saturday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('saturday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.saturday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pe-3"  day-container>
                                <div class="row">
                                    <div class="col-auto">
                                    <input class="form-check-input mt-1" type="checkbox" id="sunday" v-model="contractDetails.workSched.sunday.selected"
                                    @change="getWorkDay('sunday')"/>
                                    <label class="label mt-0" for="sunday">Sunday &nbsp;</label>
                                    </div>
                                </div>
                            </td>
                            <td class="pe-lg-4">
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.sunday.workTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('sunday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.sunday.workTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.sunday.workTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('sunday', 'workTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.sunday.workTime.hr">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="row time-container">
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">From &nbsp;</label>
                                        <date-picker :disabled="isDisabledAll" 
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.sunday.lunchTime.from"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('sunday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">To &nbsp;</label>
                                        <date-picker :disabled="contractDetails.workSched.sunday.lunchTime.isDisabledTo"
                                            class="contract-time-picker"
                                            v-model:value="contractDetails.workSched.sunday.lunchTime.to"
                                            :time-picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '23:30',
                                                format: 'hh:mm a'
                                            }"
                                            value-type="date"
                                            popup-class="contract-time-picker-popup"
                                            format="hh:mm a"
                                            type="time"
                                            placeholder="hh:mm a"
                                            @change="timeDiff('sunday', 'lunchTime')"
                                        />
                                    </div>
                                    <div class="col-auto pe-0 mt-1">
                                        <label class="label my-0">Hr &nbsp;</label>
                                        <input type="text" class="input-group-outline form-control sched-hr" disabled
                                        v-model="contractDetails.workSched.sunday.lunchTime.hr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </fieldset>
                </div>
            </div>
                
            <div class="row mt-4">
                <div class="col-md-12 ps-md-2 pt-2">
                    <div class="row">
                    <div class="col-auto pe-0">
                        <label for="working_days" class="label my-0">Working Days</label>
                        <input type="text" id="working_days" class="input-group-outline form-control p-2" v-model="contractDetails.total.days" disabled>
                    </div>
                    <div class="col-auto pe-0">
                        <label for="total_working_hrs" class="label my-0">Total Working Hours</label>
                        <input type="text" id="total_working_hrs" class="input-group-outline form-control p-2" v-model="contractDetails.total.workingHours" disabled>
                    </div>
                    <div class="col-auto pe-0">
                        <label for="total_lunch_time_hrs" class="label my-0">Total Lunch Time Hours</label>
                        <input type="text" id="total_lunch_time_hrs" class="input-group-outline form-control p-2" v-model="contractDetails.total.lunchHours" disabled>
                    </div>
                    </div>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-auto ps-md-2 pt-2">
                <MaterialButton size="md" variant="contained" color="none" class="command-btn">
                    Save Changes
                </MaterialButton><span>&nbsp;</span>
                </div>
                <div class="col-auto ps-md-2 pt-2">
                <MaterialButton size="md" variant="contained" color="none" class="command-btn">
                    Monthly Payment
                </MaterialButton><span>&nbsp;</span>
                </div>
                <div class="col-auto ps-md-2 pt-2">
                <MaterialButton size="md" variant="contained" color="none" class="command-btn">
                    Cancel Contract
                </MaterialButton><span>&nbsp;</span>
                </div>
                <div class="col-auto ps-md-2 pt-2">
                <MaterialButton size="md" variant="contained" color="none" class="command-btn">
                    Update Client Price Salary
                </MaterialButton><span>&nbsp;</span>
                </div>
                <div class="col-auto ps-md-2 pt-2">
                <MaterialButton size="md" variant="contained" color="none" class="command-btn">
                    Update Platform/Staff Type
                </MaterialButton><span>&nbsp;</span>
                </div>
            </div>
            </fieldset>
        </div>
    </div>
</div>
</template>

<style scoped>
.contractor-info {
    width: 300px;
}
.contractor-avatar {
    width: 50px;
    height: 50px;
    border-radius: unset;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
}
.div-border{
    border: 1px solid #dde1e1;
    border-radius: 5px;
    min-height: 640px !important;
    /* height: auto; */
}

.action-bar {
    float: right;
    min-width: 300px;
    max-width: 300px;
}

#profile-pic-container {
    position: relative;
    overflow: hidden;
    /* border: 3px solid #5E44FF; */
}

#profilePic {
    object-fit: contain;
}
.img-border{
    border: 2px;
    width: 180px;
    border-radius: 10px;
}
.input-group-outline {
    border: 1px solid #dbdbdb !important;
    padding: 4.3px !important;
    color: black;
}
.input-group-outline:disabled {
    padding: 5.7px !important;
}
.form-select{
    padding: 4.3px 4.3px !important;
    background-color: #f0f2f5 !important;
    border-color: #dbdbdb !important;
    background-position: right 6px center !important;
    color: black !important;
}
.form-select:disabled{
    padding: 5.7px !important;
}
label {
    font-size: 12px;
}
legend {
    font-size: inherit;
    line-height: 30px;
    font-weight: 600;
    /* text-transform: uppercase; */
    color: #555;
}

.form-check-input {
    border: 1px solid #acacac;
    border-radius: 5px !important;
}
.form-check-input:checked[type=radio] {
    background-image: linear-gradient(195deg, #160e47 0%, #5b43fc 100%);
        border-radius: 5px !important;
}
.form-check-input:checked[type=checkbox] {
    background-image: linear-gradient(195deg, #160e47 0%, #5b43fc 100%);
        border-radius: 5px !important;
}

.form-check .form-check-input {
    float: unset;
    margin: 5px 10px;
}
.sched-hr {
    display: inline;
    width: 70px;
}
.sched-select {
    display: inline;
    width: 100px;
}
.contract-time-picker {
    position: relative;
    display: inline-block;
    width: 110px;
}
.contract-date-picker {
    position: relative;
    display: inline-block;
    width: 200px;
}
.time-container {
    width: 450px;
}
</style>
<style>
.contract-time-picker .mx-input:disabled, .mx-input.disabled {
    color: #555;
}
.contract-time-picker-popup .mx-time {
    width: 110px !important;
}
.contract-time-picker-popup .mx-time .active{
    color: #160e47;
}
</style>