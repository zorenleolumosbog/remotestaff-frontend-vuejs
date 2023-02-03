<template>
    <nav-header-bar light :headerName='headerTitle'></nav-header-bar>
</template>
<script>
    import NavHeaderBar from "@/views/NavigationBar/TheHeader.vue";

    export default {
        components: {
            NavHeaderBar
        },
        data() {
            return {
                headerTitle: ''
            }
        },
        watch: {
            $route (to) {
                this.setHeaderTitle(to);
            }
        },
        mounted() {
            this.setHeaderTitle(this.$route);
        },
        methods: {
            setHeaderTitle(to) {
                switch (to.params.slug) {
                    case 'landing-page':
                        this.headerTitle = 'Masterfile Maintenance Portal'
                        break;
                    case 'organizational-unit':
                        this.headerTitle = 'Manage Organizational Unit'
                        break;
                    case 'geography-page':
                        this.headerTitle = 'Manage Geographies'
                        break;
                    case 'currency-page':
                        this.headerTitle = 'Manage Currencies'
                        break;
                    case 'social-media':
                        this.headerTitle = 'Manage Social Media'
                        break;
                    case 'registrant-expiry':
                        this.headerTitle = 'Manage Registrant Expiry'
                        break;
                    case 'registrant-type':
                        this.headerTitle = 'Manage Registrant Type'
                        break;
                    case 'job-source':
                        this.headerTitle = 'Manage Job Source'
                        break;
                    case 'civil-status':
                        this.headerTitle = 'Manage Civil Status'
                        break;
                    case 'religion':
                        this.headerTitle = 'Manage Religion'
                        break;
                    case 'industry':
                        this.headerTitle = 'Manage Industry'
                        break;
                    case 'skill':
                        this.headerTitle = 'Manage Skill'
                        break;
                    case 'skill-level':
                        this.headerTitle = 'Manage Skill Level'
                        break;
                    case 'degree-level':
                        this.headerTitle = 'Manage Degree Level'
                        break;
                    case 'field-study':
                        this.headerTitle = 'Manage Field of Study'
                        break;
                    case 'internet-type':
                        this.headerTitle = 'Manage Internet Type'
                        break;
                    case 'ISP':
                        this.headerTitle = 'Manage ISP'
                        break;
                    case 'hardware-type':
                        this.headerTitle = 'Manage Hardware Type'
                        break;
                    case 'contract-status':
                        this.headerTitle = 'Manage Contract Status'
                        break;
                    case 'contract-service-type':
                        this.headerTitle = 'Manage Contract Service Type'
                    case 'contract-type':
                        this.headerTitle = 'Manage Contract Type'
                        break;
                    case 'cancellation-reason-type':
                        this.headerTitle = 'Manage Cancellation Reason'
                        break;
                    case 'contract-note':
                        this.headerTitle = 'Manage Contract Note'
                        break;
                    case 'account-classification':
                        this.headerTitle = 'Manage Account Classification'
                        break;
                    case 'account-type':
                        this.headerTitle = 'Manage Account Type'
                        break;
                    case 'invoice-item-type':
                        this.headerTitle = 'Manage Invoice Item Type'
                        break;
                    case 'department':
                        this.headerTitle = 'Manage Department'
                        break;
                    case 'section':
                        this.headerTitle = 'Manage Sections'
                        break;
                    case 'personnel-to-section':
                        this.headerTitle = 'Assign Personnel per Section'
                        break;
                    case 'security-access-matrix':
                        this.headerTitle = 'Security Access Matrix'
                        break;
                    default:
                        break;
                }
            }
        }
    }
</script>
>
<style scoped>
    svg.bi {
        color: #000;
    }
    .navbar-dark .navbar-toggler {
        color: rgb(0 0 0 / 55%);
        /* color: #022416 !important; */
    }
    .boton{
        background-color: #76FF5B;
    }
</style>