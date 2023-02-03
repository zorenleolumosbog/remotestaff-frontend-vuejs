<template>
    <teleport to="body">
        <standard-modal 
        :show=true
        :hasClose=false
        :hasHeader=false
        :hasFooter=false
        :title=title
        size="dialog-sm"
        :isScrollable=true>
            <template #body>
                <loader></loader>
            </template>
        </standard-modal>
    </teleport>
</template>
<script>
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import Loader from "@/components/Loader.vue";

    export default {
        components: {
            StandardModal,
            Loader
        }
    }
</script>
