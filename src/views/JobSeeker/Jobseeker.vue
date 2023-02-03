<script setup>
    import NavHeaderBar from "@/views/NavigationBar/TheHeader.vue";
    import SideBar from "./component/SideBar.vue"
    import { useWindowsWidth } from "../../assets/js/useWindowsWidth";
    import TopBar from "./component/TopBar.vue";
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
    // const { type } = useWindowsWidth();

    // const setContainerClass  = () => {
    //     let set;
    //     if (type.value === "mobile") {
    //         set = 'container-fluid px-0 mt-4';
    //     } else if (type.value === "desktop") {
    //         set = 'container-fluid gx-0';
    //     }else {
    //         set = 'container-fluid gx-0 ';
    //     }
    //     return set
    // }

</script>

<script>

    import CharacterReference from "./component/CharacterReference.vue";
    import ContactInformation from "./component/ContactInformation.vue";
    import EducationalAttainment from "./component/EducationalAttainment.vue";
    import AppliedJobs from "./component/AppliedJobs.vue"
    import EmploymentHistory from "./component/EmploymentHistory.vue";
    import FileAttachments from "./component/FileAttachments.vue";
    import WFHResources from "./component/wfhResources.vue";
    import Skills from "./component/Skills.vue";
    import StaffOverview from "./component/StaffOverview.vue";
    import ContractorOverview from "./component/StaffOverview.vue";
    import WorkPreference from "./component/WorkPreference.vue";
    import WfhResources from "./component/wfhResources.vue";
    import BasicInformation from "./component/BasicInformation.vue";
    import TimeTracker from "./component/TimeTracker.vue";
    import ProfileIdentifier from "./component/ProfileIdentifier.vue";
    import Cookies from 'js-cookie';
    import { useRoute } from 'vue-router';

    export default {
        components: {
            BasicInformation,
            WfhResources,
            WorkPreference,
            StaffOverview,
            ContractorOverview,
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
                currentHeader : [
                    {view:'staff-overview',header:'Staff Overview'},
                    {view:'contractor-overview',header:'Remote Contractor'},
                    {view:'basic-information',header:'Basic Information'},
                    {view:'file-attachments',header:'File Attachments'},
                    {view:'contact-information',header:'Contact Information'},
                    {view:'employment-history',header:'Work History'},
                    {view:'work-preference',header:'Work Preference'},
                    {view:'skills',header:'Skills'},
                    {view:'character-reference',header:'Character Reference'},
                    {view:'educational-attainment',header:'Educational Attainment'},
                    {view:'wfh-resources',header:'Work From Home Resources'},
                    {view:'applied-jobs',header:'Applied Jobs'},
                ],
                finalHeader:'',
                showTimeTracker: false
            }
        },
        methods: {
            setView ( params ) {
                this.currentView = params;
            },
            getHeader( params ){
                this.finalHeader = params;
                //let headerName = params;
                for(var i=0;i<this.currentHeader.length;i++){
                    if(this.currentHeader[i].view == params){
                        this.finalHeader = this.currentHeader[i].header;
                        break;
                    }
                }
            }
        },
        created: function(){
            if (Cookies.get('userid') !== undefined && Cookies.get('token') !== undefined) {
                localStorage.setItem('userid', Cookies.get('userid'));
                localStorage.setItem('token', Cookies.get('token'));
                Cookies.remove('userid', { domain: 'remotestaff.com' });
                Cookies.remove('token', { domain: 'remotestaff.com' });
            }

            // let token = localStorage.getItem('token');
            // if (!token) {
            //     alert('Session Expired. Please Relogin.');
            //     this.$router.push('/login/jobseeker');
            // }
        },
        watch: {
            $route ( to, from ){
                this.setView( to.params.view );
                this.getHeader(to.params.view);
            }
        },
        mounted () {
            this.emitter.on("mapRegistrantType", registrantType => {
                switch (true) {
                    case (this.$route.name === 'jobseeker' && registrantType === 1):
                        this.showTimeTracker = false;
                        break;
                    case (this.$route.name === 'remote-contractor' && registrantType === 2):
                        this.showTimeTracker = true;
                        break;
                    case (this.$route.name === 'client' && registrantType === 4):
                        this.showTimeTracker = false;
                        break;
                    default:
                        this.$router.push(`/login/${this.$route.name}`);
                }
            })

            const route = useRoute();
            this.setView( route.params.view );
            this.getHeader( route.params.view );
        }
    }
</script> 

<template>

    <StandardLayout>
        <template #header>
            <NavHeaderBar light :headerName='finalHeader'/>
        </template>
        <template #leftsidebar>
            <SideBar class="side-bar" :currentView='currentView'/>
        </template>
        <template #main>
            <KeepAlive>
                <component :is="currentView"></component>
            </KeepAlive>
        </template>
        <template #rightsidebar>
            <ProfileIdentifier/>
            <TimeTracker v-if="showTimeTracker"/>
        </template>
        <!-- <template #main>
            <div :class="setContainerClass()">
                <div class="row flex-lg-row flex-md-column-reverse flex-sm-column-reverse">
                    <div class="col-lg-9 px-2 py-0 bg">
                        <component :is="currentView"></component>
                    </div>
                    <div class="col-lg-3">
                        <TimeTracker/>
                    </div>
                </div>
            </div>
            
        </template> -->
    </StandardLayout>
    <!--<DefaultNavbar light />

    <div :class="setContainerClass()">

        <aside v-if="type == 'desktop'" class="side-bar">
            <SideBar :currentView='currentView'/>
        </aside>

        <main>
        <div class="row">
            <div class="col-md-12 d-lg-none d-md-block d-sm-block d-block p-0">
                <TopBar :currentView='currentView'/>
            </div>
            
            <div class="col-lg-12 col-sm-12 col-12 px-2">
                <component :is="currentView"></component>
            </div>

        </div>
        </main>

    </div>-->
</template>

<style scoped>

    .dp__menu{
        font-size: .8rem;
    }
    .dp__month_year_select {
        height: 16px !important;
    }
    .dp__action_row {
        padding: 0px 10px 5px 10px
    }
    .dp__calendar_header_item{
            height: 20px !important;
            padding: 2px !important;
            width: 35px !important;
    }
    .dp__cell_inner{
            height: 20px !important;
            padding: 2px !important;
            width: 35px !important;
    }
    .dp__input{
        background-color: #ededed;
    }
    ::-webkit-scrollbar {
    width: 10px;
    padding-left: 0px !important;
    margin-left: 0px !important;
    }

    /* Track */
    ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; 
    border-radius: 10px;
    padding-left: 0px !important;
    margin-left: 0px !important;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
    background: rgb(117, 117, 117); 
    border-radius: 10px;
    padding-left: 0px !important;
    margin-left: 0px !important;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
    background: rgb(71, 71, 71); 
    padding-left: 0px !important;
    margin-left: 0px !important;
    }

    .side-bar {
        width: 100%;
        min-height:100vh !important;
        overflow: hidden;
        position: -webkit-sticky !important;
        position: sticky!important;
        top: 0;
    }

    .js-layout {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr 6fr;
    }
</style>

