<script setup>
    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import addIcon from "@/assets/img/add-icon.svg";
    import editIcon from "@/assets/img/edit-icon.svg";
    import deleteIcon from "@/assets/img/delete-icon.svg";
    import api  from "@/static/config.json";
    import axios from 'axios';
    import AddCharRef from "./Modals/CharacterReference/addCharacterRef.vue";
    import ModifyCharRef from "./Modals/CharacterReference/modifyCharacterRef.vue";
    import DeleteCharRef from "./Modals/CharacterReference/deleteCharacterRef.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import ThePagination from "./ThePagination.vue";
    import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
    const { type } = useWindowsWidth();
</script>
<script>
    export default {
        data(){
            return{
                API_URL:'',
                charRef:[],
                stored_data:{
                    id: '',
                    name: '',
                    prof_relation: '',
                    yearsknown:'',
                    company:'',
                    contact_mobile: '',
                    contact_email: '',
                    link_regid: '',
                },
                char_ref_form:{
                    name:'',
                    prof_relation: '',
                    years_known:'',
                    company:'',
                    contact_mobile: '',
                    contact_email: '',
                    jobseeker_id: '',
                    id:'',
                    type:'',
                },
                records: {
                    success: false,
                    data:{
                        data:[],
                    },
                },
                pagination: {
                    current: 1,
                    limit: 10,
                },
                contactPrefixes:[
                    {value:'09',display:'09'},
                    {value:'+639',display:'+639'}
                ],
                contactPrefix:'',
                showAdd:false,
                showEmpty:false,
                showSuccess:false,
                showModify:false,
                showDelete:false,
                showMessage:false,
                message:{data:''},
                showDialog:false,
                confirm:{data:false},
                showPrompt:{data:false},
                initialLoad:{data:false},
                loader:false,
                is_disabled: {data:true},
                selected_index:{data:''},
                stored_selected:{data:''},
                tempData:{},
            }
        },
        methods:{
            emptyField(data){
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
                this.char_ref_form.contact_mobile= '';
                this.char_ref_form.contact_email= '';
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
            deleteCharRef(data){
                
                this.showDelete = !this.showDelete;

                if(this.showDelete == true){
                    this.char_ref_form.name=data.name;
                    this.char_ref_form.prof_relation= data.prof_relation;
                    this.char_ref_form.years_known=data.years_known;
                    this.char_ref_form.company=data.company;
                    this.char_ref_form.contact_mobile= data.contact;
                    this.char_ref_form.contact_email= data.email;
                    this.char_ref_form.id = data.id;
                }
                else{
                    this.clearAddForm();
                }
            },
            removeCharRef(data){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                let deleteData = data;
                deleteData.jobseeker_id = ID;
                //this.loader = true;
                axios.post(this.API_URL+'/delete-character/onboarding',
                    deleteData,
                    {
                        headers: { Authorization: `Bearer ${token}`}
                    }

                ).then((response)=>{
                    if (response.data.success){
                        //console.log();
                        this.loader = false;
                        this.message.data = 'Successfully deleted.'
                        //this.removeItemInsideTheCharRefArray(deleteData);
                        this.fetchNewData();
                        this.showAdd = false;
                        this.showModify = false;
                        this.showDelete = false;
                        this.showSuccess = true;
                        this.showMessage = false;
                        this.showDialog = false;
                        //this.toggleModal();
                        
                    }   
                }).catch((err)=>{
                    if(err.response.status == 401){
                        alert('Session Expired.Please Relogin.')
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });

            },
            modifyCharRef(data){
                /*this.showModify = !this.showModify;
                if(this.showModify){
                    this.char_ref_form.name=data.name;
                    this.char_ref_form.prof_relation= data.prof_relation;
                    this.char_ref_form.years_known=data.yearsknown;
                    this.char_ref_form.company=data.company;
                    this.char_ref_form.contact_mobile= data.contact_mobile;
                    this.char_ref_form.contact_email= data.contact_email;
                    this.char_ref_form.id = data.id;
                    //this.char_ref_form.jobseeker_id= '';
                    this.confirm.data=false;
                    this.showPrompt.data = false;
                }
                else{
                    this.clearAddForm();
                    this.clearErrorMessage();
                }*/
                this.showModify = true;
                this.char_ref_form.name=data.name;
                this.char_ref_form.prof_relation= data.prof_relation;
                this.char_ref_form.years_known=data.yearsknown;
                this.char_ref_form.company=data.company;
                this.char_ref_form.contact_mobile= data.contact_mobile;
                this.char_ref_form.contact_email= data.contact_email;
                this.char_ref_form.id = data.id;
                //this.char_ref_form.jobseeker_id= '';
                this.confirm.data=false;
                this.showPrompt.data = false;
                //console.log("modify : "+data.cr_id);

            },
            showPrompter(data){
                this.showPrompt.data = !this.showPrompt.data;
                if(this.showPrompt.data){
                    this.char_ref_form.name=data.name;
                    this.char_ref_form.prof_relation= data.prof_relation;
                    this.char_ref_form.years_known=data.yearsknown;
                    this.char_ref_form.company=data.company;
                    this.char_ref_form.contact_mobile= data.contact_mobile;
                    this.char_ref_form.contact_email= data.contact_email;
                    this.char_ref_form.id = data.id;
                }
                else{
                    this.clearAddForm();
                    this.resetSelected();
                    //this.clearErrorMessage();
                }
            },
            toggleModal(){
                this.showAdd = !this.showAdd;
                if(this.showError){
                    this.showError = !this.showError;
                }
            },
            async addCharRef(data){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                let insertData = data;
                //console.log(insertData);
                let type = insertData.type;
                insertData.jobseeker_id= ID;
                this.showModify = false;
                this.showAdd = false;
                this.loader = true;
                await axios.post(this.API_URL+'/update-character/onboarding',
                    insertData,
                    {
                        headers: { Authorization: `Bearer ${token}`}
                    }

                ).then((response)=>{
                    if (response.data.success){
                        this.loader = false;
                        if(type == 'add'){
                            let data = response.data.data;
                            data.selected = false;
                            this.showEmpty = false;
                            //this.charRef.push(data);
                            this.fetchNewData();
                            this.resetSelected(); 
                            this.is_disabled.data  = true;
                            this.message.data = 'Successfully added.'
                        }
                        else{
                            //this.editItemInsideTheCharRefArray(response.data.data);
                            this.fetchNewData();
                            this.selected_index.data = -1;
                            this.is_disabled.data  = true;
                            this.confirm.data = false;
                            this.resetSelected(); 
                            this.message.data = 'Successfully updated.'
                        }
                        this.showMessage = false;
                        this.showDialog = false;
                        this.showAdd = false;
                        this.showModify = false;
                        this.showSuccess = true;
                }   
                }).catch((err)=>{
                if(err.response.status == 401){
                    alert('Session Expired.Please Relogin.')
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');

                    this.$router.push('/'); 
                }
                });
                this.getRecords();
            },
            toggleAddSuccess(){
                this.showSuccess= !this.showSuccess;
            },
            getData(){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                this.charRef = [];
                axios.post(this.API_URL+'/get-character/onboarding',{
                    jobseeker_id:ID
                },{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    if(response.data.data == null){
                        this.showEmpty = true;
                    }
                    else{
                        this.showEmpty = false;
                        for(var i=0;i<response.data.data.length;i++){
                            this.charRef.push(response.data.data[i]);
                        }
                        
                    }   
                }).catch((err)=>{

                    //this.error_message = err.response.data;
                    if(err.response.status == 401){
                        //this.error_message = {'Unauthorized': [err.response.data.message+" Please relogin."]} ;
                        alert('Session Expired.Please Relogin.');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
            },
            editItemInsideTheCharRefArray(data){
                for(var i = 0; i < this.charRef.length; i++){
                    if(this.charRef[i].id == data.id){
                        this.charRef[i].name = data.name;
                        this.charRef[i].prof_relation = data.prof_relation;
                        this.charRef[i].yearsknown = data.yearsknown;
                        this.charRef[i].company = data.company;
                        this.charRef[i].contact_mobile = data.contact_mobile;
                        this.charRef[i].contact_email = data.contact_email;
                    }
                }
            },
            removeItemInsideTheCharRefArray(data){ 
                for(var i = 0; i < this.charRef.length; i++){
                    if(this.charRef[i].id == data.id){
                        this.charRef.splice(i,1);
                    }
                }
                if(this.charRef.length == 0){
                    this.showEmpty = true;
                }
            },
            selectRow( data ){
                if(this.selected_index.data == data){
                    this.selected_index.data = -1;
                    this.is_disabled.data  = true;
                    this.resetSelected(); 
                }
                else{
                    this.is_disabled.data = false;
                    this.resetSelected();
                    this.charRef[data].selected = (typeof data == 'number') ? true : false;
                    this.selected_index.data = data;
                }
            },
            resetSelected (){
                for(const x in this.charRef){
                    this.charRef[x].selected = false;
                }
            },
            showChanges(data){
                this.showModify = false;
                this.tempData = data;
                console.log(this.tempData);
                this.showDialog = true;
                
            },
            validateData(data){
                this.char_ref_form.name=data.name;
                this.char_ref_form.prof_relation= data.prof_relation;
                this.char_ref_form.years_known=data.years_known;
                this.char_ref_form.company=data.company;
                this.char_ref_form.contact_mobile= data.contact;
                this.char_ref_form.contact_email= data.email;
                this.char_ref_form.id = data.id;
                this.showDialog = false;
                this.showModify = true;
                this.confirm.data = true;
            },
            closeModule(){
                this.showDialog = false;
                this.showModify = false;
                this.selected_index.data = -1;
                //this.selected_subIndex.data = -1;
                this.is_disabled.data  = true;
                this.resetSelected(); 
            },
            closeDialog(){
                //this.showModify = true;
                //console.log(this.skillObj);
                this.showDialog = false;
                this.modifyCharRef(this.charRef[this.selected_index.data]);
                
            },
            currentPage(val) {
                this.pagination.current = val;
                console.log(this.pagination.current);
                this.getRecords();
            },
            fetchNewData(){
                this.records.success = false;
                this.pagination.current = 1;
                this.getRecords();
            },
            getRecords(){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                this.is_disabled.data = true;
                this.initialLoad.data = true;
                this.charRef.splice(0);
                this.charRef = [];
                let data = this.pagination;
                console.log(data);

                //console.log('hey');
                axios.get(this.API_URL+'/get-character/onboarding?',{
                        params:{
                        jobseeker_id:ID,
                        page:data.current,
                        limit:data.limit
                    },
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    this.initialLoad.data = false;
                        if(response.data.data.length == 0){
                            this.showEmpty = true;
                        }
                        else{
                            //console.log(response.data.data.data);
                            this.records.success = response.data.success;
                            //console.log(response.data.success);
                            this.records.data = response.data.data;
                            this.showEmpty = false;
                            this.charRef = [];
                            //console.log(this.charRef);
                            for(var i=0;i<response.data.data.data.length;i++){
                                this.charRef.push(response.data.data.data[i]);
                                this.charRef[i].selected = false;
                            }
                            /*for(var i=0;i<this.records.data.data.length;i++){
                                //this.charRef.push(response.data.data.data[i]);
                                this.records.data.data[i].selected = false;
                                //this.charRef[i].selected = false;
                            }*/

                            //console.log(this.records.data);

                            
                            
                        }
                }).catch((err)=>{
                    this.initialLoad.data = false;
                    console.log(err);
                    //this.error_message = err.response.data;
                    if(err.response.status == 401){
                        //this.error_message = {'Unauthorized': [err.response.data.message+" Please relogin."]} ;
                        alert('Session Expired.Please Relogin.');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
            }
            
        },
        
        mounted () {
            this.API_URL = api.DEV_API_URL;
            const token = localStorage.getItem('token');
            const ID = localStorage.getItem('userid');
            this.is_disabled.data = true;
            this.initialLoad.data = true;

            let data = this.pagination;


            //console.log('hey');
            axios.get(this.API_URL+`/get-character/onboarding?&jobseeker_id=${ID}
                    &page=${data.currentPage}&limit=${data.limit}`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }).then((response)=>{
                this.initialLoad.data = false;
                    if(response.data.data.data.length == 0){
                        this.showEmpty = true;
                    }
                    else{
                        //console.log('hey');
                        //console.log(response.data.data.data);
                        this.records.success = response.data.success;
                        //console.log(response.data.success);
                        this.records.data = response.data.data;
                        
                        this.showEmpty = false;
                        
                        /*for(var i=0;i<this.records.data.data.length;i++){
                            //this.charRef.push(response.data.data.data[i]);
                            this.records.data.data[i].selected = false;
                            //this.charRef[i].selected = false;
                        }*/
                        for(var i=0;i<response.data.data.data.length;i++){
                            this.charRef.push(response.data.data.data[i]);
                            this.charRef[i].selected = false;
                        }
                       // console.log(this.records.data.data);
                        
                        
                    }
            }).catch((err)=>{
                this.initialLoad.data = false;
                console.log(err);
                //this.error_message = err.response.data;
                if(err.response.status == 401){
                    //this.error_message = {'Unauthorized': [err.response.data.message+" Please relogin."]} ;
                    alert('Session Expired.Please Relogin.');
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');

                    this.$router.push('/'); 
                }
            });

            //console.log(this.charRef);
        }
    }
</script>
<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">
        <div class="row mx-0 mb-0">
            <!--<div v-if="type == 'desktop'" class="col-md-12 content-header p-4  px-3">-->
            <div v-if="type == 'desktop'" class="col-md-12 p-0 pb-2">
                <div class="row">
                    <!--<div class="col-6">
                        <h3 id="h5">Character Reference</h3>
                    </div>-->
                    <div class="col-12">
                        <div class="right-floater" v-if="!initialLoad.data">
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" @click="toggleModal">
                            <span class="fas fa-plus fa-sm"></span>&nbsp;Add</MaterialButton>
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="showPrompter(charRef[selected_index.data])">
                            <span class="fas fa-edit" ></span>&nbsp;Edit</MaterialButton>
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="deleteCharRef(charRef[selected_index.data])">
                            <span class="fas fa-trash" ></span>&nbsp;Delete</MaterialButton>
                        </div>
                    </div>
                </div> 
            </div>
            <!--<div v-else class="col-md-12 content-header p-4 pb-3 px-3">-->
            <div v-else class="col-md-12 p-0 pb-2">
                <div class="row">
                    <!--<div class="col-md-6">
                        <h3 id="h5" class="text-center">Character Reference</h3>
                    </div>-->
                    <div class="col-md-12">
                        <div class="right-floater" v-if="!initialLoad.data">
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" @click="toggleModal">
                            <span class="fas fa-plus fa-sm"></span></MaterialButton>
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="showPrompter(charRef[selected_index.data])">
                            <span class="fas fa-edit" ></span></MaterialButton>
                            <MaterialButton variant="gradient" color="light" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="deleteCharRef(charRef[selected_index.data])">
                            <span class="fas fa-trash" ></span></MaterialButton>
                        </div>
                    </div>
                </div>
            </div>
            <!--<div class="col-12 content-header p-4 pb-3 px-3">
                <h3 id="h5">Character Reference</h3>
                <div class="right-floater">
                    <MaterialButton variant="gradient" color="success" class="btn-color mx-1 mb-0" @click="toggleModal">
                    <img :src="addIcon" />&nbsp;Add</MaterialButton>
                    <MaterialButton variant="gradient" color="success" class="btn-color mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="modifyCharRef(charRef[selected_index.data])">
                    <span class="fas fa-edit" ></span>&nbsp;Edit</MaterialButton>
                    <MaterialButton variant="gradient" color="success" class="btn-color mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="deleteCharRef(charRef[selected_index.data])">
                    <span class="fas fa-trash" ></span>&nbsp;Delete</MaterialButton>
                </div>

            </div>-->
            
           
            <Teleport to="body">
                <AddCharRef
                    v-if="showAdd"
                    @close="showAdd = !showAdd"
                    @addCharacter = "addCharRef"
                    :show="showAdd"
                >
                </AddCharRef>
                <ModifyCharRef
                    v-if="showModify"
                    @close="showModify = false"
                    @modifyCharacter = "addCharRef"
                    @dialog="showChanges"
                    :confirm="confirm.data"
                    :show="showModify"
                    :data="char_ref_form"
                >

                </ModifyCharRef>
                <DeleteCharRef
                    v-if="showDelete"
                    @close="showDelete = !showDelete"
                    @deleteCharacter = "removeCharRef"
                    :show="showDelete"
                    :data="char_ref_form"
                >

                </DeleteCharRef>
                <StandardModal 
                :show="loader" 
                @close="loader = false"
                :hasClose=true
                :hasHeader=false
                :hasFooter=false
                title="Dialog"
                size="dialog-sm"
                :isScrollable=true>
                    <template #body>
                        <div class="text-center">
                            <Loader v-if="loader"></Loader>
                        </div>
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
                    <template #body>
                        <div class="text-center">
                            <h5 id="h4">{{message.data}}</h5>
                            <span>&nbsp;</span>
                        </div>
                    </template>
                </StandardModal>
                <StandardModal 
                :show="showDialog" 
                :hasClose=true
                @close="closeDialog"
                :hasHeader=false
                :hasFooter="!loader"
                title="Dialog"
                size="dialog-md"
                :isScrollable=true>

                    <template #body>
                        <Loader v-if="loader"></Loader>
                        <div class="text-left">
                            <h5 id="h4" v-if="!loader" style="font-size:1rem;">Do you want to save changes?</h5>
                        </div>
                    </template>
                    
                    <template #footer>
                        <MaterialButton size="sm" variant="gradient" color="white" class="yes-btn mb-0" v-if="!loader" @click="validateData(tempData)">
                            Yes
                        </MaterialButton>&nbsp;
                        <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" v-if="!loader" @click="closeModule">
                            no
                        </MaterialButton>&nbsp;
                        <!--<MaterialButton size="sm" variant="contained" color="secondary" class="mb-0" v-if="!loader" @click="closeDialog">
                            cancel
                        </MaterialButton>-->
                    </template>

                </StandardModal>
                <StandardModal 
                v-if="showPrompt.data"
                :show="showPrompt.data" 
                @close="showPrompter(charRef[selected_index.data])"
                :hasClose=true
                :hasHeader=false
                :hasFooter=true
                title="Dialog"
                size="dialog-md"
                :isScrollable=true>
                    <template #body>
                        <div class="text-left">
                            <h5 id="h4" style="font-size:1rem;">You have selected <strong>{{char_ref_form.name}} </strong> to be edited. Would you like to proceed?</h5>
                        </div>
                    </template>
                    <template #footer>
                        <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="modifyCharRef(charRef[selected_index.data])">
                            Yes
                        </MaterialButton>&nbsp;
                        <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="showPrompter(charRef[selected_index.data])">
                            No
                        </MaterialButton>
                    </template>
                </StandardModal>
                
            </Teleport>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <Loader v-if="initialLoad.data"></Loader>
                <div class="table-responsive table-height" v-if="!initialLoad.data">
                    <table class="table table-striped table-fixed p-0" >
                        <thead class="thead table-fix-head bg-header">
                            <tr>
                                <th scope="col">
                                    Name
                                </th>
                                <th scope="col">
                                    Professional Relationship
                                </th>
                                <th scope="col">
                                    Company Name
                                </th>
                                <th scope="col">
                                    E-mail Address
                                </th>
                                <th scope="col">
                                    Contact Number
                                </th>
                                <!--<th scope="col">
                                    &nbsp;
                                </th>-->
                            </tr>
                        </thead>
                        <tbody v-if="!initialLoad.data"> 
                            
                            <tr v-if="showEmpty">
                                <td colspan="6" style="text-align:center!important;">No Info Available</td>
                            </tr>
                            <tr v-if="!showEmpty" v-for="(v, k) in charRef" class="select_row" :class="{selected_row: v.selected}" @click="selectRow(k)">
                                <td>
                                    {{v.name}}
                                </td>
                                <td>
                                    {{v.prof_relation}}
                                </td>
                                <td>
                                    {{v.company}}
                                </td>
                                <td>
                                    {{v.contact_email}}
                                </td>
                                <td>
                                    {{v.contact_mobile}}
                                </td>
                                <!--<td>
                                    <MaterialButton color="none" size="sm" @click=""> <img :src="editIcon" /></MaterialButton>
                                    <MaterialButton color="none" size="sm"> <img :src="deleteIcon" @click="deleteCharRef(v)"/></MaterialButton>
                                </td>-->
                            </tr>
                            <tr v-if="!showEmpty && charRef.length < 10" v-for="n in 10 - charRef.length">
                                <td>
                                    &nbsp;
                                </td>
                                <td>
                                    &nbsp;
                                </td>
                                <td>
                                    &nbsp;
                                </td>
                                <td>
                                    &nbsp;
                                </td>
                                <td>
                                    &nbsp;
                                </td>
                            </tr>
                            
                        </tbody>
                        
                    </table>
                </div>
                <div class="right-floater mt-n3">
                    <the-pagination v-if="records.success && !initialLoad.data" :records="records" @currentPage="currentPage">
                    </the-pagination>
                </div>
                
            </div>
        </div>
    </div>
</template>
<style scoped>
    .table-fix-head{
        top:0;
        position: sticky;
        z-index:0;
    }
    tr{
        z-index:-1;
    }
    
    tr,th{
        text-align: center;
    }
    .table-height{
        max-height: 512px;
    }
    .thead{
        color: white !important;
        background-color: #002315;
    }
    .content-header {
        /*justify-content: space-between !important;*/
        
        margin: 0;
        border-bottom: 2px solid #dde1e1;
    }
    body{
        color:black!important;
    }
    .error-font{
        color:red !important;
        font-size: x-small;
    }
    .btn-color{
        color:#002315!important;
    }
    .btn-color:hover{
        color: #fff!important;
    } 
    .right-floater{
        float:right!important;
    }
    #h4{
        color:#002315;
        font-family: 'Inter' !important;
        text-align: center;
    }
    #h5{
        color:#002315
    }

    #h2{
        color:black;
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
    }
    #modal-dialog {
        max-width: 1000px !important;
    }
    

    .input-group-outline { 
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>