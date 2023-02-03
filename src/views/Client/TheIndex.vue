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
            <!-- <profile-identifier></profile-identifier> -->
            <!-- <time-tracker></time-tracker> -->
        </template>
    </standard-layout>
</template>
<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { useRoute } from 'vue-router';
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
    // import TimeTracker from "@/views/JobSeeker/component/TimeTracker.vue";
    import ProfileIdentifier from "@/views/JobSeeker/component/ProfileIdentifier.vue";
    import TheMenu from "./TheMenu.vue";
    import TheNavbar from "./TheNavbar.vue";
    // import TheSidebar from "./TheSidebar.vue";
    // import OffCanvas from "./OffCanvas.vue";
    import LandingPage from "./LandingPage.vue";
    import ApplicationTracker from "./ApplicationTracker.vue";
    import JobOrder from "./Transact/JobOrder/TheIndex.vue";
    import Payment from "./Transact/Payment/TheIndex.vue";
    import axios from "axios";
    import api from "@/static/config.json";

    import ActivityNotes from "./Reports/ActivityNotes/TheIndex.vue";
    import TimeSheets from "./Reports/Timesheets/TheIndex.vue";
    import ScreenCaptures from "./Reports/ScreenCapture/TheIndex.vue";

    export default {
        components: {
            StandardLayout,
            // TimeTracker,
            ProfileIdentifier,
            TheNavbar,
            TheMenu,
            // TheSidebar,
            // OffCanvas,
            LandingPage,
            ApplicationTracker,
            axios,
            JobOrder,
            Payment,
            ActivityNotes,
            TimeSheets,
            ScreenCaptures
        },
        mounted() {
            // this.setComponent({
            //     value: 'landing-page'
            // });
            const route = useRoute();
            this.setComponent({
                value: route.params.view
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