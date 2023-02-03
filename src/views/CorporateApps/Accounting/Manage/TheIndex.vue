<!-- <script setup>
    import StandardLayout from "@/components/Layouts/StandardLayout.vue";
</script> -->
<script>
    import { useRoute } from 'vue-router'
    // import DefaultNavbar from "../components/NavbarDefault.vue";
    import ClientProfile from "./ClientProfile/TheIndex.vue";
    import ContractRate from "./ContractRate/TheIndex.vue";
    import SubConRate from "./SubConRate/TheIndex.vue";
    import AssignSubconToClient from "./AssignSubconToClient/TheIndex.vue";
    import { RouterLink } from "vue-router";
    // import TheNavbar from "../components/TheNavbar.vue";
    // import TheSidebar from "../components/TheSidebar.vue";
    // import TimeTracker from "../components/TimeTracker.vue";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

    export default {
        components: {
            // DefaultNavbar,
            // TheNavbar,
            // TheSidebar,
            ClientProfile,
            ContractRate,
            SubConRate,
            AssignSubconToClient,
            Datepicker
        },
        data() {
            return {
                currentView : 'default',
                activeTab : {
                    "client-profile" : false,
                    "contract-rate" : false,
                    "sub-con-rate" : false,
                    "assign-subcon-to-client" : false,
                },
            }
        },
        methods: {
            setActive ( params ) {
                this.currentView = params;
                for ( const x in this.activeTab ) {
                    this.activeTab[x] = x == params ? true : false ;
                }
            }
        },
        watch: {
            $route ( to, from ){
                this.setActive( to.params.tab )
            }
        },
        mounted () {
            const route = useRoute();
            this.setActive ( route.params.tab )
        }

    }


</script>

<template>

    <!-- <StandardLayout>
        <template #header>
            <the-navbar></the-navbar>
        </template>
        <template #leftsidebar>
            <the-sidebar></the-sidebar>
        </template>
        <template #main> -->
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <RouterLink to="client-profile" :class="{active: activeTab['client-profile']}"
                class="nav-link py-1" id="nav-home-tab" style="z-index: 4">
                    Client Profile
                </RouterLink>

                <RouterLink to="contract-rate" :class="{active: activeTab['contract-rate']}"
                class="nav-link py-1" id="nav-profile-tab" style="z-index: 3">    
                    Contract Rate
                </RouterLink>

                <RouterLink to="sub-con-rate" :class="{active: activeTab['sub-con-rate']}"
                    class="nav-link py-1" id="nav-contact-tab" style="z-index: 2">    
                    Remote Contractor Rate
                </RouterLink>

                <RouterLink to="assign-subcon-to-client" :class="{active: activeTab['assign-subcon-to-client']}"
                    class="nav-link py-1" id="nav-contact-tab" style="z-index: 1">    
                    Assign Subcon to Client
                </RouterLink>

            </div>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <component :is="currentView"></component>
                </div>
            </div>
        <!-- </template>
        <template #rightsidebar>
            <TimeTracker/>
        </template>
    </StandardLayout> -->

</template>

<style scoped>

    h3 {
        font-family: Inter-Bold;
        color: black;
    }

    .nav-tabs .nav-link {
        font-size: 14px;
        color: var(--bs-nav-tabs-link-active-color);
        background: #F2F2F3;
        box-shadow: 3px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        color: #ffffff;
        border-color: #3129AD;
        background-color: #3129AD;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
</style>