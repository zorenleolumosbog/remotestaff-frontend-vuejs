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
                switch (to.params.view) {
                    case 'landing-page':
                        this.headerTitle = 'Operations Portal'
                        break;
                    case 'time-sheet-adjustment':
                        this.headerTitle = 'Timesheet Adjustment'
                        break;
                    case 'activity-notes':
                        this.headerTitle = 'Activity Notes'
                        break;
                    case 'screen-capture':
                        this.headerTitle = 'Screen Captures'
                        break;
                    case 'screen-capture-interval':
                        this.headerTitle = 'Screen Capture Interval'
                        break;
                    case 'activity-notes-interval':
                        this.headerTitle = 'Activity Notes Interval'
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