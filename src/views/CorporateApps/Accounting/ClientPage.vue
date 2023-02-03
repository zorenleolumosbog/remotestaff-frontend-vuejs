<template>
    <!-- <h3 class="menu-title pb-3">Manage Currencies</h3> -->
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation" style="z-index: 5">
            <button @click="setComponent('client-profile')" class="nav-link active" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="true">Client Profile</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 4">
            <button @click="setComponent('contract-rate')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Contract Rate</button>
        </li>
        <li class="nav-item" role="presentation" style="z-index: 3">
            <button @click="setComponent('subcon-rate')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Remote Contractor Rate</button>
        </li>
        <!-- <li class="nav-item" role="presentation" style="z-index: 2">
            <button @click="setComponent('subcon-to-client')" class="nav-link" data-bs-toggle="tab" data-bs-target="#component" type="button" role="tab" aria-selected="false">Assign Subcon to Client</button>
        </li> -->
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
    import SubconToClient from"./Manage/AssignSubconToClient/TheIndex.vue";
    import ClientProfile from"./Manage/ClientProfile/TheIndex.vue";
    import ContractRate from"./Manage/ContractRate/TheIndex.vue";
    import SubconRate from"./Manage/SubConRate/TheIndex.vue";

    export default {
        components: {
            SubconToClient,
            ClientProfile,
            ContractRate,
            SubconRate

        },
        data() {
            return {
                details: {
                    selectedComponent: 'client-profile'
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
        background: #F2F2F3;
        box-shadow: 3px 0px 1px -1px #959595;
    }
    
    .nav-tabs .nav-link:hover{
        color: #ffffff;
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
