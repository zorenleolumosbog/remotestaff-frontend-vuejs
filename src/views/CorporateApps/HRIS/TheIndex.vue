<template>
    <standard-layout>
        <template #header>
            <the-navbar></the-navbar>
        </template>
        <template #leftsidebar>
            <the-menu></the-menu>
        </template>
        <template #main>
            <KeepAlive>
                <component :is="selectedComponent"></component>
            </KeepAlive>
        </template>
        <template #rightsidebar>
            <ProfileIdentifier/>
            <TimeTracker/>
        </template>
    </standard-layout>
</template>
<script >
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { useRoute } from 'vue-router';
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
    import TimeTracker from "@/views/JobSeeker/component/TimeTracker.vue";
    import ProfileIdentifier from "@/views/JobSeeker/component/ProfileIdentifier.vue";
    import TheMenu from "./TheMenu.vue";
    import TheNavbar from "./TheNavbar.vue";
    // import TheSidebar from "./TheSidebar.vue";
    // import OffCanvas from "./OffCanvas.vue";
    import LandingPage from "./LandingPage.vue";
    import ManageFile from "./ManageFile/TheIndex.vue";
    import UploadFile from "./UploadFile/TheIndex.vue";
    import ConvertJobseekerToRemoteContractor from "./ConvertJobseekerToRemoteContractor/TheIndex.vue";
    import AssignMoreClientToRemoteContractor from "./AssignMoreClientToRemoteContractor/TheIndex.vue";
    import Contracts from "./Contracts/TheIndex.vue";
    import Contract from "./Contracts/Contract/TheIndex.vue";


    export default {
        components: {
            StandardLayout,
            TimeTracker,
            ProfileIdentifier,
            TheMenu,
            TheNavbar,
            // TheSidebar,
            // OffCanvas,
            LandingPage,
            ManageFile,
            UploadFile,
            ConvertJobseekerToRemoteContractor,
            AssignMoreClientToRemoteContractor,
            Contracts,
            Contract
        },
        mounted() {

            const route = useRoute();

            let params = route.params.slug;
            
            if ( params == "contracts" && route.query['id'] ) {
                params = 'Contract'
            } 

            this.setComponent({
                value: params
            });

        },
        computed: {
            ...mapGetters(['selectedComponent'])
        },
        methods: {
            ...mapActions(['setComponent'])
        }
    }
</script>
<style scoped>
     .page-title{
        font-family: 'Inter-Bold' !important;
        color:#212529;
    }
    @media (min-width: 992px) and (max-width: 1400px) {
        .col-lg-2 {
            width: 20%;
        }
        .col-lg-10 {
            width: 80%;
        }
    }

    @media (max-width: 768px){
        .d-sm-none {
            display: none;
        }
        .main-section {
            width: 100%;
        }
    }
</style>