<script setup>
    import logo from "@/assets/img/v64_44.png";
    import MaterialButton from "@/components/MaterialButton.vue";
    import { onMounted, onUnmounted } from "vue";
    import Typed from "typed.js";


onMounted(() => {
  if (document.getElementById("typed")) {
    // eslint-disable-next-line no-unused-vars
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 1200,
      startDelay: 1500,
      loop: true,
    });
  }
});
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
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
        <a class="navbar-brand" href="/"> <img
                :src="logo"
                alt="title"
                loading="lazy"
                :style="{ height: '70px' }"
              /></a>
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
        <div class="collapse navbar-collapse" id="navigation">
            <ul class="navbar-nav navbar-nav-hover ms-auto">
                <li class="nav-item">
                    <a class="navbar-brand" href="/"><MaterialButton variant="gradient" color="dark" class="w-auto bgButtonLogin">Login</MaterialButton></a>
                </li>
            </ul>
        </div>

    </div>
    </nav>
    <div class="container-fluid" style="background-color: #002315;">
        <div class="container">
        <div class="row justify-content-md-center">
            <div class="col-xl-3 col-md-3 col-sm-3 col-3">
                <a href="/">
                    <h5 class="text-white">Home</h5>
                </a>
                
            </div>
            <div class="col-xl-9 col-md-9 col-sm-9 col-9">
                <ul class="nav justify-content-end timezoneList">
                    <li class="nav-item">
                        <p class="navbar-brand text-white"><b>Manila : </b><span class="navbar-brand text-white">{{manila_time}}</span></p>
                    </li>
                    <li class="nav-item" style="margin-left:1%;">
                        <p class="navbar-brand text-white"><b>Sydney : </b><span class=" navbar-brand text-white">{{sydney_time}}</span></p>
                    </li>
                    <li class="nav-item" style="margin-left:1%;">
                        <p class="navbar-brand text-white"><b>San Francisco : </b><span class=" navbar-brand text-white ">{{sanfran_time}}</span></p>
                    </li>
                    <li class="nav-item" style="margin-left:1%;">
                        <p class="navbar-brand text-white"><b>New York : </b><span class="navbar-brand text-white " >{{newyork_time}}</span></p>
                    </li>
                    <li class="nav-item" style="margin-left:1%;">
                        <p class="navbar-brand text-white"><b>London : </b><span class="navbar-brand text-white" >{{london_time}}</span></p>
                    </li>
                </ul>
            </div>
        </div>
        </div>
    </div>
</template>