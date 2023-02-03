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
    import TheNavbar from "./TheNavbar.vue";
    import TheMenu from "./TheMenu.vue";
    import LandingPage from "./LandingPage.vue";
   
    import TimeSheetAdjustment from "./TimesheetAdjustment/TheIndex.vue"
    import ScreenCapture from "./ScreenCapture/TheIndex.vue"
    import ActivityNotes from "./ActivityNotes/TheIndex.vue"


    export default {
        components: {
            StandardLayout,
            TimeTracker,
            ProfileIdentifier,
            TheNavbar,
            TheMenu,
            LandingPage,
            TimeSheetAdjustment,
            ScreenCapture,
            ActivityNotes
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