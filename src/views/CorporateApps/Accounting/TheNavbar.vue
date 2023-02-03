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
                        this.headerTitle = 'Accounting Portal'
                        break;
                    case 'client-page':
                        this.headerTitle = 'Manage'
                        break;
                    case 'generated-invoices':
                        this.headerTitle = 'Generated Invoices'
                        break;
                    case 'invoice-items':
                        this.headerTitle = 'Add Items to Invoice'
                        break;
                    case 'invoice-pre-processing':
                        this.headerTitle = 'Invoice Preprocessing'
                        break;
                    case 'subcon-to-client':
                        this.headerTitle = 'Assign Subcontractor to Client'
                        break;
                    case 'client-profile':
                        this.headerTitle = 'Client Profile'
                        break;
                    case 'contract-rate':
                        this.headerTitle = 'Contract Rate'
                        break;
                    case 'subcon-rate':
                        this.headerTitle = 'Subcontractor Rate'
                        break;
                    case 'prepopulated-invoice-items':
                        this.headerTitle = 'Edit Invoice'
                        break;
                    case 'manual-invoice':
                        this.headerTitle = 'Manual Invoice'
                        break;
                    case 'void-invoice':
                        this.headerTitle = 'Void Invoice'
                        break;
                    case 'void-sub-invoice':
                        this.headerTitle = 'Void Sub Invoice'
                        break;
                    case 'time-sheet':
                        this.headerTitle = 'Timesheet Adjustment'
                        break;
                    case 'create-time-sheet':
                        this.headerTitle = 'Create Timesheet'
                        break;
                    case 'forex-rate-type':
                        this.headerTitle = 'Forex Rate Type'
                        break;
                    case 'forex-rate-management':
                        this.headerTitle = 'Forex Rate Management'
                        break;
                    case 'forex-rate-history-page':
                        this.headerTitle = 'Forex Rate History'
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