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
    import TheNavbar from "./TheNavbar.vue";
    import TheMenu from "./TheMenu.vue";
    import LandingPage from "./LandingPage.vue";

    import ClientPage from "./ClientPage.vue";
    import ForexRateHistoryPage from './ForexRateHistoryPage.vue';
    // import Manage from "./Manage/TheIndex.vue";
    import GeneratedInvoices from"./GeneratedInvoices/TheIndex.vue";
    import InvoiceItems from "./InvoiceItems/TheIndex.vue";
    import InvoicePreProcessing from "./InvoicePreProcessing/TheIndex.vue";
    import PrepopulatedInvoiceItems from "./PrepopulatedInvoiceItems/TheIndex.vue";
    import ManualInvoice from "./ManualInvoice/TheIndex.vue";
    import VoidInvoice from "./Utility/VoidInvoice/TheIndex.vue";
    import VoidSubInvoice from "./Utility/VoidSubInvoice/TheIndex.vue"
    import TimeSheet from "../Timesheet/TimesheetAdjustment/TheIndex.vue"
    import CreateTimeSheet from "./CreateTimesheet/TheIndex.vue";
    import ForexRateType from "./ForexRateType/TheIndex.vue";
    import ForexRateManagement from "./ForexRateManagement/TheIndex.vue";



    export default {
        components: {
            StandardLayout,
            TimeTracker,
            ProfileIdentifier,
            TheNavbar,
            TheMenu,
            LandingPage,
            ClientPage,
            ForexRateHistoryPage,
            // Manage,
            GeneratedInvoices,
            InvoiceItems,
            InvoicePreProcessing,
            PrepopulatedInvoiceItems,
            ManualInvoice,
            VoidInvoice,
            VoidSubInvoice,
            TimeSheet,
            CreateTimeSheet,
            ForexRateType,
            ForexRateManagement
        },
        mounted() {
            // this.setComponent({
            //     value: 'landing-page'
            // });
            const route = useRoute();
            this.setComponent({
                value: route.params.slug
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