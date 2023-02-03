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
                        this.headerTitle = 'Human Resource Information System Portal'
                        break;
                    case 'manage-file':
                        this.headerTitle = '201 File Type'
                        break;
                    case 'upload-file':
                        this.headerTitle = 'Upload File'
                        break;
                    case 'convert-jobseeker-to-remote-contractor':
                        this.headerTitle = 'Convert Jobseeker to Remote Contractor'
                        break;
                    case 'assign-more-client-to-remote-contractor':
                        this.headerTitle = 'Assign More Client to Remote Contractor'
                        break;
                    case 'contracts':
                        this.headerTitle = 'Contracts'
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