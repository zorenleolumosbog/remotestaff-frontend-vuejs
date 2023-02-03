<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../../assets/js/useWindowsWidth";

// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import downArrow from "@/assets/img/down-arrow.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

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

    // set nav color on mobile && desktop

    let textDark = ref(props.darkText);
    const { type } = useWindowsWidth();

    if (type.value === "mobile") {
        textDark.value = true;
    } else if (type.value === "desktop" && textDark.value == false) {
        textDark.value = false;
    }

    // set text color
    const getTextColor = () => {
        let color;
        if (type.value === "mobile") {
            color = "text-dark";
        } else {
            color = "text-white";
        }

        return color;
    };

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
        data() {
            return { 
                manila_time: "", 
                sanfran_time: "", 
                london_time: "", 
                newyork_time: "", 
                sydney_time: "", 
            }
        },
        methods:{
            setTime(){
                //manila
                let date = new Date();

                let manila = date.toLocaleString('en-US', {
                    timeZone: 'Hongkong',
                    weekday:'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                this.manila_time = manila; 

                let sanfran = date.toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    weekday:'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                this.sanfran_time = sanfran; 

                let london = date.toLocaleString('en-US', {
                    timeZone: 'Europe/London',
                    weekday:'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                this.london_time = london; 

                let newyork = date.toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    weekday:'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                this.newyork_time = newyork; 

                let sydney = date.toLocaleString('en-US', {
                    timeZone: 'Australia/Sydney',
                    weekday:'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                this.sydney_time = sydney; 
            }
        },

        mounted () {
            setInterval(() => this.setTime(), 1000)
        }
    }

</script>
<template>
<nav
    class="navbar navbar-expand-lg top-0"
    :class="{
        'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
            props.transparent,
        'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
            props.sticky,
        'navbar-light bg-white py-3': props.light,
        ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
    }"
>
    <div
        :class="
            props.transparent || props.light || props.dark
            ? 'container'
            : 'container-fluid px-0'
        "
        >
        <!-- <a
            href="/register"
            class="btn btn-sm bg-gradient-success mb-0 ms-auto d-lg-none d-block text-dark"
            >Register
        </a> -->
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
            <ul class="navbar-nav navbar-nav-hover m-auto navbar-transparent" 
            :class="getTextColor()">
                <li class="nav-item dropdown dropdown-hover mx-auto timezone">
                    <strong>Manila: </strong><span>{{manila_time}}&nbsp;&nbsp;&nbsp;</span>
                </li>
                <li class="nav-item dropdown dropdown-hover mx-1 timezone">
                    <strong>Sydney: </strong><span>{{sydney_time}}&nbsp;&nbsp;</span>
                </li>
                <li class="nav-item dropdown dropdown-hover mx-auto timezone">
                    <strong>San Francisco: </strong><span>{{sanfran_time}}&nbsp;&nbsp;</span>
                </li>
                <li class="nav-item dropdown dropdown-hover mx-1 timezone">
                    <strong>New York: </strong><span>{{newyork_time}}&nbsp;&nbsp;</span>
                </li>
                <li class="nav-item dropdown dropdown-hover mx-auto timezone">
                    <strong>London: </strong><span>{{london_time}}</span>
                </li>
            </ul>
            <!-- <ul class="navbar-nav d-lg-block d-none navbar-transparent">
                <li class="nav-item">
                    <a
                        href="/register"
                        class="btn btn-sm mb-0 bg-gradient-success text-dark"
                        >Register
                    </a>
                </li>
            </ul> -->
        </div>
    </div>
</nav>
<!-- End Navbar -->
</template>

<style>
    .bg-gradient-success {
        background-color: #66dd4e !important;
        background-image: unset !important;
    }
    .text-dark {
        color: black !important;
        font-size: .875rem  !important;
    }
    .text-light {
        color: rgb(255, 255, 255) !important;
    }
    .timezone{
        /* font-size: .880rem; */
        font-size: 12pt;
    }
    ul.navbar-nav li.nav-item:not(:last-child)  span:after{
        content: "|";
    }
    @media only screen and (max-width: 1400px){
        ul.navbar-nav li.nav-item:not(:last-child)  span:after{
            content: "";
        }
        ul.navbar-nav li.nav-item span{
            display: block;
        }
        ul.navbar-nav li.nav-item{
            margin-right: 10px;
        }
    }
    .navbar-toggler .navbar-toggler-icon{
        display: none;
    }
</style>
