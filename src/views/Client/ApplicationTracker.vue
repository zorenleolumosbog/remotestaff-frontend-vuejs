<template>

    <!-- <h3 class="menu-title pb-3">Manage Geographies</h3> -->

    <ul class="nav nav-tabs" role="tablist" >
        <li class="nav-item" role="presentation" style="z-index: 3">
            <button @click="setComponent('screen-capture')" class="nav-link active" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">Screen Capture</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 2">
            <button @click="setComponent('activity-notes')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Activity Notes</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 1">
            <button @click="setComponent('the-timesheets')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Timesheets</button>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="component" role="tabpanel">
            <KeepAlive>
                <component :is="details.selectedComponent"></component>
            </KeepAlive>
        </div>
    </div>
</template>
<script>
    import ScreenCapture from "./Reports/ScreenCapture/TheIndex.vue";
    import ActivityNotes from "./Reports/ActivityNotes/TheIndex.vue";
    import TheTimesheets from "./Reports/Timesheets/TheIndex.vue";

    export default {
        components: {
            ScreenCapture,
            ActivityNotes,
            TheTimesheets
        },
        data() {
            return {
                details: {
                    selectedComponent: 'screen-capture'
                }
            }
        },
        methods: {
            setComponent(val) {
                switch (val) {
                    case 'screen-capture':
                        
                        this.emitter.emit("mapHeaderTitle", 'Screen Capture');
                        break;
                    case 'activity-notes':
                        
                        this.emitter.emit("mapHeaderTitle", 'Activity Notes');
                        break;
                    case 'the-timesheets':
                        
                        this.emitter.emit("mapHeaderTitle", 'Timesheets');
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
    /*.menu-title{
        color: #212529 !important;
        font-family: 'Inter-Bold' !important;
    }
    
    
    .nav-tabs .nav-link {
        font-size: 14px;
        color: var(--bs-nav-tabs-link-active-color);
        background-color: #E1E1E1 !important;
        box-shadow: 4px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        color: #ffffff;
        border-color: #3129AD;
        background-color: #3129AD !important;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }   

    .nav-tabs .nav-link:active{
        color: #111010;
        border-color: #f4f3f7;
        background-color: #f4f3f7 !important;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        min-height: 650px;
        /* height: auto; */
    /*}*/
    .menu-title{
        color: #212529 !important;
        font-family: 'Inter-Bold' !important;
    }
    .nav-tabs .nav-link {
        font-size: 14px;
        color: var(--bs-nav-tabs-link-active-color);
        background: #E1E1E1;
        box-shadow: 4px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        font-weight: bold;
        /* color: #ffffff; */
        color: #f2f2f2 !important;
        border-color: #3129AD;
        background-color: #3129AD;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }
    .tab-content {
        border-left:  1px solid #dee2e6; 
        border-right:  1px solid #dee2e6; 
        border-bottom: 1px solid #dee2e6;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        min-height: 630px !important;
    }

    .nav-tabs{position: relative; z-index: 0;}
</style>