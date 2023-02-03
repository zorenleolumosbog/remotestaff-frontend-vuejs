<template>
    <!-- <h3 class="menu-title pb-3">Manage Currencies</h3> -->
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation" style="z-index: 3">
            <button @click="setComponent('the-currency')" class="nav-link active" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">Currency</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 2">
            <button @click="setComponent('tax-type')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Tax Type</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 1">
            <button @click="setComponent('tax-rate')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Tax Rate</button>
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
    import TheCurrency from "./Currency/TheIndex.vue";
    import TaxRate from "./TaxRate/TheIndex.vue";
    import TaxType from "./TaxType/TheIndex.vue";


    export default {
        components: {
            TheCurrency,
            TaxRate,
            TaxType

        },
        data() {
            return {
                details: {
                    selectedComponent: 'the-currency'
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
        height: 630px !important;
        /* height: auto; */
    }
</style>
