<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import Multiselect from "@vueform/multiselect";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import MaterialSwitch from "@/components/MaterialSwitch.vue";
    import skills  from "@/static/skills.json";
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css';

    export default {
        name: "ViewUpdate",
        props: ['joDetails','industries','show','joDetailsString'],
        components: {
            StandardModal,
            MaterialButton,
            Multiselect,
            MaterialAlert,
            MaterialSwitch,
            skills,
            QuillEditor
        },
        data () {
            return {
                formData : this.joDetails,
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
                        "Australian Central Standard Time",
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
                        { id :"0", value : "Skype"},
                        { id :"1", value : "Slack"},
                        { id :"2", value : "Trello"},
                        { id :"3", value : "Monday"},
                        { id :"4", value : "Zoom"},
                        { id :"5", value : "Others"}
                    ],
                    teams : [
                        { id :"1", value : "No, just with me."},
                        { id :"2", value : "Yes, with my Australian team."},
                        { id :"3", value : "Yes, with my offshore team."},
                    ],
                    expertise : [
                        { id :0, value : "Entry Level (1-2 Years)"},
                        { id :1, value : "Mid Level (3-4 Years)"},
                        { id :2, value : "Senior Level (5 and Up Years)"},
                    ],

                },
                skills : [],
                softwareTools : [{
                    name : ''
                }],
                fieldValidation : {
                    joTitle: {
                        error: !this.joDetails.joTitle ? true : false,
                        message: "Job Title is required.",
                    },
                    joIndustry: {
                        error: this.joDetails.joIndustry.length == 0 ? true : false,
                        message: "Industry is required.",
                    },
                    joOpenings: {
                        error: !this.joDetails.joOpenings ? true : false,
                        message: "Number of staff is required.",
                    },
                    joDescription: {
                        error: false,
                        message: "Job Description is required.",
                    },
                    joCompanyAge: {
                        error: !this.joDetails.joCompanyAge ? true : false,
                        message: "Company Age in Years is required.",
                    },
                },
                isDisabledBtn : true,
                showConfirModal : false
            }
        },
        methods : {

            checkError() {

                let hasError = [];
                for (const x in this.fieldValidation) {
                    hasError.push(this.fieldValidation[x].error);
                }
                const errorCount = hasError.filter(value => value === true).length;

                return errorCount
            },

            setToOjb (option, val) {
                let data = {
                    id : '',
                    value : '',
                };
                for (const x in option) {
                    if ( option[x]['id'] == val ) {
                        data['id'] = option[x]['id']
                        data['value'] = option[x]['value']
                    }
                }
                return data
            },

            confirmClose () {

                let joDetailsString = this.joDetailsString;
                let formData = JSON.stringify(this.formData);
                
                if (joDetailsString != formData) {
                    this.showConfirModal = true;
                    return
                }

                this.$emit( 'close' );
            },

            confirmCloseAction (action) {
                if ( action == "Yes" ) {
                    this.showConfirModal = false;
                    this.handleSubmit ();
                    return
                }

                this.$emit( 'close' );
            },

            handleSubmit () {

                const data = {};

                // pass the ID for bullhorn and value for db
                let joIndustry = [];
                for (const x in this.industries) {
                    if (this.formData.joIndustry.includes(this.industries[x]['id'])) {
                        joIndustry.push({
                            'id' : this.industries[x]['id'],
                            'name' : this.industries[x]['name']
                        })
                    }
                }
                
                this.formData['joIndustry'] = joIndustry;
                this.formData['joHourlyRate'] = this.setToOjb(this.options.rates, this.formData.joHourlyRate);
                this.formData['joExpertise'] = this.setToOjb(this.options.expertise, this.formData.joExpertise);
                this.formData['joOs'] = this.setToOjb(this.options.compOS, this.formData.joOs);
                this.formData['joAuNumber'] = this.setToOjb(this.options.auNumbers, this.formData.joAuNumber);
                this.formData['joTeam'] = this.setToOjb(this.options.teams, this.formData.joTeam);

                if( !this.checkError() ){
                    this.$emit( 'submitCrf', this.formData )
                } else {
                    window.scrollTo(0,0)
                }
            },

            addTools (k) {
                this.joDetails.joTools.push('');
            },

            removeTools (k) {
                this.joDetails.joTools.splice(k, 1)
            },

            setjoDescriptionError () {
                const regex = /(<([^>]+)>)/ig
                let hasText = !!this.joDetails.joDescription.replace(regex, "").length;
                this.fieldValidation.error =  !hasText ? true : false;
            }
        },
        watch: {
            
            'formData.joCompanyAge' (newVal){
                this.fieldValidation.joCompanyAge.error = !newVal ? true : false;
                this.fieldValidation.joCompanyAge.message = !newVal ? "Company Age in Years is required." : '';
            },
    
            'formData.joIndustry' (newVal){
                this.fieldValidation.joIndustry.error = newVal.length == 0 ? true : false;
                this.fieldValidation.joIndustry.message = newVal.length == 0 ? "Industry is required." : '';
            },
            
            'formData.joTitle' (newVal){
                this.fieldValidation.joTitle.error = !newVal ? true : false;
                this.fieldValidation.joTitle.message = !newVal ? "Job Title is required." : '';
            },

            'formData.joDescription' (newVal){
                const regex = /(<([^>]+)>)/ig
                let hasText = !!newVal.replace(regex, "").length;
                console.log(hasText);
                this.fieldValidation.joDescription.error = !hasText ? true : false;
                this.fieldValidation.joDescription.message = !hasText ? "Job Description is required." : '';
            },
    
            'formData.joOpenings' (newVal){
                this.fieldValidation.joOpenings.error = !newVal ? true : false;
                this.fieldValidation.joOpenings.message = !newVal ? "Number of staff is required." : '';

                let newValCount = newVal.toString().length;
                if ( newVal ) {
                    this.fieldValidation.joOpenings.error = newValCount > 3 ? true : false;
                    this.fieldValidation.joOpenings.message = newValCount > 3 ? "Maximum of 3 characters only." : '';
                }

            }
        },
        mounted () {
            this.skills = skills.skills;
            this.setjoDescriptionError();
        }
    }
</script>

<template>
    <StandardModal 
        @close="confirmClose"
        :show="show" 
        :hasFooter=true
        :hasHeader=true
        :hasClose=true
        title="Job Order Form"
        size="dialog-xxxl"
        isScrollable="true"
        >

        <template #body>


            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <label for="name" class="label my-0">Name</label>
                    <input type="text" id="name" class="input-group-outline form-control  p-2" v-model="formData.name" :disabled="true">
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="comp_name" class="label my-0">Company Name or Website</label>
                    <input type="text" id="comp_name" class="input-group-outline form-control  p-2" v-model="formData.clientCorporation" :disabled="true">
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <label for="comp_age" class="label my-0">Company Age in Years <span class="lavel_required">*</span></label>
                    <input type="number" id="comp_age" class="input-group-outline form-control  p-2" v-model="formData.joCompanyAge">
                    <span v-if="fieldValidation.joCompanyAge.error" class="error_msg">&nbsp;{{fieldValidation.joCompanyAge.message}}</span>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="no_employee" class="label my-0">Number of Employee</label>
                    <select class="form-select form-select-md" id="no_employee" v-model="formData.joEmployees">
                        <option value=""></option>
                        <option v-for="v in options.employees" :value="v.value">{{v.value}}</option>
                    </select>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <label for="industry" class="label my-0">Industry <span class="lavel_required">*</span></label>
                    <Multiselect
                    v-model="formData.joIndustry"
                    mode="tags"
                    label="name"
                    valueProp="id"
                    :close-on-select="false"
                    :searchable="true"
                    :options="industries"
                    class="multiselect-crf"
                    />
                    <span v-if="fieldValidation.joIndustry.error" class="error_msg">&nbsp;{{fieldValidation.joIndustry.message}}</span>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <div class="pb-2">
                        <label for="offshore" class="label my-0">Have you worked with an offshore staff before?</label>
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="jo_offshore">No</label>
                        <input class="form-check-input" type="checkbox" id="jo_offshore" v-model="formData.joOffshore">
                        <label class="form-check-label" for="jo_offshore">Yes</label>
                    </div>
                </div>
                <div class="col-md-6 ps-md-2">
                    <div class="pb-2">
                        <label for="sourcing" class="label my-0">Are you sourcing for this role for the first time?</label>
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="jo_sourcing">No</label>
                        <input class="form-check-input" type="checkbox" id="jo_sourcing" v-model="formData.joSourcing">
                        <label class="form-check-label" for="jo_sourcing">Yes</label>
                    </div>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <label for="size_of_team" class="label my-0">Size of the team</label>
                    <select class="form-select form-select-md" id="size_of_team" v-model="formData.joSize">
                        <option value=""></option>
                        <option v-for=" v in options.size" :value="v.value">{{v.value}}</option>
                    </select>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="job_title" class="label my-0">Job Title <span class="lavel_required">*</span></label>
                    <input type="text" id="job_title" maxlength="100" class="input-group-outline form-control  p-2" v-model="formData.joTitle">
                    <span v-if="fieldValidation.joTitle.error" class="error_msg">&nbsp;{{fieldValidation.joTitle.message}}</span>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2" style="height: 315px">
                    <label for="job_desc" class="label my-0">Job Description <span class="lavel_required">*</span></label>
                    <div style="height: 200px">
                        <quill-editor style="background-color: #ededed; border-radius: 0px 0px 5px 5px  !important;"
                        v-model:content="formData.joDescription" 
                        contentType="html" 
                        theme="snow"></quill-editor>
                    </div>
                    <span v-if="fieldValidation.joDescription.error" class="error_msg"><br /><br /><br />&nbsp;{{fieldValidation.joDescription.message}}</span>
                </div>
                <div class="col-md-6 ps-md-2" style="height: 315px">
                    <label for="role_objective" class="label my-0">Role Objective</label>
                    <div style="height: 200px">
                        <quill-editor style="background-color: #ededed; border-radius: 0px 0px 5px 5px  !important;"
                        v-model:content="formData.joRoleObj" 
                        contentType="html" 
                        theme="snow">{{ formData.joRoleObj }}</quill-editor>
                    </div>
                    <!-- <textarea name="role_objective" v-model="formData.joRoleObj"
                    class="form-control  p-3" id="role_objective" placeholder="" rows="4"
                    style="background-color: #ededed; border-radius: 5px  !important;"
                    ></textarea> -->
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <div class="pb-2">
                        <label for="job_type" class="label my-0">Job Type</label>
                    </div>&nbsp;
                    <input class="form-check-input" type="radio" id="full-time" value="Full-Time" v-model="formData.joType" />
                    <label for="full-time">Full-Time</label>
                    &nbsp;
                    <input class="form-check-input" type="radio" id="part-time" value="part-time" v-model="formData.joType" />
                    <label for="part-time">Part-Time</label>
                    &nbsp;
                    <input class="form-check-input" type="radio" id="unsure" value="Unsure" v-model="formData.joType" />
                    <label for="unsure">Unsure</label>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="expected_TOA" class="label my-0">Expected terms of agreement</label>
                    <select class="form-select form-select-md" id="expected_TOA" v-model="formData.joExpectedTof">
                        <option value=""></option>
                        <option v-for="v in options.terms" :value="v">{{v}}</option>
                    </select>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-6 ps-md-2">
                    <label for="number_of_staff" class="label my-0">Number of staff required <span class="lavel_required">*</span></label>
                    <input type="number" id="number_of_staff" class="input-group-outline form-control  p-2" v-model="formData.joOpenings">
                    <span v-if="fieldValidation.joOpenings.error" class="error_msg">&nbsp;{{fieldValidation.joOpenings.message}}</span>
                </div>
                <div class="col-md-6 ps-md-2">
                    <label for="timezone" class="label my-0">Timezone</label>
                    <select class="form-select form-select-md" id="timezone" v-model="formData.joTimezone">
                        <option value=""></option>
                        <option v-for="v in options.timezones" :value="v">{{v}}</option>
                    </select>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="staff_hourly_rate" class="label my-0">Staff Hourly Rate</label>
                    </div>
                    <span v-for="rate in options.rates">&nbsp;
                        <input class="form-check-input" type="radio" :id="rate.value" :value="rate.id" name="staff_hourly_rate" v-model="formData.joHourlyRate"/>
                        <label :for="rate.value">{{rate.value}}</label><br />
                    </span>
                    
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="level_of_expertise" class="label my-0">Level of Expertise</label>
                    </div>
                    <span v-for="expertise in options.expertise">&nbsp;
                        <input class="form-check-input" type="radio" :id="expertise.value" :value="expertise.id" v-model="formData.joExpertise"/>
                        <label :for="expertise.value">{{expertise.value}}</label><br />
                    </span>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <label for="required_skills" class="label my-0">Required Skills</label>
                    <Multiselect
                    v-model="formData.joAdvSkills"
                    mode="tags"
                    :close-on-select="false"
                    :searchable="true"
                    :options="skills"
                    class="multiselect-crf"
                    />
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <label for="optional_skills" class="label my-0">Optional Skills</label>
                    <Multiselect
                    v-model="formData.joMidSkills"
                    mode="tags"
                    :close-on-select="false"
                    :searchable="true"
                    :options="skills"
                    class="multiselect-crf"
                    />
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="operating_system" class="label my-0">Computer Operating System</label>
                    </div>
                    <span v-for="compOS in options.compOS">&nbsp;
                        <input class="form-check-input" type="radio" :id="compOS.value" :value="compOS.id" v-model="formData.joOs"/>
                        <label :for="compOS.value">{{compOS.value}}</label><br />
                    </span>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-7 ps-md-2">
                    <label for="required_software" class="label my-0">Required Software / Tools</label><br />
                    <i style="font-size: 13px !important">*You will be paying for the subscription of these softwares.</i>
                    <div v-for="(v, k) in formData.joTools" >
                        <div class="row">
                            <div class="col-8">
                                <input type="text" id="required_software" class="input-group-outline form-control p-2 m-2" v-model="formData.joTools[k]">
                            </div>
                            <div class="col-4 pt-2">
                                <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn"
                                    @click="removeTools(k)"
                                    v-show="k || ( !k && formData.joTools.length > 1)">
                                    <span class="fas fa-minus"></span>
                                </MaterialButton>&nbsp;
                                <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn"
                                    @click="addTools(k)"
                                    v-show="k == formData.joTools.length-1">
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
                        <label for="au_number" class="label my-0">Will you require your staff to have an Australian number to answer calls or make calls from?</label><br />
                        <i style="font-size: 13px !important">*You will be paying for the subscription Australian number subscription.</i>
                    </div>
                    <span v-for="nunber in options.auNumbers">&nbsp;
                        <input class="form-check-input" type="radio" :id="nunber.value" :value="nunber.id" v-model="formData.joAuNumber"/>
                        <label :for="nunber.value">{{nunber.value}}</label><br />
                    </span>
                    
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="monitors" class="label my-0">Do you need your staff to have 2 monitors?</label>
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="jo_sourcing">No</label>
                        <input class="form-check-input" type="checkbox" id="jo_sourcing" v-model="formData.joMonitors">
                        <label class="form-check-label" for="jo_sourcing">Yes</label>
                    </div>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="com_tools" class="label my-0">Communication Tools Required</label>
                    </div>
                    <span v-for="comm in options.comms">&nbsp;
                        <input class="form-check-input" type="radio" :id="comm.value" :value="comm.value" v-model="formData.joCommTools"/>
                        <label :for="comm.value">{{comm.value}}</label><br />
                    </span>
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-md-12 ps-md-2">
                    <div class="pb-2">
                        <label for="existing_team" class="label my-0">Is this staff going to work with an existing team?</label>
                    </div>
                    <span v-for="team in options.teams">&nbsp;
                        <input class="form-check-input" type="radio" :id="team.value" :value="team.id" v-model="formData.joTeam"/>
                        <label :for="team.value">{{team.value}}</label><br />
                    </span>
                </div>
            </div>

        </template>

        <template #footer>
            <MaterialButton size="sm" variant="contained" color="none" class="command-btn mb-0"
                @click="handleSubmit" :disabled="!checkError() ? false : true">
                Update
            </MaterialButton><span>&nbsp;</span>
        </template>

    </StandardModal>

    
    <StandardModal 
        @close="showConfirModal = !showConfirModal"
        :show="showConfirModal" 
        size="dialog-sm"
        >
        <template #body>
            <div style="text-align: center">
                <h6 class="alert-message"> Do you want to save changes? </h6>
                <span>&nbsp;</span>

                <MaterialButton size="sm" variant="contained" color="none" class="command-btn mb-0" @click="confirmCloseAction('Yes')">
                    Yes
                </MaterialButton><span>&nbsp;</span>
                <MaterialButton size="sm" variant="contained" color="none" class="no-btn mb-0" @click="confirmCloseAction('No')">
                    No
                </MaterialButton><span>&nbsp;</span>
            </div>
        </template>

    </StandardModal>
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
    .lavel_required {
        color: #9c0404;
    }

    label {
        color: black;
    }
    .input-group-outline {
        border: 1px solid #c5c4c4 !important;
    }
    .form-check-input {
        border: 1px solid #c5c4c4;
        border-radius: 5px !important;
    }
    .form-check-input:checked[type=radio] {
        background-image: linear-gradient(195deg, #160e47 0%, #5b43fc 100%);
        border-radius: 6px !important;
    }

    .form-check .form-check-input {
        float: unset;
        margin: 5px 10px;
    }

    .form-switch {
        padding-left: 0.375rem
    }
    .form-switch .form-check-input:checked {
        border-color: #5b43fc;
        background-color: #5b43fc;
    }
    .form-switch .form-check-input:after {
        top: -3px;
        left: -5px;
        background-color: #160e47;
    }
    .alert-message {
        padding-top: unset;
    }
</style>

<style>
.multiselect-crf {
    --ms-tag-bg: #c4bcfc;
    --ms-tag-color: #3f3f3f;
    --ms-border-color: #D1D5DB;
    --ms-border-color-active: #D1D5DB;
    --ms-ring-color: #c4bcfc;
}
.multiselect-crf .multiselect-tags {
    overflow: auto;
}
</style>

<style src="@vueform/multiselect/themes/default.css"></style>