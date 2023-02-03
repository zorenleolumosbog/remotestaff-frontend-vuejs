<script setup>
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
    import SideBar from "./SideBar.vue";
    import DefaultNavbar from "./NavbarDefault.vue";
</script>
<script>

    import CharacterReference from "./CharacterReference.vue";
    import ContactInformation from "./ContactInformation.vue";
    import EducationalAttainment from "./EducationalAttainment.vue";
    import AppliedJobs from "./AppliedJobs.vue"
    import EmploymentHistory from "./EmploymentHistory.vue";
    import FileAttachments from "./FileAttachments.vue";
    import WFHResources from "./wfhResources.vue";
    import Skills from "./Skills.vue";
    import StaffOverview from "./StaffOverview.vue";
    import WorkPreference from "./WorkPreference.vue";
    import WfhResources from "./wfhResources.vue";
    import BasicInformation from "./BasicInformation.vue";
    import Cookies from 'js-cookie';
    import { useRoute } from 'vue-router';

    export default {
        components: {
            BasicInformation,
            WfhResources,
            WorkPreference,
            StaffOverview,
            Skills,
            WFHResources,
            FileAttachments,
            EmploymentHistory,
            AppliedJobs,
            EducationalAttainment,
            ContactInformation,
            CharacterReference,
        },
        data () {
            return {
                currentView : 'StaffOverview',
            }
        },
        methods: {
            setView ( params ) {
                this.currentView = params;
            }
        },
        created: function(){
            if (Cookies.get('userid') !== undefined && Cookies.get('token') !== undefined) {
                localStorage.setItem('userid', Cookies.get('userid'));
                localStorage.setItem('token', Cookies.get('token'));
                Cookies.remove('userid', { domain: 'remotestaff.com' });
                Cookies.remove('token', { domain: 'remotestaff.com' });
            }

            let token = localStorage.getItem('token');
            if (!token) {
                alert('Session Expired. Please Relogin.');
                this.$router.push('/login/jobseeker');
            }
        },
        watch: {
            $route ( to, from ){
                this.setView( to.params.view )
                console.log('to',to)
            }
        },
        mounted () {
            const route = useRoute();
            this.setView( route.params.view )
        }
    }
</script> 
<template>
    <StandardLayout>
        <template #header>
            <h3>Header</h3>
        </template>
        <template #leftsidebar>
            <h3>Side bard</h3>
        </template>
        <template #main>
            <div class="row p-4">
                <div class="col-lg-12 col-sm-12 col-12 px-2">
                    <h3>Main page</h3>
                </div>
            </div>
        </template>
    </StandardLayout>
</template>
<style scoped>
.side-bar {
        width: 286px;
    }
</style>