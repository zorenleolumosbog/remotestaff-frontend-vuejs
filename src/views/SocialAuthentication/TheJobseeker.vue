<script setup>
	import { onMounted } from "vue";
	import setTooltip from "@/assets/js/tooltip";
	import { useAppStore } from "@/stores";
	const store = useAppStore();

    onMounted(() => {
        setTooltip(store.bootstrap);
    });
</script>
<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialSocialButton from "@/components/MaterialSocialButton.vue";
    import TheLoader from "@/views/CorporateApps/Widgets/TheLoader.vue";
    import api from "@/static/config.json";

    export default {
        components: {
            MaterialButton,
            MaterialSocialButton,
            TheLoader
        },
        data() {
            return {
                confirmations: {
                    showLoader: false
                }
            }
        },
        methods: {
            socialLogin(provider) {
                this.confirmations.showLoader = true;
                setTimeout(() => {
                    window.location.replace(api.SOCIAL_AUTH_REDIRECT_URL + `/${this.$route.params.registrantType}/${provider}`);
                });
            }
        }
    }
</script>
<template>
    <material-button @click="socialLogin('facebook')" class="facebook me-3" size="sm" data-bs-toggle="tooltip" data-bs-placement="top" title="using Facebook account"><i class="fa fa-brands fa-facebook"></i></material-button>
    <material-button @click="socialLogin('twitter')" class="twitter me-3" size="sm" data-bs-toggle="tooltip" data-bs-placement="top" title="using Twitter account"><i class="fa fa-brands fa-twitter"></i></material-button>
    <!-- <material-button @click="socialLogin('instagram')" class="instagram me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="using Instagram account"><i class="fa fa-brands fa-instagram"></i></material-button> -->
    <material-button @click="socialLogin('linkedin')" class="linkedin me-3" size="sm" data-bs-toggle="tooltip" data-bs-placement="top" title="using Linkedin account"><i class="fa fa-brands fa-linkedin"></i></material-button>
    <material-button @click="socialLogin('google')" class="google me-3" size="sm" data-bs-toggle="tooltip" data-bs-placement="top" title="using Google account"><i class="fa fa-brands fa-google"></i></material-button>
    <the-loader v-if="confirmations.showLoader"></the-loader>
</template>
<style scoped>
.tooltip {
    background-color: green !important;
}
button {
    /* background-color: #f2f3f5; */
    background-color: #f2f2f2;
    text-transform: unset;
    font-size: 15px;
}
button i {
    float: left;
}
button .fa {
    font-size: 25px !important;
}
button.facebook:hover,
button.facebook:focus {
    background-color: #1777f2;
    color: #ffffff;
}
button.twitter:hover,
button.twitter:focus {
    background-color: #05acee;
    color: #ffffff;
}
button.instagram:hover,
button.instagram:focus {
    background-color: #cd486b;
    color: #ffffff;
}
button.linkedin:hover,
button.linkedin:focus {
    background-color: #0072b1;
    color: #ffffff;
}
button.google:hover,
button.google:focus {
    background-color: #f2f2f2;
    color: #ffffff;
}
button:hover .fa-facebook,
button:focus .fa-facebook,
button:hover .fa-twitter,
button:focus .fa-twitter,
button:hover .fa-instagram,
button:focus .fa-instagram,
button:hover .fa-linkedin,
button:focus .fa-linkedin {
    color: #ffffff;
}
.fa {
    padding-top: 5px;
    font-size: 18px;
}
.fa-facebook {
    color: #1777f2;
}
.fa-twitter {
    color: #05acee;
}
.fa-instagram {
    color: #cd486b;
}
.fa-linkedin {
    color: #0072b1;
}
.fa-google {
    background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>