<script setup>
    import { RouterLink } from "vue-router";
    import { ref, watch } from "vue";
    import { useWindowsWidth } from "../../../../assets/js/useWindowsWidth";

    // images
    import ArrDark from "@/assets/img/down-arrow-dark.svg";
    import downArrow from "@/assets/img/down-arrow.svg";
    import DownArrWhite from "@/assets/img/down-arrow-white.svg";
    import rsLogo from "@/assets/img/rs-logo-white.png";
    import api  from "@/static/config.json";
    import axios from 'axios';

    const props = defineProps({
        transparent: {
            type: Boolean,
            default: false
        },
        light: {
            type: Boolean,
            default: false
        },
        dark: {
            type: Boolean,
            default: false
        },
        sticky: {
            type: Boolean,
            default: false
        },
        darkText: {
            type: Boolean,
            default: false
        }
    });

    // set rs logo
    function getRsLogo() {
        return rsLogo;
    }

    // set arrow  color
    function getArrowColor() {
        if (props.transparent && textDark.value) {
            return ArrDark;
        } else if (props.transparent) {
            return DownArrWhite;
        } else {
            return ArrDark;
        }
    }

    // set text color
    const getTextColor = () => {
        let color;
        if (props.transparent && textDark.value) {
            color = "text-dark";
        } else if (props.transparent) {
            color = "text-white";
        } else {
            color = "text-dark";
        }

        return color;
    };

    function logout() {
        localStorage.removeItem('userid');
        localStorage.removeItem('token');
    }

    // set nav color on mobile && desktop

    let textDark = ref(props.darkText);
    const { type } = useWindowsWidth();

    if (type.value === "mobile") {
        textDark.value = true;
    } else if (type.value === "desktop" && textDark.value == false) {
        textDark.value = false;
    }

    const getView  = () => {
        let set;
        if (type.value === "mobile") {
            set = 'container-fluid px-2';
        } else if (type.value === "desktop") {
            set = 'container-fluid px-4';
        }else {
            set = 'container';
        }
        return set

    }

    watch(
        () => type.value,
            (newValue) => {
                if (newValue === "mobile") {
                textDark.value = true;
                } else {
                textDark.value = false;
                }
            }
    );
</script>
<script>
    export default {
        methods:{
            logout(){
                const token = localStorage.getItem('token');
                axios.post(this.API_URL+'/logout',{},{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response)=>{
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');
                    this.$router.push("/");
                });
            },
        },
        mounted () {
            this.API_URL = api.DEV_API_URL;
        }
    }
</script>
<template>
    <nav
        class="navbar navbar-expand-lg top-0 navbar-dark bg-gradient-dark z-index-30"
    >
        <div
        :class="getView()"
        >
            <div class = "col-md-4">
                <RouterLink
                    class="navbar-brand d-block"
                    to="/"
                    rel="tooltip"
                    title="RS-logo"
                    data-placement="bottom"
                >
                    <img height="58"
                    :src="getRsLogo()"
                    alt="rs-logo"
                    />
                </RouterLink>
            </div>
            <div class = "col-md-8">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link  dropdown-toggle nav-link-ltr" href="#" data-bs-toggle="dropdown">  Revenue  </a>
                        <div class = "revenue-list dropdown-menu">
                            <div class = "manage-container">
                                <h6>Manage</h6>
                                <ul class="">
                                    <li><RouterLink to="/manage/client-profile"> Client Profile </RouterLink></li>
                                    <li><RouterLink to="/manage/contract-rate"> Contract Rate </RouterLink></li>
                                    <li><RouterLink to="/manage/sub-con-rate"> Subcon Rate </RouterLink></li>
                                </ul>
                            </div>
                            <div class = "transact-container">
                                <h6>Transact</h6>
                                <ul class="">
                                    <li><RouterLink to="/invoice-preprocessing"> Pre-processing of Invoice </RouterLink></li>
                                    <li><RouterLink to="/generated-invoices"> Invoicing (actual run) </RouterLink></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item active"> <a class="nav-link nav-link-ltr" href="#">Expense </a> </li>
                    <li class="nav-item"><a class="nav-link nav-link-ltr" href="#"> Payables </a></li>
                    <li class="nav-item"><a class="nav-link nav-link-ltr" href="#"> Receivables </a></li>
                    <li class="nav-item"><a class="nav-link nav-link-ltr" href="#"> Liabilities </a></li>
                    <li class="nav-item"><a class="nav-link nav-link-ltr" href="#"> Assets </a></li>
                    <li class="nav-item"><a class="nav-link nav-link-ltr" href="#"> Equities </a></li>
                </ul>
            </div>
            <button
                class="navbar-toggler shadow-none ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navigation"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon mt-2">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
                </span>
            </button>
            <div
                class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
                id="navigation"
            >
            </div>
        </div>
    </nav>
<!-- End Navbar -->
</template>

<style scoped>
    .revenue-list {
        width: 500px;
    }
    .navbar-brand {
        padding: 0 !important;
    }
    .bg-gradient-dark {
        background-image: linear-gradient(195deg, #26139e 0%, #2C16B2 100%);
    }
    .navbar-nav {
        float: right;
    }
    .nav-link {
        color: whitesmoke !important;
        font-size: 16px !important;
        display: inline-block;
        position: relative;
    }
    .nav-link::before {
        transition: 300ms;
        height: 3px;
        content: "";
        position: absolute;
        background-color: #63fe45;
    }
    .nav-link-ltr::before {
        width: 0%;
        bottom: 5px;
    }

    .nav-link-ltr:hover::before {
        width: 80%;
    }
    .nav-item {
        padding-left: 15px;
        padding-right: 15px;
    }
    .dropdown-menu {
        display: flex !important;
        padding: 20px;
    }
    .dropdown-menu ul {
        list-style-type: none;
        padding-left: 0;
    }
    li {
        padding: 5px 0;
    }
    .dropdown-item:hover {
        background: none;
    }
    .manage-container, .transact-container {
        width: 50%;
    }
    .manage-container {
        border-right: 2px solid lightgray;
    }
    .transact-container {
        padding-left: 20px;
    }
    .revenue-list {
        min-width: 20rem;
    }
</style>