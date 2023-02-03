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
                        <div class="form-group contract_status mb-3">
                            <label for="filetype_id" class="form-label">File Type</label>
                            <v-select class="input-group-outline reach-inside-border" :clearable="true" :options="details.fileTypes" label="description" v-model="details.fileTypeId" style="margin-top: 2px !important;" ></v-select>
                            <template v-if="validations.errors.filetype_id">
                                <span v-for="(error, index) in validations.errors.filetype_id" :key="index" class="error-font">{{ error }}</span>
                            </template>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group contract_status mb-3">
                            <div v-if="details.fileTypeId">
                                <DropZone 
                                    ref="dropzone"
                                    :maxFiles="Number(1)"
                                    :uploadOnDrop="false"
                                    :chunking="true"
                                    @addedFile="onFileAdd"
                                    @removedFile="onFileRemove"
                                    />
                                <template v-if="validations.errors.file">
                                    <span v-for="(error, index) in validations.errors.file" :key="index" class="error-font">{{ error }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <input v-model="details.notes" type="text" class="input-group-outline form-control p-2" id="notes" placeholder="Notes">
                        <template v-if="validations.errors.notes">
                            <span v-for="(error, index) in validations.errors.notes" :key="index" class="error-font">{{ error }}</span>
                        </template>
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
    import DropZone from 'dropzone-vue';
    import 'dropzone-vue/dist/dropzone-vue.common.css';

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
            vSelect,
            DropZone
        },
        data() {
            return {
                details: {
                    notes: "",
                    filename: '',
                    file: null,
                    fileTypeId: null,
                    fileTypes:[],
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
                }
            }
        },
        mounted() {
            this.validations.previousDetails = JSON.stringify(this.details);
            this.getFiletypes();
        },
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
            store() {
                this.confirmations.showLoader = true;

                let self = this;

                let data = new FormData();
                data.append('notes',self.details.notes);

                if(self.details.fileTypeId != null) {
                    data.append('filetype_id',self.details.fileTypeId.id);
                    data.append('filename',self.details.filename);
                    data.append('file',self.details.file);
                }

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/admin/store-contract-note',
                    headers: { 
                        'Content-Type': 'multipart/form-data', 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    },
                    data: data
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
            },

            getFiletypes(){
                let self = this;
            
                //get file types
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/admin/filetype',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if (response.data.success) {
                        console.log(response.data.data.data);
                        self.details.fileTypes = response.data.data.data;
                        self.validations.previousDetails = JSON.stringify(self.details);
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
            onFileAdd(item) {
                let self = this;
                let file = item.file;

                self.details.filename = file.name;

                let reader = new FileReader(file);
                reader.onload = function() {
                    self.details.file = reader.result;
                };
                reader.onerror = function() {
                    console.log(reader.error);
                };
                reader.readAsDataURL(file);
            },
            onFileRemove(){
                let self = this;
                self.details.file = null;
                self.details.filename = '';
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
    }
</style>

<style>
.contract_status .vs__dropdown-menu{
    max-height: 155px !important;
}
</style>