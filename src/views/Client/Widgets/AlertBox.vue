<template>
    <teleport to="body">
        <standard-modal 
        :show=showAlertBox
        @close=toggleShowAlertBox
        :hasClose=true
        :hasHeader=false
        :hasFooter=false
        size="dialog-md"
        :isScrollable=true>
            <template #body>
                <div class="center">
                <h5 class="alert-message"><span v-html="message"></span></h5>
                </div>
            </template>
        </standard-modal>
    </teleport>
</template>
<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";

    export default {
        components: {
            StandardModal,
        },
        methods: {
            toggleShowAlertBox() {
                this.$emit("toggleShowAlertBox");
            }
        },
        props: ['message', 'showAlertBox']
    }
</script>
<style scoped>
    .center{
        text-align: center;
        margin-bottom: 27px !important;
    }
    .alert-message{
        padding-top:unset;
    }

    .modal-body {
    position: relative;
    flex: 1 1 auto;
    /* padding: var(--bs-modal-padding); */
    /* padding-top: -10px; */
    /* padding-bottom: 30px; */
}
</style>
