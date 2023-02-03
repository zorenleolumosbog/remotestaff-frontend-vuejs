<template>

    <!-- <h3 class="menu-title pb-3">Manage Geographies</h3> -->

    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation" style="z-index: 5">
            <button @click="setComponent('the-country')" class="nav-link active" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">Country</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 4">
            <button @click="setComponent('the-region')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Region</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 3">
            <button @click="setComponent('TheState')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">State/Province</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 2">
            <button @click="setComponent('the-towncity')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Town/City</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 1">
            <button @click="setComponent('the-barangay')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Brgy/Village</button>
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
    import TheCountry from "./Country/TheIndex.vue";
    import TheRegion from "./Region/TheIndex.vue";
    import TheState from "./State/TheIndex.vue";
    import TheTowncity from "./Towncity/TheIndex.vue";
    import TheBarangay from "./Barangay/TheIndex.vue";

    export default {
        components: {
            TheCountry,
            TheRegion,
            TheState,
            TheTowncity,
            TheBarangay
        },
        data() {
            return {
                details: {
                    selectedComponent: 'the-country'
                }
            }
        },
        methods: {
            setComponent(val) {
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
        color: var(--bs-nav-tabs-link-active-color);
        background: #E1E1E1;
        box-shadow: 4px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        font-weight: bold;
        /* color: #ffffff; */
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
        height: 650px !important;
        /* height: auto; */
    }
</style>
