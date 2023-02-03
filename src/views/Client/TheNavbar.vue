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
                headerTitle: '',
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
                switch (to.params.view) {
                    case 'landing-page':
                        this.headerTitle = 'Client Portal'
                        break;
                    // case 'application-tracker':
                    //     this.headerTitle = 'Screen Capture'
                    //     break;
                    case 'time-sheets':
                        this.headerTitle = 'Timesheets'
                        break;
                    case 'screen-captures':
                        this.headerTitle = 'Screen Captures'
                        break;
                    case 'activity-notes':
                        this.headerTitle = 'Activity Notes'
                        break;
                    case 'job-order':
                        this.headerTitle = 'Job Order'
                        break;
                    case 'payment':
                        this.headerTitle = 'Invoice Payment'
                        break;
                
                    default:
                        break;
                }
            }
        }
    }
</script>

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