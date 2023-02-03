<script setup>
    import { onMounted } from "vue";
    import setTooltip from "@/assets/js/tooltip";
	import { useAppStore } from "@/stores";
	const store = useAppStore();
	onMounted(() => {
		setTooltip(store.bootstrap);
	});
</script>

<script>
    import MaterialButton from "@/components/MaterialButton.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import api  from "@/static/config.json";
    import TheAdd from "./TheAdd.vue";
    import TheEdit from "./TheEdit.vue";
    import axios from "axios";
    import Loader from "@/components/Loader.vue";
    import DataGrid from "../../components/DataGrid.vue";
    import DataPagination from "../../../Widgets/ThePagination.vue";

    export default {
        components : {
            MaterialButton,
            MaterialInput,
            api,
            TheAdd,
            TheEdit,
            axios,
            StandardModal,
            Loader,
            DataGrid,
            DataPagination
        },
        data () {
            return {
                DEV_API_URL: "",
                TOKEN: "",
                USERID: "",
                contractsRates: [],
                contractsData: {
                    success : false
                },
                selectedIndex : "",
                isBtnDisableEdit : true,
                isBtnDisableDelete : true,
                showModal : {
                    add : false,
                    edit : false,
                    delete : false,
                },
                actionType : "",
                isLoading : false,
                modalLoaderShow : false,
                confirmModal : false,
                confirmClose : '',
                clientsOption : [],
                subcontractorsOption : [],
                getLoader : false,
                gridColumns : ['id', 'client_name' ,'subcon_name' ,'basic_monthly_rate' ,'basic_weekly_rate',
                        'basic_daily_rate', 'basic_hourly_rate', 'effective_date_from', 'effective_date_to'],
                headers : ['ID','Client', 'Remote Contractor', 'Monthly Rate', 'Weekly Rate', 'Daily Rate', 
                        'Hourly Rate', 'Effective From', 'Effective To'],
                alignItemToRight : ['basic_monthly_rate','basic_weekly_rate','basic_daily_rate','basic_hourly_rate','effective_date_from','effective_date_to'],
                searchQuery : '',
                isSearchAll : false,
                currentPage : 1,
                rowLimit : 20,
                selectedRows : []
            }
        },
        methods : {
            
            getClients () {
                
                axios.get(this.API_URL+'/accounting/client-list',{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{

                    if ( response.data.success ) {
                        const clientsData = response.data.data;

                        for ( const x in clientsData ) {
                            this.clientsOption.push({
                                'id' : clientsData[x]['id'],
                                'name' : clientsData[x]['client_name']
                            });
                        }

                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            getSubcontractors ( clientId  ) {
                

                axios.get(this.API_URL+'/accounting/subcontractor-list/'+clientId,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{

                    if ( response.data.success ) {
                        const subcontractorsData = response.data.data;
                        this.subcontractorsOption = subcontractorsData;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            getContractRate ( page ) {

                this.currentPage = page;

                this.selectedRows = [];
                this.selectedIndex = "";
                this.isBtnDisableEdit = true;
                this.isBtnDisableDelete = true;
                
                this.getLoader = true;

                axios.get(this.API_URL+'/accounting/client-basic-rate',{
                    params:{
                        limit: this.rowLimit,
                        page: this.currentPage,
                        search: this.searchQuery
                    },
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{

                    if ( response.data.success ) {
                        const contractRate = response.data.data.data;

                        this.currentPage = response.data.data.current_page;
                        this.contractsData = response.data;
                        
                        for ( const x in contractRate ) {
                            contractRate[x]['selected'] = false;
                            contractRate[x]['effective_date_to'] = this.formatDate(contractRate[x]['effective_date_to'])
                            contractRate[x]['effective_date_from'] = this.formatDate(contractRate[x]['effective_date_from'])
                        }

                        this.contractsRates = contractRate;
                        this.getLoader = false;

                    } 

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            addContractRate ( data ) {

                this.closeModal( 'add' );
                this.modalLoaderShow = true;
                this.isLoading = true;
                data['limit'] = 20;

                axios.post(this.API_URL+'/accounting/store-client-basic-rate',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if (response.data.success) {
                        
                        const rateData = response.data.data.data;

                        this.currentPage = response.data.data.current_page;
                        this.contractsData = response.data;

                        for ( const x in rateData ) {
                            rateData[x]['selected'] = false;
                        }
                        
                        this.contractsRates = rateData;
                        this.isLoading = false;
                        this.selectedRows = [];

                    }
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            editContractRate ( data ) {

                this.closeModal( 'edit' );
                this.modalLoaderShow = true;
                this.isLoading = true;
                
                axios.post(this.API_URL+'/accounting/update-client-basic-rate',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if (response.data.success) {

                        this.contractsRates[this.selectedIndex] = response.data.data
                        this.contractsRates[this.selectedIndex]['selected'] = true;
                        this.isLoading = false;

                    }
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },
            
            deleteContractRate () {

                this.isLoading = true;

                axios.post(this.API_URL+'/accounting/delete-client-basic-rate',
                    { 
                        id : this.selectedRows,
                        limit : 20
                    }
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if (!response.data.success) {
                        this.isLoading = false;
                        alert('Unable to delete.')
                        return
                    }
                    
                    let leftData = [];
                    for ( const x in this.contractsRates ) {
                        if ( this.selectedRows.includes(this.contractsRates[x]['id'])) {
                            continue;
                        }
                        leftData.push(this.contractsRates[x]);
                    }

                    const rateData = response.data.data.data;

                    this.currentPage = response.data.data.current_page;

                    for ( const x in rateData ) {
                        rateData[x]['selected'] = false;
                    }

                    this.contractsRates = leftData;
                    
                    this.selectedRows = [];
                    this.selectedIndex = "";
                    this.isBtnDisableDelete = true;
                    this.isBtnDisableEdit = true;
                    this.isLoading = false;
                    
                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },
            
            selectRow ( selected ) {
                let index = 0;

                for(const x in this.contractsRates){

                    if (selected.id == this.contractsRates[x]['id']) {
                        index = x;

                        if (  this.selectedRows.includes(this.contractsRates[x]['id']) ) {
                            this.selectedRows = this.selectedRows.filter(item => item !== this.contractsRates[x]['id']);
                        }else {
                            this.selectedRows.push(this.contractsRates[x]['id']);
                        }
                    }

                }

                this.isBtnDisableEdit = this.selectedRows.length > 1 ? true : false;
                this.isBtnDisableDelete = false;

                if (this.selectedRows.length == 0) {
                    this.isBtnDisableEdit = true;
                    this.isBtnDisableDelete = true;
                }

                if ( this.selectedRows.length == 1 ) {
                    this.selectedIndex = this.contractsRates.findIndex((value) => value.id === this.selectedRows[0]);
                }

                this.contractsRates[index].selected = this.contractsRates[index].selected ? false : true;
                
            },
            
            toggleModal ( action ) {
                
                this.actionType = action;
                this.showModal[action] = true;

            },

            closeModal ( action ) {
                
                this.showModal[action] = false;

            },
            
            toggleConfirmModal ( action ) {
                
                if ( this.actionType == 'delete' && action == 'yes' ) {
                    this.modalLoaderShow = true;
                    this.actionType = 'delete';
                    this.confirmModal = !this.confirmModal;
                    this.deleteContractRate();

                    return
                }
                
                if ( this.actionType == 'edit' && action == 'yes' ) {

                    const selectedRow = this.getSelectedRow;
                    this.getSubcontractors(selectedRow['client_id'])
                    this.toggleModal('edit');
                    this.actionType = 'edit';
                    this.confirmModal = !this.confirmModal;

                    return
                }

                this.actionType = action;
                this.confirmModal = !this.confirmModal;

            },

            formatDate ( value ){

                if ( !value ) { return ""}
                var d = new Date(value),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');

            },

        },

        computed : {

            getSelectedRow (){
                
                if ( this.actionType == 'add' ) {
                    return ''}
                
                if ( this.selectedRows.length > 1 ) {
                    return {"client_name" :"multiple records"}
                }

                const i = this.selectedIndex;

                return this.contractsRates[i] ? this.contractsRates[i] : "";

            },

        },

        watch : {

            searchQuery : {
                handler ( newValue, oldValue ) {
                    if ( this.isSearchAll && oldValue.length > 0 && newValue.length == 0 ) {
                        this.getContractRate(1);
                        this.isSearchAll = false;
                    }
                }
            }

        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getContractRate(1);
            this.getClients();
        }
    }

</script>

<template>

    <div class="container-fluid p-0 px-4 pt-4">

        <div class="row">
            <div class="col-12">

                <div class="row">
                    <div class="col-12 mb-2">
                        <div class="action-bar">
                            <MaterialButton variant="gradient" color="none" class="mb-0 yes-btn" 
                                @click="toggleModal( 'add' )">
                                <span class="fas fa-plus"></span> &nbsp;Add
                            </MaterialButton> &nbsp;
                            <MaterialButton variant="gradient" color="none" class="mb-0 yes-btn"
                                @click="toggleConfirmModal( 'edit' )" :class="{disabled: isBtnDisableEdit}">
                                <span class="fas fa-edit"></span> &nbsp;Edit
                            </MaterialButton> &nbsp;
                            <MaterialButton variant="gradient" color="none" class="mb-0 yes-btn"
                                @click="toggleConfirmModal( 'delete' )" :class="{disabled: isBtnDisableDelete}">
                                <span class="fas fa-trash"></span> &nbsp;Delete
                            </MaterialButton> 
                        </div>
                        <div class="search-bar mx-4 mt-2 mt-md-0">
                            <MaterialInput class="border" icon="search mx-3" placeholder="Search" size="sm" 
                            v-model="searchQuery" @keyup.enter="getContractRate(1)"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Please hit enter to search in database."/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">

                <div v-if="getLoader" class="text-center">
                    <br /><br />
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <br /><br /><br />
                </div>

                <div v-else> 
                    <DataGrid 
                        @selectRow="selectRow"
                        :data="contractsRates"
                        :headers="headers"
                        :columns="gridColumns"
                        :filter-key="searchQuery"
                        :alignItemToRight="alignItemToRight">
                    </DataGrid>
                </div>

                <div style="float: right">
                    <data-pagination v-if="contractsData.success"
                        @currentPage="getContractRate"
                        :records="contractsData"
                    />
                </div>
            </div>
            <div class="col-12">
                <Teleport to="body">
                    <the-add
                        v-if="showModal.add"
                        @close = "closeModal( 'add' )" 
                        @addContractRate = "addContractRate"
                        @getSubcontractors = "getSubcontractors"
                        :subcontractorsOption = "subcontractorsOption"
                        :clientsOption = "clientsOption"
                        :show = "showModal.add">
                    </the-add>
                    <the-edit
                        v-if="showModal.edit"
                        @close = "closeModal( 'edit' )" 
                        @editContractRate = "editContractRate"
                        @getSubcontractors = "getSubcontractors"
                        :show = "showModal.edit"
                        :subcontractorsOption = "subcontractorsOption"
                        :clientsOption = "clientsOption"
                        :selectedData = "getSelectedRow"
                        :selectedIndex = "selectedIndex"
                        >
                    </the-edit>

                    <!-- Success Loader -->
                    <StandardModal 
                        @close="modalLoaderShow = !modalLoaderShow"
                        :show="modalLoaderShow" 
                        :hasClose=true
                        size="dialog-sm"
                        >
                        <template v-if="isLoading" #body>
                            <Loader v-if="isLoading"></Loader>
                        </template>

                        <template v-if="!isLoading" #body>
                            <div style="text-align: center">
                                <h5 class="alert-message" v-if="actionType == 'delete'"> Successfully deleted. </h5>
                                <h5 class="alert-message" v-if="actionType == 'edit'"> Successfully updated. </h5>
                                <h5 class="alert-message" v-if="actionType == 'add'"> Successfully added. </h5>
                                <span>&nbsp;</span>
                            </div>
                        </template>

                    </StandardModal>
                        
                    <StandardModal 
                        @close="toggleConfirmModal('no')"
                        :show="confirmModal" 
                        hasFooter="true"
                        hasClose="true"
                        size="dialog-md"
                        >
                        
                        <template #body>

                            <h5 v-if="actionType == 'delete'" class="alert-message" >You have selected {{ getSelectedRow.client_name }} to be deleted. Would you like to proceed?</h5>
                        
                            <h5 v-if="actionType == 'edit'" class="alert-message" >You have selected {{ getSelectedRow.client_name }} to be edited. Would you like to proceed?</h5>
                        
                            <h5 v-if="confirmClose" class="alert-message" >Do you want to save the changes you made?</h5>
                        
                        </template>
                        
                        <template #footer>

                            <div v-if="confirmClose">
                                <MaterialButton size="sm" variant="contained" color="none" class="command-btn mb-0" @click="toggleModal('yes')">
                                    Yes
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" color="none" class="no-btn mb-0" @click="toggleModal('no')">
                                    no
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" color="none" class="no-btn mb-0" @click="toggleModal('cancel')">
                                    cancel
                                </MaterialButton>
                            </div>

                            <div v-else>
                                <MaterialButton size="sm" variant="contained" color="none" class="command-btn mb-0" @click="toggleConfirmModal('yes')">
                                    Yes
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" color="none" class="no-btn mb-0" @click="toggleConfirmModal('no')">
                                    no
                                </MaterialButton>
                            </div>

                        </template>

                    </StandardModal>
                </Teleport>
            </div>
        </div>
    </div>

</template>

<style scoped>
    .search-bar .input-group {
        border-radius: 5px;
    }
    .action-btn {
        background: #5E44FF !important;
        border-radius: 5px;
    }
    .action-btn:hover, .action-btn:focus-visible, .action-btn:focus, .action-btn:active {
        background: #2C16B2  !important;
    }
    .table > thead {
        color: #fff;
        background-color: #002315;
    }
    .table thead th {
        padding: 0.5rem 0.5rem;
    }
    .table thead th:first-child {
        border-radius: 10px 0px 0px 0px;
    }
    .table thead th:last-child {
        border-radius: 0px 10px 0px 0px;
    }
    .table thead th {
        border: 1px #b7b7b7 solid;
    }
    .table tbody td {
        border: 1px #b7b7b7 solid;
    }
    .table tbody tr:last-child td {
        border: 1px #b7b7b7 solid;
    }
    .search-bar {
        float: right;
    }
    .action-bar {
        float: right;
    }
    .select_row:hover{
        background-color: #99f89c;
        cursor: pointer;
    }
    .selected_row{
        background-color: #99f89c;
    }
    .alert-message {
        padding-top: unset;
    }
    .f-action-btn {
        border-radius: 5px;
    }
    .fa-edit,.action-label{color: unset}
</style>

<style>
.multiselect-contract-rate {
    --ms-tag-bg: #c4bcfc;
    --ms-tag-color: #3f3f3f;
    --ms-border-color: #D1D5DB;
    --ms-border-color-active: #D1D5DB;
    --ms-ring-color: #c4bcfc;
    box-shadow: unset !important;
}
.multiselect-contract-rate .multiselect-option.is-selected.is-pointed {
    background: #c4bcfc;
    color: #3f3f3f;
}
.multiselect-contract-rate .multiselect-option.is-selected {
    background: #c4bcfc;
    color: #3f3f3f;
}
.multiselect-contract-rate .multiselect-dropdown {
    overflow-x: hidden !important;
}
</style>

<style src="@vueform/multiselect/themes/default.css"></style>