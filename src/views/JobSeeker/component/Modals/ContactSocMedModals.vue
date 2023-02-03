<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import Loader from "@/components/Loader.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";

</script>

<script>

    export default {
        name: "ContactSocMedModals",
        props: ['show', 'selectedSocMed', 'socMedsList', 'type', 'selectedIndex', 'validateSocMed'],

        data() {
            return {
                data:{'soc_med_name': '', 'soc_med': '', 'soc_med_id': ''},
                selected:{'selected': ''},
                loaderSaveUpdate: false,
                isDisableBtn: true,
                socMed: {'name': '', 'link' : ''}
            }
        },

        methods: {
            handleDelete(action){
                if(action == 'yes'){
                    this.$emit('deleteSocMed', this.selectedIndex);
                }else{ this.$emit('close') }
            },
            validate(action){

                this.data.soc_med_name = this.socMedsList[this.data.soc_med_id]
                if(action == 'add'){
                    this.$emit('addSocMed', this.data);
                }else{
                    this.$emit('updateSocMed', {
                        'soc_med_id': this.selected.selected, 
                        'soc_med_name': this.socMedsList[this.selected.selected], 
                        'soc_med': this.data.soc_med, 
                        'index': this.selectedIndex
                    });
                }
            },
            setDefaultSocMed(data){
                
                this.data.soc_med_name = data.soc_med_name;
                this.data.soc_med = data.soc_med;
                this.data.soc_med_id = data.soc_med_id;
                this.selected.selected = data.soc_med_id;

                this.socMed.name = data.soc_med_name;
                this.socMed.link = data.soc_med;
                
            },

            hanndleChange (e) {

                if ( e.type == "change" ){
                    this.socMed.name = e.target.value;
                }else {
                    this.socMed.link = e.target.value;
                }


                this.isDisableBtn = ( this.socMed.name && this.socMed.link ) 
                    ? false : true;

            }

        },

        mounted() {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            if(this.type == 'confirm'){
                this.setDefaultSocMed(this.selectedSocMed)
            }
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
                
                <div class="row mb-2 mx-0" v-if="validateSocMed.isAdded == true">
                    <MaterialAlert color="danger">{{ validateSocMed.message }}</MaterialAlert>
                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="ea_field" class="labels my-0">Social Media Name</label>
                            <select class="form-select form-select-md" v-model="data.soc_med_id"  @change="hanndleChange">
                                <option v-for="(v, k) in socMedsList" :value="k">{{v}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="soc_med_link" class="labels my-0">Social Media Link</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                id="soc_med_link"  v-model="data.soc_med"
                                maxlength="50"
                                @keyup="hanndleChange">
                        </div>
                    </div>
                </div>

            </template>

            <template #footer>
                
                <MaterialButton variant="contained" color="white" size="sm" class="command-btn mb-0" 
                @click="validate('add')" 
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
                
                <div class="row mb-2 mx-0" v-if="validateSocMed.isAdded == true">
                    <MaterialAlert color="danger">{{ validateSocMed.message }}</MaterialAlert>
                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="ea_field" class="labels my-0">Social Media Name</label>
                            <select class="form-select form-select-md" v-model="selected.selected" @change="hanndleChange">
                                <option v-for="(v, k) in socMedsList" :value="k">{{v}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="soc_med_link" class="labels my-0">Social Media Link</label>
                            <input type="text" class="input-group-outline form-control  p-2" 
                                id="soc_med_link" v-model="data.soc_med"
                                maxlength="50"
                                @keyup="hanndleChange">
                        </div>
                    </div>
                </div>

            </template>

            <template #footer>
                
                <MaterialButton variant="contained" color="white" size="sm" class="command-btn mb-0" 
                @click="validate('edit')"
                :class="{disabled: isDisableBtn}">
                    update
                </MaterialButton> <span>&nbsp;</span>

                <MaterialButton variant="contained" color="white" size="sm" class="no-btn mb-0" @click="$emit('close')">
                    Cancel
                </MaterialButton>

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
                
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="$emit('continueEdit', 'soc_med')">
                    Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="$emit('close')">
                    no
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

            <template #body>
                <slot name="body">Error!</slot>
            </template>

            <template #footer>
                
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="handleDelete('yes')">
                    Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="handleDelete('no')">
                    no
                </MaterialButton>

            </template>

        </StandardModal>
        
    </div>

</template>

<style scoped>
    .modal {
        background-color: rgba(0, 0, 0, 0.5);
        display: block;
        transition: opacity 0.3s ease;
    }
    .modal-dialog{
        max-width: 400px;
    }
    .modal-content {
        transition: all 0.3s ease;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter-from {
        opacity: 0;
    }

    .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-from .modal-content,
    .modal-leave-to .modal-content {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
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
    .verify_soc_med{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verify_soc_med:hover{
        background-color: #4caf50;
    }
    .verified_soc_med{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        background-color: #4caf50;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verified_soc_med:hover{
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