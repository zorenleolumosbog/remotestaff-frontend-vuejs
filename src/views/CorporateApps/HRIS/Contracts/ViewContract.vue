<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialButton from "@/components/MaterialButton.vue";

    export default {
        name: "ViewContract",
        props: ['show'],
        components: {
            StandardModal,
            MaterialButton
        },
        data() {
            return {

            }
        }
    }
</script>

<template>
    <StandardModal 
        @close="$emit( 'close' )"
        :show="show" 
        :hasFooter=true
        :hasHeader=true
        :hasClose=true
        title="Contract"
        size="dialog-xxxl"
        isScrollable="true"
        >

        <template #body>

            <form role="form" id="contact-form" method="post" autocomplete="off">

            </form>

        </template>

        <template #footer>
            <MaterialButton size="sm" variant="contained" color="success" class="command-btn mb-0">
                Update
            </MaterialButton><span>&nbsp;</span>
        </template>

    </StandardModal>

</template>

<style scroped>
</style>