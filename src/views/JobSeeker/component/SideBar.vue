<script setup>
    import { RouterLink } from "vue-router";
    import overviewIcon from "@/assets/img/Vectorstaff-ovvw-ico.svg";
    import fileIcon from "@/assets/img/Vector-File-Attachments.svg";
    import basicInfoIcon from "@/assets/img/Vector-Basic-Information.svg";
    import contactInfoIcon from "@/assets/img/Vector-Contact-Information.svg";
    import empHistIcon from "@/assets/img/Vector-Employment-History.svg";
    import workPrefIcon from "@/assets/img/Vector-Work-Preference.svg";
    import skillsIcon from "@/assets/img/Vector-Skills.svg";
    import charRefIcon from "@/assets/img/Vector-Character-Reference.svg";
    import educAttainIcon from "@/assets/img/Vector-Educational-Attainment.svg";
    import workHomeIcon from "@/assets/img/Vector-Work-From-Home-Resources.svg";
    import appliedJobsIcon from "@/assets/img/Vector-Applied-Jobs.svg";
    import rsLogo from "@/assets/img/rs-logo-white.png";
    import { useWindowsWidth } from "../../../assets/js/useWindowsWidth";
    
    const emits = defineEmits(["changeView"]);

    const getView = (viewName) => {
        emits("changeView", viewName);
    };

    function getRsLogo() {
        return rsLogo;
    }
    
</script>

<script>
    export default {
        props: ['currentView']
    }
</script>

<template>
    <div>
        <ul class="nav nav-pills nav-menu-font flex-column rs-bg mb-auto">
            <li class="px-5 mb-2 mt-2">
                <img height="58"
                @click="$router.push('/jobseeker/staff-overview')"
                style="cursor: pointer;"
                :src="getRsLogo()"
                alt="rs-logo"/>
            </li>
            <li v-if="$route.name === 'jobseeker'" class="nav-item">
                <RouterLink to="staff-overview" class="nav-link">
                    <img :src="overviewIcon" />
                    Staff Overview
                </RouterLink>
            </li>
            <li v-if="$route.name === 'remote-contractor'" class="nav-item">
                <RouterLink to="contractor-overview" class="nav-link">
                    <img :src="overviewIcon" />
                    Remote Contractor
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="basic-information" class="nav-link">
                    <img :src="basicInfoIcon" />Basic Information
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="file-attachments" class="nav-link">
                    <img :src="fileIcon" />
                    File Attachments
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="contact-information" class="nav-link">
                    <img :src="contactInfoIcon" />
                    Contact Information
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="employment-history" class="nav-link">
                    <img :src="empHistIcon" />
                    Work History
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="work-preference" class="nav-link">
                    <img :src="workPrefIcon" />
                    Work Preference
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="skills" class="nav-link">
                    <img :src="skillsIcon" />
                    Skills
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="character-reference" class="nav-link">
                    <img :src="charRefIcon" />
                    Character Reference
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="educational-attainment" class="nav-link">
                    <img :src="charRefIcon" />
                    Educational Attainment
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="wfh-resources" class="nav-link">
                    <img :src="workHomeIcon" />
                    WFH Resources
                </RouterLink>
            </li>
            <li class="nav-item" >
                <RouterLink to="applied-jobs" class="nav-link">
                    <img :src="appliedJobsIcon" />
                    Applied Jobs
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    
    .nav.nav-pills {
        
        min-height: 100vh !important;
        overflow:hidden;
        
    }
    .nav-pills {
        font-size: 14px;
    }
    .router-link-active img {
        filter: invert(1) brightness(0) 
    }
    .nav-link {
        color: #fff !important;
        padding: 11px 40px;
        border-radius: 0px !important;
    }
    .nav-link:hover{
        font-family: 'Inter';
        padding-left: 35px;
        color: #fff !important;
        background-color: #5E44FF  !important;
    }
    .nav-link:hover img{
        filter: invert(10)  brightness(0)
    }
    .router-link-active{
        font-family: 'Inter';
        padding-left: 35px;
        background-color: #5E44FF  !important;
        color: #fff !important;
    }
    #li_first .router-link-active{
        border-top-right-radius: 5px!important;
        border-top-left-radius: 5px!important;
    }
    #li_last .router-link-active{
        border-bottom-right-radius: 5px!important;
        border-bottom-left-radius: 5px!important;
    }
    .nav-item img{
        width: 23px;
        height: 19px;
        margin-right: 10px;
    }

</style>
