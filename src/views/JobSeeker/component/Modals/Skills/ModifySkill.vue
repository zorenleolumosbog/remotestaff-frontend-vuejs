<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    const stored = {};
</script>
<script>
    export default {
        name: "ModifySkill",
        props: ['show','allLevels','allSkills','currentSkill','error','errorMessage'],
        data(){
            return{
                skill_error:{
                    skill:'',
                    level:'',
                },
                skill:{
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
                storedSkill:{
                   data:''
                },
                skills:[],
                levels:[],
                showError:false,
                loader:false,
                showDialog:false,
                showErrorModal:{data:''},
                errorMsg:{data:''}
            }
        },
        methods:{
            emptyField(data){
                return data == "" || data == null;
            },
            cancel(){
                //console.log(data.link_skill_id);
                this.showErrorModal.data = false;
                if(this.storedSkill.data != JSON.stringify(this.skill)){
                    let data = this.skill;
                    data.type = 'edit';
                    this.$emit('dialog',data);
                }
                else{
                    
                    this.$emit('close');
                }
            },
            clearErrorMessages(){
                this.skill_error.skill = "";
                this.skill_error.level = "";
            },
            editSkill(){
                let data = this.skill;
                this.loader = true;
                this.showError = false;
                this.clearErrorMessages();
                if(this.emptyField(this.skill.link_skill_id)){
                    this.showError = true;
                    this.loader = false;
                    this.skill_error.skill = "This field is required."
                }
                if(this.emptyField(this.skill.link_level_id)){
                    this.showError = true;
                    this.loader = false;
                    this.skill_error.level = "This field is required."
                }
                if(this.showError == false){
                    data.type = 'edit';
                    this.$emit('modify-skill', data);
                }
            }
        },
        mounted () {
            this.skills = this.allSkills;
            this.levels  = this.allLevels;
            this.skill = this.currentSkill;
            this.storedSkill.data = JSON.stringify(this.skill);
            this.showErrorModal.data = this.error;
            this.errorMsg.data = this.errorMessage;
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
        title="Modify Skill"
        :size="(loader == true) ? 'dialog-sm':'dialog-md'"
        :isScrollable=true>
            <template #body>
                <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" v-if="showErrorModal.data">
                    {{errorMsg.data}}
                </MaterialAlert>
                <div class="form-group" v-if="!loader">
                    <label for="Prefix" class="labels my-0">Skill</label>
                    <select class="form-select input-group-outline" v-model="skill.link_skill_id">
                        <option v-for="s in skills" :key="s.id" :value="s.id">
                            {{s.desc}}
                        </option>
                    </select>
                </div>
                <div class="form-group" v-if="!loader">
                    <label for="Prefix" class="labels my-0">Level</label>
                    <select class="form-select input-group-outline" v-model="skill.link_level_id">
                        <option v-for="l in levels" :key="l.id" :value="l.id">
                            {{l.desc}}
                        </option>
                    </select>
                </div>
            </template>
            <template #footer>
                <MaterialButton size="sm" variant="contained" color="white" class="command-btn mb-0" v-if="!loader" @click="editSkill">
                    Save
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" v-if="!loader" @click="cancel">
                    Cancel
                </MaterialButton>
            </template>
        </StandardModal>
        
        
</template>
<style scoped>
    select{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 5px;
    }
    .error-font{
        /*color:red !important;
        font-size: x-small;*/
        font-size: 0.9em;
        color: #9c0404;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>