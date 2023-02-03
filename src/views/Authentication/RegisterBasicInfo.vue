 
 <script setup>
 import MaterialInput from "@/components/MaterialInput.vue";
 import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
 import MaterialButton from "@/components/MaterialButton.vue";
 import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
 import SocialAuthentication from "../SocialAuthentication/TheJobseeker.vue";
 import StandardModal from "@/components/Modals/StandardModal.vue";
 import MaterialAlert from "@/components/MaterialAlert.vue";
 import Loader from "@/components/Loader.vue";
 import api  from "@/static/config.json";
 import axios from 'axios';
 import successLogo from "@/assets/img/Vectorcheck.svg";

 
 import setMaterialInput from "@/assets/js/material-input"; 
 import moment from 'moment';
 import Cookies from 'js-cookie';
 import examples from 'libphonenumber-js/mobile/examples'
    import { 
        getExampleNumber, 
        isValidPhoneNumber, 
        getCountryCallingCode, 
        getCountries, 
        parsePhoneNumber } 
        from 'libphonenumber-js/mobile';

 const { type } = useWindowsWidth();
 const { width } = useWindowsWidth();
</script>

<script>
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
    export default {
        components: {
            Datepicker
        },
        data(){
            return{
                API_URL:'',
                token: '',
                pageSlug: '',
                pageTitle: '',
                showError:false,
                //Contact Info
                isValidMobile: false,
                isValidLandline: false,
                isValidMobileMsg: '',
                
                loaderSaveUpdate: false,
                preferredCountries:['PH','AU','CA','GB'],
                countryCode: {'country': 'PH', 'code': '', 'example': '9051234567'},
                //Mobile
                mobile: { 
                    'number': ''
                },
                mobileResult: "",
                //Landline
                landline: { 
                    'number': ''  
                },
                landlineResult: "",
                isDisableBtn: true,
                isValid: "default-border",

                validateMobile: {'isAdded': false, 'message': ''},
                validateLandline: {'isAdded': false, 'message': ''},

                //Basic Infos
                jobseeker_errors:{
                    firstname:'',
                    middlename:'',
                    lastname:'',
                    birthdate:'',
                    civilstatus:'',
                    religion:'',
                    sss_id:'',
                    philhealth_id:'',
                    pagibig_id:'',
                    tin:'',
                    home_addr_line1:'',
                    home_addr_line2:'',    
                    home_tc:'',
                    home_prov:'',
                    home_region:'',
                    home_country:'',
                    home_brgy:'',
                    prov_tc:'',
                    prov_prov:'',
                    prov_region:'',
                    prov_country:'',
                    prov_brgy:'',
                    mobile_no:'',
                    landline_no:''                                  
                },
                jobseeker:[
                    {
                        reg_firstname:'',
                        reg_middlename:'',
                        reg_lastname:'',
                        reg_birthdate:'',
                        reg_civilstatus:'',
                        reg_religion:'',
                        reg_sss_id:'',
                        reg_philhealthid:'',
                        reg_pagibigid:'',
                        reg_tin:'',
                        reg_prefix:'',
                        reg_gender:'',
                        reg_nationality:'',
                        reg_nickname:'',
                        reg_source:'',
                        reg_home_addr_line1:'',
                        reg_home_addr_line2:'',
                        reg_home_addr_towncity:'',
                        reg_prov_addr_line1:'',
                        reg_prov_addr_line2:'',
                        reg_prov_addr_towncity:'',
                        mobile_number:'',
                        landline_number:''
                    
                    }
                ],
                stored_info:{
                    firstname:'',
                    middlename:'',
                    lastname:'',
                    dob:'',
                    civil:'',
                    religion:'',
                    gender:'',
                    nationality:'',
                    ral1:'',
                    ral2:'',
                    rtc:'',
                    pal1:'',
                    pal2:'',
                    ptc:'',
                    sss:'',
                    philID:'',
                    pagibig:'',
                    tin:'',
                    prefix:'',
                    source:'',
                    nickname:'',
                    home_country:'',
                    home_region:'',
                    home_province:'',
                    home_zip:'',
                    home_brgy:'',
                    home_countryCode:'',
                    prov_country:'',
                    prov_region:'',
                    prov_province:'',
                    prov_zip:'',
                    prov_brgy:''
                },
                //final_job:[],
                prefixes:[
                    {value:'Mr.',display:'Mr.'},
                    {value:'Mrs.',display:'Mrs.'},
                    {value:'Ms.',display:'Ms.'},
                    {value:'Dr.',display:'Dr.'},
                    {value:'Miss',display:'Miss'},
                ],
                basicModalShow: false,
                birthdate:{
                    month:'',
                    day:'',
                    year:''
                },
                genders:[
                    {value:'male',display:'Male'},
                    {value:'female',display:'Female'},
                ],
                status:[
                ],
                town_citys:[],
                religions:[],
                sources:[
                ],
                nationalities:[
                    {value:1,display:'Filipino'},
                    {value:2,display:'Japanese'},
                    {value:3,display:'Korean'},
                ],
                // countries:[],
                // countries:{
                //   short_desc:''
                // },
                // regions:[],
                // provinces:[],
                // display_regions:[],     
                // display_provinces:[],
                // display_towncities:[],
                // display_prov_regions:[],     
                // display_prov_provinces:[],
                // display_prov_towncities:[],
                // display_brgy:[],
                // display_prov_brgy:[],
                // countryData:{
                //     home:[],
                //     province:[],
                // },
                countries:[],
                regions:[],
                provinces:[],
                display_regions:[],     
                display_provinces:[],
                display_towncities:[],
                display_prov_regions:[],     
                display_prov_provinces:[],
                display_prov_towncities:[],
                display_brgy:[],
                display_prov_brgy:[],
                countryData:{
                    home:[],
                    province:[],
                    homeTownCity:[],
                    provTownCity:[],
                },
                dataHome:{},
                dataProv:{},
                currentYear:0,
                index:0,
                display:{
                    gender:'',
                    national:'',
                    source:'',
                    prov_towncity:'',                
                    towncity:'',
                    religion:'',
                    civil:'',
                    bday:'',
                    country:'',
                    region:'',
                    province:'',
                    prov_country:'',
                    prov_region:'',
                    prov_province:'',
                    brgy:'',
                    prov_brgy:'',
                },
                homeAddress:{
                    country:'',
                    region:'',
                    province:'',
                    zipCode:'',
                    brgy:'',
                },
                provAddress:{
                    prov_country:'',
                    prov_region:'',
                    prov_province:'',
                    prov_zipCode:'',
                    prov_brgy:'',
                },
                showSuccess:false,
                liftState:false,
                copyAddress:{data:false,},
                showDialog:false,
                loader:false,
                loaderFront:false,
                // format:'yyyy-MM-dd',
                format:'dd-MM-yyyy',
                regionDisabled:{
                    home_data:true,
                    prov_data:true,
                },
                countryLoad:{
                    home:false,
                    prov:false,
                    homeState:false,
                    provState:false,
                }
            }
            
        },
        methods:{
          //mobile
        //   addLandline (){
        //         let number = '+' + getCountryCallingCode(this.countryCode.country) + this.landline.number;
        //         this.jobseeker.landline_number = number;
        //         },
            
          //profile
          profileSuccess() {
                this.$router.push(`/login/${this.pageSlug}`);
            },


            letterOnly(data){
                return /^[a-zA-ZÑñ .,]*$/.test(data);
            },
            numberOnly(data){
                return /^[0-9]*$/.test(data);
            },
            alphaNumericOnly(data){
                return /^[a-zA-Z0-9 ]*$/.test(data);
            },
            addressValid(data){
                return /[`!@$%^&*()_+\=\\|]/.test(data);
            },
            checkLength(data,length){
                return data.length <= length;
            },
            emptyField(data){
                return data == "" || data == null;
            },
            allSpaces(data){
                return data.s.indexOf(' ') <=0;
            },
            checkMobile(data){
                return /^(09|\+639)\d{9}$/.test(data);
            },
            clearErrors(){
                this.jobseeker_errors.firstname='';
                this.jobseeker_errors.middlename='';
                this.jobseeker_errors.lastname='';
                this.jobseeker_errors.birthdate='';
                this.jobseeker_errors.civilstatus='';
                this.jobseeker_errors.religion='';
                this.jobseeker_errors.sss_id='';
                this.jobseeker_errors.philhealth_id='';
                this.jobseeker_errors.tin='';
                this.jobseeker_errors.home_addr_line1='';
                this.jobseeker_errors.home_addr_line2='';
                this.jobseeker_errors.home_tc='';
                this.jobseeker_errors.home_prov='';
                this.jobseeker_errors.home_region='';
                this.jobseeker_errors.home_country='';
                this.jobseeker_errors.prov_tc='';
                this.jobseeker_errors.prov_prov='';
                this.jobseeker_errors.prov_region='';
                this.jobseeker_errors.prov_country=''; 
                this.jobseeker_errors.mobile_no='';
                this.jobseeker_errors.landline_no='';
            },
            filterItV1(search,array){
                let tempArray = array;
                try{
                    tempArray = tempArray.filter((item) => {
                        return item.value.toString()
                        ==search.toString()
                    });
                }catch(e){
                    
                    return '';
                }
                if(tempArray == null){
                    return '';
                }
                return tempArray[0].display;
            },
            filterIt(search,array,type){
                let tempArray = array;
                if(type == 'type1'){
                    try{
                        tempArray = tempArray.filter((item) => {
                            return item.id.toString()
                            ==search.toString()
                        });
                    }catch(e){
                        return '';
                    }
                    
                    if(tempArray == null){
                        return '';
                    }
                    return tempArray[0].description;
                }
                return '';
            },
            filterBasicInfos(){
    
                this.display.gender= this.filterItV1(this.jobseeker.reg_gender,this.genders);
                this.display.civil = this.filterIt(this.jobseeker.reg_civilstatus,this.status,'type1');
                this.display.national = this.filterItV1(this.jobseeker.reg_nationality,this.nationalities);
                
                this.display.religion = this.filterIt(this.jobseeker.reg_religion,this.religions,'type1');
                this.display.source = this.filterIt(this.jobseeker.reg_source,this.sources,'type1');
            },

             //mobile
            addMobile (){
                let number = '+' + getCountryCallingCode(this.countryCode.country) +''+ this.mobile.number;
                this.jobseeker.mobile_number = number;
            },

            validateMobileNumber ( number = false ) {

            let mobileNumber = String(number ? number : this.mobile.number);
            if(this.emptyField(this.mobile.number)){
                this.isValid = 'isInvalid';
                this.jobseeker_errors.mobile_no = "This field is required.";
                //this.showSuccess=false;
                this.showError = true;
                this.loader = false;
            }
            else if ( isValidPhoneNumber( mobileNumber, this.countryCode.country ) ) {
                this.isValid = 'isValid';
                //console.log('valid number')
                this.showError = false;
                // this.isDisableBtn = false;
            } else {
                this.isValid = 'isInvalid';
                //console.log('invalid number')
                this.jobseeker_errors.mobile_no = "Enter a valid contact number.";
                this.showSuccess=false;
                this.showError = true;
                this.loader = false;
                // this.isDisableBtn = true;
            }

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

                this.countryCode.example = getExampleNumber(this.countryCode.country, examples)
                this.validateMobileNumber();
                // this.validateLandlineNumber();

                },

                hanndleChange () {

                this.validateMobileNumber();
                this.validateFields();
                this.validateBirthDate();
                // this.validateLandlineNumber();

            },

            onUpdatePost(){
              
                // let token = localStorage.getItem('token');
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const token = urlParams.get('token');
                this.token = token;
                const ID = localStorage.getItem('userid');
                let infotype = 'basic';
                let data_insert = this.jobseeker;

                
                this.showError=false;
                this.clearErrors();
                if(this.letterOnly(data_insert.reg_firstname) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.firstname = "First Name should not contain special characters.";                   
                }
                if(this.letterOnly(data_insert.reg_middlename) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.middlename = "Middle Name should not contain special characters.";                   
                }
                if(this.letterOnly(data_insert.reg_lastname) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.lastname = "Last Name should not contain special characters.";                   
                }
                if(this.emptyField(data_insert.reg_firstname)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.firstname = "First Name is required.";
                }
                if(this.emptyField(data_insert.reg_lastname)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.lastname = "Last Name is required.";
                }
                
                this.validateMobileNumber();
                this.validateFields();
                // this.validateLandlineNumber();
                this.validateHomeTownCity();
                this.validateProvTownCity();
                this.validateBirthDate();

                // this.getCountries();

                console.log(this.showError);
                if(this.showError==false){
                    this.addMobile();
                    // this.addLandline();
                    this.loader = true;
                    let date_conv = this.setDateFormat(data_insert.reg_birthdate);
                    
                    if(this.showDialog == true){
                        this.basicModalShow = false;
                    }

                    axios.post(this.API_URL+'/preregister/onboarding',
                    { 
                        jobseeker_id:ID,
                        token: token,
                        info_type:infotype,
                        prefix:data_insert.reg_prefix,
                        nickname:data_insert.reg_nickname,
                        first_name:data_insert.reg_firstname,
                        middle_name:data_insert.reg_middlename,
                        last_name:data_insert.reg_lastname,
                        birthdate:date_conv,
                        civil_status:data_insert.reg_civilstatus,
                        religion:data_insert.reg_religion,
                        sss_id:data_insert.reg_sss_id,
                        philhealth_id:data_insert.reg_philhealthid,
                        pagibig_id:data_insert.reg_pagibigid,
                        tin:data_insert.reg_tin,
                        gender:data_insert.reg_gender,
                        nationality:data_insert.reg_nationality,
                        source:data_insert.reg_source,
                        address_1:data_insert.reg_home_addr_line1,
                        address_2:data_insert.reg_home_addr_line2,
                        town_city:data_insert.reg_home_addr_towncity,
                        province_address_1:data_insert.reg_prov_addr_line1,
                        province_address_2:data_insert.reg_prov_addr_line2,
                        province_towncity:data_insert.reg_prov_addr_towncity,
                        mobile_number: this.jobseeker.mobile_number,
                        landline_number: this.jobseeker.landline_number
                        
                        // },
                        // {
                        // headers:{
                        //     'Authorization': `Bearer ${token}`
                        // }
                    }).then((response)=>{
                        this.loader = false;
                        this.basicModalShow = false;
                        this.showDialog = false;
                        data_insert.reg_birthdate = date_conv;
                        this.clearDisplay();
                        this.setData(data_insert);
                        this.setDisplayDate(data_insert.reg_birthdate);
                        // this.filterBasicInfos();
                        this.copyAddress.data = false;
                        this.showSuccess = true;
                        console.log('sucessfully updated')
                        // this.$router.push('/:registrantType/login');
                        
                    }).catch((err)=>{
                            console.log(err)
                        // if(err.response.status == 401){
                        //     alert('Session Expired.Please Relogin.');
                        //     localStorage.removeItem('userid');
                        //     localStorage.removeItem('token');
                        //     this.$router.push('/'); 
                        // }
                   });
                }
               
               
            },
            // validateBirthDate(){
            //     let birth_date = this.setDateFormat(this.jobseeker.reg_birthdate);
            //     let current = this.getCurrentDate();
            //     if(this.emptyField(this.jobseeker.reg_birthdate)){
            //         this.showError = true;
            //         this.showDialog = false;
            //         this.jobseeker_errors.birthdate = "Birthdate is required.";
            //     }
            //     else if ( birth_date > current ){
            //         this.showError = true;
            //         this.showDialog = false;
            //         this.jobseeker_errors.birthdate = "Invalid birthdate.";
            //     }
            // },

            //birthdate
            
            validateBirthDate() {
            var dateString = document.getElementById("date")?.value;
            if(dateString !="")
            {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                var da = today.getDate() - birthDate.getDate();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if(m<0){
                    m +=12;
                }
                if(da<0){
                    da +=30;
                }
                
            if(age < 18 || age > 65)
            {
            console.log("Age "+age+" is not allowed");
            
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.birthdate = "Invalid Birthdate.";

            } else {

            // alert("Age "+age+" is allowed");
            console.log("Age "+age+" is allowed");
            }
            } else {
            // alert("please provide your date of birth");
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.birthdate = "Birthdate is required.";
            }
            },


            //validation on fields
            validateFields(){
                if(this.emptyField(this.homeAddress.country)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_country = "Country is required.";
                } 

                // if(this.emptyField(this.countryData.home.with_region)){
                //     this.showError = true;
                //     this.showDialog = false;
                //     this.jobseeker_errors.home_region = "Region is required.";
                //     console.log('ASDSA')
                // }

                // if(this.countryData.home.with_region == 1){
                //     this.showError = false;
                //     this.showDialog = false;
                //     this.jobseeker_errors.home_region = "true";
                // }
                // if(!this.countryData.home.with_region){
                //     this.showError = true;
                //     this.showDialog = false;
                //     this.jobseeker_errors.home_region = "Region is required.";  
                //     console.log('region required')
                // }
                
                if(this.countryData.home.with_region == this.emptyField(this.homeAddress.region)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_region = "Region is required.";  
                    console.log('region required')
                } else {
                    console.log('no error')
                }
                
                if(!this.countryData.home.with_region == this.homeAddress.region){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_region = "Region is required.";  
                    console.log('region required')
                } else {
                    console.log('no error')
                }
                // if(!this.homeAddress.region){
                //     this.showError = true;
                //     this.showDialog = false;
                //     this.jobseeker_errors.home_region = "Region is required.";  
                //     console.log('region required')
                // }


                if(this.emptyField(this.homeAddress.province)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_prov = "Province is required.";
                }
                if(this.emptyField(this.jobseeker.reg_home_addr_towncity)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_tc = "Town/City is required.";
                }
                if(this.emptyField(this.jobseeker.reg_home_addr_line1)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_addr_line1 = "Address 1 is required.";
                }

                if(this.addressValid(this.jobseeker.reg_home_addr_line1)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_addr_line1 = "Address 1 should not contain special characters.";
                }
                if(this.addressValid(this.jobseeker.reg_home_addr_line2)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_addr_line2 = "Address 2 should not contain special characters.";
                }
                if(this.emptyField(this.mobile.number)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.mobile_no = "Mobile Number is required.";
                }
            },
            validateHomeTownCity(){
                if((this.jobseeker.reg_home_addr_towncity == '')&&(this.emptyField(this.homeAddress.country) == false)&&(this.emptyField(this.homeAddress.region))
                &&(this.emptyField(this.homeAddress.province))){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_region = "This field is required.";
                    this.jobseeker_errors.home_prov = "This field is required.";
                    this.jobseeker_errors.home_tc = "This field is required.";
                }
                else if((this.jobseeker.reg_home_addr_towncity == '')&&(this.emptyField(this.homeAddress.country) == false)&&(this.emptyField(this.homeAddress.region)==false)
                &&(this.emptyField(this.homeAddress.province))){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_prov = "This field is required.";
                    this.jobseeker_errors.home_tc = "This field is required.";
                }
                else if((this.jobseeker.reg_home_addr_towncity == '')&&(this.emptyField(this.homeAddress.country) == false)&&(this.emptyField(this.homeAddress.region)==false)
                &&(this.emptyField(this.homeAddress.province)==false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.home_tc = "This field is required.";
                }
            },
            validateProvTownCity(){
                if((this.jobseeker.reg_prov_addr_towncity == '')&&(this.emptyField(this.provAddress.prov_country) == false)&&(this.emptyField(this.provAddress.prov_region))
                &&(this.emptyField(this.provAddress.prov_province))){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.prov_region = "This field is required.";
                    this.jobseeker_errors.prov_prov = "This field is required.";
                    this.jobseeker_errors.prov_tc = "This field is required.";
                }
                else if((this.jobseeker.reg_prov_addr_towncity == '')&&(this.emptyField(this.provAddress.prov_country) == false)&&(this.emptyField(this.provAddress.prov_region)==false)
                &&(this.emptyField(this.provAddress.prov_province))){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.prov_prov = "This field is required.";
                    this.jobseeker_errors.prov_tc = "This field is required.";
                }
                else if((this.jobseeker.reg_prov_addr_towncity == '')&&(this.emptyField(this.provAddress.prov_country) == false)&&(this.emptyField(this.provAddress.prov_region)==false)
                &&(this.emptyField(this.provAddress.prov_province)==false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.prov_tc = "This field is required.";
                }
            },
            toggleModal(){
                setMaterialInput();
                this.basicModalShow = !this.basicModalShow;
                if(this.basicModalShow == false){
                    this.showDialog = false;
                    this.showError = false;
                    this.clearErrors();
                    this.restoreData();
                }
            },
            toggleDialog(){
                this.showDialog = !this.showDialog;
            },
            toggleSuccess(){
                this.showSuccess= !this.showSuccess;
            },
            putData(data){
                this.stored_info.firstname=data.reg_firstname;
                this.stored_info.middlename=data.reg_middlename;
                this.stored_info.lastname=data.reg_lastname;
                this.stored_info.dob=data.reg_birthdate;
                this.stored_info.civil=data.reg_civilstatus;
                this.stored_info.religion=data.reg_religion;
                this.stored_info.gender=data.reg_gender;
                this.stored_info.birthdate = data.reg_birthdate;
                this.stored_info.nationality=data.reg_nationality;
                this.stored_info.ral1=data.reg_home_addr_line1;
                this.stored_info.ral2=data.reg_home_addr_line2;
                this.stored_info.rtc=data.reg_home_addr_towncity;
                this.stored_info.pal1=data.reg_prov_addr_line1;
                this.stored_info.pal2=data.reg_prov_addr_line2;
                this.stored_info.ptc=data.reg_prov_addr_towncity;
                this.stored_info.sss=data.reg_sss_id;
                this.stored_info.philID=data.reg_philhealthid;
                this.stored_info.pagibig=data.reg_pagibigid;
                this.stored_info.tin=data.reg_tin;
                this.stored_info.prefix=data.reg_prefix;
                this.stored_info.source=data.reg_source;
                this.stored_info.nickname=data.reg_nickname;
                this.stored_info.home_country = this.homeAddress.country;
                this.stored_info.home_region = this.homeAddress.region;
                this.stored_info.home_province = this.homeAddress.province;
                this.stored_info.home_zip = this.homeAddress.zipCode;
                this.stored_info.prov_country = this.provAddress.prov_country;
                this.stored_info.prov_region = this.provAddress.prov_region;
                this.stored_info.prov_province = this.provAddress.prov_province;
                this.stored_info.prov_zip = this.provAddress.prov_zipCode;
                //console.log(this.provAddress.prov_country);
                //this.restoreData();
            },
            openDialog(){
                this.checkData();
                if(this.showDialog == false){
                    this.toggleModal();
                }
            },
            checkData(){
                if (this.jobseeker.reg_firstname != this.stored_info.firstname ||
                this.jobseeker.reg_middlename != this.stored_info.middlename ||
                this.jobseeker.reg_lastname != this.stored_info.lastname ||
                this.jobseeker.reg_birthdate != this.stored_info.dob ||
                this.jobseeker.reg_civilstatus != this.stored_info.civil ||
                this.jobseeker.reg_religion != this.stored_info.religion ||
                this.jobseeker.reg_gender != this.stored_info.gender ||
                this.jobseeker.reg_birthdate != this.stored_info.birthdate ||
                this.jobseeker.reg_nationality != this.stored_info.nationality ||
                this.jobseeker.reg_home_addr_line1 != this.stored_info.ral1 ||
                this.jobseeker.reg_home_addr_line2 != this.stored_info.ral2 ||
                this.jobseeker.reg_home_addr_towncity != this.stored_info.rtc ||
                this.jobseeker.reg_prov_addr_line1 != this.stored_info.pal1 ||
                this.jobseeker.reg_prov_addr_line2 != this.stored_info.pal2 ||
                this.jobseeker.reg_prov_addr_towncity != this.stored_info.ptc ||
                this.jobseeker.reg_sss_id != this.stored_info.sss ||
                this.jobseeker.reg_philhealthid != this.stored_info.philID ||
                this.jobseeker.reg_pagibigid != this.stored_info.pagibig ||
                this.jobseeker.reg_tin != this.stored_info.tin ||
                this.jobseeker.reg_prefix != this.stored_info.prefix ||
                this.jobseeker.reg_source != this.stored_info.source ||
                this.jobseeker.reg_nickname != this.stored_info.nickname){
                    this.showDialog = true;
                }
            },
            async restoreData(){
                // this.clearDisplayProvAddress(3);
                this.clearDisplayHomeAddress(3);
                this.jobseeker.reg_firstname = this.stored_info.firstname;
                this.jobseeker.reg_middlename = this.stored_info.middlename;
                this.jobseeker.reg_lastname=this.stored_info.lastname;
                this.jobseeker.reg_birthdate=this.stored_info.dob;
                this.jobseeker.reg_civilstatus=this.stored_info.civil;
                this.jobseeker.reg_religion=this.stored_info.religion;
                this.jobseeker.reg_gender=this.stored_info.gender;
                this.jobseeker.reg_birthdate = this.stored_info.birthdate;
                this.jobseeker.reg_nationality=this.stored_info.nationality;
                this.jobseeker.reg_home_addr_line1=this.stored_info.ral1;
                this.jobseeker.reg_home_addr_line2=this.stored_info.ral2;
                this.jobseeker.reg_home_addr_towncity=this.stored_info.rtc;
                this.jobseeker.reg_prov_addr_line1=this.stored_info.pal1;
                this.jobseeker.reg_prov_addr_line2=this.stored_info.pal2;
                this.jobseeker.reg_prov_addr_towncity=this.stored_info.ptc;
                this.jobseeker.reg_sss_id=this.stored_info.sss;
                this.jobseeker.reg_philhealthid=this.stored_info.philID;
                this.jobseeker.reg_pagibigid=this.stored_info.pagibig;
                this.jobseeker.reg_tin=this.stored_info.tin;
                this.jobseeker.reg_prefix=this.stored_info.prefix;
                this.jobseeker.reg_source=this.stored_info.source;
                this.jobseeker.reg_nickname=this.stored_info.nickname;
                this.homeAddress.region = this.stored_info.home_region;
                this.homeAddress.country = this.stored_info.home_country;
                this.homeAddress.countryCode = this.stored_info.home_countryCode;
                this.homeAddress.province = this.stored_info.home_province;
                this.homeAddress.zipCode = this.stored_info.home_zip;
                this.provAddress.prov_region = this.stored_info.prov_region;
                this.provAddress.prov_country = this.stored_info.prov_country;
                this.provAddress.prov_province = this.stored_info.prov_province;
                this.provAddress.prov_zipCode = this.stored_info.prov_zip;
                
                // await this.getCountryAddresses('home',this.homeAddress.country);
                // this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
                // this.display_towncities = this.filterTowncity(this.display_provinces,this.homeAddress.province);
                // await this.getCountryAddresses('prov',this.provAddress.prov_country);
                // this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                // this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
                // this.copyAddress.data = false;
                //this.setDate();
                //console.log('');
                await this.getCountryAddresses('home',this.homeAddress.country);
                this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
                this.display_towncities = this.filterTowncity(this.display_provinces,this.homeAddress.province);

                await this.getCountryAddresses('prov',this.provAddress.prov_country);
                this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
                this.copyAddress.data = false;
                //this.setDate();
            },
            async setData(data){
                //console.log(data.reg_prov_addr_towncity);
                //this.jobseeker = [];
                this.jobseeker.reg_firstname = data.reg_firstname;
                this.jobseeker.reg_middlename = data.reg_middlename;
                this.jobseeker.reg_lastname= data.reg_lastname;
                this.jobseeker.reg_birthdate=data.reg_birthdate;
                this.jobseeker.reg_civilstatus=data.reg_civilstatus;
                this.jobseeker.reg_religion=data.reg_religion;
                this.jobseeker.reg_gender=data.reg_gender;
                this.jobseeker.reg_nationality=data.reg_nationality;
                this.jobseeker.reg_home_addr_line1=data.reg_home_addr_line1;
                this.jobseeker.reg_home_addr_line2=data.reg_home_addr_line2;
                this.jobseeker.reg_home_addr_towncity=data.reg_home_addr_towncity;
                this.jobseeker.reg_prov_addr_line1=data.reg_prov_addr_line1;
                this.jobseeker.reg_prov_addr_line2=data.reg_prov_addr_line2;
                this.jobseeker.reg_prov_addr_towncity=data.reg_prov_addr_towncity;
                this.jobseeker.reg_sss_id= data.reg_sss_id;
                this.jobseeker.reg_philhealthid= data.reg_philhealthid;
                this.jobseeker.reg_pagibigid=data.reg_pagibigid;
                this.jobseeker.reg_tin=data.reg_tin;
                this.jobseeker.reg_prefix=data.reg_prefix;
                this.jobseeker.reg_source=data.reg_source;
                this.jobseeker.reg_nickname=data.reg_nickname;
                //console.log(this.jobseeker.reg_home_addr_towncity);
                //console.log(this.jobseeker.reg_prov_addr_towncity);
                //console.log('');
                if(this.jobseeker.reg_home_addr_towncity){
                    await this.populatePreHomeData();
                }
                if(this.jobseeker.reg_prov_addr_towncity){
                    await this.populatePreProvinceData();
                }
                //console.log(this.display.prov_towncity);
                //console.log(this.provAddress.prov_country);
                this.putData(this.jobseeker);
            },
            clearDisplay(){
                this.display.gender='';
                this.display.national='';
                this.display.source='';
                this.display.prov_towncity='';                
                this.display.towncity='';
                this.display.religion='';
                this.display.civil='';
                this.display.bday='';
                this.display.country='';
                this.display.countryCode='';
                this.display.region='';
                this.display.province='';
                this.display.prov_country='';
                this.display.prov_region='';
                this.display.prov_province='';
                
            },
            setDateFormat(value){
                var d = new Date(value),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');
            },
            getCurrentDate(){
                var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');
            },
            setDisplayDate(date){
                this.display.bday = moment(this.jobseeker.reg_birthdate).format("MMMM D, YYYY");
            },
            async copyHomeToProv(){
                this.copyAddress.data = !this.copyAddress.data;
                if(this.copyAddress.data == true){
                    this.display_prov_regions = [];
                    this.clearDisplayProvAddress(3);
                    this.jobseeker.reg_prov_addr_line1 = this.jobseeker.reg_home_addr_line1;
                    this.jobseeker.reg_prov_addr_line2 = this.jobseeker.reg_home_addr_line2;
                    this.jobseeker.reg_prov_addr_towncity= this.jobseeker.reg_home_addr_towncity;
                    this.provAddress.prov_province = this.homeAddress.province;
                    this.provAddress.prov_zipCode =  this.homeAddress.zipCode;
                    
                    this.provAddress.prov_country = this.homeAddress.country;
                    
                    
                    await this.getCountryAddresses('prov',this.provAddress.prov_country);
                    this.provAddress.prov_region =  this.countryData.prov.with_region == 0? this.provAddress.prov_country:this.homeAddress.region;
                    this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                    this.getProvinceAddresses('prov',this.provAddress.prov_province);
                    //this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
                }
                else{
                    this.display_prov_regions = [];
                    this.clearDisplayProvAddress(3);
                    this.jobseeker.reg_prov_addr_line1 = this.stored_info.pal1;
                    this.jobseeker.reg_prov_addr_line2 = this.stored_info.pal2;
                    this.jobseeker.reg_prov_addr_towncity= this.stored_info.ptc;
                    this.provAddress.prov_province = this.stored_info.prov_province;
                    this.provAddress.prov_zipCode =  this.stored_info.prov_zip;
                    this.provAddress.prov_region =  this.stored_info.prov_region;
                    this.provAddress.prov_country = this.stored_info.prov_country;
                    
                    await this.getCountryAddresses('prov',this.provAddress.prov_country);
                    this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                    this.getProvinceAddresses('prov',this.provAddress.prov_province);
                    //this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
                }
            },
            filterProvince(country,search){
                let array = [];
                if((search=='')||(!search)){ 
                    let arrayTemp = [];
                    array = arrayTemp;
  
                    return array;
                }
                if(country.with_region == 0){
                    return country.states;
                }
                //console.log(search);
                let tempArray = country.regions;
                
                try{
                    tempArray = tempArray.filter((item) => {
                        if(item.id)
                            return item.id.toString()
                            ==search.toString()
                    });
                }catch(e){
                    //console.log(e);
                    return array;
                }
                
                if(tempArray == null){
                    return array;
                }
                array = tempArray[0].states;
                
                return array;
            },
            filterTowncity(array,search){
                let arrayTemp = [];
                if((search=='')||(!search)){
                    
                    
                    return arrayTemp;
                }
                let tempArray = array;
                try{
                    tempArray = tempArray.filter((item) => {
                        if(item.id)
                            return item.id.toString() == search.toString()
                    });
                }catch(e){
                    return arrayTemp;
                }
                
                arrayTemp = tempArray[0].towncities;
                return arrayTemp;
            },
            filterBarangay(array,search){
                let arrayTemp = [];
                if((search=='')||(!search)){
                    
                    

                    return arrayTemp;
                }

                let tempArray = array;
                try{
                    tempArray = tempArray.filter((item) => {
                        if(item.id)
                            return item.id.toString() == search.toString()
                    });
                }catch(e){
                    return arrayTemp;
                }
                


                arrayTemp = tempArray[0].barangays;

                return arrayTemp;
            },
            getZipcode(array,search){
                if((search == '')||(!search)){
                    return '';
                }
                let tempArray = array;
                let stringFinal = '';
                try{
                    tempArray = tempArray.filter((item) => {
                        return item.id.toString()
                        ==search.toString()
                    });
                }catch(e){

                    return '';
                }
                try{
                    stringFinal = tempArray[0].zip_code.toString();
                }catch(e){
                    stringFinal = 'null';
                }
                return stringFinal;
            },

            clearDisplayHomeAddress(data){
                let tempArray = [];
                if(data == 1){
                    this.display_regions = tempArray;
                    this.display_provinces = tempArray;
                    this.display_towncities = tempArray;
                    this.homeAddress.region = '';
                    this.jobseeker.reg_home_addr_towncity = '';
                    this.homeAddress.province = '';
                    this.homeAddress.zipCode = '';
                }
                else if(data == 2){
                    this.display_provinces = tempArray;
                    this.display_towncities = tempArray;
                    this.homeAddress.province = '';
                    this.jobseeker.reg_home_addr_towncity = '';
                    this.homeAddress.zipCode = '';
                }
                else if(data == 3){
                    this.display_towncities = tempArray;
                    this.jobseeker.reg_home_addr_towncity = '';
                    this.homeAddress.zipCode = '';
                }
            },
            clearDisplayProvAddress(data){
                let tempArray = [];
                if(data == 1){
                    this.display_prov_regions = tempArray;
                    this.display_prov_provinces = tempArray;
                    this.display_prov_towncities = tempArray;
                    this.provAddress.prov_region='';
                    this.jobseeker.reg_prov_addr_towncity = '';
                    this.provAddress.prov_province = '';
                    this.provAddress.prov_zipCode = '';
                    
                }
                else if(data == 2){
                    this.display_prov_provinces = tempArray;
                    this.display_prov_towncities = tempArray;
                    this.jobseeker.reg_prov_addr_towncity = '';
                    this.provAddress.prov_province = '';
                    this.provAddress.prov_zipCode = '';
                }
                else if(data == 3){
                    this.display_prov_towncities = tempArray;
                    this.jobseeker.reg_prov_addr_towncity = '';
                    this.provAddress.prov_zipCode = '';
                }
            },
            async getTownCityInfo(data){
                // const token = localStorage.getItem('token');
                let responseData = {};
                await axios.get(this.API_URL+'/towncity/'+data,{
                    // headers:{
                    //     'Authorization': `Bearer ${token}`
                    // }
                }).then((response)=>{
                    //console.log(response.data.data); 
                    responseData = response.data.data;
                    //this.provinces = response.data;
                    
                });
                //console.log(responseData);
                return responseData;
            },
            async getAddressDropdown(type,data){
                let responseData = {};
                
                // const token = localStorage.getItem('token');
                
                if(type =='home'){
                    this.countryLoad.home = true;
                }
                else{
                    this.countryLoad.prov = true;
                }
                await axios.get(this.API_URL+'/country/'+data,{
                    // headers:{
                    //     'Authorization': `Bearer ${token}`
                    // }
                }).then((response)=>{
                    //console.log(response.data.data); 
                    responseData = response.data.data;
                    //this.provinces = response.data;
                    
                });
                //console.log(responseData);
                return responseData; 
            },

            async getTowncityDropdown(type,data){
                let responseData = {};
                
                // const token = localStorage.getItem('token');
                
                if(type =='home'){
                    this.countryLoad.home = true;
                    this.countryLoad.homeState = true;
                }
                else{
                    this.countryLoad.prov = true;
                    this.countryLoad.provState = true;
                }
                await axios.get(this.API_URL+'/state/'+data,{
                    // headers:{
                    //     'Authorization': `Bearer ${token}`
                    // }
                }).then((response)=>{
                    //console.log(response.data.data); 
                    responseData = response.data.data;
                    //this.provinces = response.data;
                    
                });
                //console.log(responseData);
                return responseData; 



            },
            // async populatePreHomeData(){
            //     this.dataHome = await this.getTownCityInfo(this.jobseeker.reg_home_addr_towncity);
                
            //     this.homeAddress.province = this.dataHome.state.id;
            //     this.homeAddress.zipCode =  this.dataHome.zip_code;
            //     this.homeAddress.region = this.dataHome.state.link_region_id == null ? this.dataHome.state.country.id:this.dataHome.state.region.id;
            //     this.homeAddress.country = this.dataHome.state.country.id;
            //     this.homeAddress.countryCode = this.dataHome.state.country.short_desc;
                
            //     this.display.towncity = this.dataHome.description;
            //     this.display.province = this.dataHome.state.description;
            //     this.display.region = this.dataHome.state.link_region_id == null ? '':this.dataHome.state.region.description;
            //     this.display.country =this.dataHome.state.country.long_desc;
            //     this.display.countryCode =this.dataHome.state.country.short_desc;  
            //     await this.getCountryAddresses('home',this.homeAddress.country);
            //     this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
            //     this.display_towncities = this.filterTowncity(this.display_provinces,this.homeAddress.province);
                
            // },

            async populatePreHomeData(){
                this.dataHome = await this.getTownCityInfo(this.jobseeker.reg_home_addr_towncity);
                
                this.homeAddress.province = this.dataHome.state.id;
                this.homeAddress.zipCode =  this.dataHome.zip_code;
                this.homeAddress.region = this.dataHome.state.link_region_id == null ? this.dataHome.state.country.id:this.dataHome.state.region.id;
                this.homeAddress.country = this.dataHome.state.country.id;
                
                this.display.towncity = this.dataHome.description;
                this.display.province = this.dataHome.state.description;
                this.display.region = this.dataHome.state.link_region_id == null ? '':this.dataHome.state.region.description;
                this.display.country =this.dataHome.state.country.long_desc; 

                await this.getCountryAddresses('home',this.homeAddress.country);
                this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
                this.getProvinceAddresses('home',this.dataHome.state.id);
                
                
            },
            // async populatePreProvinceData(){
            //     //console.log(this.jobseeker.reg_prov_addr_towncity);
            //     this.dataProv = await this.getTownCityInfo(this.jobseeker.reg_prov_addr_towncity);
            //     this.provAddress.prov_province = this.dataProv.state.id;
            //     this.provAddress.prov_zipCode =  this.dataProv.zip_code;
            //     this.provAddress.prov_region = this.dataProv.state.link_region_id == null ? this.dataProv.state.country.id:this.dataProv.state.region.id;
            //     this.provAddress.prov_country = this.dataProv.state.country.id;
            //     this.display.prov_towncity = this.dataProv.description;
            //     this.display.prov_province = this.dataProv.state.description;
            //     this.display.prov_region = this.dataProv.state.link_region_id == null ? '':this.dataProv.state.region.description; 
            //     this.display.prov_country = this.dataProv.state.country.long_desc; 
            //     await this.getCountryAddresses('prov',this.provAddress.prov_country);
            //     this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
            //     this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
            // },

            async populatePreProvinceData(){
                //console.log(this.jobseeker.reg_prov_addr_towncity);
                this.dataProv = await this.getTownCityInfo(this.jobseeker.reg_prov_addr_towncity);

                this.provAddress.prov_province = this.dataProv.state.id;
                this.provAddress.prov_zipCode =  this.dataProv.zip_code;
                this.provAddress.prov_region = this.dataProv.state.link_region_id == null ? this.dataProv.state.country.id:this.dataProv.state.region.id;
                this.provAddress.prov_country = this.dataProv.state.country.id;

                this.display.prov_towncity = this.dataProv.description;
                this.display.prov_province = this.dataProv.state.description;
                this.display.prov_region = this.dataProv.state.link_region_id == null ? '':this.dataProv.state.region.description; 
                this.display.prov_country = this.dataProv.state.country.long_desc; 

                await this.getCountryAddresses('prov',this.provAddress.prov_country);
                this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                this.getProvinceAddresses('prov',this.dataProv.state.id);
                //this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);

            },    
            async getCountryAddresses(type,countryId){
                if(!countryId){
                    return;
                }
                else{
                    if(type == "home"){
                    
                        this.countryData.home = [];
                        this.countryData.home = await this.getAddressDropdown(type,countryId);
                        if(this.countryData.home.with_region == 0){
                            this.display_provinces = this.countryData.home.states;
                            this.regionDisabled.home_data = true;
                            this.countryLoad.home = false;
                            this.display_prov_brgy=false;
                            this.liftState=true;
                        }
                        else{
                            this.display_regions = this.countryData.home.regions;
                            this.regionDisabled.home_data = false;
                            this.countryLoad.home = false;
                            this.liftState=false;
                        }
                    }
                    else{
                        this.countryData.prov = [];
                        this.countryData.prov = await this.getAddressDropdown(type,countryId);
                        if(this.countryData.prov.with_region == 0){
                            this.display_prov_provinces = this.countryData.prov.states;
                            this.regionDisabled.prov_data = true;
                            this.countryLoad.prov = false;
                        }
                        else{
                            this.display_prov_regions = this.countryData.prov.regions;
                            this.regionDisabled.prov_data = false;
                            this.countryLoad.prov = false;
                        }
                    }
                }
                
                    
            },

            async getProvinceAddresses(type,statesId){
                if(!statesId){
                    return;
                }
                else{
                    if(type == "home"){
                    
                        this.countryData.homeTownCity = [];
                        this.countryData.homeTownCity = await this.getTowncityDropdown(type,statesId);
                        this.display_towncities = this.countryData.homeTownCity.towncities;
                        this.countryLoad.home = false;
                        this.countryLoad.homeState = false;
                        
                    }
                    else{
                        this.countryData.provTownCity = [];
                        this.countryData.provTownCity = await this.getTowncityDropdown(type,statesId);
                        this.display_prov_towncities = this.countryData.provTownCity.towncities;
                        this.countryLoad.prov = false;
                        this.countryLoad.provState = false;
                    }
                }
                
                    
            },
            async getReligions(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/admin/religion',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{  
                    this.religions = response.data.data.data;
                    
                    
                
                });
            },
            async getSources(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/admin/job-source',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    this.sources = response.data.data.data;
                    
                });
            },
            async getCivilStatus(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/admin/civil-status',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    this.status = response.data.data.data;
                    
                    
                });
                
            },
             getTownCityDisplay(data){
                // const token = localStorage.getItem('token');
                let responseData = {};
                axios.post(this.API_URL+'/towncity/'+data,{
                    // headers:{
                    //     'Authorization': `Bearer ${token}`
                    // }
                }).then((response)=>{
                    
                    responseData = response.data.data;

                }).catch((err)=>{
                    // console.log(err);
                    return '';
 
                    
                });
                return responseData;
            }
        
        },
       async mounted () { 
            //set chooseable year to current year below
            // date.max = new Date().toISOString().split("T")[0];
            date.max = new Date().toLocaleDateString('en-ca');

           
            setMaterialInput();
            // this.getTownCitys();

            this.API_URL = api.DEV_API_URL;
            switch(this.$route.params.registrantType) {
              case 'jobseeker':
                  this.pageSlug = 'jobseeker',
                  this.pageTitle = 'Jobseeker Registration';
                  break;
              case 'admin':
                  this.pageSlug = 'admin',
                  this.pageTitle = 'Corporate Apps Registration';
                  break;
              case 'client':
                  this.pageSlug = 'client',
                  this.pageTitle = 'Client Registration';
                  break;
              default:
                  this.$router.push('/');
            }
            // const token = localStorage.getItem('token');
            // const ID = localStorage.getItem('userid');
            const info_type = "basic";
            // const list = phInfoJson;
            let date_array = [];
            let date_String = "";

            if (Cookies.get('userid') !== undefined) {
                localStorage.setItem('userid', Cookies.get('userid'));
                Cookies.remove('userid', { domain: 'remotestaff.com' });
            }

            let start_year=1901;

            await axios.get(this.API_URL+'/country',{
                      }).then((response)=>{
                          this.countries = response.data.data.data;
                      });    

            await axios.get(this.API_URL+'/validate-preregister/onboarding/' + localStorage.getItem('userid'))
            .then((response)=>{
                if(response.data.success) {
                    switch (true) {
                        case this.$route.params.registrantType === 'jobseeker' && response.data.data.registrant_type === 1:
                        case this.$route.params.registrantType === 'admin' && response.data.data.registrant_type === 3:
                        case this.$route.params.registrantType === 'client' && response.data.data.registrant_type === 4:
                            
                            break;
                    
                        default:
                            this.$router.push(`/login/${this.$route.params.registrantType}`);
                            break;
                    }
                } else {
                    this.$router.push(`/login/${this.$route.params.registrantType}`);
                }
            }); 
                      
        }
    }
</script> 

<template>

 <!-- Left Side Background -->
  <div class="container-fluid p-0 overflow-hidden">
      <div class="row" v-if="type =='desktop'">
         <div class="col-md-4 rs-background">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-6" v-if="!showSuccess">
             <div class="container mx-2 px-7">
                 <div class="row">
                     <div class="col-12 text-left">
                        <h3 class="login-title text-center font-colors mt-0 my-3"> {{ pageTitle }} </h3>
                         <div class="form-row py-5">
                                    <div class="row mt-0 stick-alert">
										<div class="col-12 mt-n5" v-if="showError">
											  <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" style="font-family:'Inter-Light'; text-align: center;" >
												  Your form could not be saved. Please complete all the marked fields.
											  </MaterialAlert>
										</div>
									</div>



                                 <Loader v-if="loader"></Loader>
									  <div class="form-group" style="padding-right:22px;" v-if="!loader">
										  <div class="row px-1">
											  <div class="col-sm-4">
												  <label for="firstname" class="labels my-0">First Name <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
												  <input type="text" id="firstname" class="field form-control  p-2" style="text-transform: capitalize !important;" v-model="jobseeker.reg_firstname" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.firstname}}</span>
											  </div>
											  <div class="col-sm-4">
												  <label for="middlename" class="labels my-0">Middle Name</label><!--<span class="asterisk">*</span>-->
												  <input type="text" id="middlename" class="field form-control  p-2" style="text-transform: capitalize !important;" v-model="jobseeker.reg_middlename" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.middlename}}</span>
											  </div>
											  <div class="col-sm-4">
												  <label for="lastname" class="labels my-0">Last Name <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
												  <input type="text" id="lastname" class="field form-control  p-2" style="text-transform: capitalize !important;" v-model="jobseeker.reg_lastname" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.lastname}}</span>
											  </div>
										  </div>
									  </div>

                                      <div class="row padding-header mx-auto"  v-if="!loader" >
										  <div class="col-md-12" >

                                            <div class="form-group mt-2" style="padding-right:18px;">
												  <div class="row px-1">
													  <div class="col-sm-4">
														  <div class="row">
															  <div class="pt-1 px-0 pb-1">
                                                                <label for="" class="labels my-0">Date of Birth <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
															  </div>
															  <div class="p-0 mt-1">
                                                                <!-- <Datepicker v-model="jobseeker.reg_birthdate" :format="format" :enableTimePicker="false" class="birth" required></Datepicker> -->
                                                                <div class="input-group-date w-95" id="datepicker">
                                                                    <input type="date" 
                                                                           class="form-control field" 
                                                                           id="date"
                                                                           v-model="jobseeker.reg_birthdate"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                                                                </div>
												                <span class="error-font" v-if="showError">{{jobseeker_errors.birthdate}}</span>
															  </div>
														  </div>
													  </div>
                                                      <div class="col-sm-2 px-2 ps-lg-3">
														  <div class="row px-auto" >
															  <div class="pt-1 px-0">
																<label for="email_address" class="labels my-0">Code</label><!--<span class="asterisk">*</span>-->
															  </div>
															  <div class="p-1" style="margin-top:6px;">
																<!-- <select class="form-select form-select-md field" v-model="countryCode.country" :class="isValid">
																  <option v-for="item in preferredCountries" :value="item">
																	  {{item}} +{{getCountryCallingCode(item)}}
																  </option>
																</select> -->
                                                                <select class="form-select form-select-md field" 
                                                                v-model="countryCode.country"
                                                                @change="handleChangeCode">
                                                                    <option v-for="item in preferredCountries" :value="item">
                                                                        {{item}} +{{getCountryCallingCode(item)}}
                                                                    </option>
                                                                </select>
															  </div>
														  </div>
													  </div>
                                                      <div class="col-sm-6 ps-lg-4">
														  <div class="row">
																<div class="pt-1 px-0">
																  <label for="mobile_number" class="labels my-0">Mobile number <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
																</div>
																<div class="p-1">
																  <!-- <input type="tel" class="field form-control  p-2" id="mobile_number" v-model="mobile.number" :class="isValid" autocomplete="off" maxlength="10"> -->
                                                                  <input type="tel" class="field form-control  p-2" id="mobile_number" 
                                                                  v-model="mobile.number" autocomplete="off"
                                                                  :placeholder='countryCode.example.nationalNumber ? countryCode.example.nationalNumber : countryCode.example'
                                                                  />
																  <span class="error-font" v-if="showError">{{jobseeker_errors.mobile_no}}</span>
																  <!-- <span class="exampleNumber">Ex: {{countryCode.example.nationalNumber ? countryCode.example.nationalNumber : countryCode.example }}</span> -->
																</div>
														  </div>
													  </div>

												  </div>
									        </div>

											  <div class="form-group mt-2" style="padding-right:22px;" v-if="!loader">
												  <div class="row px-1">
													  <div class="col-sm-12">
														  <div class="row">
															  <div class="pt-1 px-0">
																  <label for="address_1" class="labels my-0">Address Line 1</label><span class="asterisk">*</span>
															  </div>
															  <div class="p-0">
																  <input id="address_1" class="field form-control  p-2" type="text" v-model="jobseeker.reg_home_addr_line1" maxlength="50"/>
                                                                  <span class="error-font" v-if="showError">{{jobseeker_errors.home_addr_line1}}</span>
															  </div>
														  </div>
													  </div>
												  </div>
											  </div>
											  <div class="form-group mt-2" style="padding-right:22px;" v-if="!loader">
												  <div class="row px-1">
													  <div class="col-sm-12">
														  <div class="row">
															  <div class="pt-1 px-0">
																  <label for="address_2" class="labels my-0">Address Line 2</label>
															  </div>
															  <div class="p-0">
																  <input id="address_2" class="field form-control  p-2" type="text" v-model="jobseeker.reg_home_addr_line2" maxlength="50"/>
                                                                  <span class="error-font" v-if="showError">{{jobseeker_errors.home_addr_line2}}</span>
															  </div>
														  </div>
													  </div>
												  </div>
											  </div>
                                              
											</div> <!--End Tag col-md-12-->
										</div>  <!--end tag row padding-header-->

                                         <!--Location Dropdowns-->

                                         <div class="container-fluid px-1" id="location-container">
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="country" class="labels my-0">Country<span class="asterisk"> *</span>&nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.home && !countryLoad.homeState"></i></label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select class="form-select form-select-md field" v-model="homeAddress.country" 
                                                                    @change="clearDisplayHomeAddress(1); getCountryAddresses('home',homeAddress.country);"
                                                                    :disabled="countryLoad.home">
                                                                        <option :value="''" ></option>
                                                                        <option v-for="c in countries.sort((a, b) => a.long_desc.localeCompare(b.long_desc))" :value="c.id">{{c.long_desc}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_country}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 balance" v-if="!liftState">
                                                <div class="form-group" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item"> <!--v-if="regionDisabled.home_data == false"-->
                                                        <div class="col-sm-12">
                                                            <div class="row region-margin">
                                                                <div class="pt-1 px-0">
                                                                    <label for="region" class="labels my-0">Region <span class="asterisk"> *</span></label>
                                                                </div>
                                                                <div class="p-0 gx-0">
                                                                    <select class="form-select form-select-md field"  v-model="homeAddress.region" 
                                                                    @change="clearDisplayHomeAddress(2); display_provinces = filterProvince(countryData.home,homeAddress.region);"
                                                                    :disabled="countryLoad.home || !homeAddress.country"> <!--countryLoad.home-->
                                                                        <option :value="''"></option>
                                                                        <option v-for="d in display_regions.sort((a, b) => a.description.localeCompare(b.description))" :value="d.id">{{d.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_region}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                                <!--lift state to region-->
                                                <!-- <div v-else></div> -->
                                   
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="region" class="labels my-0 ">State/Province<span class="asterisk"> *</span> &nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.homeState"></i></label>
                                                                </div>
                                                                <!--disable state-->
                                                                <div class="p-0" v-if="!regionDisabled.home_data">
                                                                    <select :disabled="!homeAddress.region" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.province" 
                                                                    @change="clearDisplayHomeAddress(3); getProvinceAddresses('home',homeAddress.province);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="p in display_provinces.sort((a, b) => a.description.localeCompare(b.description))" :value="p.id">{{p.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_prov}}</span>   
                                                                </div>

                                                                <div class="p-0" v-else>
                                                                    <select :disabled="!homeAddress.country" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.province" 
                                                                    @change="clearDisplayHomeAddress(3); getProvinceAddresses('home',homeAddress.province);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="p in display_provinces.sort((a, b) => a.description.localeCompare(b.description))" :value="p.id">{{p.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_prov}}</span>   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="town_city" class="labels my-0">Town/City<span class="asterisk"> *</span></label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select :disabled="countryLoad.home || countryLoad.state || !homeAddress.province" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="jobseeker.reg_home_addr_towncity" @change="homeAddress.zipCode=getZipcode(display_towncities,jobseeker.reg_home_addr_towncity);
                                                                    display_brgy = filterBarangay(display_towncities,jobseeker.reg_home_addr_towncity);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="x in display_towncities.sort((a, b) => a.description.localeCompare(b.description))" :value="x.id">{{x.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_tc}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <!--<div class="form-group mt-2" v-if="!loader && display_brgy.length != 0">
                                                    <div class="row">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="col-5 pt-1">
                                                                    <label for="town_city" class="labels my-0">Barangay</label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select :disabled="countryLoad.home || countryLoad.state" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.brgy" >
                                                                        <option :value="''"></option>
                                                                        <option v-for="x in display_brgy" :value="x.id">{{x.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_brgy}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>-->
                                                <div class="form-group" style="margin-top:2px !important;" id="location-item" v-if="!loader"> <!--mt-auto-->
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="zip" class="labels my-0">Zip Code</label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <input
                                                                        id="zip"
                                                                        class="field form-control p-2"
                                                                        type="text"
                                                                        v-model="homeAddress.zipCode"
                                                                        :disabled="countryLoad.home || countryLoad.state"
                                                                        readonly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div> <!--end tag div location-container-->


                                        <!--Submit Button-->
                                        <div class="right-floater py-3 px-4">
											<MaterialButton variant="light" size="lg" class="mb-0 capitalize command-btn" @click="onUpdatePost" v-if="!loader">
												Register
											</MaterialButton>
										</div>
                         </div> <!--form-row py-3-->
                         
                     </div>
                 </div>
             </div>
         </div>

         <div class="col-md-8 pt-5"  v-else>
           <div class="text-center py-5" >
                <div class="reset">
                        <!-- <i class="fa fa-circle-check mt-8"></i> -->
                        <img
                            class="mb-n4"
                            :src="successLogo"
                            alt="title"
                            loading="lazy"
                            :style="{ height: '70px' }"> 
                    </div>
                    <h2 class="font-color-success">Success!</h2>
                        <p class="font-color-success mb-4 mt-3">
                            You are fully registered.
                        </p>

                    <material-button @click="profileSuccess" size="md" variant="light" class="command-btn mb-0 capitalize">
                            Login to your Account
                    </material-button>
            </div>
        </div>
         
         <!-- <div v-if="modals.fpModalShow" class="col-md-8 pt-5">
         </div> -->
      </div>


      <div v-else class="row" >
         <div class="col-md-4 rs-background min-height-mobile" v-if="width < '768'">
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-3" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-4 rs-background min-height-mobile-v2" v-else>
             <div class="justify-content-center" style="text-align: center;">
                 <img class="rs-logo mt-6" src="/src/assets/img/rs-logo-white.png" alt="Remotestaff" loading="lazy">
             </div>
         </div>
         <div class="col-md-8 pt-5" v-if="!showSuccess">
             <div class="container-fluid mx-1 px-2"> <!--Added px-7-->
                 <div class="row">
                     <div class="col-12 text-left">
                        <h3 class="login-title text-center font-colors mt-0 my-3"> {{ pageTitle }} </h3>
                         
                         <div class="form-row py-3">
                                    <!-- <div class="row mt-0 stick-alert">
										<div class="col-12">
											  <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" v-if="showError">
												  Your form could not be saved. Please complete all the marked fields.
											  </MaterialAlert>
										</div>
									</div> -->
                                    <div class="row mt-0 stick-alert">
										<div class="col-12 mt-n5" v-if="showError">
											  <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" style="font-family:'Inter-Light'; text-align: center;" >
												  Your form could not be saved. Please complete all the marked fields.
											  </MaterialAlert>
										</div>
									</div>



                                    <Loader v-if="loader"></Loader>
									  <div class="form-group" style="padding-right:22px;" v-if="!loader">
										  <div class="row">
											  <div class="col-sm-4">
												  <label for="firstname" class="labels my-0">First Name <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
												  <input id="firstname" class="field form-control  p-2" type="text" v-model="jobseeker.reg_firstname" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.firstname}}</span>
											  </div>
											  <div class="col-sm-4">
												  <label for="middlename" class="labels my-0">Middle Name</label><!--<span class="asterisk">*</span>-->
												  <input id="middlename" class="field form-control  p-2" type="text" v-model="jobseeker.reg_middlename" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.middlename}}</span>
											  </div>
											  <div class="col-sm-4">
												  <label for="lastname" class="labels my-0">Last Name <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
												  <input id="lastname" class="field form-control  p-2" type="text" v-model="jobseeker.reg_lastname" maxlength="30"/>
												  <span class="error-font" v-if="showError">{{jobseeker_errors.lastname}}</span>
											  </div>
										  </div>
									  </div>

                                      <div class="row padding-header mx-auto"  v-if="!loader" >
										  <div class="col-md-12" >

                                            <div class="form-group mt-2" style="padding-right:18px;">
												  <div class="row">
													  <div class="col-sm-4 col-12 mb-3">
														  <div class="row">
															  <div class="pt-1 px-0 pb-1">
                                                                <label for="" class="labels my-0">Date of Birth <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
															  </div>
															  <div class="px-1 mt-1">
                                                                <!-- <Datepicker v-model="jobseeker.reg_birthdate" :format="format" :enableTimePicker="false" class="birth" required></Datepicker> -->
                                                                <div class="input-group-date w-auto" id="datepicker">
                                                                    <input type="date" 
                                                                           class="form-control field" 
                                                                           id="date"
                                                                           v-model="jobseeker.reg_birthdate"
                                                                           :format="format" 
                                                                           :enableTimePicker="false" 
                                                                           style="font-size: 12pt; margin-top: 2px !important;"
                                                                           />
                                                                    <span class="input-group-append">
                                                                    </span>
                                                                </div>
												                <span class="error-font" v-if="showError">{{jobseeker_errors.birthdate}}</span>
															  </div>
														  </div>
													  </div>
                                                      <div class="col-sm-2 col-3 ps-lg-3">
														  <div class="row">
															  <div class="pt-1 px-2">
																<label for="email_address" class="labels my-0">Code</label><!--<span class="asterisk">*</span>-->
															  </div>
															  <div class="p-1" style="margin-top:6px;">
																<!-- <select class="form-select form-select-md field" v-model="countryCode.country" :class="isValid">
																  <option v-for="item in preferredCountries" :value="item">
																	  {{item}} +{{getCountryCallingCode(item)}}
																  </option>
																</select> -->
                                                                <select class="form-select form-select-md field" 
                                                                v-model="countryCode.country"
                                                                @change="handleChangeCode">
                                                                    <option v-for="item in preferredCountries" :value="item">
                                                                        {{item}} +{{getCountryCallingCode(item)}}
                                                                    </option>
                                                                </select>
															  </div>
														  </div>
													  </div>
                                                      <div class="col-sm-6 col-9 ps-lg-4">
														  <div class="row">
																<div class="pt-1 px-0">
																  <label for="mobile_number" class="labels my-0">Mobile number <span class="asterisk">*</span></label><!--<span class="asterisk">*</span>-->
																</div>
																<div class="p-1">
																  <!-- <input type="tel" class="field form-control  p-2" id="mobile_number" v-model="mobile.number" :class="isValid" autocomplete="off" maxlength="10"> -->
																  <input type="tel" class="field form-control  p-2" id="mobile_number" 
                                                                  v-model="mobile.number" autocomplete="off"
                                                                  :placeholder='countryCode.example.nationalNumber ? countryCode.example.nationalNumber : countryCode.example'
                                                                  />
                                                                  <span class="error-font" v-if="showError">{{jobseeker_errors.mobile_no}}</span>
																  <!-- <span class="exampleNumber">Ex: {{countryCode.example.nationalNumber ? countryCode.example.nationalNumber : countryCode.example }}</span> -->
																</div>
														  </div>
													  </div>

												  </div>
									        </div>

											  <div class="form-group mt-2" style="padding-right:22px;" v-if="!loader">
												  <div class="row">
													  <div class="col-sm-12">
														  <div class="row">
															  <div class="pt-1 px-0">
																  <label for="address_1" class="labels my-0">Address Line 1</label><span class="asterisk">*</span>
															  </div>
															  <div class="p-0">
																  <input id="address_1" class="field form-control  p-2" type="text" v-model="jobseeker.reg_home_addr_line1" maxlength="50"/>
                                                                  <span class="error-font" v-if="showError">{{jobseeker_errors.home_addr_line1}}</span>
															  </div>
														  </div>
													  </div>
												  </div>
											  </div>
											  <div class="form-group mt-2" style="padding-right:22px;" v-if="!loader">
												  <div class="row">
													  <div class="col-sm-12">
														  <div class="row">
															  <div class="pt-1 px-0">
																  <label for="address_2" class="labels my-0">Address Line 2</label>
															  </div>
															  <div class="p-0">
																  <input id="address_2" class="field form-control  p-2" type="text" v-model="jobseeker.reg_home_addr_line2" maxlength="50"/>
                                                                  <span class="error-font" v-if="showError">{{jobseeker_errors.home_addr_line2}}</span>
															  </div>
														  </div>
													  </div>
												  </div>
											  </div>
                                              
											</div> <!--End Tag col-md-12-->
										</div>  <!--end tag row padding-header-->

                                         <!--Location Dropdowns-->

                                         <div class="container-fluid px-0" id="location-container">
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="country" class="labels my-0">Country<span class="asterisk"> *</span>&nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.home && !countryLoad.homeState"></i></label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select class="form-select form-select-md field" v-model="homeAddress.country" 
                                                                    @change="clearDisplayHomeAddress(1); getCountryAddresses('home',homeAddress.country);"
                                                                    :disabled="countryLoad.home">
                                                                        <option :value="''" ></option>
                                                                        <option v-for="c in countries.sort((a, b) => a.long_desc.localeCompare(b.long_desc))" :value="c.id">{{c.long_desc}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_country}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 balance" v-if="!liftState">
                                                <div class="form-group" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item"> <!--v-if="regionDisabled.home_data == false"-->
                                                        <div class="col-sm-12">
                                                            <div class="row region-margin">
                                                                <div class="pt-1 px-0">
                                                                    <label for="region" class="labels my-0">Region <span class="asterisk"> *</span></label>
                                                                </div>
                                                                <div class="p-0 gx-0">
                                                                    <select class="form-select form-select-md field"  v-model="homeAddress.region" 
                                                                    @change="clearDisplayHomeAddress(2); display_provinces = filterProvince(countryData.home,homeAddress.region);"
                                                                    :disabled="countryLoad.home || !homeAddress.country"> <!--countryLoad.home-->
                                                                        <option :value="''"></option>
                                                                        <option v-for="d in display_regions.sort((a, b) => a.description.localeCompare(b.description))" :value="d.id">{{d.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_region}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                                <!--lift state to region-->
                                                <!-- <div v-else></div> -->
                                   
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="region" class="labels my-0 ">State/Province<span class="asterisk"> *</span> &nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.homeState"></i></label>
                                                                </div>
                                                                <!--disable state-->
                                                                <div class="p-0" v-if="!regionDisabled.home_data">
                                                                    <select :disabled="!homeAddress.region" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.province" 
                                                                    @change="clearDisplayHomeAddress(3); getProvinceAddresses('home',homeAddress.province);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="p in display_provinces.sort((a, b) => a.description.localeCompare(b.description))" :value="p.id">{{p.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_prov}}</span>   
                                                                </div>

                                                                <div class="p-0" v-else>
                                                                    <select :disabled="!homeAddress.country" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.province" 
                                                                    @change="clearDisplayHomeAddress(3); getProvinceAddresses('home',homeAddress.province);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="p in display_provinces.sort((a, b) => a.description.localeCompare(b.description))" :value="p.id">{{p.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_prov}}</span>   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group mt-2" id="location-item" v-if="!loader">
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="town_city" class="labels my-0">Town/City<span class="asterisk"> *</span></label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select :disabled="countryLoad.home || countryLoad.state || !homeAddress.province" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="jobseeker.reg_home_addr_towncity" @change="homeAddress.zipCode=getZipcode(display_towncities,jobseeker.reg_home_addr_towncity);
                                                                    display_brgy = filterBarangay(display_towncities,jobseeker.reg_home_addr_towncity);">
                                                                        <option :value="''"></option>
                                                                        <option v-for="x in display_towncities.sort((a, b) => a.description.localeCompare(b.description))" :value="x.id">{{x.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_tc}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <!--<div class="form-group mt-2" v-if="!loader && display_brgy.length != 0">
                                                    <div class="row">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="col-5 pt-1">
                                                                    <label for="town_city" class="labels my-0">Barangay</label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <select :disabled="countryLoad.home || countryLoad.state" 
                                                                    class="form-select form-select-md field" 
                                                                    v-model="homeAddress.brgy" >
                                                                        <option :value="''"></option>
                                                                        <option v-for="x in display_brgy" :value="x.id">{{x.description}}</option>
                                                                    </select>
                                                                    <span class="error-font" v-if="showError">{{jobseeker_errors.home_brgy}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>-->
                                                <div class="form-group" style="margin-top:2px !important;" id="location-item" v-if="!loader"><!--mt-auto-->
                                                    <div class="row" id="location-item">
                                                        <div class="col-sm-12">
                                                            <div class="row">
                                                                <div class="pt-1 px-0">
                                                                    <label for="zip" class="labels my-0">Zip Code</label>
                                                                </div>
                                                                <div class="p-0">
                                                                    <input
                                                                        id="zip"
                                                                        class="field form-control p-2"
                                                                        type="text"
                                                                        v-model="homeAddress.zipCode"
                                                                        :disabled="countryLoad.home || countryLoad.state"
                                                                        readonly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div> <!--end tag div location-container-->


                                        <!--Submit Button-->
                                        <div class="right-floater py-3 px-4">
											<MaterialButton variant="light" size="lg" class="mb-0 capitalize command-btn" @click="onUpdatePost" v-if="!loader">
												Register
											</MaterialButton>
										</div>
                                 
                         </div> <!--form-row py-3-->
                            
                     </div>
                 </div>
             </div>
         </div>

         <div class="col-md-8 pt-5"  v-else>
            <div class="text-center py-5" >
                <div class="reset">
                        <!-- <i class="fa fa-circle-check mt-8"></i> -->
                        <img
                            class="mb-n4"
                            :src="successLogo"
                            alt="title"
                            loading="lazy"
                            :style="{ height: '70px' }"> 
                    </div>
                    <h2 class="font-color-success">Success!</h2>
                        <p class="font-color-success mb-4 mt-3">
                            You are fully registered.
                        </p>

                    <material-button @click="profileSuccess" size="md" variant="light" class="command-btn mb-0 capitalize">
                            Login to your Account
                    </material-button>
            </div>
        </div>
      </div>

      
      
  </div>

  <!--Success Modal-->
        <!-- <StandardModal 
            :show="showSuccess" 
            @close="showSuccess = false"
            :hasClose=false
            :hasHeader=false
            :hasFooter=true
            title="Dialog"
            size="dialog-sm"
            :isScrollable=true>

            <template #body>
                <h5 class="text-center">Profile Successfully Added</h5>
            </template>
            <template #footer>
                <material-button @click="profileSuccess" size="sm" variant="contained" color="success" class="mb-0 me-2">
                    Proceed to Login Page
                </material-button>
            </template>
            

        </StandardModal> -->
  
</template>



<style scoped>


#location-container{
    display: flex;
    flex-wrap: wrap;
}

#location-item{
    width: 100%;
}

#location-container > #location-item {
  flex: 0 50%; /* or - flex: 0 50% - or - flex-basis: 50% - */
  /*demo*/
  /* box-shadow: 0 0 0 1px black;s */
  /* margin-bottom: 10px; */
  padding: 10px;

}
#location-container > #location-item1 {
  white-space:inherit;

}

#region-margin-top{
    margin-top: 1.2rem !important;
    padding-left: 10px;
}
/* 
.child{
    flex: 0 0 300px;
} */

/* .region-width{
    width: 100%;
} */

.region-margin{
    margin-top: 1.2rem;
    margin-left:auto;
    /* min-width: 417px;
    width: auto; */
}

.balance{
    width: 49%;
}
.size{
        min-width: 25%;
        width: auto;
    }
.form-select:disabled {
    /* color: #6c757d; */
    background-color: #f7f7f7;
}



.others{
 color:#5E44FF !important;
}
.others:hover{
 font-weight: bold;
}

a{
 cursor: pointer;
}
.rs-background{
 background-image: url('@/assets/img/landing-page-banner-thumb.f80af095.jpg');
 background-repeat: no-repeat;
 background-size: cover;
 display: block;
 /* width: 100%; */
 min-height: 100vh;
}
.margin-bottom{
 margin-bottom: 2%;
}

.min-height-mobile{
 min-height: 10vh !important;
 height:auto;
 width:100%;
}

.input-width-desktop{
 width:50%;
}

.min-height-mobile-v2{
 min-height: 100vh !important;
 height:auto;
}

.rs-logo{
  width:50%;
  height: 50% !important;
}

.btnColor{
  text-transform: capitalize;
  background-color: #5E44FF;
  color: #f2f2f2;
}
.btnColor:hover{
  text-transform: capitalize;
  background-color: #5E44FF;
  color: #f2f2f2;
}

.font-colors{
  color: #212529 !important;
  font-family: 'Inter-Light' !important;
}

.link-text:hover{
  color: blue;
}

.formInput{
  padding-top: 300px !important;
}

.small{
  font-size: small;
}

.login-title{
  font-size: xx-large;
  font-family: 'Inter-Light' !important;
}

.separator{
 display: flex;
 align-items: center;
}

.separator span{
 padding: 0 1rem; /* creates the space */
}

.separator .line{
 flex: 1;
 height: 1px;
 background-color: rgb(150, 147, 147);
}


/** new CSS added */

.right-floater{
        float:right;
}

.field{
    border:none;
    border-radius: 0;
    border-bottom: 1px solid #7b809a;
    padding: 5px 10px;
    outline: none;
}

.field:focus{
  border:none;
    border-bottom: 1px solid #7b809a;
    padding: 5px 10px;
    outline: none;
}

.labels{
  color: black !important;
  font-size: small;
  font-weight: bold;
}

.asterisk{
  color:red; 
  font-size: 1em; 
}

.form-control[readonly] {
    background-color: #f8f8f8;
    opacity: 0.5;
}

.error-font{
        color:red !important;
        font-size: 12px !important;
}

.birth{
    max-width: 95%;
    width: auto;
}

.btn.bg-gradient-success{
  color: black;
}

.font-color-success{
    font-family: 'Inter-Light' !important;
}

.capitalize{
    text-transform: capitalize !important;
    font-weight:unset !important;
    font-size: 10pt !important;
}
</style>