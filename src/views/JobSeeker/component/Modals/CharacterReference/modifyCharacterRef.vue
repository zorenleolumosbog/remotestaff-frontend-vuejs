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
        name: "ModifyCharRef",
        props: ['show','data','confirm'],
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
                storedCharRef:{data:''},
                preferredCountries:['PH','AU','CA','GB'],
                countryCode: {'country': 'PH', 'code': '', 'example': '9051234567'},
                //Mobile
                mobile: { 
                    'number': ''
                },
                isValid: "default-border",
                showError:false,
                loader:false,
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
            addMobile (){
                let number = '+' + getCountryCallingCode(this.countryCode.country) +''+ this.mobile.number;
                this.char_ref_form.contact = number;
            },
            validateMobileNumber ( number = false ) {

                let mobileNumber = String(number ? number : this.mobile.number);
                if(this.emptyField(mobileNumber)){
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
                    //this.showSuccess=false;
                    this.showError = true;
                    this.loader = false;
                } 
                /*else {
                    this.isValid = 'isInvalid';
                    //console.log('invalid number')
                    this.char_ref_errors.cr_contact = "Enter a valid contact number.";
                    //this.showSuccess=false;
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

                this.validateMobileNumber();
            },
            validate(){
                let data = this.char_ref_form;
                //this.loader = true;
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
                    this.char_ref_errors.cr_yearsknown = "Years known should only contain numbers."
                }
               
                this.validateMobileNumber();
                //console.log(this.showError);
            },
            handleModify(){
                this.loader = false;
                this.validate();
                //console.log(this.showError);
                if(this.showError == false){
                    this.addMobile();
                    let data = this.char_ref_form;
                    data.contact = this.char_ref_form.contact;
                    data.type = 'edit';
                    this.$emit( 'modify-character', data);
                    this.clearAddForm();
                }
            },
            cancel(){
                
                this.addMobile();
                if(this.storedCharRef.data != JSON.stringify(this.char_ref_form)){
                   
                  
                    let data = this.char_ref_form;
                    data.contact = this.char_ref_form.contact;
                    data.type = 'edit';
                    this.$emit('dialog',data);
                }
                else{
                    
                    this.$emit('close');
                }
            },
        },
        mounted () {

            this.char_ref_form.name=this.data.name;
            this.char_ref_form.prof_relation= this.data.prof_relation;
            this.char_ref_form.years_known=this.data.years_known;
            this.char_ref_form.company=this.data.company;
            this.char_ref_form.contact= this.data.contact_mobile;
            this.char_ref_form.email= this.data.contact_email;
            this.char_ref_form.jobseeker_id= this.data.jobseeker_id;
            this.char_ref_form.id=this.data.id;
            this.char_ref_form.type=this.data.type;
            const parsedNumber = parsePhoneNumber(this.char_ref_form.contact);
            
            this.countryCode.country = parsedNumber.country;
            this.mobile.number = parsedNumber.nationalNumber;
            this.storedCharRef.data = JSON.stringify(this.char_ref_form);
            if(this.confirm){
                this.validate();
                if(this.showError == false){
                    this.addMobile();
                    let data = this.char_ref_form;
                    data.contact = this.char_ref_form.contact;
                    data.type = 'edit';
                    this.$emit( 'modify-character', data);
                    this.clearAddForm();
                }
            }
        }
    }
</script>
<template>
    <StandardModal 
        @close="cancel"
        :show="show" 
        :hasClose=true
        :hasHeader='!loader'
        :hasFooter='!loader'
        title="Character Reference"
        :size="(loader == true) ? 'dialog-md':'dialog-xl'"
        :isScrollable=true>

        <template #body>
            
            <div class="form-group"  v-if="!loader">
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
                        <label for="mobile_number" class="labels my-0">Mobile Number </label>
                        <input type="tel" class="input-group-outline form-control p-2" id="mobile_number" 
                        v-model="mobile.number" autocomplete="off"
                        :placeholder='countryCode.example.nationalNumber 
                        ? countryCode.example.nationalNumber : countryCode.example'
                        @change="validate"
                         />
                        <span class="error-font" v-if="showError">{{char_ref_errors.cr_contact}}</span>
                    </div>
                    
                </div>
            </div>
            
            <!--<div class="form-group" v-if="!loader">
                <label for="contactNum" class="labels my-0">Contact Number</label>
                <input
                    id="contactNum"
                    class="input-group-outline form-control p-2"
                    type="text"
                    v-model="char_ref_form.contact"
                    maxlength="14"
                    placeholder="+639 or 09"
                />
                <span class="error-font" v-if="showError">{{char_ref_errors.cr_contact}}</span>
            </div>-->
            
        </template>

        <template #footer>
            <MaterialButton variant="gradient" color="white" class="command-btn mb-0" @click="handleModify">
                Update
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