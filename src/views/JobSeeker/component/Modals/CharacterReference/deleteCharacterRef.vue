<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";

</script>
<script>
    export default {
        name: "ModifyCharRef",
        props: ['show','data'],
        data(){
            return{
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
                showError:false,
                loader:false
            }
        },
        methods:{
            removeCharRef(){
                let data = this.char_ref_form;
                this.loader = true;
                this.$emit( 'delete-character', data);
            },
            cancel(){
                this.$emit('close');
            }
        },
        mounted () {
           this.char_ref_form = this.data;
        }
    }
</script>
<template>
     <StandardModal 
        :show="show"
        :hasClose=true
        :hasHeader='!loader'
        :hasFooter='!loader'
        title="Delete Character Reference"
        :size="(loader == true) ? 'dialog-sm':'dialog-md'"
        :isScrollable=true>
        <template #body>
            <Loader v-if="loader"></Loader>
            <h5  class="font-message" v-if="!loader">
                You have selected <strong>{{char_ref_form.name}}</strong> to be deleted. Would you like to proceed?
                <!--Are you sure you want to remove  as a character reference?-->
            </h5 >
        </template>
        <template #footer>
            <MaterialButton size="sm" variant="contained" color="white" class="yes-btn mb-0" @click="removeCharRef">
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