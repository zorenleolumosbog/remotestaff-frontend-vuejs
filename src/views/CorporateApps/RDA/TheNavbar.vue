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
                        this.headerTitle = 'Reports, Dashboard & Analytics Portal'
                        break;
                    case 'reports-verified':
                        this.headerTitle = 'Verified Users'
                        break;
                    case 'reports-unverified':
                        this.headerTitle = 'Unverified Users'
                        break;
                    case 'reports-expired':
                        this.headerTitle = 'Expired Users'
                        break;
                    case 'audit-trail':
                        this.headerTitle = 'Audit Trail Logs'
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