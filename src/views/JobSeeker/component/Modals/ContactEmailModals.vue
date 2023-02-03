<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import Loader from "@/components/Loader.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    
    // import { onMounted } from "vue";
    // // popover
    // import setTooltip from "@/assets/js/tooltip";

    // // store
    // import { useAppStore } from "@/stores";
    // const store = useAppStore();

    // // hook
    // onMounted(() => {
    //     setTooltip(store.bootstrap);
    //     console.log("test")
    // });

</script>

<script>

    export default {
        name: "ContactEmailModals",
        props: ['show', 'selectedEmail', 'type', 'selectedIndex', 'isPrimaryEmail','preregEmail', 'validateEmail'],
        data() {
            return {
                isValidEmail: false,
                data:{'email': this.selectedEmail},
                emailMsg: '',
                isValidEmailMsg: '',
                loaderSaveUpdate: false,
                isDisableBtn: true
            }
        },
        methods: {
            
            handleDelete ( action ) {

                if ( action == 'yes' ) {
                    this.$emit( 'deleteEmail', this.selectedIndex );
                } else { this.$emit( 'close' ) } 
                
            },

            handleSubmit ( action ){

                    if( action == 'add' ) {
                        this.$emit( 'addEmail', this.data.email );
                    } else {
                        this.$emit( 'updateEmail', {'email': this.data.email, 'index': this.selectedIndex} );
                    }
                
                    this.isValidEmail = false;
                    this.isValidEmailMsg = "";
            },

            handleChange (){

                this.isDisableBtn = true;
                var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                if ( !this.data.email.match(validRegex) ){

                    this.emailMsg = "Please include an '@' and '.' in the email address.";
                    this.isValidEmail = true;
                    let emailArr = this.data.email.split('@');
                    let emailSArr = "";
                    let emailDArr = "";

                    try {
                        emailSArr = emailArr[1].split('.');
                    } catch (error) {}

                    if ( emailArr.length == 1 ){
                        this.isValidEmailMsg = "\'" + this.data.email + "\'" + " missing an '@'";
                    }else if ( emailSArr && emailSArr.length == 1 ) {
                        this.isValidEmailMsg = "\'" + this.data.email + "\'" + " missing email domain"
                    }else if (emailSArr[1] && emailSArr[1].length < 2) {
                        this.isValidEmailMsg = "\'" + this.data.email + "\'" + " invalid email domain."
                    }

                } else {

                    this.isValidEmail = false;
                    this.isValidEmailMsg = "";
                    this.isDisableBtn = false;

                }
            },
            
            setDefaultEmail (){
                this.$emit('continueEdit', 'email')
            }
        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
        }

    }            
</script>

<template>

    <div v-if="type=='add'">
        <StandardModal
            @close="$emit('close')"
            :show="show" 
            :hasClose=true
            hasHeader="true"
            hasFooter="true"
            title="Contact Information"
            size="dialog-md"
            >

            <template #body>

                <div class="row mb-2 mx-0" v-if="validateEmail.isExist == true">
                    <MaterialAlert color="danger">Email is already taken.</MaterialAlert>
                </div>
                <div class="row mb-2 mx-0" v-if="validateEmail.isAdded == true">
                    <MaterialAlert color="danger">{{ validateEmail.message }}</MaterialAlert>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="email_address" class="labels my-0">Email</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                v-model="data.email"
                                maxlength="50"
                                @keyup="handleChange">
                            <span v-if="isValidEmail" class="error_msg">{{emailMsg}}<br />{{isValidEmailMsg}}</span>
                        </div>
                    </div>
                </div>

            </template>

            <template #footer>
                
                <MaterialButton variant="contained" color="white" size="sm" class="command-btn mb-0" @click="handleSubmit('add')"
                :class="{disabled: isDisableBtn}">
                    Save
                </MaterialButton> <span>&nbsp;</span>

                <MaterialButton variant="contained" color="white" size="sm" class="no-btn mb-0" @click="$emit('close')">
                    Cancel
                </MaterialButton>

            </template>

        </StandardModal>
    </div>

    <div v-if="type=='edit'">
        <StandardModal 
            @close="$emit('close')"
            :show="show" 
            :hasClose=true
            hasHeader="true"
            hasFooter="true"
            title="Contact Information"
            size="dialog-md"
            >

            <template #body>

                <div class="row mb-2 mx-0" v-if="validateEmail.isExist == true">
                    <MaterialAlert color="danger">Email is already taken.</MaterialAlert>
                </div>
                <div class="row mb-2 mx-0" v-if="validateEmail.isAdded == true">
                    <MaterialAlert color="danger">{{ validateEmail.message }}</MaterialAlert>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="email_address" class="labels my-0">Email</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                v-model="data.email"
                                maxlength="50"
                                @keyup="handleChange">
                            <span v-if="isValidEmail" class="error_msg">{{emailMsg}}<br />{{isValidEmailMsg}}</span>
                        </div>
                    </div>
                </div>

            </template>

            <template #footer>
                
                <MaterialButton variant="contained" color="white" size="sm" class="command-btn mb-0" @click="handleSubmit('edit')"
                :class="{disabled: isDisableBtn}">
                    update
                </MaterialButton> <span>&nbsp;</span>

                <MaterialButton variant="contained" color="white" size="sm" class="no-btn mb-0" @click="$emit('close')">
                    Cancel
                </MaterialButton>

            </template>

        </StandardModal>
    </div>

    
    <div v-if="type == 'delete'">

        <StandardModal 
            @close="$emit('close')"
            :show="show" 
            hasFooter="true"
            size="dialog-md"
            hasClose="true"
            >

            <template #body v-if="loaderSaveUpdate">
                <Loader></Loader>
            </template>'
            
            <template #body v-if="!loaderSaveUpdate">
                    <slot name="body">default body</slot>
            </template>

            <template #footer v-if="!loaderSaveUpdate">
                <div v-if="!isPrimaryEmail && selectedEmail != preregEmail">
                    <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="handleDelete('yes')">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="handleDelete('no')">
                        no
                    </MaterialButton>
                </div>
                <div v-else>
                    <MaterialButton size="sm" variant="contained" color="white" class="command-btn mb-0" @click="handleDelete('no')">
                        Close
                    </MaterialButton>
                </div>
            </template>

        </StandardModal>

    </div>
    

    <div v-if="type == 'confirm'">
        <StandardModal 
            @close="$emit('close')"
            :show="show" 
            hasFooter="true"
            size="dialog-md"
            hasClose="true"
            >

            <template #body>
                <slot name="body">Error!</slot>
            </template>
            
            <template #footer>

                <div v-if="selectedEmail == preregEmail">
                    <MaterialButton size="sm" variant="contained" color="white" class="command-btn mb-0" @click="handleDelete('no')">
                        Close
                    </MaterialButton>
                </div>
                <div v-else>
                    <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="setDefaultEmail">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="$emit('close')">
                        no
                    </MaterialButton>
                </div>

            </template>

        </StandardModal>

    </div>


</template>


<style scoped>
    
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }

    .form-check{
        padding-left: 0px !important;
    }
    .form-check-input[type=radio]:checked {
        border-color:#6bf22d !important;
    }
    .form-check:not(.form-switch) .form-check-input[type=radio]:after {
        background-image: linear-gradient(195deg, #4caf50 0%, #4caf50 100%), var(--bs-gradient) !important;
    }
    .verify_email{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verify_email:hover{
        background-color: #4caf50;
    }
    .verified_email{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        background-color: #4caf50;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verified_email:hover{
        background-color: #59c95d;
    }

    #add_more{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        border: 2px solid #b1ffb4;
        border-radius: 20px;
        background-color: #b1ffb4;
    }
    #add_more:hover{
        background-color: #4caf50;
    }

    .spinner-border{
        --bs-spinner-width: 1rem !important;
        --bs-spinner-height: 1rem !important;
    }
    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .error_msg {
        font-size: 0.9em;
        color: #9c0404;
    }
</style>