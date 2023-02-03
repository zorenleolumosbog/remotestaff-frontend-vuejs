<template>
    <template v-if="!details.showLoader && !details.alertBox.success">
        <teleport to="body">
            <standard-modal 
            :show=showDelete
            @close=removeAlertBox
            :hasClose=true
            :hasHeader=false
            :hasFooter=true
            size="dialog-md"
            :isScrollable=true>
                <template #body>
                    <h6 class="text-center alert-message-modal">You have selected {{ selectedIds.length === 1 ? 'this record' : 'these records' }} to be deleted.</h6>
                    <h6 class="text-center alert-message-modal">Would you like to proceed?</h6>
                </template>
                
                <template #footer>
                    <material-button @click="remove" size="sm" variant="light" class="command-btn mb-0 me-2">
                        Yes
                    </material-button>
                    <material-button @click="removeAlertBox" size="sm" variant="light" class="no-btn mb-0">
                        No
                    </material-button>
                </template>
            </standard-modal>
        </teleport>
    </template>
    <alert-unauthenticated v-if="details.showAlertUnauthenticated.success" :message="details.showAlertUnauthenticated.message"></alert-unauthenticated>
    <the-loader v-if="details.showLoader"></the-loader>
    <alert-box v-if="details.alertBox.success" :showAlertBox="details.alertBox.success" :message="details.alertBox.message" @toggleShowAlertBox="removeAlertBox"></alert-box>
</template>
<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import TheLoader from "../../Widgets/TheLoader.vue";
    import AlertUnauthenticated from "../../Widgets/AlertUnauthenticated.vue";
    import AlertBox from "../../Widgets/AlertBox.vue";
    import api from "@/static/config.json";
    import axios from "axios";

    export default {
        components: {
            MaterialButton,
            StandardModal,
            TheLoader,
            AlertUnauthenticated,
            AlertBox
        },
        data() {
            return {
                details: {
                    showLoader: false,
                    alertBox: {
                        success: false,
                        message: ''
                    },
                    showAlertUnauthenticated: {
                        success: false,
                        message: '',
                    }
                },
                validations: {
                    errors: []
                }
            }
        },
        props: ['title', 'showDelete', 'selectedIds'],
        methods: {
            removeAlertBox() {
                this.details.alertBox.success = !this.details.alertBox.success;
                this.$emit("toggleShowDelete");
            },
            remove() {
                this.details.showLoader = true;
                
                let self = this;

                this.selectedIds.forEach((selectedId) => {
                    axios({
                        method: 'delete',
                        url: api.DEV_API_URL + `/accounting/delete-forex-rate/${selectedId}`,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(function (response) {
                        self.$emit("refresh");
                        self.details.showLoader = false;
                        self.details.alertBox.success = response.data.success;
                        self.details.alertBox.message = response.data.message;
                    })
                    .catch(function (errors) {
                        if(errors.response.status === 401) {
                            self.details.showAlertUnauthenticated.success = true;
                            self.details.showAlertUnauthenticated.message = errors.response.data.message;
                        }
                        if(errors.response.status === 422) {
                            self.validations.errors = errors.response.data.errors;
                        }
                    });
                });
            }
        }
    }
</script>
