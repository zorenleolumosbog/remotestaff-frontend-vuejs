<script setup>

    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";

</script>

<script>

    export default {

        data () {
            return { 
                showSuccess: false, 
            }
        },

        methods: {

            toggleModal ( type ) {
                this.showSuccess = !this.showSuccess
            }
        }
    }

</script>

<template>
    <div class="container py-7">
        <div class="row mt-5">
        <div class="col-sm-3 col-6 mx-auto">
            <!-- Button trigger modal -->
            <MaterialButton
                @click="toggleModal"
                variant="gradient"
                color="success">
                Test Alert Modal
            </MaterialButton>

        </div>
        </div>
    </div>
    <div>
        <!--
            props:
                show = true/false
                hasClose = true/false
                hasHeader = true/false
                hasFooter = true/false
                title = true/false (hasHeader must be true)
                size = dialog-sm/dialog-md/dialog-lg/dialog-xxl/dialog-xxxl/dialog-xxxxl
                isScrollable = true/false

            slots:
                title (hasHeader must be true)
                body 
                footer (hasFooter must be true)
        -->

        <Teleport to="body">
            <StandardModal 
            :show="showSuccess" 
            @close="showSuccess = false"
            :hasClose=true
            :hasHeader=true
            :hasFooter=true
            title="Test Alert"
            size="dialog-md"
            :isScrollable=true>

            <template #title>
                <h5 class="modal-title"> Alert Header </h5>
            </template>

            <template #body>
                <h5>Test Test Content</h5>
            </template>
            
            <template #footer>
                <MaterialButton size="sm" variant="outline" color="success" class="mb-0" @click="toggleModal()">
                    Yes
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="outline" color="dark" class="mb-0" @click="toggleModal()">
                    no
                </MaterialButton>&nbsp;
                <MaterialButton size="sm" variant="outline" color="dark" class="mb-0" @click="toggleModal()">
                    cancel
                </MaterialButton>
            </template>

            </StandardModal>
        </Teleport>
    </div>
</template>

<style scoped>
</style>

