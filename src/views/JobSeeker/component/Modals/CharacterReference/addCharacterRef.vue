<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import examples from 'libphonenumber-js/mobile/examples';
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
        name: "AddCharRef",
        props: ['show'],
        data(){
            return{
                char_ref_errors:{
                    cr_name: '',
                    cr_prof_relation: '',
                    cr_yearsknown:'',
                    cr_company:'',
                    cr_contact: '',
                    cr_email: '',
                },
                char_ref_form:{
                    name:'',
                    prof_relation: '',
                    years_known:'',
                    company:'',
                    contact: '',
                    email: '',
                    jobseeker_id: '',
                    id:'',
                    type:'',
                },
                preferredCountries:['PH','AU','CA','GB'],
                countryCode: {'country': 'PH', 'code': '', 'example': '9051234567'},
                //Mobile
                mobile: { 
                    'number': ''
                },
                isValid: "default-border",
                showError:false,
                loader:false
            }
        },
        methods:{
            emptyField(data){
                //console.log(data == "" || data == null);
                return data == "" || data == null;
            },
            numberOnly(data){
                return !/^[0-9]*$/.test(data);
            },
            invalidEmail(data){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data);
            },
            checkMobile(data){
                return /^(09|\+639)\d{9}$/.test(data);
            },
            addMobile (){
                let number = '+' + getCountryCallingCode(this.countryCode.country) +''+ this.mobile.number;
                this.char_ref_form.contact = number;
            },
            validateMobileNumber ( number = false ) {
                //console.log(mobileNumber);
                let mobileNumber = String(number ? number : this.mobile.number);

                //console.log(isValidPhoneNumber( mobileNumber, this.countryCode.country ));
                if(this.emptyField(this.mobile.number)){
                    this.isValid = 'isInvalid';
                    this.char_ref_errors.cr_contact = "This field is required.";
                    //this.showSuccess=false;
                    this.showError = true;
                    this.loader = false;
                }
                else if ( isValidPhoneNumber( mobileNumber, this.countryCode.country ) == false ) {
                    this.isValid = 'isInvalid';
                    //console.log('invalid number')
                    this.char_ref_errors.cr_contact = "Enter a valid contact number.";
                    this.showSuccess=false;
                    this.showError = true;
                    this.loader = false;
                    // this.isDisableBtn = false;
                } 

            
                /*else {
                    this.isValid = 'isInvalid';
                    //console.log('invalid number')
                    this.char_ref_errors.cr_contact = "Enter a valid contact number.";
                    this.showSuccess=false;
                    this.showError = true;
                    this.loader = false;
                    // this.isDisableBtn = true;
                }*/

            },


                // validateLandlineNumber ( number = false ) {

                // let landlineNumber =  String(number ? number : this.landline.number);
                // if ( isValidPhoneNumber( landlineNumber, this.countryCode.country ) ) {
                //   this.isValid = 'isValid';
                //     console.log('valid number')
                //     this.showError = false;
                // } else {
                //     this.isValid = 'isInvalid';
                //     console.log('invalid number')
                //     this.jobseeker_errors.landline_no = "Invalid number";
                //     this.showSuccess=false;
                //     this.showError = true;
                // }

                // },

            handleChangeCode () {

                this.countryCode.example = getExampleNumber(this.countryCode.country, examples);
                this.validateMobileNumber();
            // this.validateLandlineNumber();

            },

            handleChange () {
                //console.log('hey');
                this.validateMobileNumber();
            },
                // this.validateLandlineNumber();
            clearAddForm(){
                this.char_ref_form.name='';
                this.char_ref_form.prof_relation= '';
                this.char_ref_form.years_known='';
                this.char_ref_form.company='';
                this.char_ref_form.contact= '';
                this.char_ref_form.email= '';
                this.char_ref_form.jobseeker_id= '';
                this.char_ref_form.type='';
            },
            clearErrorMessage(){
                this.char_ref_errors.cr_name='';
                this.char_ref_errors.cr_prof_relation= '';
                this.char_ref_errors.cr_yearsknown='';
                this.char_ref_errors.cr_company='';
                this.char_ref_errors.cr_contact= '';
                this.char_ref_errors.cr_email= '';
            },
            validate(){
                let data = this.char_ref_form;
                //this.loader = true;
                this.showError = false;
                this.clearErrorMessage();
                //console.log(this.showError);
                if(this.emptyField(data.name)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_name = "This field is required."
                }
                if(this.emptyField(data.prof_relation)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_prof_relation = "This field is required."
                }
                if(this.emptyField(data.years_known)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_yearsknown = "This field is required."
                }
                if(this.emptyField(data.company)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_company = "This field is required."
                }
                if(this.emptyField(data.email)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_email = "This field is required."
                }
                if(!this.invalidEmail(data.email)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_email = "Enter a valid email."
                }
                if(this.numberOnly(data.years_known)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_yearsknown = "Years known should only contain numbers"
                }
                //console.log(this.showError);
                /*if(!this.checkMobile(data.contact)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_contact = "Enter a valid contact number.";
                }*/
                this.validateMobileNumber();
                //console.log(this.showError);
            },
            handleAdd(){
                let data = this.char_ref_form;
                this.loader = true;
                this.showError = false;
                this.clearErrorMessage();
                if(this.emptyField(data.name)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_name = "This field is required."
                }
                if(this.emptyField(data.prof_relation)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_prof_relation = "This field is required."
                }
                if(this.emptyField(data.years_known)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_yearsknown = "This field is required."
                }
                if(this.emptyField(data.company)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_company = "This field is required."
                }
                if(this.emptyField(data.email)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_email = "This field is required."
                }
                if(!this.invalidEmail(data.email)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_email = "Enter a valid email."
                }
                if(this.numberOnly(data.years_known)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_yearsknown = "Years known should only contain numbers"
                }
                /*if(!this.checkMobile(data.contact)){
                    this.showError = true;
                    this.loader = false;
                    this.char_ref_errors.cr_contact = "Enter a valid contact number.";
                }*/
                this.validateMobileNumber();

                if(this.showError == false){
                    this.addMobile();
                    data.contact = this.char_ref_form.contact;
                    data.type = 'add';
                    this.$emit( 'add-character', data);
                    this.clearAddForm();
                }
            },

        }
    }
  
</script>
<template>
    <StandardModal 
        :show="show"
        :hasClose=true
        :hasHeader='!loader'
        :hasFooter='!loader'
        title="Add Character Reference"
        :size="(loader == true) ? 'dialog-md':'dialog-xl'"
        :isScrollable=true>

            <template #body>
                <Loader v-if="loader"></Loader>
                <div class="form-group" v-if="!loader">
                    <label for="name" class="labels my-0">Name</label>
                    <input
                        id="name"
                        class="input-group-outline form-control p-2"
                        type="text"
                        v-model="char_ref_form.name"
                        maxlength="100"
                        @change="validate"
                    />
                    <span class="error-font" v-if="showError">{{char_ref_errors.cr_name}}</span>
                </div>
                <div class="form-group" v-if="!loader">
                    <label for="profRel" class="labels my-0">Professional Relationship</label>
                    <input
                        id="profRel"
                        class="input-group-outline form-control p-2"
                        type="text"
                        v-model="char_ref_form.prof_relation"
                        maxlength="30"
                        @change="validate"
                    />
                    <span class="error-font" v-if="showError">{{char_ref_errors.cr_prof_relation}}</span>
                </div>
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-6">
                            <label for="compName" class="labels my-0">Company Name</label>
                            <input
                                id="compName"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="char_ref_form.company"
                                maxlength="20"
                                @change="validate"
                            />
                            <span class="error-font" v-if="showError">{{char_ref_errors.cr_company}}</span>
                        </div>
                        <div class="col-sm-6">
                            <label for="yearKnown" class="labels my-0">Years Known</label>
                            <input
                                id="yearKnown"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="char_ref_form.years_known"
                                maxlength="20"
                                @change="validate"
                            />
                            <span class="error-font" v-if="showError">{{char_ref_errors.cr_yearsknown}}</span>
                        </div>
                    </div>
                </div>
                <div class="form-group" v-if="!loader">
                    <label for="email" class="labels my-0">Email</label>
                    <input
                        id="email"
                        class="input-group-outline form-control p-2"
                        type="email"
                        v-model="char_ref_form.email"
                        maxlength="50"
                        @change="validate"      
                    />
                    <span class="error-font" v-if="showError">{{char_ref_errors.cr_email}}</span>
                </div>
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-2">
                            <label for="email_address" class="labels my-0">Code</label>
                            <select class="form-select form-select-md input-group-outline p-2" 
                            v-model="countryCode.country"
                            @change="handleChangeCode">
                                <option v-for="item in preferredCountries" :value="item">
                                    {{item}} +{{getCountryCallingCode(item)}}
                                </option>
                            </select>
                        </div>
                        <div class="col-10">
                            <label for="mobile_number" class="labels my-0">Mobile Number</label>
                            <input type="tel" class="input-group-outline form-control p-2" id="mobile_number" 
                            v-model="mobile.number" autocomplete="off"
                            :placeholder='countryCode.example.nationalNumber 
                            ? countryCode.example.nationalNumber : countryCode.example'
                            @change="validate"/>
                            <span class="error-font" v-if="showError">{{char_ref_errors.cr_contact}}</span>
                        </div>
                        <!--<div class="col-sm-2 px-2 ps-lg-3">
                            <div class="row px-auto" >
                                <div class="pt-1 px-0">
                                <label for="email_address" class="labels my-0">Code</label>
                                </div>
                                <div class="p-1">
                                <select class="form-select form-select-md input-group-outline p-2" v-model="countryCode.country" :class="isValid">
                                    <option v-for="item in preferredCountries" :value="item">
                                        {{item}} +{{getCountryCallingCode(item)}}
                                    </option>
                                </select>
                                </div>
                            </div>
                        </div>-->
                        <!--<div class="col-sm-6 ps-lg-4">
                            <div class="row">
                                <div class="pt-1 px-0">
                                    <label for="mobile_number" class="labels my-0">Mobile number <span class="asterisk">*</span></label>
                                </div>
                                <div class="p-1">
                                    <input type="tel" class="input-group-outline form-control p-2" id="mobile_number" v-model="mobile.number" :class="isValid" autocomplete="off" maxlength="10">
                                    <span class="error-font" v-if="showError">{{jobseeker_errors.mobile_no}}</span>
                                   <span class="exampleNumber">Ex: {{countryCode.example.nationalNumber ? countryCode.example.nationalNumber : countryCode.example }}</span> 
                                </div>
                            </div>
                        </div>-->
                    </div>
                    <!--
                    <label for="contactNum" class="labels my-0">Contact Number</label>
                    <input
                            id="contactNum"
                            class="input-group-outline form-control p-2"
                            type="text"
                            v-model="char_ref_form.contact"
                            maxlength="20"
                            placeholder="+639 or 09"
                        />-->
                    
                </div>
            </template>
            
            <template #footer>
                <MaterialButton variant="gradient" color="white" class="command-btn mb-0" @click="handleAdd">
                    Save
                </MaterialButton>
              
            </template>

    </StandardModal>
    
</template>
<style scoped>
    .error-font{
        color:red !important;
        font-size: x-small;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>