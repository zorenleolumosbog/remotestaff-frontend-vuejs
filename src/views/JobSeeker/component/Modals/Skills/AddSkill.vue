<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
    import MaterialAlert from "@/components/MaterialAlert.vue";
</script>
<script>
    export default {
        name: "AddSkill",
        props: ['show','allLevels','allSkills','error','errorMessage'],
        data(){
            return{
                skill_error:{
                    skill:'',
                    level:'',
                },
                skill:{
                   skill:'',
                   level:'',
                   type:'',
                   jobseeker_id:'',
                },
                skills:[],
                levels:[],
                showError:false,
                showErrorModal:{data:''},
                loader:false,
                errorMsg:{data:''},
            }
        },
        methods:{
            emptyField(data){
                return data == "" || data == null;
            },
            cancel(){
                this.showErrorModal.data = false;
                this.$emit('close');
            },
            clearErrorMessages(){
                this.skill_error.skill = "";
                this.skill_error.level = "";
            },
            addSkill(){
                let data = this.skill;
                //this.loader = true;
                this.showError = false;
                this.clearErrorMessages();
                if(this.emptyField(this.skill.skill)){
                    this.showError = true;
                    this.loader = false;
                    this.skill_error.skill = "This field is required."
                }
                if(this.emptyField(this.skill.level)){
                    this.showError = true;
                    this.loader = false;
                    this.skill_error.level = "This field is required."
                }
                if(this.showError == false){
                    data.type = 'add';
                    this.$emit( 'add-skill', data);
                    //this.loader = false;
                }
                
            },
        },
        mounted () {
            this.skills = this.allSkills;
            this.levels  = this.allLevels;
            this.showErrorModal.data = this.error;
            this.errorMsg.data = this.errorMessage;
            
        }
    }
</script>
<template>
    <StandardModal 
        :show="show"
        :hasClose=true
        :hasHeader='!loader'
        :hasFooter='!loader'
        title="Add Skill"
        :size="(loader == true) ? 'dialog-sm':'dialog-md'"
        :isScrollable=true>
            <template #body>
                
                <div class="form-group" v-if="!loader">
                    <MaterialAlert color="danger" fontWeight="bold" class="stick-alert" v-if="showErrorModal.data">
                        {{errorMsg.data}}
                    </MaterialAlert>
                    <label for="Skill" class="labels my-0">Skill</label>
                    <select class="form-select input-group-outline" v-model="skill.skill">
                        <option value=""></option>
                        <option v-for="s in skills" :key="s.id" :value="s.id">
                            {{s.desc}}
                        </option>
                    </select>
                    <span class="error-font" v-if="showError">{{skill_error.skill}}</span>
                </div>
                <div class="form-group" v-if="!loader">
                    <label for="Levels" class="labels my-0">Level</label>
                    <select class="form-select input-group-outline" v-model="skill.level">
                        <option value=""></option>
                        <option  v-for="l in levels" :key="l.id" :value="l.id">
                            {{l.desc}}
                        </option>
                    </select>
                    <span class="error-font" v-if="showError">{{skill_error.level}}</span>
                </div>
            </template>
            <template #footer>
                <MaterialButton size="sm" variant="gradient" color="white" class="command-btn mb-0" @click="addSkill" v-if="!loader">
                    Save
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="cancel" v-if="!loader" >
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