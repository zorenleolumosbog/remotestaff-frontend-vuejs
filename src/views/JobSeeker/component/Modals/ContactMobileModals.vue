<script setup>

    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import Loader from "@/components/Loader.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";

    import examples from 'libphonenumber-js/mobile/examples'
    import { 
        getExampleNumber, 
        isValidPhoneNumber, 
        getCountryCallingCode, 
        getCountries, 
        parsePhoneNumber } 
        from 'libphonenumber-js/mobile';

</script>

<script>

    export default {
        name: "ContactMobilesModals",
        props: ['show', 'selectedMobile', 'type', 'selectedIndex', 'isPrimaryMobile', 'hasPrimary', 'validateMobile'],

        data() {
            return {
                isValidMobile: false,
                isValidMobileMsg: '',
                loaderSaveUpdate: false,
                preferredCountries:['PH','AU','CA','GB'],
                countryCode: {'country': 'PH', 'code': '', 'example': '9051234567'},
                mobile: { 
                    'number': '', 
                    'primary': this.isPrimaryMobile,
                    'isNewPrimary': false
                },
                mobileResult: "",
                isDisableBtn: true,
                isValid: "default-border",
            }
        },

        methods: {
            handleDelete ( action ){
                if(action == 'yes'){
                    this.$emit('deleteMobile', this.selectedIndex);
                }else{ this.$emit('close') }
            },

            validate( action ){
                let number = '+' + getCountryCallingCode(this.countryCode.country) + this.mobile.number;
                this.mobile.number = number;

                console.log(this.mobile.primary)
                console.log(this.isPrimaryMobile)
                this.mobile.isNewPrimary = (this.hasPrimary == true 
                    && ( this.mobile.primary != this.isPrimaryMobile )) 
                    ? true : false;

                if ( !this.mobile.primary ) {
                    this.mobile.isNewPrimary = false;
                }

                if(action == 'add'){
                    this.$emit('addMobile', this.mobile);
                }else{
                    this.mobile['index'] = this.selectedIndex;
                    this.$emit('updateMobile', this.mobile);
                }
            
                this.isValidMobile = false;
                this.isValidMobileMsg = "";
                
            },

            setPrimary () {
                this.mobile.primary = !this.mobile.primary;
                this.isDisableBtn = this.isValid == 'isInvalid' ? true : false;
            },

            validateMobileNumber ( number = false ) {

                let mobileNumber = String(number ? number : this.mobile.number);
                if ( isValidPhoneNumber( mobileNumber, this.countryCode.country ) ) {
                    this.isValid = 'isValid';
                    this.isDisableBtn = false;
                } else {
                    this.isValid = 'isInvalid';
                    this.isDisableBtn = true;
                }

            },

            handleChangeCode () {

                this.countryCode.example = getExampleNumber(this.countryCode.country, examples)

                this.validateMobileNumber();

            },

            hanndleChange () {
                
                this.validateMobileNumber();

            },

            setDefaultValue () {  
                
                if ( this.selectedMobile ){
                    const selectedMobile = this.selectedMobile;
                    const parsedNumber = parsePhoneNumber(selectedMobile);
                    this.countryCode.country = parsedNumber.country;
                    this.mobile.number = parsedNumber.nationalNumber;

                    this.validateMobileNumber( this.selectedMobile )
                }
            }

        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');  
            this.setDefaultValue();
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

                <div class="row mb-2 mx-0" v-if="validateMobile.isAdded == true">
                    <MaterialAlert color="danger">{{ validateMobile.message }}</MaterialAlert>
                </div>

                <div class="row my-3">

                    <div class="form-group col-4 col-md-4 code">
                        <label for="email_address" class="labels my-0">Code</label>
                        <select class="form-select form-select-md" 
                            v-model="countryCode.country"
                            :class="isValid"
                            @change="handleChangeCode">
                            <option v-for="item in preferredCountries" :value="item">
                                {{item}} +{{getCountryCallingCode(item)}}
                            </option>
                        </select>
                    </div>

                    <div class="form-group col-8 col-md-8 number">
                        <label for="mobile_number" class="labels my-0">Mobile number</label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="mobile_number"
                            v-model="mobile.number"
                            :class="isValid"
                            @keyup="hanndleChange"
                            autocomplete="off">
                            <span class="example-number">Ex: {{countryCode.example.nationalNumber 
                            ? countryCode.example.nationalNumber : countryCode.example }}</span>
                    </div>

                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-check form-switch d-flex align-items-center ps-4.5">
                            <input class="form-check-input" id="flexSwitchCheckDefault" type="checkbox" 
                            :checked="mobile.primary" 
                            @click="setPrimary" 
                            :disabled="isDisableBtn">
                            <label class="form-check-label d-block ms-3 mb-0" for="flexSwitchCheckDefault"> Primary </label>
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

                <div class="row mb-2 mx-0" v-if="validateMobile.isAdded == true">
                    <MaterialAlert color="danger">{{ validateMobile.message }}</MaterialAlert>
                </div>

                <div class="row my-3">

                    <div class="form-group col-4 col-md-4 code">
                        <label for="email_address" class="labels my-0">Code</label>
                        <select class="form-select form-select-md" 
                            v-model="countryCode.country"
                            :class="isValid"
                            @change="handleChangeCode">
                            <option v-for="item in preferredCountries" :value="item">
                                {{item}} +{{getCountryCallingCode(item)}}
                            </option>
                        </select>
                    </div>

                    <div class="form-group col-8 col-md-8 number">
                        <label for="mobile_number" class="labels my-0">Mobile number</label>
                        <input type="number" class="input-group-outline form-control  p-2" 
                            id="mobile_number"
                            v-model="mobile.number"
                            :class="isValid"
                            @keyup="hanndleChange"
                            autocomplete="off">
                            <span class="example-number">Ex: {{countryCode.example.nationalNumber 
                            ? countryCode.example.nationalNumber : countryCode.example }}</span>
                    </div>
                    
                </div>

                <div class="row mb-2">
                    <div class="col-12">
                        <div class="form-check form-switch d-flex align-items-center ps-4.5">
                            <input class="form-check-input" id="flexSwitchCheckDefault" type="checkbox" 
                            :checked="mobile.primary" 
                            @click="setPrimary">
                            <label class="form-check-label d-block ms-3 mb-0" for="flexSwitchCheckDefault"> Primary </label>
                        </div>
                    </div>
                </div>

            </template>

            <template #footer>
                
                <MaterialButton variant="contained" color="white" size="sm" class="command-btn mb-0" @click="validate('edit')"
                :class="{disabled: isDisableBtn}">
                    update
                </MaterialButton> <span>&nbsp;</span>

                <MaterialButton variant="contained" color="white" size="sm" class="no-btn mb-0" @click="$emit('close')">
                    Cancel
                </MaterialButton>

            </template>

        </StandardModal>

    </div>

    <div v-if="type=='confirm'">

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
                
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="$emit('continueEdit', 'mobile')">
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
                
                <div v-if="!isPrimaryMobile">
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

</template>

<style scoped>
    .input-group-outline {
        background-color: #ededed !important;
    }

    .verify_mobile{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verify_mobile:hover{
        background-color: #4caf50;
    }
    .verified_mobile{
        padding: 2px 10px;
        font-size: small;
        color: #6a6a6a !important;
        background-color: #4caf50;
        border: 2px solid #4caf50;
        border-radius: 20px;
    }
    .verified_mobile:hover{
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
        border: 0px;
    }
    .error_msg {
        font-size: 0.9em;
        color: #9c0404;
    }
    .example-number {
        font-size: 0.9em;
        color: #7b809a;
    }
    .code {
        padding-right: 4px;
    }
    .number {
        padding-left: 4px;
    }
    .default-border {
        border: 1px  solid;
        border-color: #ededed !important
    }
    .isValid {
        border: 1px solid;
        border-color: #4caf50 !important
    }
    .isInvalid {
        border: 1px solid;
        border-color: #9c0404 !important
    }

</style>