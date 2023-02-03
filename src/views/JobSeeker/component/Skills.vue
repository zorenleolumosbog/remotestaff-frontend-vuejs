<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    import addIcon from "@/assets/img/add-icon.svg";
    import editIcon from "@/assets/img/edit-icon.svg";
    import deleteIcon from "@/assets/img/delete-icon.svg";
    import api  from "@/static/config.json";
    import axios from 'axios';
    import AddSkill from "./Modals/Skills/AddSkill.vue";
    import ModifySkill from "./Modals/Skills/ModifySkill.vue";
    import DeleteSkill from "./Modals/Skills/DeleteSkill.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
    const { type } = useWindowsWidth();
    

</script>
<script>
    export default {
        data(){
            return {
                API_URL:'',
                showAdd:false,
                showEmpty:false,
                showSuccess:false,
                showModify:false,
                showDelete:false,
                showMessage:false,
                showDialog:false,
                message:{data:''},
                loader:false,
                initialLoad:{data:true},
                is_disabled: {data:true},
                selected_index:{data:''},
                selected_subIndex:{data:''},
                stored_selected:{data:''},
                showPrompt:{data:false},
                skillObj:{
                    id:'',
                    link_regid:'',
                    link_skill_id: '',
                    link_level_id: '',
                    createdby: '',
                    datecreated: '',
                    modifiedby: '',
                    datemodified: '',
                    skill_type: '',
                    skill_level: ''
                },
                tempData:{},
                levels:[],
                skills:[],
                jobseekerSkills:[],

            }
        },
        methods:{
            async addSkillPost(data){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                let insertData;
                this.loader = true;
            
                if(data.type=='add'){
                    insertData = data;
                    this.showAdd = false;
                }
                else{
                    insertData={
                        id:data.id,
                        skill:data.link_skill_id,
                        level:data.link_level_id,
                        type:data.type,
                        jobseeker_id:'',
                    };
                    this.showModify = false;
                }
                let type = insertData.type;
                insertData.jobseeker_id= ID;
                await axios.post(this.API_URL+'/update-skills/onboarding',
                    insertData,
                    {
                        headers: { Authorization: `Bearer ${token}`}
                    }

                ).then((response)=>{
                    if (response.data.success){
                        this.loader = false;
                        if(type == 'add'){
                            console.log('hey');
                            let data = response.data.data;
                            this.addSkillInArray(data);

                            this.showAdd = false;
                            this.showModify = false;
                            this.showDialog = false;
                            this.showSuccess = true;
                            this.tempData = '';
                            this.showMessage = false;
                        }
                        else{
                            //console.log(data);
                            this.modifySkillInArray(data);
                            //this.editItemInsideTheCharRefArray(response.data.data);
                            this.selected_index.data = -1;
                            this.selected_subIndex.data = -1;
                            this.is_disabled.data  = true;
                            this.resetSelected(); 

                            this.showAdd = false;
                            this.showModify = false;
                            this.showDialog = false;
                            this.showSuccess = true;
                            this.tempData = '';
                            this.showMessage = false;
                        }

                        
                }   
                }).catch((err)=>{
                    this.loader = false;
                    //this.showAdd = false;
                    if((err.response.status == 422)&&(type == 'add')){
                        //console.log('hey');
                        this.showAdd = !this.showAdd;
                        this.showMessage = true;
                        this.message.data = "This skill is already exists.";
                        this.tempData = '';
                    }
                    if((err.response.status == 422)&&(type == 'edit')){
                        this.showModify = true;
                        this.showDialog = false;
                        this.showMessage = true;
                        this.message.data = "This skill is already exists.";
                    }
                    if(err.response.status == 401){
                        alert('Session Expired.Please Relogin.')
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
            },
            deleteSkillPost(data){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                let insertData = data;
                axios.post(this.API_URL+'/delete-skills/onboarding',
                    {
                        jobseeker_id:insertData.link_regid,
                        id:insertData.id,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}`}
                    }

                ).then((response)=>{
                    if (response.data.success){
                        this.loader = false;
                        this.deleteSkillInArray(insertData);
                        this.showDelete =false;
                        this.showAdd = false;
                        this.showModify = false;
                        this.showSuccess = true;
                        this.selected_index.data = -1;
                        this.selected_subIndex.data = -1;
                        this.is_disabled.data  = true;
                        this.resetSelected(); 
                    }   
                }).catch((err)=>{
                //console.log(err);
                if(err.response.status == 401){
                    alert('Session Expired.Please Relogin.')
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');

                    this.$router.push('/'); 
                }
                });
            },
            toggleMessage(){
                this.showMessage = !this.showMessage;
            },
            toggleModal(){
                this.showAdd = !this.showAdd;
            },
            async getSkills(){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                await axios.get(this.API_URL+'/get-skillstype/onboarding?jobseeker_id='+ID,
                    {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                        if(response.data.data.length == 0){
                            alert('No Skills Available.');
                            this.$router.push('/jobseeker/skills'); 
                        }
                        else{
                            this.skills = response.data.data;
                        }
                        
                }).catch((err)=>{

                    if(err.response.status == 401){
                        alert('Session Expired.Please Relogin.');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');

                        this.$router.push('/'); 
                    }
                });
            },
            async getLevels(){
                const token = localStorage.getItem('token');
                const ID = localStorage.getItem('userid');
                await axios.get(this.API_URL+'/get-skilllevel/onboarding?jobseeker_id='+ID,
                    {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                        //console.log(response.data.data);
                        this.levels = response.data.data;
                        //console.log(this.levels);
                        if(response.data.data.length == 0){
                            alert('No Levels Available.');
                            this.$router.push('/jobseeker/skills'); 
                        }
                        else{
                            this.getSkills();
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
            filterSkillDescription(id){
                let display = '';
                for(var i = 0; i < this.skills.length; i++){
                    if(this.skills[i].id == id){
                        display = this.skills[i].desc;
                    }
                }
                return display;
            },
            filterLevelDescription(id){
                let display = '';
                for(var i = 0; i < this.levels.length; i++ ){
                    if(this.levels[i].id == id){
                        display = this.levels[i].desc;
                    }
                }
                return display;
            },
            addSkillInArray(data){
                let dataInput = data;
                //let newLevel = true;
                let savedIndex;
                const ID = localStorage.getItem('userid');
                for(var i = 0;i<this.jobseekerSkills.length;i++){
                    if(this.jobseekerSkills[i].id == dataInput.link_level_id){
                        //newLevel = false;
                        let onboardSkill = {
                            id : dataInput.id,
                            link_level_id : dataInput.link_level_id,
                            link_skill_id : dataInput.link_skill_id,
                            link_regid : ID,
                            skill_level : this.filterLevelDescription(dataInput.link_level_id),
                            skill_type : this.filterSkillDescription(dataInput.link_skill_id)
                        };
                        this.jobseekerSkills[i].onboard_skills.push(onboardSkill); 
                        this.jobseekerSkills[i].empty = false;
                    }
                }

            },
            modifySkillInArray(data){
                let savedIndex = 0;
                let removedLevel = false;
                let savedData;
                for(var i = 0;i<this.jobseekerSkills.length;i++){
                    for(var j = 0;j<this.jobseekerSkills[i].onboard_skills.length;j++){
                        if(this.jobseekerSkills[i].onboard_skills[j].id == data.id){
                            if(this.jobseekerSkills[i].onboard_skills[j].link_level_id != data.link_level_id){
                                savedData = data;
                                this.jobseekerSkills[i].onboard_skills.splice(j,1);
                                this.addSkillInArray(savedData);
                                if(this.jobseekerSkills[i].onboard_skills.length == 0){
                                    savedIndex = i;
                                    removedLevel = true;
                                }
                                break;
                            }
                            else{
                                savedData = data;
                                this.jobseekerSkills[i].onboard_skills.splice(j,1);
                                this.addSkillInArray(savedData);
                                break;
                            }
                        }
                    }
                }

                if(removedLevel == true){
                    this.jobseekerSkills[savedIndex].empty = true;
                }
                if(this.jobseekerSkills.length == 0){
                    this.showEmpty = true;
                }
            },
            deleteSkillInArray(data){
                let savedIndex = 0;
                let removedLevel = false;
                for(var i = 0;i<this.jobseekerSkills.length;i++){
                    for(var j = 0;j<this.jobseekerSkills[i].onboard_skills.length;j++){
                        if(this.jobseekerSkills[i].onboard_skills[j].id == data.id){
                            this.jobseekerSkills[i].onboard_skills.splice(j,1);
                            if(this.jobseekerSkills[i].onboard_skills.length == 0){
                                removedLevel = true;
                                savedIndex = i;
                            }
                        }
                    }
                }
                if(removedLevel == true){
                    this.jobseekerSkills[savedIndex].empty = true;
                }
                if(this.jobseekerSkills.length == 0){
                    this.showEmpty = true;
                }
            },
            showChanges(data){
                this.tempData = data;
                //console.log(this.tempData);
                this.showDialog = true;
                this.showModify = false;
            },
            closeModule(){
                this.showDialog = false;
                this.showModify = false;
                this.selected_index.data = -1;
                this.selected_subIndex.data = -1;
                this.is_disabled.data  = true;
                this.resetSelected(); 
            },
            closeDialog(){
                //this.showModify = true;
                //console.log(this.skillObj);
                this.modifySkill(this.jobseekerSkills[this.selected_index.data].onboard_skills[this.selected_subIndex.data]);
                this.showDialog = false;
            },
            clearAddForm(){
                this.skillObj.id='';
                this.skillObj.link_regid='';
                this.skillObj.link_skill_id='';
                this.skillObj.link_level_id='';
                this.skillObj.createdby='';
                this.skillObj.datecreated='';
                this.skillObj.modifiedby='';
                this.skillObj.datemodified='';
                this.skillObj.skill_type='';
                this.skillObj.skill_level='';
            },
            modifySkill(data){
                this.showModify = true;

                this.skillObj.id=data.id;
                this.skillObj.link_regid=data.link_regid;
                this.skillObj.link_skill_id= data.link_skill_id;
                this.skillObj.link_level_id= data.link_level_id;
                this.skillObj.createdby= data.createdby;
                this.skillObj.datecreated= data.datecreated;
                this.skillObj.modifiedby= data.modifiedby;
                this.skillObj.datemodified= data.datemodified;
                this.skillObj.skill_type= data.skill_type;
                this.skillObj.skill_level= data.skill_level;
                this.showPrompt.data = false;
            },
            showPrompter(data){
                this.showPrompt.data = !this.showPrompt.data;
                if(this.showPrompt.data){
                    this.skillObj.id=data.id;
                    this.skillObj.link_regid=data.link_regid;
                    this.skillObj.link_skill_id= data.link_skill_id;
                    this.skillObj.link_level_id= data.link_level_id;
                    this.skillObj.createdby= data.createdby;
                    this.skillObj.datecreated= data.datecreated;
                    this.skillObj.modifiedby= data.modifiedby;
                    this.skillObj.datemodified= data.datemodified;
                    this.skillObj.skill_type= data.skill_type;
                    this.skillObj.skill_level= data.skill_level;
                }
                else{
                    this.clearAddForm();
                    //this.clearErrorMessage();
                }
            },
            deleteSkill(data){
                this.showDelete = !this.showDelete;
                if(this.showDelete){
                    this.skillObj.id=data.id;
                    this.skillObj.link_regid=data.link_regid;
                    this.skillObj.link_skill_id= data.link_skill_id;
                    this.skillObj.link_level_id= data.link_level_id;
                    this.skillObj.createdby= data.createdby;
                    this.skillObj.datecreated= data.datecreated;
                    this.skillObj.modifiedby= data.modifiedby;
                    this.skillObj.datemodified= data.datemodified;
                    this.skillObj.skill_type= data.skill_type;
                    this.skillObj.skill_level= data.skill_level;
                    
                }
                else{
                    this.clearAddForm();
                    //this.clearErrorMessage();
                }
            },
            selectRow(index,subIndex){
                if((this.selected_index.data == index)&&(this.selected_subIndex.data == subIndex)){
                    this.selected_index.data = -1;
                    this.selected_subIndex.data = -1;
                    this.is_disabled.data  = true;
                    this.resetSelected(); 
                }
                else{
                    this.is_disabled.data = false;
                    this.resetSelected();
                    this.jobseekerSkills[index].onboard_skills[subIndex].selected = (typeof index == 'number' && 
                    typeof subIndex == 'number') ? true : false;
                    this.selected_index.data = index;
                    this.selected_subIndex.data = subIndex;
                }
            },
            resetSelected (){
                for(const x in this.jobseekerSkills){
                    for(const y in this.jobseekerSkills[x].onboard_skills){
                        this.jobseekerSkills[x].onboard_skills[y].selected = false;
                    }
                    
                }
            },
            checkIfEmpty(){
                for(const x in this.jobseekerSkills){
                    if(this.jobseekerSkills[x].onboard_skills.length == 0){
                        this.jobseekerSkills[x].empty = true;
                    }
                    else{
                        this.jobseekerSkills[x].empty = false;
                    }
                    
                }
            },
            createJobseekerSkills(){
                this.jobseekerSkills = this.levels;
                for(const x in this.jobseekerSkills){
                    this.jobseekerSkills[x].empty = true;
                    this.jobseekerSkills[x].onboard_skills = [];
                }
            },
        },
        mounted () {
            this.API_URL = api.DEV_API_URL;
            const token = localStorage.getItem('token');
            const ID = localStorage.getItem('userid');
            this.is_disabled.data = true;
            this.initialLoad.data = true;
            this.getLevels();
            axios.get(this.API_URL+'/get-skills/onboarding?jobseeker_id='+ID
            ,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }).then((response)=>{
                this.initialLoad.data = false;
                if(response.data.success == false){
                    console.log('hey');
                    this.showEmpty = true;
                    this.createJobseekerSkills();
                    //console.log(this.jobseekerSkills);
                }
                else{
                    this.jobseekerSkills = response.data.data.levels;
                    //console.log(this.jobseekerSkills);
                    this.checkIfEmpty();
                    this.resetSelected();
                }
                
            }).catch((err)=>{
                //console.log(err);
                this.initialLoad.data = false;
                if(err.response.status == 401){
                    alert('Session Expired.Please Relogin.');
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');

                    this.$router.push('/jobseeker/login');  
                }
            });

        }
    }
</script>
<template>
    <!--<div class="container-fluid p-0 div-border">-->
    <div class="container-fluid p-0">
        <div class="row mx-0 mb-0 ">
            <!--<div v-if="type == 'desktop'" class="col-md-12 content-header p-4  px-3">-->
            <div v-if="type == 'desktop'" class="col-md-12 p-0 pb-2">
                <div class="row">
                    <!--<div class="col-3">
                        <h3 id="h3">Skills</h3>
                    </div>-->
                    <div class="col-12">
                        <div class="right-floater" v-if="!initialLoad.data">
                            <MaterialButton variant="gradient" color="white" class="command-btn mx-1 mb-0" @click="toggleModal">
                            <span class="fas fa-plus fa-sm"></span>&nbsp;Add</MaterialButton>
                            <MaterialButton variant="gradient" color="white" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="showPrompter(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                            <span class="fas fa-edit" ></span>&nbsp;Edit</MaterialButton>
                            <MaterialButton variant="gradient" color="white" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="deleteSkill(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                            <span class="fas fa-trash" ></span>&nbsp;Delete</MaterialButton>
                        </div>
                    </div>
                </div> 
            </div>
            <!--<div v-else class="col-md-12 content-header p-4 pb-3 px-3">-->
            <div v-else class="col-md-12 p-0 pb-2">
                <div class="row">
                    <!--<div class="col-3">
                        <h3 id="h3">Skills</h3>
                    </div>-->
                    <div class="col-12">
                        <div class="right-floater" v-if="!initialLoad.data">
                            <MaterialButton variant="gradient" size="sm" color="white" class="command-btn mx-1 mb-0" @click="toggleModal">
                            <span class="fas fa-plus fa-sm"></span></MaterialButton>
                            <MaterialButton variant="gradient" size="sm" color="white" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="showPrompter(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                            <span class="fas fa-edit fa-sm" ></span></MaterialButton>
                            <MaterialButton variant="gradient" size="sm" color="white" class="command-btn mx-1 mb-0" :class="{disabled: is_disabled.data}" @click="deleteSkill(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                            <span class="fas fa-trash fa-sm" ></span></MaterialButton>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row ">
            <div class="col-sm-12">
                <Loader v-if="initialLoad.data"></Loader>
                <div class="table-responsive table-height " v-for="(level, index) in levels" v-if="!initialLoad.data">
                    <table class="table table-striped table-fixed p-0" >
                        <thead class="thead table-fix-head bg-header">
                            <tr >
                                <th scope="col" class="px-2">
                                    {{level.desc}}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="jobseekerSkills[index].empty">
                                <td>No info available.</td>
                            </tr>
                            <tr v-else v-for="(jobSkill, subIndex) in jobseekerSkills[index].onboard_skills"
                                class="select_row" :class="{selected_row: jobSkill.selected}" 
                                @click="selectRow(index,subIndex)"
                            >
                                <td class="">{{jobSkill.skill_type}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
        <Teleport to="body">
            <AddSkill 
                v-if="showAdd"
                @close="showAdd = !showAdd;showMessage = false"
                :show="showAdd"
                :allLevels="levels"
                :allSkills="skills"
                :error="showMessage"
                :errorMessage="message.data"
                @addSkill = "addSkillPost"
            
            >
            </AddSkill>
            <ModifySkill 
                v-if="showModify"
                @close="showModify = false; showMessage = false"
                @modifySkill = "addSkillPost"
                @dialog="showChanges"
                :show="showModify"
                :allLevels="levels"
                :allSkills="skills"
                :error="showMessage"
                :errorMessage="message.data"
                :currentSkill="skillObj"
                
            >
            </ModifySkill>

            <DeleteSkill
                v-if="showDelete"
                @close="showDelete = !showDelete"
                :show="showDelete"
                :currentSkill="skillObj"
                @deleteSkill="deleteSkillPost"
            >

            </DeleteSkill>
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
            v-if="showPrompt.data"
            :show="showPrompt.data" 
            @close="showPrompter(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])"
            :hasClose=true
            :hasHeader=false
            :hasFooter=true
            title="Dialog"
            size="dialog-md"
            :isScrollable=true>
                <template #body>
                    <div class="text-left">
                        <h5 id="h4" style="font-size:1rem;">You have selected {{skillObj.skill_type}} to be edited. Would you like to proceed?</h5>
                    </div>
                </template>
                <template #footer>
                    <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="modifySkill(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                        Yes
                    </MaterialButton>&nbsp;
                    <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="showPrompter(jobseekerSkills[selected_index.data].onboard_skills[selected_subIndex.data])">
                        No
                    </MaterialButton>
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
                        <h5 id="alert-message" v-if="!loader" style="font-size:1rem;">Do you want to save changes?</h5>
                    </div>
                </template>
                
                <template #footer>
                    <MaterialButton size="sm" variant="gradient" color="white" class="yes-btn mb-0" v-if="!loader" @click="addSkillPost(tempData)">
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
        </Teleport>
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
        text-align: left;
    }
    .table-height{
        max-height: 256px;
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
        color:#212529!important;
    }
    .btn-color:hover{
        color:#fff!important;
        border-color: #fff!important;
    }
    .right-floater{
        float:right!important;
    }
    #h4{
        color:#212529;
    }
    #h5{
        color:#212529;
        font-family: 'Inter' !important;
    }
    #h3{
        color:#212529;
        font-family: 'Inter-Bold' !important;
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
    
    .bg-btn-green{
        background-color: #76FF5B!important;
    }
    .input-group-outline { 
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>