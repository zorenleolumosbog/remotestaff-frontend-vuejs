<template>
    <teleport to="body">
        <standard-modal 
        :show=showHasChangedComfirmation
        @close=toggleShowHasChangedComfirmation
        :hasClose=true
        :hasHeader=false
        :hasFooter=true
        size="dialog-md"
        :isScrollable=true>
            <template #body>
                <h5 class="alert-message-modal">Do you want to save changes?</h5>
            </template>
            
            <template #footer>
                <material-button @click="submitForm" size="sm" variant="light" class="command-btn mb-0 me-2">
                    Yes
                </material-button>
                <MaterialButton @click="closeForm" size="sm" variant="light"  class="no-btn mb-0 me-2">
                    No
                </MaterialButton>
                <!-- <material-button @click="toggleShowHasChangedComfirmation" size="sm" variant="contained" color="secondary" class="mb-0">
                    Cancel
                </material-button> -->
            </template>
        </standard-modal>   
    </teleport>
</template>
<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";

    export default {
        components: {
            MaterialButton,
            StandardModal
        },
        props: ['showHasChangedComfirmation'],
        methods: {
            submitForm() {
                this.$emit("submitForm");
            },
            closeForm() {
                this.$emit("closeForm");
            },
            toggleShowHasChangedComfirmation() {
                this.$emit("toggleShowHasChangedComfirmation");
            }
        }
    }
</script>
<style scoped>
    h5 {
        text-align:center; 
        color: black;
    }
</style>
