<script>
import api  from "@/static/config.json";
import axios from "axios";
import Multiselect from "@vueform/multiselect";
import skills  from "@/static/skills.json";
import MaterialButton from "@/components/MaterialButton.vue";

export default {
    components: {
    axios,
    api,
    Multiselect,
    skills,
    MaterialButton
},
    data(){
        return {
            joDetails : {
                name : "",
                jobId : 0,
                joIndustry : [],
                joOffshore : "",
                joTitle : "",
                joDescription : "",
                joRoleObj : "",
                joType : "",
                joTerms : "",
                joOpenings : 0,
                joTimezone : "",
                joRate : "",
                joExpertise : "",
                joMidSkills : [],
                joAdvSkills : [],
                joOs : "",
                joTools : [''],
                joAuSubs : "",
                joMonitors : "",
                joCommTools : "",
                joCommOthers : "",
                joTeam : "",
                joCompanyAge : "",
                joNumberEmployees : "",
                joSourcing : "",
                joSize : ""
            },
            clientCorporation : {
                name : ''
            },
            options : 
            {
                employees : [
                    { id :"1", value : "1-2 staff" },
                    { id :"2", value : "3-10 staff" },
                    { id :"3", value : "11 -20 staff" },
                    { id :"4", value : "21-50 staff" },
                    { id :"5", value : "50 -100 staff" },
                    { id :"6", value : "100+staff" }
                ],
                size : [
                    { id :"1", value : "1-2 staff"},
                    { id :"2", value : "3-10 staff" },
                    { id :"3", value : "11 -20 staff" },
                    { id :"4", value : "21-50 staff" },
                    { id :"5", value : "50 -100 staff" },
                    { id :"6", value : "100+staff" }
                ],
                terms : [ "6 Months", "12 Months", "On-Going" ],
                timezones : [
                    "Australian Western Standard Time",
                    "Australian Central Standard Time ",
                    "Australian Eastern Standard Time",
                    "New Zealand Daylight Time",
                    "Hawaii Standard Time",
                    "Alaska Standard Time",
                    "US Pacific Standard Time",
                    "US Mountain Standard Time",
                    "US Central Standard Time",
                    "US Eastern Standard Time",
                    "UK London"
                ],
                rates : [
                    { id :0, value : "AUD $5-$10" },
                    { id :1, value : "AUD $11-$17" },
                    { id :2, value : "AUD $18-$25" },
                    { id :3, value : "Open Budget" },
                ],
                expertise : [
                    { id :0, value : "Entry Level (1-2 Years)" },
                    { id :1, value : "Mid Level (3-4 Years)" },
                    { id :2, value : "Senior Level (5 and Up Years)" },
                ],
                compOS : [
                    { id :"1", value : "Any"},
                    { id :"2", value : "Microsoft Windows"},
                    { id :"3", value : "macOS"},
                    { id :"4", value : "Linux"},
                ],
                auNumbers : [
                    { id :"1", value : "Yes, I have an existing provider"},
                    { id :"2", value : "Yes, I need help setting this up."},
                    { id :"3", value : "No, the role does not require an Australian number."},
                ],
                comms : [
                    { id :0, value : "Skype"},
                    { id :1, value : "Slack"},
                    { id :2, value : "Trello"},
                    { id :3, value : "Monday"},
                    { id :4, value : "Zoom"},
                    { id :5, value : "Others"}
                ],
                teams : [
                    { id :"1", value : "No, just with me."},
                    { id :"2", value : "Yes, with my Australian team."},
                    { id :"3", value : "Yes, with my offshore team."},
                ],

            },
            skills : [],
            industries : [],
            softwareTools : [{
                name : ''
            }]
        }
    },
    methods: {
        async getJobOrder () {
            
            await axios.get(this.API_URL+'/bh/getJobOrder/12673').then((response)=>{
                console.log(response);

            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },

        async getIndustries () {
            
            await axios.get(this.API_URL+'/bh/getIndustries').then((response)=>{
                if ( response.data.success ) {
                    const data = response.data.data.data;
                    this.industries = data;
                }
            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },

        updateJobOrder () {
            
            axios.post(this.API_URL+'/bh/updateJobOrder').then((response)=>{
                console.log(response);
            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },

        addTools (k) {
            this.joDetails.joTools.push('');
        },

        removeTools (k) {
            this.joDetails.joTools.splice(k, 1)
        }
    },
    mounted(){
        this.API_URL = api.DEV_API_URL;
        this.skills = skills.skills;
        // this.getJobOrder ();
        this.getIndustries();
    }
}

</script>
<template>
        
    <div class="container">
        <div class="card card-body shadow-xl mx-3 mx-md-4 mt-5">
            <div class="card-body p-0 my-3">
                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="name" class="labels my-0">Name</label>
                        <input type="text" id="name" class="input-group-outline form-control  p-2" v-model="joDetails.name">
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="comp_name" class="labels my-0">Company Name or Website</label>
                        <input type="text" id="comp_name" class="input-group-outline form-control  p-2" v-model="clientCorporation.name">
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="comp_age" class="labels my-0">Company Age in Years</label>
                        <input type="text" id="comp_age" class="input-group-outline form-control  p-2" v-model="joDetails.joCompanyAge">
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="no_employee" class="labels my-0">Number of Employee</label>
                        <select class="form-select form-select-md" id="no_employee" v-model="joDetails.joNumberEmployees">
                            <option value=""></option>
                            <option v-for="(v, k) in options.employees" :value="v.value">{{v.value}}</option>
                        </select>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <label for="industry" class="labels my-0">Industry</label>
                        
                        <Multiselect
                        v-model="joDetails.joIndustry"
                        mode="tags"
                        label="name"
                        valueProp="id"
                        :close-on-select="false"
                        :searchable="true"
                        :options="industries"
                        />
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <div class="pb-2">
                            <label for="offshore" class="labels my-0">Have you worked with an offshore staff before?</label>
                        </div>&nbsp;
                        <input type="radio" id="offshore_yes" value="Yes" v-model="joDetails.joOffshore"/>
                        <label for="offshore_yes">Yes</label>
                        &nbsp;
                        <input type="radio" id="offshore_no" value="No" v-model="joDetails.joOffshore"/>
                        <label for="offshore_no">No</label>
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <div class="pb-2">
                            <label for="sourcing" class="labels my-0">Are you sourcing for this role for the first time?</label>
                        </div>&nbsp;
                        <input type="radio" id="sourcing_yes" value="Yes" v-model="joDetails.joSourcing"/>
                        <label for="sourcing_yes">Yes</label>
                        &nbsp;
                        <input type="radio" id="sourcing_no" value="No" v-model="joDetails.joSourcing"/>
                        <label for="sourcing_no">No</label>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="size_of_team" class="labels my-0">Size of the team</label>
                        <select class="form-select form-select-md" id="size_of_team" v-model="joDetails.joSize">
                            <option value=""></option>
                            <option v-for=" v in options.size" :value="v.value">{{v.value}}</option>
                        </select>
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="job_title" class="labels my-0">Job Title</label>
                        <input type="text" id="job_title" class="input-group-outline form-control  p-2" v-model="joDetails.joTitle">
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="job_desc" class="labels my-0">Job Description</label>
                        <textarea name="job_desc" v-model="joDetails.joDescription"
                        class="form-control p-3" id="job_desc" placeholder="" rows="4"
                        style="background-color: #ededed; border-radius: 5px  !important;"
                        ></textarea>
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="role_objective" class="labels my-0">Role Objective</label>
                        <textarea name="role_objective" v-model="joDetails.joRoleObj"
                        class="form-control  p-3" id="role_objective" placeholder="" rows="4"
                        style="background-color: #ededed; border-radius: 5px  !important;"
                        ></textarea>
                    </div>
                </div>
                
                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <div class="pb-2">
                            <label for="job_type" class="labels my-0">Job Type</label>
                        </div>&nbsp;
                        <input type="radio" id="full-time" value="Full-Time" v-model="joDetails.joType" />
                        <label for="full-time">Full-Time</label>
                        &nbsp;
                        <input type="radio" id="part-time" value="part-time" v-model="joDetails.joType" />
                        <label for="part-time">Part-Time</label>
                        &nbsp;
                        <input type="radio" id="unsure" value="Unsure" v-model="joDetails.joType" />
                        <label for="unsure">Unsure</label>
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="expected_TOA" class="labels my-0">Expected terms of agreement</label>
                        <select class="form-select form-select-md" id="expected_TOA" v-model="joDetails.joTerms">
                            <option value=""></option>
                            <option v-for="v in options.terms" :value="v">{{v}}</option>
                        </select>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="number_of_staff" class="labels my-0">Number of staff required</label>
                        <input type="number" id="number_of_staff" class="input-group-outline form-control  p-2" v-model="joDetails.joOpenings">
                    </div>
                    <div class="col-md-6 ps-md-2">
                        <label for="timezone" class="labels my-0">Timezone</label>
                        <select class="form-select form-select-md" id="timezone" v-model="joDetails.joTimezone">
                            <option value=""></option>
                            <option v-for="v in options.timezones" :value="v">{{v}}</option>
                        </select>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="staff_hourly_rate" class="labels my-0">Staff Hourly Rate</label>
                        </div>&nbsp;
                        <span v-for="rate in options.rates">
                            <input type="radio" :id="rate.value" :value="rate.id" name="staff_hourly_rate" v-model="joDetails.joRate"/>
                            <label :for="rate.value">{{rate.value}}</label>&nbsp;
                        </span>
                        
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="level_of_expertise" class="labels my-0">Level of Expertise</label>
                        </div>&nbsp;
                        <span v-for="expertise in options.expertise">
                            <input type="radio" :id="expertise.value" :value="expertise.id" name="level_of_expertise" v-model="joDetails.joExpertise"/>
                            <label :for="expertise.value">{{expertise.value}}</label>&nbsp;
                        </span>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <label for="required_skills" class="labels my-0">Required Skills</label>
                        <Multiselect
                        v-model="joDetails.joAdvSkills"
                        mode="tags"
                        :close-on-select="false"
                        :searchable="true"
                        :options="skills"
                        />
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <label for="optional_skills" class="labels my-0">Optional Skills</label>
                        <Multiselect
                        v-model="joDetails.joMidSkills"
                        mode="tags"
                        :close-on-select="false"
                        :searchable="true"
                        :options="skills"
                        />
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="operating_system" class="labels my-0">Computer Operating System</label>
                        </div>
                        <span v-for="compOS in options.compOS">&nbsp;
                            <input type="radio" :id="compOS.value" :value="compOS.id" name="operating_system" v-model="joDetails.joExpertise"/>
                            <label :for="compOS.value">{{compOS.value}}</label><br />
                        </span>
                    </div>
                </div>
                
                <div class="row pt-3">
                    <div class="col-md-6 ps-md-2">
                        <label for="required_software" class="labels my-0">Required Software / Tools</label>
                        <div v-for="(v, k) in joDetails.joTools" >
                            <div class="row">
                                <div class="col-8">
                                    <input type="text" id="required_software" class="input-group-outline form-control p-2 m-2" v-model="joDetails.joTools[k]">
                                </div>
                                <div class="col-4 pt-2">
                                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn"
                                        @click="removeTools(k)"
                                        v-show="k || ( !k && joDetails.joTools.length > 1)">
                                        <span class="fas fa-minus"></span>
                                    </MaterialButton>&nbsp;
                                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn"
                                        @click="addTools(k)"
                                        v-show="k == joDetails.joTools.length-1">
                                        <span class="fas fa-plus"></span>
                                    </MaterialButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="au_number" class="labels my-0">Will you require your staff to have an Australian number to answer calls or make calls from?</label><br />
                            <i style="font-size: 13px !important">*You will be paying for the subscription Australian number subscription.</i>
                        </div>
                        <span v-for="nunber in options.auNumbers">&nbsp;
                            <input type="radio" :id="nunber.value" :value="nunber.id" v-model="joDetails.joAuSubs"/>
                            <label :for="nunber.value">{{nunber.value}}</label><br />
                        </span>
                        
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="monitors" class="labels my-0">Do you need your staff to have 2 monitors?</label>
                        </div>&nbsp;
                        <input type="radio" id="monitors_yes" value="Yes" name="monitors" v-model="joDetails.joMonitors"/>
                        <label for="monitors_yes">Yes</label>
                        &nbsp;
                        <input type="radio" id="monitors_no" value="No" name="monitors" v-model="joDetails.joMonitors"/>
                        <label for="monitors_no">No</label>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="com_tools" class="labels my-0">Communication Tools Required</label>
                        </div>
                        <span v-for="comm in options.comms">&nbsp;
                            <input type="radio" :id="comm.value" :value="comm.id" v-model="joDetails.joCommTools"/>
                            <label :for="comm.value">{{comm.value}}</label><br />
                        </span>
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md-12 ps-md-2">
                        <div class="pb-2">
                            <label for="existing_team" class="labels my-0">Is this staff going to work with an existing team?</label>
                        </div>
                        <span v-for="team in options.teams">&nbsp;
                            <input type="radio" :id="team.value" :value="team.id" v-model="joDetails.joTeam"/>
                            <label :for="team.value">{{team.value}}</label><br />
                        </span>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>
<style scoped>
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

<style src="@vueform/multiselect/themes/default.css"></style>