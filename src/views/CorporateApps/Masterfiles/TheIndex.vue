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
    import OrganizationalUnit from "./OrganizationalUnit/TheIndex.vue";
    import GeographyPage from "./GeographyPage.vue";
    import CurrencyPage from "./CurrencyPage.vue";
    import RegistrantType from "./RegistrantType/TheIndex.vue";
    import JobSource from "./JobSource/TheIndex.vue";
    import CivilStatus from "./CivilStatus/TheIndex.vue";
    import Religion from "./Religion/TheIndex.vue";
    import RegistrantExpiry from "./RegistrantExpiry/TheIndex.vue";
    import SocialMedia from "./SocialMedia/TheIndex.vue";
    import Industry from "./Industry/TheIndex.vue";
    import AccountClassification from "./AccountClassification/TheIndex.vue";
    import AccountType from "./AccountType/TheIndex.vue";
    import InvoiceItemType from "./InvoiceItemType/TheIndex.vue";
    import Skill from "./Skill/TheIndex.vue";
    import SkillLevel from "./SkillLevel/TheIndex.vue";
    import DegreeLevel from "./DegreeLevel/TheIndex.vue";
    import FieldStudy from "./FieldStudy/TheIndex.vue";
    import InternetType from "./InternetType/TheIndex.vue";
    import ISP from "./ISP/TheIndex.vue";
    import HardwareType from "./HardwareType/TheIndex.vue";
    import ContractStatus from "./ContractStatus/TheIndex.vue";
    import ContractServiceType from "./ContractServiceType/TheIndex.vue";
    import ContractType from "./ContractType/TheIndex.vue";
    import CancellationReasonType from "./CancellationReasonType/TheIndex.vue";
    import ContractNote from "./ContractNote/TheIndex.vue";

    import Department from "./Department/TheIndex.vue"
    import Section from "./Section/TheIndex.vue"
    import PersonnelToSection from "./PersonnelToSection/TheIndex.vue";
    import SecurityAccessMatrix from "./SecurityAccessMatrix/TheIndex.vue";

    export default {
        components: {
            StandardLayout,
            TimeTracker,
            ProfileIdentifier,
            TheNavbar,
            TheMenu,
            LandingPage,
            OrganizationalUnit,
            GeographyPage,
            CurrencyPage,
            RegistrantType,
            JobSource,
            CivilStatus,
            Religion,
            RegistrantExpiry,
            SocialMedia,
            Industry,
            AccountClassification,
            AccountType,
            InvoiceItemType,
            Skill,
            SkillLevel,
            DegreeLevel,
            FieldStudy,
            InternetType,
            ISP,
            HardwareType,
            Department,
            Section,
            PersonnelToSection,
            SecurityAccessMatrix,
            ContractStatus,
            ContractServiceType,
            ContractType,
            CancellationReasonType,
            ContractNote
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