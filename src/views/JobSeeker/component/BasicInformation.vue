<script setup>
    //components
    //
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import axios from 'axios';
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import editIcon from "@/assets/img/edit-icon.svg";
    import MaterialInput from "@/components/MaterialInput.vue";
    import setMaterialInput from "@/assets/js/material-input";
    import moment from 'moment';
    import { walkBlockDeclarations } from "@vue/compiler-core";
    import phInfoJson from "@/assets/philippine_provinces_cities_municipalities_and_barangays_2019v2.json";
    import { onMounted } from "vue";
    import Loader from "@/components/Loader.vue";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
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
                showError:false,
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
                    prov_country:'',
                    prov_region:'',
                    prov_province:'',
                    prov_zip:'',
                    prov_brgy:'',

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
                copyAddress:{data:false,},
                showDialog:false,
                loader:false,
                loaderFront:false,
                format:'yyyy-MM-dd',
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
            letterOnly(data){
                return /^[a-zA-Z ]*$/.test(data);
            },
            numberOnly(data){
                return /^[0-9]*$/.test(data);
            },
            alphaNumericOnly(data){
                return /^[a-zA-Z0-9 ]*$/.test(data);
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
                this.jobseeker_errors.home_tc='';
                this.jobseeker_errors.home_prov='';
                this.jobseeker_errors.home_region='';
                this.jobseeker_errors.home_country='';
                this.jobseeker_errors.prov_tc='';
                this.jobseeker_errors.prov_prov='';
                this.jobseeker_errors.prov_region='';
                this.jobseeker_errors.prov_country=''; 
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
            onUpdatePost(){
                let token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                let infotype = 'basic';
                let data_insert = this.jobseeker;
               
                this.showError=false;
                this.clearErrors();
                if(this.letterOnly(data_insert.reg_firstname) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.firstname = "First Name should contain only letters.";                   
                }
                if(this.emptyField(data_insert.reg_firstname)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.firstname = "This field is required.";
                }
                if(this.emptyField(data_insert.reg_lastname)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.lastname = "This field is required.";
                }
                if(this.alphaNumericOnly(data_insert.reg_middlename) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.middlename = "Middle Name should not contain special characters.";
                }
                if(this.alphaNumericOnly(data_insert.reg_lastname) == false ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.lastname = "Last Name should not contain special characters.";
                }
                if((this.numberOnly(data_insert.reg_sss_id) == false ) 
                &&(this.emptyField(data_insert.reg_sss_id) == false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.sss_id = "SSS ID should only contain numbers.";
                }
                if((this.numberOnly(data_insert.reg_pagibigid) == false )
                &&(this.emptyField(data_insert.reg_pagibigid) == false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.pagibig_id = "Pagibig ID should only contain numbers.";
                }
                if((this.numberOnly(data_insert.reg_philhealthid) == false )
                &&(this.emptyField(data_insert.reg_philhealthid) == false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.philhealth_id= "Philhealth ID should only contain numbers.";
                }
                if((this.numberOnly(data_insert.reg_tin) == false)
                &&(this.emptyField(data_insert.reg_tin) == false)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.tin = "TIN ID should only contain numbers.";
                }
                
                this.validateHomeTownCity();
                this.validateProvTownCity();
                this.validateBirthDate();
                if(this.showError==false){
                    this.loader = true;
                    let date_conv = this.setDateFormat(data_insert.reg_birthdate);
                    
                    if(this.showDialog == true){
                        this.basicModalShow = false;
                    }
                    axios.post(this.API_URL+'/update-profile/onboarding',
                    { 
                        jobseeker_id:ID,
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

                        },{
                        headers:{
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((response)=>{
                        this.emitter.emit("mapProfileName", response.data.basic_info);
                        this.loader = false;
                        this.basicModalShow = false;
                        this.showSuccess = true;
                        this.copyAddress.data = false;
                        this.showDialog = false;
                        data_insert.reg_birthdate = date_conv;
                        this.clearDisplay();
                        this.setData(data_insert);
                        this.setDisplayDate(data_insert.reg_birthdate);
                        this.filterBasicInfos();
                        
                        
                    }).catch((err)=>{
                            
                        if(err.response.status == 401){
                            alert('Session Expired.Please Relogin.');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('token');
                            this.$router.push('/'); 
                        }
                });
                }
               
               
            },
            validateBirthDate(){
                let birth_date = this.setDateFormat(this.jobseeker.reg_birthdate);
                let current = this.getCurrentDate();
                if(this.emptyField(this.jobseeker.reg_birthdate)){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.birthdate = "This field is required.";
                }
                else if ( birth_date > current ){
                    this.showError = true;
                    this.showDialog = false;
                    this.jobseeker_errors.birthdate = "Invalid birthdate.";
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
                this.clearDisplayProvAddress(3);
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
                this.homeAddress.province = this.stored_info.home_province;
                this.homeAddress.zipCode = this.stored_info.home_zip;
                this.provAddress.prov_region = this.stored_info.prov_region;
                this.provAddress.prov_country = this.stored_info.prov_country;
                this.provAddress.prov_province = this.stored_info.prov_province;
                this.provAddress.prov_zipCode = this.stored_info.prov_zip;
                
                //console.log('');
                await this.getCountryAddresses('home',this.homeAddress.country);
                this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
                //this.display_towncities = this.filterTowncity(this.display_provinces,this.homeAddress.province);
                this.getProvinceAddresses('home',this.homeAddress.province);
                
                

                await this.getCountryAddresses('prov',this.provAddress.prov_country);
                this.display_prov_provinces = this.filterProvince(this.countryData.prov,this.provAddress.prov_region);
                //this.display_prov_towncities = this.filterTowncity(this.display_prov_provinces,this.provAddress.prov_province);
                this.getProvinceAddresses('prov',this.provAddress.prov_province);
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
                const token = localStorage.getItem('token');
                let responseData = {};
                await axios.get(this.API_URL+'/towncity/'+data,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
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
                
                const token = localStorage.getItem('token');
                
                if(type =='home'){
                    this.countryLoad.home = true;
                }
                else{
                    this.countryLoad.prov = true;
                }
                await axios.get(this.API_URL+'/country/'+data,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
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
                
                const token = localStorage.getItem('token');
                
                if(type =='home'){
                    this.countryLoad.home = true;
                    this.countryLoad.homeState = true;
                }
                else{
                    this.countryLoad.prov = true;
                    this.countryLoad.provState = true;
                }
                await axios.get(this.API_URL+'/state/'+data,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    //console.log(response.data.data); 
                    responseData = response.data.data;
                    //this.provinces = response.data;
                    
                });
                //console.log(responseData);
                return responseData; 



            },
            async populatePreHomeData(){
                this.dataHome = await this.getTownCityInfo(this.jobseeker.reg_home_addr_towncity);
                
                this.homeAddress.province = this.dataHome.state.id;
                this.homeAddress.zipCode =  this.dataHome.zip_code;
                this.homeAddress.region = this.dataHome.state.link_region_id == null ? this.dataHome.state.country.id:this.dataHome.state.region.id;
                
                if(this.dataHome.state.region) {
                    this.homeAddress.country = this.dataHome.state.region.country.id;
                    
                    this.display.towncity = this.dataHome.description;
                    this.display.province = this.dataHome.state.description;
                    this.display.region = this.dataHome.state.region.description;
                    this.display.country = this.dataHome.state.region.country.long_desc;
                } else { 
                    this.homeAddress.country = this.dataHome.state.country.id;
                    
                    this.display.towncity = this.dataHome.description;
                    this.display.province = this.dataHome.state.description;
                    this.display.region = '';
                    this.display.country = this.dataHome.state.country.long_desc; 
                }

                await this.getCountryAddresses('home',this.homeAddress.country);
                this.display_provinces = this.filterProvince(this.countryData.home,this.homeAddress.region);
                this.getProvinceAddresses('home',this.dataHome.state.id);
                
                
            },
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
                        }
                        else{
                            this.display_regions = this.countryData.home.regions;
                            this.regionDisabled.home_data = false;
                            this.countryLoad.home = false;
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
                await axios.get(this.API_URL+'/religion',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{  
                    this.religions = response.data.data.data;
                    
                    
                
                });
            },
            async getCountries(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/country',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{  
                    this.countries = response.data.data.data;
                    
               
                });
            },
            async getSources(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/job-source',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    this.sources = response.data.data.data;
                    
                });
            },
            async getCivilStatus(){
                const token = localStorage.getItem('token');
                await axios.get(this.API_URL+'/civil-status',{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    this.status = response.data.data.data;
                    
                    
                });

                
            },
            getTownCityDisplay(data){
                const token = localStorage.getItem('token');
                let responseData = {};
                axios.post(this.API_URL+'/towncity/'+data,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    
                    responseData = response.data.data;

                }).catch((err)=>{
                    //console.log(err);
                    return '';
 
                    
                });
                return responseData;
            },
            
        
        },
        mounted () {
            setMaterialInput();
            this.API_URL = api.DEV_API_URL;
            const token = localStorage.getItem('token');
            const ID = localStorage.getItem('userid');
            const info_type = "basic";
            const list = phInfoJson;
            if (!token) {
                this.$router.push('/');
            }
            else{
                
                this.getCivilStatus();
                this.getReligions();
                this.getSources();
                this.getCountries();
                this.loaderFront = true;
                axios.post(this.API_URL+'/get-profile/onboarding',
                { 
                    jobseeker_id:ID,
                    info_type:info_type
                },{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    //this.getAddressDropdown(5);
                    if(response.data.data == null){
                        this.putData(this.jobseeker);
                        this.filterBasicInfos();
                        
                    }
                    else{
                        
                        this.setData(response.data.data);
                        
                        this.setDisplayDate(this.jobseeker.reg_birthdate);

                        this.filterBasicInfos();
                        
                    }
                    this.loaderFront = false;
                    
                    
                }).catch((err)=>{
                    this.loaderFront = false;
                    if(err.response.status == 401){
                        alert('Session Expired.Please Relogin.');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/login/jobseeker'); 
                    }
                });
                
            }
            
        }
    }
</script> 
<template>
<!--<div class="container-fluid p-0 div-border">-->
<div class="container-fluid p-0">
    <div class="row mx-0">
        <!--<div class="col-12 content-header p-4 pb-2">-->
        <div class="col-12 p-4 pt-0 pb-0">
            <!--<h3 id="h5" class="mt-0">Basic Information</h3>-->
            <MaterialButton variant="gradient" color="white" 
            size="md" class="right-floater command-btn mx-0 mb-0"  @click="toggleModal" v-if="!loaderFront">
                <span class="fas fa-edit"></span>&nbsp;Edit
            </MaterialButton>
        </div> 
       
        <Teleport to="body">
            <StandardModal 
            :show="basicModalShow" 
            @close="openDialog"
            :hasClose=true
            :hasHeader="!loader"
            :hasFooter="!loader"
            title="Edit Basic Info"
            :size="(loader == true) ? 'dialog-sm':'dialog-xxxxl'"
            :isScrollable=true>


            <template #body>
                
                <div class="row mt-0 stick-alert">
                    <div class="col-12">
                        <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" v-if="showError">
                            Your form could not be saved. Please complete all the marked fields.
                        </MaterialAlert>
                    </div>
                </div>
                <Loader v-if="loader"></Loader>
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-2">
                            <label for="Prefix" class="labels my-0">Prefix</label>
                            <select class="form-select input-group-outline" v-model="jobseeker.reg_prefix">
                                <option v-for="p in prefixes" :key="p.value" :value="p.value">
                                    {{p.display}}
                                </option>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label for="firstname" class="labels my-0">First Name</label>
                            <input
                                id="firstname"
                                class="input-group-outline form-control  p-2"
                                type="text"
                                v-model="jobseeker.reg_firstname"
                                maxlength="30"
                                
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.firstname}}</span>
                        </div>
                        <div class="col-sm-3">
                            <label for="middlename" class="labels my-0">Middle Name</label>
                            <input
                                id="middlename"
                                class="input-group-outline form-control  p-2"
                                type="text"
                                v-model="jobseeker.reg_middlename"
                                maxlength="30"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.middlename}}</span>
                        </div>
                        <div class="col-sm-3">
                            <label for="lastname" class="labels my-0">Last Name</label>
                            <input
                                id="lastname"
                                class="input-group-outline form-control  p-2"
                                type="text"
                                v-model="jobseeker.reg_lastname"
                                maxlength="30"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.lastname}}</span>
                        </div>
                    </div>
                    
                </div>
                <!--<div class="form-group" v-if="!loader">
                    
                </div>
                <div class="form-group" v-if="!loader">
                    
                </div>-->
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-4">
                            <label for="nickname" class="labels my-0">Nickname</label>
                            <input
                                id="nickname"
                                class="input-group-outline form-control  p-2"
                                type="text"
                                v-model="jobseeker.reg_nickname"
                                maxlength="10"
                            />
                        </div>
                        <div class="col-sm-4">
                            <label for="" class="labels my-0">Gender</label>
                            <select class="input-group-outline form-select" v-model="jobseeker.reg_gender">
                                <option v-for="g in genders" :key="g.value" :value="g.value">
                                    {{g.display}}
                                </option>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label for="" class="labels my-0">Date of Birth</label>
                            <Datepicker v-model="jobseeker.reg_birthdate" :format="format"
                            :enableTimePicker="false"  style="width: 100% !important; background-color: bisque;" required></Datepicker>
                            <span class="error-font" v-if="showError">{{jobseeker_errors.birthdate}}</span>
                        </div>
                    </div>                                   
                </div>
                <div class="form-group mb-4" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-4">
                            <label for="nationality" class="labels my-0">Nationality</label>
                            <select class="form-select input-group-outline" v-model="jobseeker.reg_nationality">
                                <option v-for="n in nationalities" :key="n.value" :value="n.value">
                                    {{n.display}}
                                </option>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label for="religion" class="labels my-0">Religion</label>
                            <select class="form-select input-group-outline" v-model="jobseeker.reg_religion">
                                <option v-for="r in religions.sort((a, b) => a.description.localeCompare(b.description))" :key="r.id" :value="r.id">
                                    {{r.description}}
                                </option>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label for="status" class="labels my-0">Marital Status</label>
                            <select class="form-select input-group-outline" v-model="jobseeker.reg_civilstatus">
                                <option v-for="cs in status.sort((a, b) => a.description.localeCompare(b.description))" :key="cs.id" :value="cs.id">
                                    {{cs.description}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row padding-header"  v-if="!loader" >
                    <div class="col-md-6">
                        <div class="row bg-header text-left">
                            <div class="col-12">
                                <h5 class="header-color-inside-modal">Home Address</h5>
                            </div>
                            <div class="col-12">
                                <span class="header-color-inside-modal">&nbsp;</span>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="address_1" class="labels my-0">Address Line 1</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="address_1"
                                                class="input-group-outline form-control p-2"
                                                type="text"
                                                v-model="jobseeker.reg_home_addr_line1"
                                                maxlength="50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="address_2" class="labels my-0">Address Line 2</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="address_2"
                                                class="input-group-outline form-control p-2"
                                                type="text"
                                                v-model="jobseeker.reg_home_addr_line2"
                                                maxlength="50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="country" class="labels my-0">Country &nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.home && !countryLoad.homeState"></i></label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline" v-model="homeAddress.country" 
                                            @change="clearDisplayHomeAddress(1); getCountryAddresses('home',homeAddress.country);"
                                            :disabled="countryLoad.home">
                                                <option :value="''"></option>
                                                <option v-for="c in countries.sort((a, b) => a.long_desc.localeCompare(b.long_desc))" :value="c.id">{{c.long_desc}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.home_country}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row" v-if="regionDisabled.home_data == false">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="region" class="labels my-0">Region</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline"  v-model="homeAddress.region" 
                                            @change="clearDisplayHomeAddress(2); display_provinces = filterProvince(countryData.home,homeAddress.region);"
                                            :disabled="countryLoad.home">
                                                <option :value="''"></option>
                                                <option v-for="d in display_regions.sort((a, b) => a.description.localeCompare(b.description))" :value="d.id">{{d.description}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.home_region}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="region" class="labels my-0 ">State/Province &nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.homeState"></i></label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select :disabled="countryLoad.home" 
                                            class="form-select form-select-md input-group-outline" 
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
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="town_city" class="labels my-0">Town/City</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select :disabled="countryLoad.home || countryLoad.state" 
                                            class="form-select form-select-md input-group-outline" 
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
                                        <div class="col-7 p-0">
                                            <select :disabled="countryLoad.home || countryLoad.state" 
                                            class="form-select form-select-md input-group-outline" 
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
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="zip" class="labels my-0">Zip Code</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="zip"
                                                class="input-group-outline form-control p-2"
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
                    </div>
                    <div class="col-md-6">
                        <div class="row bg-header">
                            <div class="col-12 px-2">
                                <div class="row">
                                    <div class="col-12">
                                        <h5 class="header-color-inside-modal mb-1">Provincial Address</h5>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 p-0">
                                        <div class="form-check" style="padding:0 3% .5% !important;">
                                            <input type="checkbox" class="form-check-input" 
                                                v-model="copyAddress.data" 
                                            :value="true" id="copy" @click="copyHomeToProv" :checked="copyAddress.data">
                                            <span class="header-color-inside-modal">&nbsp; Same as Home Address</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="province_address_1" class="labels my-0">Address Line 1</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="province_address_1"
                                                class="input-group-outline form-control p-2"
                                                type="text"
                                                v-model="jobseeker.reg_prov_addr_line1"
                                                :disabled="copyAddress.data"
                                                maxlength="50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="province_address_2" class="labels my-0">Address Line 2</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="province_address_2"
                                                class="input-group-outline form-control p-2"
                                                type="text"
                                                v-model="jobseeker.reg_prov_addr_line2"
                                                :disabled="copyAddress.data"
                                                maxlength="50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="country" class="labels my-0">Country 
                                            &nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.prov && !countryLoad.provState"></i></label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline" v-model="provAddress.prov_country" 
                                            @change="clearDisplayProvAddress(1); getCountryAddresses('prov',provAddress.prov_country);"
                                            :disabled="countryLoad.prov || copyAddress.data"
                                            >
                                                <option :value="''"></option>
                                                <option v-for="c in countries.sort((a, b) => a.long_desc.localeCompare(b.long_desc))" :value="c.id">{{c.long_desc}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.prov_country}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row" v-if="regionDisabled.prov_data == false">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="region" class="labels my-0">Region</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline"  
                                            v-model="provAddress.prov_region" @change=" clearDisplayProvAddress(2); 
                                            display_prov_provinces = filterProvince(countryData.prov,provAddress.prov_region);"
                                            :disabled="countryLoad.prov || copyAddress.data">
                                                <option :value="''"></option>
                                                <option v-for="d in display_prov_regions.sort((a, b) => a.description.localeCompare(b.description))" :value="d.id">{{d.description}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.prov_region}}</span>     
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="region" class="labels my-0">State/Province&nbsp;<i class="fas fa-spinner fa-pulse" v-if="countryLoad.provState"></i></label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline" 
                                            v-model="provAddress.prov_province" @change=" clearDisplayProvAddress(3); 
                                            getProvinceAddresses('prov',provAddress.prov_province);"
                                            :disabled="countryLoad.prov || copyAddress.data">
                                                <option :value="''"></option>  
                                                <option v-for="p in display_prov_provinces.sort((a, b) => a.description.localeCompare(b.description))" :value="p.id">{{p.description}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.prov_prov}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="province_towncity" class="labels my-0">Town/City</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select class="form-select form-select-md input-group-outline" v-model="jobseeker.reg_prov_addr_towncity" 
                                            @change="provAddress.prov_zipCode=getZipcode(display_prov_towncities,jobseeker.reg_prov_addr_towncity);
                                            display_prov_brgy = filterBarangay(display_prov_towncities,jobseeker.reg_prov_addr_towncity)"
                                            :disabled="countryLoad.prov || copyAddress.data || countryLoad.provState">
                                                <option :value="''"></option>
                                                <option v-for="item in display_prov_towncities.sort((a, b) => a.description.localeCompare(b.description))" :value="item.id">{{item.description}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.prov_tc}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--<div class="form-group mt-2" v-if="!loader && display_prov_brgy.length != 0">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="town_city" class="labels my-0">Barangay</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <select :disabled="countryLoad.prov || countryLoad.provState" 
                                            class="form-select form-select-md input-group-outline" 
                                            v-model="provAddress.brgy" >
                                                <option :value="''"></option>
                                                <option v-for="x in display_prov_brgy" :value="x.id">{{x.description}}</option>
                                            </select>
                                            <span class="error-font" v-if="showError">{{jobseeker_errors.prov_brgy}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>-->
                        <div class="form-group mt-2" v-if="!loader">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-5 pt-1">
                                            <label for="zip" class="labels my-0">Zip Code</label>
                                        </div>
                                        <div class="col-7 p-0">
                                            <input
                                                id="zip"
                                                class="input-group-outline form-control p-2"
                                                type="text"
                                                v-model="provAddress.prov_zipCode"
                                                :disabled="countryLoad.prov || copyAddress.data || countryLoad.provState"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>   
                
                <div class="row padding-header mt-2"  v-if="!loader">
                    <div class="col-12 bg-header">
                        <h5 class="header-color-inside-modal">Goverment Membership</h5>
                    </div>
                </div>                                   
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-6">
                            <label for="sss" class="labels my-0">SSS ID</label>
                            <input
                                id="sss"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="jobseeker.reg_sss_id"
                                maxlength="20"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.sss_id}}</span>
                        </div>
                        <div class="col-sm-6">
                            <label for="philhealth" class="labels my-0">Philihealth ID</label>
                            <input
                                id="philhealth"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="jobseeker.reg_philhealthid"
                                maxlength="20"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.philhealth_id}}</span>
                        </div>
                    </div>
                    
                </div>   
                <div class="form-group" v-if="!loader">
                    <div class="row">
                        <div class="col-sm-6">
                            <label for="pagibig" class="labels my-0">Pag-Ibig ID</label>
                            <input
                                id="pagibig"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="jobseeker.reg_pagibigid"
                                maxlength="20"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.pagibig_id}}</span>
                        </div>
                        <div class="col-sm-6">
                            <label for="email_address" class="labels my-0">TIN ID</label>
                            <input
                                id="tin"
                                class="input-group-outline form-control p-2"
                                type="text"
                                v-model="jobseeker.reg_tin"
                                maxlength="20"
                            />
                            <span class="error-font" v-if="showError">{{jobseeker_errors.tin}}</span>
                        </div>
                    </div>
                </div>
                <div class="form-group" v-if="!loader">
                    <label for="source" class="labels my-0">Source</label>
                    <select class="form-select input-group-outline select-x-padding select-width" v-model="jobseeker.reg_source">
                        <option v-for="s in sources.sort((a, b) => a.description.localeCompare(b.description))" :key="s.id" :value="s.id">
                            {{s.description}}
                        </option>
                    </select>
                </div>
            
            </template>
            
            <template #footer >
                <MaterialButton variant="gradient" color="white" class="command-btn mb-0" @click="onUpdatePost" v-if="!loader">
                    Save
                </MaterialButton>
            </template>

            </StandardModal>

            <StandardModal 
            :show="showDialog" 
            @close="showDialog = false"
            :hasClose=true
            :hasHeader=false
            :hasFooter="!loader"
            title="Dialog"
            size="dialog-md"
            :isScrollable=true>

            <!--<template #title>
                <h5 class="modal-title"> Alert Header </h5>
            </template>-->

            <template #body>
                <Loader v-if="loader"></Loader>
                <h5 id="h4" v-if="!loader">Do you want to save changes?</h5>
            </template>
            
            <template #footer>
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="onUpdatePost" v-if="!loader">
                    Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" v-if="!loader" @click="toggleModal">
                    no
                </MaterialButton>&nbsp;
                <!--<MaterialButton size="sm" variant="contained" color="secondary" class="mb-0"  @click="toggleDialog" v-if="!loader">
                    cancel
                </MaterialButton>-->
            </template>

            </StandardModal>

            <StandardModal 
            :show="showSuccess" 
            @close="showSuccess = false"
            :hasClose=true
            :hasHeader=false
            :hasFooter=false
            title="Dialog"
            size="dialog-sm"
            :isScrollable=true>

            <!--<template #title>
                <h5 class="modal-title"> Alert Header </h5>
            </template>-->

            <template #body>
                <div class="text-center">
                    <h5 id="h4">Successfully saved.</h5>
                    <span>&nbsp;</span>
                </div>
            </template>
            

            </StandardModal>
        </Teleport>
    </div>
    <div class="row p-4">
        <div class="col-md-12">
            <Loader v-if="loaderFront"></Loader>
            <div class="table-responsive" v-if="!loaderFront">
                <table class="table table-striped" >
                    <thead class="thead bg-header">
                        <tr>
                            <th colspan="2" class="px-2">Personal Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="col-sm-6 first-col-width">
                                Full Name
                            </td>
                            <td class="col-sm-6">
                                {{jobseeker.reg_prefix}}&nbsp;{{jobseeker.reg_firstname}}&nbsp;{{jobseeker.reg_middlename}}&nbsp;{{jobseeker.reg_lastname}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Nickname
                            </td>
                            <td>
                                {{jobseeker.reg_nickname}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Birthday
                            </td>
                            <td>
                                {{display.bday}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Gender
                            </td>
                            <td>
                                {{display.gender}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Civil Status
                            </td>
                            <td>
                                {{display.civil}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Nationality
                            </td>
                            <td>
                                {{display.national}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Religion
                            </td>
                            <td>
                                {{display.religion}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-responsive" v-if="!loaderFront">
                <table class="table table-striped">
                    <thead class="thead bg-header">
                        <tr>
                            <th colspan="2" class="px-2">Home Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="col-sm-6 first-col-width">
                                Address
                            </td>
                            <td class="col-sm-6">
                                {{jobseeker.reg_home_addr_line1}}&nbsp;{{jobseeker.reg_home_addr_line2}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Country
                            </td>
                            <td>
                                {{display.country}}
                            </td>
                        </tr>
                        <tr v-if="display.region">
                            <td>
                                Region
                            </td>
                            <td>
                                {{display.region}}
                            </td>
                        </tr>   
                        <tr>
                            <td>
                                State/Province
                            </td>
                            <td>
                                {{display.province}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Town/City
                            </td>
                            <td>
                                {{display.towncity}}
                            </td>
                        </tr>   
                        
                        
                        <tr>
                            <td>
                                Zip Code
                            </td>
                            <td>
                                {{homeAddress.zipCode}}
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div class="table-responsive" v-if="!loaderFront">
                <table class="table table-striped">
                    <thead class="thead bg-header">
                        <tr>
                            <th colspan="2" class="px-2">Provincial Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="col-sm-6 first-col-width">
                                Address
                            </td>
                            <td class="col-sm-6">
                                {{jobseeker.reg_prov_addr_line1}}&nbsp;{{jobseeker.reg_prov_addr_line2}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Country
                            </td>
                            <td>
                                {{display.prov_country}}
                            </td>
                        </tr>
                        <tr v-if="display.region">
                            <td>
                                Region
                            </td>
                            <td>
                                {{display.prov_region}}
                            </td>
                        </tr> 
                        <tr>
                            <td>
                                State/Province
                            </td>
                            <td>
                                {{display.prov_province}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Town/City
                            </td>
                            <td>
                                {{display.prov_towncity}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Zip Code
                            </td>
                            <td>
                                {{provAddress.prov_zipCode}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-responsive" v-if="!loaderFront">
                <table class="table table-striped">
                    <thead class="thead bg-header">
                        <tr>
                            <th colspan="2" class="px-2">Government Membership</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="col-sm-6 first-col-width">
                                SSS ID
                            </td>
                            <td class="col-sm-6">
                                {{jobseeker.reg_sss_id}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Philhealth ID
                            </td>
                            <td>
                                {{jobseeker.reg_philhealthid}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Pag-Ibig ID
                            </td>
                            <td>
                                {{jobseeker.reg_pagibigid}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Tin ID
                            </td>
                            <td>
                                {{jobseeker.reg_tin}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Source
                            </td>
                            <td>
                                {{display.source}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
    .address-dropdown-size{
        width:22%!important;
    }
    #alert-message{
        color: black!important;
    }
    td{
        text-align: left;
    }
    .first-col-width{
        width:16%;
    }
    .stick-alert{
        top:0;
        position:sticky;
        background-color: white;
        background-size: cover;
    }
    .margin-header{
        margin-left:.1%;
        margin-right:.1%
    }
    .padding-header{
        padding-left:1.5%;
        padding-right:1.5%
    }
    .header-color-inside-modal{
        color:white!important;
    }
    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    .thead{
        color:white!important;
        background-color:#002315;
        
    }
    .select-x-padding{
        padding-left:1%;
        padding-right:1%;
    }
    .select-width{
        width: 48.5%!important;
    }
    .error-font{
        color:red !important;
        font-size: x-small;
    }
    .right-floater{
        float:right;
    }
    .btn-color{
        color:#212529!important;
    }
    .btn-color:hover{
        color:#fff!important;
    }

    .bg-btn-green{
        background-color: #76FF5B!important;
    }
    #h4{
        color:#002315;
        font-family: 'Inter' !important;
        text-align: center;
    }
    #h5{
        color:#002315;
        font-family: 'Inter-Bold' !important;
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    #h2{
        color:#002315;
        margin-left: 1rem;
    }
    #modal-dialog {
        max-width: 900px !important;
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