<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import api  from "@/static/config.json";
    import ContactEmailModals from "./Modals/ContactEmailModals.vue";
    import ContactMobileModals from "./Modals/ContactMobileModals.vue";
    import ContactLandlineModals from "./Modals/ContactLandlineModals.vue"
    import ContactSocMedModals from "./Modals/ContactSocMedModals.vue"
    import axios from "axios";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
</script>

<script>

    export default {

        data() {
            return {
                modalEmailShow: false,
                modalMobileShow: false,
                modalLandlineShow: false,
                modalSocMedShow: false,
                modalLoaderShow: false,
                isLoading: false,
                is_disabled_email: true,
                is_disabled_mobile: true,
                is_disabled_landline: true,
                is_disabled_soc_med: true,
                contact_data: [],
                alt_emails: [],
                mobiles: [],
                landlines: [],
                soc_meds: [],
                socMedsList:{ 
                    '1': "Facebook",
                    '2': "Linkedin",
                    '3': "Twitter",
                    '4': "Instagram",
                },
                primaryEmail: {'email': ''},
                primaryMobile:  {'mobile': ''},
                primaryLandline:  {'landline': ''},
                actionType: "",
                btnType: '',
                selectedIndex: false,
                prereg_email: '',
                validateEmail: {'isAdded': false, 'isExist': false, 'message': ''},
                validateMobile: {'isAdded': false, 'message': ''},
                validateLandline: {'isAdded': false, 'message': ''},
                validateSocMed: {'isAdded': false, 'message': ''},
                confirmPrimary:  false,
                mobileData: {},
                landlineData: {},
                newMobileNumberVal: '',
                newLandlineNumberVal: '',
                
            }
        },

        methods: {
            
            getContact(){

                axios.post(this.API_URL+'/get-contact/onboarding',{ 
                    jobseeker_id:this.USERID,
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    this.contact_data = response.data;

                    if ( this.contact_data ) {

                        // set email
                        this.prereg_email = this.contact_data.email;
                        this.alt_emails.push({
                            'email': this.contact_data.email, 
                            'selected': false, 
                            'primary': true, 
                            'id': 0
                        });
    
                        this.primaryEmail.email = this.alt_emails[0].email;
    
                        const emails = this.contact_data.alt_emails;
    
                        for (const x in emails) {
                            this.alt_emails.push({
                                'email': emails[x].alt_email, 
                                'selected': false, 
                                'primary': !!emails[x].is_primary, 
                                'id': emails[x].id
                            });
                        }
    
                        // set mobiles
                        const mobiles = this.contact_data.mobiles;
    
                        for ( const x in mobiles ) {
                            this.mobiles.push({
                                'mobile': mobiles[x].mobile_number, 
                                'selected': false, 
                                'primary': !!mobiles[x].is_primary, 
                                'id': mobiles[x].id
                            });
    
                            if ( mobiles[x].is_primary ){
                                this.primaryMobile.mobile = mobiles[x].mobile_number;
                            }
                        }
    
    
                        // set landlines
                        const landlines = this.contact_data.phones;
                        
                        for ( const x in landlines ) {
                            this.landlines.push({
                                'landline': landlines[x].landline_number, 
                                'selected': false, 
                                'primary': !!landlines[x].is_primary, 
                                'id': landlines[x].id
                            });
    
                            if ( landlines[x].is_primary ){
                                this.primaryLandline.landline = landlines[x].landline_number
                            }
                        }
    
                        // set soc_meds
                        const soc_meds = this.contact_data.soc_med;
    
                        for ( const x in soc_meds ) {
                            this.soc_meds.push({
                                'id': soc_meds[x].id, 
                                'soc_med_id': soc_meds[x].link_social_media, 
                                'soc_med_name': soc_meds[x].description, 
                                'soc_med': soc_meds[x].social_media_url,
                                'selected': false,
                            });
    
                        }

                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            // EMAIL ADDRESS ======================
            checkEmail ( data ) {
                
                this.modalEmailShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;
                this.validateEmail.isAdded = false;
                this.validateEmail.isExist = false;

                axios.post(this.API_URL+'/check-email/onboarding',{ 
                        email:data,
                },{
                    
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                    
                }).then((response)=>{

                    const isExist = response.data.success;
                    if ( !isExist ) {
                        
                        this.selected_email = data;
                        this.validateEmail.isExist = true;
                        this.modalEmailShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;

                    } else { 
                        
                        this.validateEmail.isExist = false;

                        if ( this.actionType == 'add' ) {
                            this.addEmail(data) 
                        } else {
                            this.updateEmail(data)
                        }
                    
                    }

                }).catch((err)=>{ 

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }

                })

            },

            addEmail ( data ){

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    alt_email: data,
                    contact_info: 'alt_email',
                    is_primary: 0,
                    type: 'add'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {

                        this.validateEmail.isAdded = false;
                        
                        const resp_data = response.data.data;
                        this.alt_emails.push({
                            'email': resp_data.alt_email, 
                            'selected': false, 
                            'primary': false, 
                            'id': resp_data.id 
                        })

                        this.isLoading = false;

                    }


                }).catch((err)=>{

                    if ( err.response.data.alt_email ){
                        this.validateEmail.isAdded = true;
                        this.validateEmail.message = err.response.data.alt_email[0];

                        this.modalEmailShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }
                    
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
                
            },

            updateEmail ( data ){

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    alt_email: data.email,
                    id: this.alt_emails[data.index].id,
                    contact_info: 'alt_email',
                    is_primary: 0,
                    type: 'edit'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {

                        const resp_data = response.data.data;
                        this.alt_emails[data.index]['email'] = resp_data.alt_email;
                        this.alt_emails[data.index]['id'] = resp_data.id;

                        this.isLoading = false;
                        this.is_disabled_email = true;
                        this.resetSelected();

                    }

                }).catch((err)=>{

                    if ( err.response.data.alt_email ){
                        this.validateEmail.isAdded = true;
                        this.validateEmail.message = err.response.data.alt_email[0];

                        this.modalEmailShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            deleteEmail ( index ){

                this.modalEmailShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;
                axios.post(this.API_URL+'/delete-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    id: this.alt_emails[index].id,
                    contact_info: 'alt_email'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    this.alt_emails.splice(index, 1);

                    this.is_disabled_email = true;
                    this.isLoading = false;
                    this.resetSelected();

                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            selectRowEmail ( data ){

                this.is_disabled_mobile = true;
                this.is_disabled_landline = true;
                this.is_disabled_soc_med = true;
                this.is_disabled_email = false;

                this.selectedIndex = (typeof data == 'string') ? data : false;
                // reset selected
                this.resetSelected();

                if(this.alt_emails[data]){
                    this.alt_emails[data].selected = (typeof data == 'number') ? true : false;
                    this.selectedIndex = data;
                }

            },

            
            // MOBILE ADDRESS ======================
            checkMobile ( data ) {

                this.newMobileNumberVal = data.number;
                this.mobileData = data;

                if ( data.isNewPrimary ){
                    this.modalMobileShow = false;
                    this.confirmPrimary = true;
                    return
                }

                if ( "index" in data ) {
                    this.updateMobile();
                } else {
                    this.addMobile();
                }

            },

            addMobile (){

                this.confirmPrimary = false;
                this.modalMobileShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;
                this.validateMobile.isAdded = false;

                const data = this.mobileData;
                
                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    mobile_number: data.number,
                    contact_info: 'mobile',
                    is_primary: data.primary ? 1 : 0,
                    type: 'add'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {
                        
                        if ( data.primary ){
                            this.primaryMobile.mobile = data.number;

                            for ( const x in this.mobiles) {
                                this.mobiles[x].primary = !data.primary;
                            }
                            
                        }

                        const resp_data = response.data.data;
                        this.mobiles.push({
                            'mobile': resp_data.mobile_number, 
                            'selected': false,
                            'primary': data.primary,
                            'id': resp_data.id
                        })

                        this.validateMobile.isAdded = false;
                        this.isLoading = false;
                        this.newMobileNumberVal = '';
                    }

                }).catch((err)=>{
                    
                    if ( err.response.data.mobile_number ){
                        this.validateMobile.isAdded = true;
                        this.validateMobile.message = err.response.data.mobile_number[0];

                        this.modalMobileShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            updateMobile (){
                
                this.confirmPrimary = false;
                this.modalMobileShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;
                this.validateMobile.isAdded = false;

                const data = this.mobileData;

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    mobile_number: data.number,
                    id: this.mobiles[data.index].id,
                    contact_info: 'mobile',
                    is_primary: data.primary ? 1 : 0,
                    type: 'edit'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if ( response.data.data ) {

                        const resp_data = response.data.data;
                        if(this.mobiles[data.index]){

                            if ( data.primary ){
                                this.primaryMobile.mobile = data.number;

                                for ( const x in this.mobiles) {
                                    this.mobiles[x].primary = !data.primary;
                                }

                            }

                            this.mobiles[data.index]['mobile'] = resp_data.mobile_number;
                            this.mobiles[data.index]['id'] = resp_data.id;
                            this.mobiles[data.index]['primary'] = data.primary;

                        }

                        this.is_disabled_mobile = true;
                        this.isLoading = false;
                        this.resetSelected();
                        this.validateMobile.isAdded = false;
                        this.newMobileNumberVal = '';
                    }
                        

                }).catch((err)=>{

                    if ( err.response.data.mobile_number ){
                        this.validateMobile.isAdded = true;
                        this.validateMobile.message = err.response.data.mobile_number[0];

                        this.modalMobileShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            deleteMobile ( index ){
                
                this.modalMobileShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/delete-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    id: this.mobiles[index].id,
                    contact_info: 'mobile'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    this.mobiles.splice(index, 1);

                    this.isLoading = false;
                    this.is_disabled_mobile = true;
                    this.resetSelected();

                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
                
            },

            selectRowMobile ( data ){
                this.is_disabled_email = true;
                this.is_disabled_landline = true;
                this.is_disabled_soc_med = true;
                this.is_disabled_mobile = false
                // reset selected
                this.resetSelected();

                this.mobiles[data].selected = (typeof data == 'number') ? true : false;
                this.selectedIndex = data;
            },


            // LANDLINE ADDRESS ======================
            checkLandline ( data ) {

                this.newLandlineNumberVal = data.number;
                this.landlineData = data;
                console.log(this.newLandlineNumberVal)
                if ( data.isNewPrimary ){
                    this.modalLandlineShow = false;
                    this.confirmPrimary = true;
                    return
                }

                if ( "index" in data ) {
                    this.updateLandline();
                } else {
                    this.addLandline();
                }
                
            },

            addLandline (){

                this.confirmPrimary = false;
                this.validateLandline.isAdded = false;
                this.modalLandlineShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                const data = this.landlineData;

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    landline_number: data.number,
                    contact_info: 'landline',
                    is_primary: data.primary ? 1 : 0,
                    type: 'add'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {

                        if ( data.primary ){
                            this.primaryLandline.landline = data.number;

                            for ( const x in this.landlines) {
                                this.landlines[x].primary = !data.primary;
                            }
                        }

                        const resp_data = response.data.data;
                        this.landlines.push({
                            'landline': resp_data.landline_number, 
                            'selected': false, 
                            'primary': data.primary,
                            'id': resp_data.id
                        })

                        this.isLoading = false;
                        this.validateLandline.isAdded = false;
                        this.newLandlineNumberVal = '';

                    }


                }).catch((err)=>{

                    if ( err.response.data.landline_number ){
                        this.validateLandline.isAdded = true;
                        this.validateLandline.message = err.response.data.landline_number[0];

                        this.modalLandlineShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
                
            },

            updateLandline (){
                
                this.confirmPrimary = false;
                this.validateLandline.isAdded = false;
                this.modalLandlineShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                const data = this.landlineData;

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    landline_number: data.number,
                    id: this.landlines[data.index].id,
                    contact_info: 'landline',
                    is_primary: data.primary ? 1 : 0,
                    type: 'edit'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {

                        const resp_data = response.data.data;
                            
                        if ( data.primary ){
                            this.primaryLandline.landline = data.number;
                            
                            for ( const x in this.landlines) {
                                this.landlines[x].primary = !data.primary;
                            }
                        }

                        if(this.landlines[data.index]){
                            this.landlines[data.index]['landline'] = resp_data.landline_number
                            this.landlines[data.index]['id'] = resp_data.id
                            this.landlines[data.index]['primary'] = data.primary;

                        }

                        this.is_disabled_landline = true;
                        this.isLoading = false;
                        this.resetSelected();
                        this.validateLandline.isAdded = false;
                        this.newLandlineNumberVal = '';

                    }

                }).catch((err)=>{

                    if ( err.response.data.landline_number ){
                        this.validateLandline.isAdded = true;
                        this.validateLandline.message = err.response.data.landline_number[0];

                        this.modalLandlineShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
            },

            deleteLandline ( index ){
                
                this.modalLandlineShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/delete-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    id: this.landlines[index].id,
                    contact_info: 'landline'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                
                    this.landlines.splice(index, 1);

                    this.isLoading = false;
                    this.is_disabled_landline = true;
                    this.resetSelected();

                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            selectRowLandline ( data ){
                this.is_disabled_email = true;
                this.is_disabled_mobile = true;
                this.is_disabled_soc_med = true;
                this.is_disabled_landline = false;
                // reset selected
                this.resetSelected();

                this.landlines[data].selected = (typeof data == 'number') ? true : false;
                this.selectedIndex = data;
            },


            // SOCIAL MEDIA ADDRESS ======================
            addSocMed ( data ){

                this.validateSocMed.isAdded = false;
                this.modalSocMedShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    socialmed_id: data.soc_med_id,
                    social_media_url: data.soc_med,
                    contact_info: 'socmed',
                    type: 'add'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if ( response.data.data ) {

                        const resp_data = response.data.data;
                        
                        this.soc_meds.push({
                            'id': resp_data.id,
                            'soc_med_id': resp_data.link_social_media,
                            'soc_med_name': data.soc_med_name, 
                            'soc_med': resp_data.social_media_url,
                            'selected': false
                        })

                        this.isLoading = false;
                        this.validateSocMed.isAdded = false;
                    
                    }

                }).catch((err)=>{

                    if ( err.response.data.social_media_url ){
                        this.validateSocMed.isAdded = true;
                        this.validateSocMed.message = err.response.data.social_media_url[0];

                        this.modalSocMedShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            updateSocMed ( data ){

                this.validateSocMed.isAdded = false;
                this.modalSocMedShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/update-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    socialmed_id: data.soc_med_id,
                    social_media_url: data.soc_med,
                    contact_info: 'socmed',
                    type: 'edit',
                    id: this.soc_meds[data.index].id,
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{

                    if ( response.data.data ) {

                        const resp_data = response.data.data;
                    
                        this.soc_meds[data.index]['id'] = resp_data.id
                        this.soc_meds[data.index]['soc_med_id'] = resp_data.link_social_media
                        this.soc_meds[data.index]['soc_med_name'] = data.soc_med_name
                        this.soc_meds[data.index]['soc_med'] = resp_data.social_media_url

                        this.is_disabled_soc_med = true;
                        this.isLoading = false;
                        this.resetSelected();
                        this.validateSocMed.isAdded = false;

                    }

                }).catch((err)=>{

                    if ( err.response.data.social_media_url ){
                        this.validateSocMed.isAdded = true;
                        this.validateSocMed.message = err.response.data.social_media_url[0];

                        this.modalSocMedShow = true;
                        this.modalLoaderShow = false;
                        this.isLoading = false;
                    }

                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            deleteSocMed ( index ) {

                this.modalSocMedShow = false;
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/delete-contact/onboarding',{ 
                    jobseeker_id: this.USERID,
                    id: this.soc_meds[index].id,
                    contact_info: 'socmed'
                },{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                
                    this.soc_meds.splice(index, 1);

                    this.is_disabled_soc_med = true;
                    this.isLoading = false;
                    this.resetSelected();

                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert("Your session has expired please relogin.")    
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },

            selectRowSocMed ( data ){
                this.is_disabled_email = true;
                this.is_disabled_mobile = true;
                this.is_disabled_landline = true;
                this.is_disabled_soc_med = false;
                // reset selected
                this.resetSelected();

                this.soc_meds[data].selected = (typeof data == 'number') ? true : false;
                this.selectedIndex = data;
            },

            resetSelected (){
                for(const x in this.alt_emails){
                    this.alt_emails[x].selected = false;
                }
                for(const x in this.mobiles){
                    this.mobiles[x].selected = false;
                }
                for(const x in this.landlines){
                    this.landlines[x].selected = false;
                }
                for(const x in this.soc_meds){
                    this.soc_meds[x].selected = false;
                }
            },

            toggleModal ( action, type ){

                this.btnType = type;
                this.actionType = action;
                this.validateEmail.isExist = false;
                this.validateEmail.isAdded = false;
                this.validateMobile.isAdded = false;
                this.validateLandline.isAdded = false;
                this.validateSocMed.isAdded = false;

                if(type == 'email'){
                    this.modalEmailShow = true
                }else if(type == 'mobile'){
                    this.modalMobileShow = true
                }else if(type == 'landline'){
                    this.modalLandlineShow = true
                }else if(type == 'soc_med'){
                    this.modalSocMedShow = true
                }
                
            },
            
            continueEdit ( type ){
                this.actionType = 'edit';
                this.modalEmailShow = (type == 'email') ? true : false;
                this.modalMobileShow = (type == 'mobile') ? true : false;
                this.modalLandlineShow = (type == 'landline') ? true : false;
                this.modalSocMedShow = (type == 'soc_med') ? true : false;
            },

            continuePrimary () {
                
                if ( this.btnType == 'mobile' ) {

                    if ( this.actionType == 'add' ) {
                        this.addMobile();
                    } else {
                        this.updateMobile();
                    }

                } else { 

                    if ( this.actionType == 'add' ) {
                        this.addLandline();
                    } else {
                        this.updateLandline ();
                    }
                }
                
            },

            closeConfirmPrimary () {

                this.confirmPrimary = false;

                if ( this.btnType == 'landline' ){
                    this.modalLandlineShow = true;

                } else {
                    this.modalMobileShow = true;
                }

            },
            
            toggleLoader (){
                this.modalLoaderShow = !this.modalLoaderShow;
            },

        },
        computed: {
            
            // EMAIL ========================
            getSelectedRowEmail (){

                if ( this.actionType == 'add' ) {
                    return ''}

                let data = "";
                const i = this.selectedIndex;

                if(typeof this.selectedIndex == 'string'){
                    data = this.selectedIndex
                }else{
                    data = this.alt_emails[i] ? this.alt_emails[i].email : "";}

                return data

            },

            checkPrimaryEmail (){
                
                let is_primary = false;
                if(this.getSelectedRowEmail == this.primaryEmail.email){
                    is_primary = true;
                }
                
                return is_primary

            },

            setDeleteEmailMsg (){
                
                let msg = `You have selected ${this.getSelectedRowEmail} to be deleted. Would you like to proceed?`;
                if (this.getSelectedRowEmail && this.checkPrimaryEmail){
                    msg = 'Unable to delete primary email!';
                } else if ( this.prereg_email == this.getSelectedRowEmail) {
                    msg = 'Updating main email is unavailable for now.';
                }
                return msg
            },

            // MOBILE ========================
            getSelectedRowMobile () {

                if ( this.actionType == 'add' ) {
                    return ''}

                const i = this.selectedIndex;
                return this.mobiles[i] ? this.mobiles[i].mobile : "";

            },

            checkPrimaryMobile (){

                let is_primary = false;
                if(this.getSelectedRowMobile == this.primaryMobile.mobile){
                    is_primary = true;
                }
                
                return is_primary
            },

            checkHasPrimaryMobile () {

                let has_primary = false;
                for ( const x in this.mobiles ){
                    if ( this.mobiles[x].primary ) {
                        has_primary = true;
                    }
                }

                return has_primary

            },  

            setDeleteMobileMsg (){

                let msg = `You have selected ${this.getSelectedRowMobile} to be deleted. Would you like to proceed?`;
                if (this.getSelectedRowMobile && this.checkPrimaryMobile){
                    msg = 'Unable to delete primary mobile!';
                }
                return msg

            },

            // Landline ========================
            getSelectedRowLandline (){

                if ( this.actionType == 'add' ) {
                    return ''}

                const i = this.selectedIndex;
                return this.landlines[i] ? this.landlines[i].landline : "";

            },

            checkPrimaryLandline (){

                let is_primary = false;
                if(this.getSelectedRowLandline == this.primaryLandline.landline){
                    is_primary = true;
                }
                
                return is_primary
            },

            checkHasPrimaryLandline () {

                let has_primary = false;
                for ( const x in this.landlines ){
                    if ( this.landlines[x].primary ) {
                        has_primary = true;
                    }
                }

                return has_primary

            },  

            setDeleteLandlineMsg (){

                let msg = `You have selected ${this.getSelectedRowLandline} to be deleted. Would you like to proceed?`;
                if (this.getSelectedRowLandline && this.checkPrimaryLandline){
                    msg = 'Unable to delete primary landline!';
                }
                return msg

            },

            // Social Media ========================
            getSelectedRowSocMed (){
                
                if ( this.actionType == 'add' ) {
                    return ''}
                
                const i = this.selectedIndex;
                return this.soc_meds[i] ? this.soc_meds[i] : "";

            },

        },
        mounted() {

            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getContact();
            
        }

    }            
</script>

<template>

<!--<div class="container-fluid p-0 div-border ">-->
<div class="container-fluid p-0">
    <!--<div class="row mx-0">
        <div class="col-12 content-header p-4">
            <h3>Contact Information</h3>
        </div>
    </div>-->
    
    <div class="row px-4 pt-4">
        <div class="col-12">
            <div class="table-responsive tableFixHead div-border">

                <div style="text-align: right;" class="p-2">

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        @click="toggleModal('add', 'email')">
                        <span class="fas fa-plus"></span>&nbsp;Add
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_email}" @click="toggleModal('confirm', 'email')">
                        <span class="fas fa-edit"></span>&nbsp;Edit
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_email}" @click="toggleModal('delete', 'email')">
                        <span class="fas fa-trash"></span>&nbsp;Delete
                    </MaterialButton>

                </div>

                <div class="contact-content">
                    <table class="table table-striped table-fixed " >
                        <thead class="thead bg-header">
                            <tr>
                                <th>Email Address</th>
                                <th>Primary</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(v, k) in alt_emails" class="select_row" :class="{selected_row: v.selected}" @click="selectRowEmail(k)">
                                <td>{{v.email}}</td>
                                <td>
                                    <div class="form-check form-switch d-flex align-items-center ps-6">
                                        <input class="form-check-input" type="radio" disabled :checked="v.primary" 
                                        v-model="primaryEmail.email" :value="v.email">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

    <div class="row px-4 ">
        <div class="col-12">
            <div class="table-responsive tableFixHead div-border">

                <div style="text-align: right;" class="p-2">

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        @click="toggleModal('add', 'mobile')">
                        <span class="fas fa-plus"></span>&nbsp;Add
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_mobile}" @click="toggleModal('confirm', 'mobile')">
                        <span class="fas fa-edit"></span>&nbsp;Edit
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_mobile}" @click="toggleModal('delete', 'mobile')">
                        <span class="fas fa-trash"></span>&nbsp;Delete
                    </MaterialButton>

                </div>

                <div class="contact-content">
                    <table class="table table-striped table-fixed " >
                        <thead class="thead bg-header">
                            <tr>
                                <th>Mobile Number</th>
                                <th>Primary</th>
                            </tr>
                        </thead>

                        <tbody>
                            
                            <tr v-for="(v, k) in mobiles" class="select_row" :class="{selected_row: v.selected}" @click="selectRowMobile(k)">
                                <td>{{v.mobile}}</td>
                                <td>
                                    <div class="form-check form-switch d-flex align-items-center ps-6">
                                        <input class="form-check-input" type="radio" disabled :checked="v.primary" 
                                        v-model="primaryMobile.mobile" :value="v.mobile">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
    
    <div class="row px-4 ">
        <div class="col-12">
            <div class="table-responsive tableFixHead div-border">

                <div style="text-align: right;" class="p-2">

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        @click="toggleModal('add', 'landline')">
                        <span class="fas fa-plus"></span>&nbsp;Add
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_landline}" @click="toggleModal('confirm', 'landline')">
                        <span class="fas fa-edit"></span>&nbsp;Edit
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_landline}" @click="toggleModal('delete', 'landline')">
                        <span class="fas fa-trash"></span>&nbsp;Delete
                    </MaterialButton>

                </div>

                <div class="contact-content">
                    <table class="table table-striped table-fixed " >
                        <thead class="thead bg-header">
                            <tr>
                                <th>Landline Number</th>
                                <th>Primary</th>
                            </tr>
                        </thead>

                        <tbody>
                            
                            <tr v-for="(v, k) in landlines" class="select_row" :class="{selected_row: v.selected}" @click="selectRowLandline(k)">
                                <td>{{v.landline}}</td>
                                <td>
                                    <div class="form-check form-switch d-flex align-items-center ps-6">
                                        <input class="form-check-input" type="radio" disabled :checked="v.primary" 
                                        v-model="primaryLandline.landline" :value="v.landline">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
    
    <div class="row px-4 ">
        <div class="col-12">
            <div class="table-responsive tableFixHead div-border">

                <div style="text-align: right;" class="p-2">

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        @click="toggleModal('add', 'soc_med')">
                        <span class="fas fa-plus"></span>&nbsp;Add
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_soc_med}" @click="toggleModal('confirm', 'soc_med')">
                        <span class="fas fa-edit"></span>&nbsp;Edit
                    </MaterialButton>&nbsp;

                    <MaterialButton variant="gradient" color="light" size="sm" class="mb-0 action-btn command-btn" 
                        :class="{disabled: is_disabled_soc_med}" @click="toggleModal('delete', 'soc_med')">
                        <span class="fas fa-trash"></span>&nbsp;Delete
                    </MaterialButton>

                </div>

                <div class="contact-content">
                    <table class="table table-striped table-fixed" >
                        <thead class="thead bg-header">
                            <tr>
                                <th colspan="2">Social Media</th>
                            </tr>
                        </thead>

                        <tbody class="soc_med">
                            <tr v-for="(v, k) in soc_meds" class="select_row" :class="{selected_row: v.selected}" @click="selectRowSocMed(k)">
                                <td>{{v.soc_med_name}}</td>
                                <td>{{v.soc_med}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
    <div class="row">
        <Teleport to="body">
            <ContactEmailModals 
                v-if="modalEmailShow"
                @close="modalEmailShow = !modalEmailShow" 
                @continueEdit="continueEdit" 
                @addEmail="checkEmail" 
                @updateEmail="checkEmail" 
                @deleteEmail="deleteEmail" 
                :show="modalEmailShow" 
                :selectedIndex="selectedIndex"
                :selectedEmail="getSelectedRowEmail"
                :type="actionType"
                :isPrimaryEmail="checkPrimaryEmail"
                :preregEmail="prereg_email"
                :validateEmail="validateEmail">

                <template #body 
                    v-if="actionType == 'delete'">
                    <h5 class="alert-message" >{{setDeleteEmailMsg}}</h5>
                </template>

                <template #body>
                    <h5 class="alert-message" v-if="actionType == 'confirm' && prereg_email == getSelectedRowEmail">
                        Updating main email is unavailable for now.</h5>
                    <h5 class="alert-message" v-else>You have selected {{getSelectedRowEmail}} to be edited. Would you like to proceed?</h5>
                </template>

            </ContactEmailModals>

            <ContactMobileModals 
                v-if="modalMobileShow"
                @close="() => { modalMobileShow = !modalMobileShow; 
                        newMobileNumberVal = ''; }" 
                @continueEdit="continueEdit" 
                @addMobile="checkMobile" 
                @updateMobile="checkMobile" 
                @deleteMobile="deleteMobile" 
                :show="modalMobileShow" 
                :selectedIndex="selectedIndex"
                :selectedMobile="newMobileNumberVal ? newMobileNumberVal : getSelectedRowMobile"
                :type="actionType"
                :isPrimaryMobile="checkPrimaryMobile"
                :hasPrimary="checkHasPrimaryMobile"
                :validateMobile="validateMobile">

                <template #body 
                    v-if="actionType == 'delete'">
                    <h5 class="alert-message" >{{setDeleteMobileMsg}}</h5>
                </template>

                <template #body 
                    v-if="actionType == 'confirm'">
                    <h5 class="alert-message" >You have selected {{getSelectedRowMobile}} to be edited. Would you like to proceed?</h5>
                </template>

            </ContactMobileModals>

            <ContactLandlineModals 
                v-if="modalLandlineShow"
                @close="() => { modalLandlineShow = !modalLandlineShow; 
                        newLandlineNumberVal = ''; }" 
                @continueEdit="continueEdit" 
                @addLandline="checkLandline" 
                @updateLandline="checkLandline" 
                @deleteLandline="deleteLandline" 
                :show="modalLandlineShow" 
                :selectedIndex="selectedIndex"
                :selectedLandline="newLandlineNumberVal ? newLandlineNumberVal : getSelectedRowLandline"
                :type="actionType"
                :isPrimaryLandline="checkPrimaryLandline"
                :hasPrimary="checkHasPrimaryLandline"
                :validateLandline="validateLandline">

                <template #body 
                    v-if="actionType == 'delete'">
                    <h5 class="alert-message" >{{setDeleteLandlineMsg}}</h5>
                </template>

                <template #body 
                    v-if="actionType == 'confirm'">
                    <h5 class="alert-message" >You have selected {{getSelectedRowLandline}} to be edited. Would you like to proceed?</h5>
                </template>

            </ContactLandlineModals>

            <ContactSocMedModals 
                v-if="modalSocMedShow"
                @close="modalSocMedShow = !modalSocMedShow" 
                @continueEdit="continueEdit" 
                @addSocMed="addSocMed" 
                @updateSocMed="updateSocMed" 
                @deleteSocMed="deleteSocMed" 
                :show="modalSocMedShow" 
                :selectedIndex="selectedIndex"
                :selectedSocMed="getSelectedRowSocMed"
                :type="actionType"
                :socMedsList="socMedsList"
                :validateSocMed="validateSocMed">

                <template #body 
                    v-if="actionType == 'delete'">
                    <h5 class="alert-message" >You have selected {{getSelectedRowSocMed.soc_med_name}} {{getSelectedRowSocMed.soc_med}} to be deleted. Would you like to proceed?</h5>
                </template>
                <template #body 
                    v-if="actionType == 'confirm'">
                    <h5 class="alert-message" >You have selected {{getSelectedRowSocMed.soc_med_name}} {{getSelectedRowSocMed.soc_med}} to be edited. Would you like to proceed?</h5>
                </template>

            </ContactSocMedModals>

            <!-- Success Loader -->
            <StandardModal 
                @close="modalLoaderShow = !modalLoaderShow"
                :show="modalLoaderShow" 
                :hasClose=true
                size="dialog-sm"
                >
                <template v-if="isLoading" #body>
                    <Loader v-if="isLoading"></Loader>
                </template>

                <template v-if="!isLoading" #body>
                    <div style="text-align: center">
                        <h5 class="alert-message" v-if="actionType == 'delete'"> Successfully deleted. </h5>
                        <h5 class="alert-message" v-if="actionType == 'edit'"> Successfully updated. </h5>
                        <h5 class="alert-message" v-if="actionType == 'add'"> Successfully added. </h5>
                        <span>&nbsp;</span>
                    </div>
                </template>

            </StandardModal>

            <!-- confirm primary -->
            <StandardModal 
                @close="confirmPrimary = !confirmPrimary"
                :show="confirmPrimary" 
                hasFooter="true"
                size="dialog-md"
                hasClose="true"
                >

                <template #body>
                    <h5>Primary number is already set. Are you sure you want to change it?</h5>
                </template>

                <template #footer>

                    <MaterialButton size="sm" variant="contained" color="success" class="mb-0" @click="continuePrimary">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="secondary" class="mb-0" @click="closeConfirmPrimary">
                        no
                    </MaterialButton>

                </template>
            </StandardModal>

        </Teleport>
    </div>

</div>
</template>

<style scoped>
    h5{
        font-size:1rem;
    }
    .content-header {
        justify-content: space-between !important;
        display: flex;
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    #module-title {
        color: #002315;
        font-size: 1.5rem;
        line-height: 1.375;
        font-weight: 600;
        letter-spacing: -0.05rem;
    }
    .right-floater{
        float:right;
    }
    
    .thead{
        color:white!important;
        background-color: #002315;
    }
    .btn-light{
        background-color: #4caf50;
        margin-bottom: 0; 
        padding: 1px 5px;
        box-shadow: unset;
        border-radius: 5px;
        border: 1px solid #a9b7b1 !important;
    }
    .btn-light:hover{
        background-color: #4caf50;
        box-shadow: unset
        
    }
    thead tr th:first-child {
        width: 90% !important;
    }
    tbody tr td:first-child {
        width: 90% !important;
    }
    .soc_med tr td:first-child {
        width: 30% !important;
    }
    .thead {
        top:0;
        position: sticky;
        z-index: 1
    }

    .contact-content{
        max-height: 20vh;
        overflow-y: auto; 
    }
    .action-btn{
        color:#212529!important;
        border-radius: 5px;
    }
    /*.action-btn:hover{
        color: #fff !important;
        border-radius: 5px;
    }*/

    .alert-message {
        padding-top: unset;
    }
    
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
        margin-bottom: 10px;
    }
</style>