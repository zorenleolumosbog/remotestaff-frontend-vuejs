<template>
    <v-idle @idle="onidle" @remind="onremind" :duration="300" :events="['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']" />
    <teleport to="body">
        <standard-modal
        :show=isIdle
        :hasClose=false
        :hasHeader=false
        :hasFooter=false
        size="dialog-m"
        :isScrollable=true
        :isBringToFront=true>
            <template #body>
                <h5 class="text-center">You are idle for 5 minutes already. Do you want to continue your session?</h5>
                <div class="d-flex justify-content-center mt-3 mb-3">
                    <material-button @click="doNotContinueSession" size="md" variant="contained" color="success" class="bg-gradient-light mb-0 me-2 w-30 h6 command-btn">
                        No
                    </material-button>
                    <material-button @click="continueSession" size="md" variant="contained" color="success" class="bg-gradient-light mb-0 me-2 w-35 h6 command-btn">
                        Continue
                    </material-button>
                </div>
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
        data() {
            return {
                isIdle: false,
                isWorking: false,
            };
        },
        mounted () {
            this.emitter.on("mapIsWorking", isWorking => {
                this.isWorking = isWorking;
            });
        },
        methods: {
            onidle() {
                if(this.isWorking == true
                || this.$route.name == 'remote-contractor' 
                || this.$route.name == 'landing-page' 
                || this.$route.name == 'rs-register' 
                || this.$route.name == 'rs-reset-pass' 
                || this.$route.name == 'rs-verify-account' 
                || this.$route.name == 'registrant-type-login' 
                || this.$route.name == 'registrant-type-register' 
                || this.$route.name == 'registrant-type-register-basic-info'
                || this.$route.name == 'registrant-type-forgot-password'
                || this.$route.name == 'registrant-type-forgot-password-success') {
                    this.isIdle = false;
                } else {
                    this.isIdle = true;
                }
            },
            continueSession() {
                this.isIdle = false;
            },
            doNotContinueSession() {
                this.isIdle = false;
                localStorage.removeItem('userid');
                localStorage.removeItem('token');
                this.$router.push('/');
            }
        }
    }
</script>
<style scoped>
    h5 {
        color: black;
    }
    .v-idle {
        display: none;
    }
</style>
