<template>
    <teleport to="body">
        <standard-modal 
        :show=true
        :hasClose=false
        :hasHeader=false
        :hasFooter=true
        size="dialog-md"
        :isScrollable=true>
            <template #body>
                <h5 class="text-center alert-message-modal">{{ message }}</h5>
                <h5 class="text-center alert-message-modal">Please re-login to continue</h5>
            </template>
            <template #footer>
                <material-button @click="relogin" size="sm" variant="contained" color="success" class="mb-0 me-2">
                    Relogin
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
            StandardModal,
            MaterialButton
        },
        props: ['message'],
        methods: {
            relogin() {
                this.$router.push('/');
            }
        }
    }
</script>
<style scoped>
    h5 {
        color: black;
    }
</style>
