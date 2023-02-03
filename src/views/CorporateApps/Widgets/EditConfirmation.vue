<template>
    <teleport to="body">
        <standard-modal 
        :show=showEditConfirmation
        @close=toggleShowEditConfirmation
        :hasClose=true
        :hasHeader=false
        :hasFooter=true
        size="dialog-l"
        :isScrollable=true>
            <template #body>
                <h6 class="text-center alert-message-modal">You have selected this record to be edited.</h6>
                <h6 class="text-center alert-message-modal">Would you like to proceed?</h6>
            </template>
            
            <template #footer>
                <material-button @click="showEdit" size="sm" variant="light" class="command-btn mb-0 me-2">
                    Yes
                </material-button>
                <material-button @click="toggleShowEditConfirmation" size="sm" variant="light" class="no-btn mb-0">
                    No
                </material-button>
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
        props: ['showEditConfirmation'],
        methods: {
            showEdit() {
                this.$emit("toggleShowEditConfirmation");
                this.$emit("showEdit");
            },
            toggleShowEditConfirmation() {
                this.$emit("toggleShowEditConfirmation");
            }
        }
    }
</script>