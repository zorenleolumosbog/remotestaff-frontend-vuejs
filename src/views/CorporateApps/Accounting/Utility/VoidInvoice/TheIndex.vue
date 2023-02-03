<script setup>
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
</script>
<script>
    // import TheNavbar from "../../components/TheNavbar.vue";
    // import TheSidebar from "../../components/TheSidebar.vue";
    // import TimeTracker from "../../components/TimeTracker.vue";
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import axios from "axios";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";

    export default {
        components: {
            // TheNavbar,
            // TheSidebar,
            MaterialButton,
            api,
            axios,
            StandardModal,
            Loader
        },

        data() {
            return {
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                details : {
                    id : '',
                    voidReason : ''
                },
                fieldErrors : {
                    invoiceId : {
                        error: false,
                        message: "Invoice ID is required.",
                    },
                    voidReason : {
                        error: false,
                        message: "Void Reason is required.",
                    }
                },
                showModal : {
                    confirm : false,
                    edit : false,
                    loader : false
                },
                isLoading : false
            }
        },

        methods: {

            getInvoice () {
                
                if ( !this.details.id ) {
                    this.fieldErrors.invoiceId.error = true;
                    return
                }

                this.fieldErrors.invoiceId.error = false;
                this.showModal.loader = true;
                this.isLoading = true;

                axios.get(this.API_URL+'/accounting/utility/show-invoice/'+ this.details.id,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{

                    this.showModal.loader = false;
                    this.isLoading = false;

                    if ( response.data.success ) {
                        this.details.data = response.data.data[0];
                        this.details.voidReason = response.data.data[0]['void_reason'];
                        this.showModal.edit = true;
                    } else {
                        this.fieldErrors.invoiceId = {
                            error: true,
                            message: "Invoice ID is not found.",
                        }
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            voidNow () {
                
                if ( !this.details.voidReason ) {
                    this.fieldErrors.voidReason.error = true;
                    this.showModal.edit = true;
                    this.showModal.confirm = false;
                    return
                }

                this.fieldErrors.voidReason.error = false;
                this.showModal.loader = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/accounting/utility/update-invoice',
                    { 
                        id : this.details.id,
                        void_reason : this.details.voidReason,
                        voidedby : this.USERID
                    },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if ( response.data.success ) {
                        this.isLoading = false;
                        this.details = {
                            id : '',
                            voidReason : '',
                            data : {
                                client_poc : '',
                                inv_date : '',
                                net_amt : ''
                            }
                        };
                        this.fieldErrors.invoiceId.error = false;
                        this.showModal.edit = false;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },

            confirmVoid () {
                // check if has an error 
                const error = this.fieldErrors;
                if (error.invoiceId.error || error.voidReason.error ) {
                    return
                } 
                    this.showModal.edit = false;
                    this.showModal.confirm = true;
            },

            confirmModalBtn ( action ) {
                this.showModal.edit = false;
                if ( action == 'yes' ) {
                    this.showModal.confirm = false;
                    this.voidNow();
                } else if ( action == 'no' ) {
                    this.showModal.confirm = false;
                    this.showModal.confirm = false;
                    this.details = {
                        'id' : '',
                        'voidReason' : ''
                    }
                    this.fieldErrors.voidReason.error = false;
                } else if ( action == 'cancel' ) {
                    this.showModal.edit = true;
                    this.showModal.confirm = false;
                }
            },

            handleChangeId () {
                this.fieldErrors.invoiceId.error = this.details.id ? false : true;
            },
            
            handleChangeVoidReason () {
                
                const voidReason = this.details.voidReason;
                this.fieldErrors.voidReason.error = voidReason ? false : true;
                this.fieldErrors.voidReason.message = voidReason == '' ? "Void Reason is required." 
                    : '';

                console.log('voidReason',voidReason)
                if ( voidReason.length > 30 ) {
                    this.fieldErrors.voidReason.error = true;
                    this.fieldErrors.voidReason.message = "Maximum of 30 characters are allowed.";
                }
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
<!-- 
    <StandardLayout>
        <template #header>
            <the-navbar></the-navbar>
        </template>
        <template #leftsidebar>
            <the-sidebar></the-sidebar>
        </template>
        <template #main> -->
            
            <div class="container mx-auto my-auto">

                <div class="row mb-2 m-auto">
                    <div class="col-12 col-sm-5 col-md-5 ">
                        <div class="form-group mb-2">
                            <label for="invoice_id" class="labels my-0">Invoice ID <span class="required-field">*</span></label>
                            <input type="text" class="input-group-outline form-control p-2" 
                                @keyup="handleChangeId"
                                id="invoice_id"
                                v-model="details.id"
                                maxlength="50">
                            <span class="error_msg" v-if="fieldErrors.invoiceId.error">&nbsp;{{ fieldErrors.invoiceId.message }}</span>
                        </div>
                        <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0"
                            @click="getInvoice">
                            Search
                        </MaterialButton><span>&nbsp;</span>
                    </div>
                </div>
                
                <StandardModal 
                    @close="showModal.edit = false"
                    :show="showModal.edit" 
                    :hasFooter=true
                    :hasHeader=true
                    :hasClose=true
                    title="Invoice Details"
                    size="dialog-md"
                    isScrollable="true"
                    >

                    <template #body>
                    <div class="row mb-2">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="clinet_name" class="labels my-0">Client Name</label><br />
                                <span class="p-3">{{ details.data.client_poc }}</span>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="client_poc" class="labels my-0">Invoice Date</label><br />
                                <span class="p-3">{{ details.data.inv_date }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="clinet_name" class="labels my-0">Net Amount</label><br />
                                <span class="p-3">{{ details.data.net_amt }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="clinet_name" class="labels my-0">Void Reason &nbsp;<span class="required-field">*</span></label><br />
                                <input type="text" class="input-group-outline form-control p-2" 
                                    @keyup="handleChangeVoidReason"
                                    id="invoice_id"
                                    v-model="details.voidReason"
                                    maxlength="50">
                                <span class="error_msg" v-if="fieldErrors.voidReason.error">&nbsp;{{ fieldErrors.voidReason.message }}</span>
                            </div>
                        </div>
                    </div>
                    </template>
                    
                    <template #footer>
                        <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0"
                            @click="confirmVoid">
                            Void Now
                        </MaterialButton><span>&nbsp;</span>
                    </template>

                </StandardModal>

                <!-- Success Loader -->
                <StandardModal 
                    @close="showModal.loader = false"
                    :show="showModal.loader" 
                    :hasClose=true
                    size="dialog-sm"
                    >
                    <template v-if="isLoading" #body>
                        <Loader></Loader>
                    </template>

                    <template v-if="!isLoading" #body>
                        <div style="text-align: center">
                            <h5 class="alert-message"> Successfully updated. </h5>
                            <span>&nbsp;</span>
                        </div>
                    </template>

                </StandardModal>
                    
                <StandardModal 
                    @close="showModal.confirm = false"
                    :show="showModal.confirm" 
                    hasFooter="true"
                    hasClose="true"
                    size="dialog-md"
                    >
                    
                    <template #body>

                        <h5 v-if="showModal.confirm" class="alert-message" >Are you sure you want to void this invoice?</h5>
                    
                    </template>
                    
                    <template #footer>

                        <div v-if="confirmVoid">
                            <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0" @click="confirmModalBtn('yes')">
                                Yes
                            </MaterialButton>&nbsp;
                            <MaterialButton size="sm" variant="contained" color="danger" class="no-btn mb-0" @click="confirmModalBtn('no')">
                                no
                            </MaterialButton>&nbsp;
                            <MaterialButton size="sm" variant="contained" color="secondary" class="no-btn mb-0" @click="confirmModalBtn('cancel')">
                                cancel
                            </MaterialButton>
                        </div>

                    </template>

                </StandardModal>

            </div>

        <!-- </template>
        <template #rightsidebar>
            <TimeTracker/>
        </template>
    </StandardLayout> -->

</template>

<style scoped>

    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
    .required-field {
        color: red;
    }
    .error_msg {
        font-size: 0.9em;
        color: red;
    }
    .alert-message {
        padding-top: unset;
    }

</style>