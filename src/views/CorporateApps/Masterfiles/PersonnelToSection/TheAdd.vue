<template>
    <template v-if="!confirmations.showLoader && !confirmations.alertBox.success">
        <teleport to="body">
            <standard-modal 
            :show=showAdd
            @close=removeAlertBox
            :hasClose=true
            :hasHeader=true
            :hasFooter=true
            :title=title
            size="dialog-l"
            :isScrollable=true>
                <template #body>
                    <div class="row">
                        <div class="form-group mb-3">
                            <!-- <select v-model="details.departmentId" class="input-group-outline form-select form-control p-2" id="country">
                                <option selected value="">Choose Worker</option>
                                <option v-for="department in details.departments" :value="department.id" :key="department.id">{{department.reg_firstname}} {{department.reg_lastname}}</option>
                            </select> -->
                            
                            <label for="country" class="form-label">Assign to Section</label>
                            <select v-model="details.sectionId" class="input-group-outline form-select form-control p-2" id="country" @change="sectionSelected()">
                                <!-- <option selected value="">Choose Section</option> -->
                                <option v-for="department in details.sections" :value="department.id" :key="department.id">{{department.description}}</option>
                            </select>
                            <template v-if="validations.errors.link_sec_id">
                                <span v-for="(error, index) in validations.errors.link_sec_id" :key="index" class="error-font">{{ error }}</span>
                            </template>
                            
                        </div>
                        <div class="form-group personnel-to-section1 mb-4">
                            <label for="country" class="form-label">Personnel</label>
                            <template v-if="details.jobseeker.success">
                                <v-select class="input-group-outline reach-inside-border" :disabled="!details.sectionId" :clearable="true" :options="details.jobseeker.data.data" label="complete_name" v-model="details.selectedJobseeker" style="margin-top: 2px !important;" ></v-select>
                            </template>
                            <template v-else>
                                <v-select style="margin-top: 2px !important;"></v-select>
                            </template>

                            <template v-if="validations.errors.link_prereg_id">
                                <span v-for="(error, index) in validations.errors.link_prereg_id" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <material-button @click="store" variant="light" class="btn command-btn btn-md false false mb-0">
                        Save
                    </material-button>
                </template>
            </standard-modal>
        </teleport>
    </template>
    <input-has-changed-confirmation 
        v-if="!confirmations.showLoader && !confirmations.alertBox.success"
        :showHasChangedComfirmation="confirmations.showHasChangedComfirmation" 
        @submitForm="submitForm" 
        @closeForm="closeForm" 
        @toggleShowHasChangedComfirmation="toggleShowHasChangedComfirmation">
    </input-has-changed-confirmation>
    <alert-unauthenticated v-if="confirmations.showAlertUnauthenticated.success" :message="confirmations.showAlertUnauthenticated.message"></alert-unauthenticated>
    <the-loader v-if="confirmations.showLoader"></the-loader>
    <alert-box v-if="confirmations.alertBox.success" :showAlertBox="confirmations.alertBox.success" :message="confirmations.alertBox.message" @toggleShowAlertBox="removeAlertBox"></alert-box>
    <teleport to="body">
        <the-validation></the-validation>
    </teleport>
</template>
<script>
    import { mapGetters } from 'vuex';
    import MaterialInput from "@/components/MaterialInput.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import TheValidation from "./TheValidation.vue";
    import TheLoader from "../../Widgets/TheLoader.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import InputHasChangedConfirmation from "../../Widgets/InputHasChangedConfirmation.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    import vSelect from "vue-select";

    export default {
        components: {
            MaterialButton,
            MaterialInput,
            StandardModal,
            TheValidation,
            TheLoader,
            AlertUnauthenticated,
            AlertBox,
            InputHasChangedConfirmation,
            vSelect
        },
        data() {
            return {
                details: {
                    description: "",
                    sectionId: null,
                    departments:{},
                    sections:{},
                    selectedJobseeker: null,
                    jobseeker: {
                        success: false
                    },
                },
                confirmations: {
                    showLoader: false,
                    inputHasChanged: false,
                    showHasChangedComfirmation: false,
                    alertBox: {
                        success: false,
                        message: ''
                    },
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    }
                },
                validations: {
                    previousDetails: "",
                    errors: []
                },
            }
        },
        mounted() {
            this.validations.previousDetails = JSON.stringify(this.details);
            this.getJobseeker();
            this.getSection();
        },
        // watch: {
        //     'details.sectionId'(newVal) {
        //         this.details.selectedJobseeker = null;
        //         if(newVal) {
        //             this.getSection();
        //         } else {
        //             this.details.jobseeker.success = false;
        //         }
        //     }
        // },
        provide() {
            return {
                details: this.details,
                validations: this.validations,
                confirmations: this.confirmations
            }
        },
        props: ['title', 'showAdd'],
        methods: {
            submitForm() {
                this.confirmations.showHasChangedComfirmation = false;
                this.store();
            },
            closeForm() {
                this.$emit("toggleShowAdd");
            },
            toggleShowHasChangedComfirmation() {
                this.confirmations.showHasChangedComfirmation = !this.confirmations.showHasChangedComfirmation;
            },
            removeAlertBox() {
                if(this.confirmations.inputHasChanged) {
                    this.confirmations.showHasChangedComfirmation = true;
                } else {
                    this.confirmations.alertBox.success = !this.confirmations.alertBox.success;
                    this.$emit("toggleShowAdd");
                }
            },

            sectionSelected(){
                this.getJobseeker();
            },

            getJobseeker() {
                let self = this;
                // var selectedSectionId = self.details.sections ? self.details.sections.id : null;
                axios({
                    method: 'get',
                    // url: api.DEV_API_URL + `/admin/corporate-apps-registrant?section_id=17`,
                    url: api.DEV_API_URL + `/admin/corporate-apps-registrant?section_id=${self.details.sectionId}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.details.jobseeker = response.data;
                    console.log('asdas'+self.details.jobseeker)
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },

            getSection(){
                let self = this;
            
                //get section
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/admin/department-section',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if (response.data.success) {
                        self.details.sections = response.data.data.data;
                        self.validations.previousDetails = JSON.stringify(self.details);
                        console.log(self.details.sections)
                    }
                })
                .catch(function (errors) {
                    self.confirmations.showLoader = false;
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                });
            },

            store() {
                // console.log(this.details.selectedJobseeker);
                // return 
                this.confirmations.showLoader = true;

                let self = this;
                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/admin/store-department-section-personnel',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        section_id: self.details.sectionId,
                        registrant_id: self.details.selectedJobseeker.id,
                    }
                   
                })
                .then(function (response) {
                    self.$emit("refresh");
                    self.confirmations.showLoader = false;
                    self.confirmations.inputHasChanged = false;
                    self.confirmations.alertBox.success = response.data.success;
                    self.confirmations.alertBox.message = response.data.message;
                })
                .catch(function (errors) {
                    self.confirmations.showLoader = false;
                    if(errors.response.status === 401) {
                        self.confirmations.showAlertUnauthenticated.success = true;
                        self.confirmations.showAlertUnauthenticated.message = errors.response.data.message;
                    }
                    if(errors.response.status === 422) {
                        self.validations.errors = errors.response.data.errors;
                    }
                    
                    const element = document.querySelector(".error-font:first-of-type");
                    element?.scrollIntoView({ behavior: "smooth" });
                });
            }
            
        },
    };
</script>
<style scoped>
    .form-switch .form-check-input:checked {
        background-color: #63ff43;
    }
    .error-font{
        color:red !important;
        font-size: small;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .input-group-outline:disabled {
        background-color: #c9c8c8 !important;
        border-color: #c9c8c8 !important;
    }
    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
        border: 0.5px solid #979595a8 !important;
    }

</style>

<style>
.personnel-to-section1 .vs__dropdown-menu{
max-height: 65px !important;
}

.personnel-to-section1 .vs--disabled .vs__dropdown-toggle{
background-color: #ededed  !important;
}
.personnel-to-section1 .vs--disabled .vs__search{
background-color: #ededed !important;
}
.personnel-to-section1 .vs--disabled svg.vs__open-indicator{
background-color: #ededed  !important;
}

/* .personnel-to-section1 .vs__dropdown-menu{
max-height: 60px !important;
overflow-y:auto !important;
}
.personnel-to-section1 .vs--disabled .vs__dropdown-toggle{
background-color: #ededed !important;
}
.personnel-to-section1 .vs--disabled .vs__search{
background-color: orange !important;
}
.personnel-to-section1 .vs--disabled .vs__selected{
opacity:0.3 !important;
}
.personnel-to-section1 .vs--disabled svg.vs__open-indicator{
background-color: #ededed !important;
}

.personnel-to-section1 .vs__actions .vs__open-indicator{
display: none !important;
} */

</style>