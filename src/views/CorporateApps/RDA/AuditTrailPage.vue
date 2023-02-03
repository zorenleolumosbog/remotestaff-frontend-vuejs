<template>
    <!-- <h3 class="menu-title pb-3">Manage Currencies</h3> -->
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation" style="z-index: 2">
            <button @click="setComponent('log-user-stat')" class="nav-link active" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">Logged User Stats</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 1">
            <button @click="setComponent('page-visit')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Page Visits</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 0">
            <button @click="setComponent('user-visit')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">User Visits</button>
        </li>
    </ul>
    <div class="tab-content my-n3">
        <div class="tab-pane fade show active" id="component" role="tabpanel">
            <KeepAlive>
                <component :is="details.selectedComponent"></component>
            </KeepAlive>
        </div>
    </div>
</template>
<script>
    // import ReferenceFx from "./ReferenceFx/TheIndex.vue";
    // import ActualFx from "./ActualFx/TheIndex.vue";
    import UserVisit from "./UserVisit/TheIndex.vue";
    import PageVisit from "./PageVisit/TheIndex.vue";
    import LogUserStat from "./LogUserStat/TheIndex.vue";

    export default {
        components: {
            UserVisit,
            PageVisit,
            LogUserStat
            // ReferenceFx,
            // ActualFx

        },
        data() {
            return {
                details: {
                    selectedComponent: 'log-user-stat'
                }
            }
        },
        methods: {
            // setComponent(val) {
            //     this.details.selectedComponent = val;
            // }

            setComponent(val) {
                switch (val) {
                    case 'user-visit':
                        this.emitter.emit("mapHeaderTitle", 'User Visits');
                        break;

                    case 'page-visit':    
                        this.emitter.emit("mapHeaderTitle", 'Page Visits');
                        break;

                    case 'log-user-stat':   
                        this.emitter.emit("mapHeaderTitle", 'Logged User Stats');
                        break;
                
                    default:
                        break;
                }
                this.details.selectedComponent = val;
            }
        }

    }
</script>
<style scoped>
.menu-title{
        color: #212529 !important;
        font-family: 'Inter-Bold' !important;
    }
    
    .nav-tabs .nav-link {
        font-size: 14px;
        font-family: 'Inter-Bold' !important;
        color: var(--bs-nav-tabs-link-active-color);
        background: #F2F2F3;
        box-shadow: 3px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        color: #ffffff;
        border-color: #0B0724;
        background-color: #0B0724;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    /* .nav-tabs .nav-link {
        font-size: 14px;
        color: var(--bs-nav-tabs-link-active-color);
        background: #E1E1E1;
        box-shadow: 4px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        font-weight: bold;
        color: #f2f2f2 !important;
        border-color: #0B0724;
        background-color: #0B0724;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }
    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 880px !important;
    } */
</style>
