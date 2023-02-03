<template>
    <nav-header-bar light :headerName='headerName'></nav-header-bar>
</template>
<script>
    import NavHeaderBar from "@/views/NavigationBar/TheHeader.vue";

    export default {
        components: {
            NavHeaderBar
        },
        data() {
            return {
                route: '',
                headerName: ''
            }
        },
        methods: {
            logout() {
                localStorage.removeItem("userid");
                localStorage.removeItem("token");
                this.$router.push("/");
            },
            getPageName() {
                if (this.route == '/timesheet-adjustment') {
                    this.headerName = 'Timesheet Adjustment';
                }
            }
        },
        mounted() {
            this.route = window.location.pathname;
            this.getPageName();
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