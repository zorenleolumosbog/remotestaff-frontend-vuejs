<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";
</script>
<script>
    export default {
        name: "AddSkill",
        props: ['show','currentSkill'],
        data(){
            return{
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
                skills:[],
                levels:[],
                showError:false,
                loader:false,
                
            }
        },
        methods:{
            cancel(){
                this.$emit('close');
            },
            removeSkill(){
                let data = this.skill;
                this.loader = true;
                this.$emit('delete-skill',data);
            }
        },
        mounted () {
            this.skill = this.currentSkill;
        }
    }
</script>
<template>
    <StandardModal 
        :show="show"
        :hasClose=true
        :hasHeader='false'
        :hasFooter='!loader'
        title="Delete Skill"
        :size="(loader == true) ? 'dialog-sm':'dialog-md'"
        :isScrollable=true>
            <template #body>
                <Loader v-if="loader"></Loader>
                <h5 class="font-message text-left" v-if="!loader" >
                    You have selected {{skill.skill_type}} to be deleted. Would you like to proceed?</h5>
            </template>
            <template #footer>
                <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="removeSkill">
                        Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="contained" color="white" class="no-btn mb-0" @click="cancel">
                        No
                </MaterialButton>&nbsp;
                
            </template>
        </StandardModal>
        
        
</template>
<style scoped>
    .font-message{
        font-size:1rem;
        color:#0a0a0a !important;
    }
    .error-font{
        color:red !important;
        font-size: x-small;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }
</style>