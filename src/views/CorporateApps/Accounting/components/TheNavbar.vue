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
                if (this.route == '/generated-invoices') {
                    this.headerName = 'Generated Invoices';
                }
                else if (this.route == '/invoice-preprocessing') {
                    this.headerName = 'Pre-processing of Invoices';
                }
                else if (this.route == '/create-timesheet') {
                    this.headerName = 'Create Timesheet';
                }
                else if (this.route == '/edit-invoice') {
                    this.headerName = 'Edit Invoice Items';
                }
                else if (this.route == '/add-item-to-invoice') {
                    this.headerName = 'Add item to Invoice';
                }
                else if (this.route.includes("manage")) {
                    this.headerName = 'Manage';
                }
                else if (this.route == '/utility/void-invoice') {
                    this.headerName = 'Void Invoice';
                }
                else if (this.route == '/utility/void-invoice-sub-detail') {
                    this.headerName = 'Void Invoice Sub Detail';
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
    nav {
        padding-left: 0;
    }
</style>