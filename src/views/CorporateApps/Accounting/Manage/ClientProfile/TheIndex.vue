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
                clients: [],
                clientData: {
                    success : false
                },
                countries : [],
                selectedOptions : {
                    regions : [],
                    states : [],
                    townCities : []
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
                gridColumns : ['id', 'client_id_legacy' ,'client_name' ,'client_poc' ,'client_poc_position'],
                headers : ['ID', 'Legacy ID', 'Client Name', 'Point Of Contact', 'POC Position'],
                searchQuery : '',
                getLoader : false,
                isSearchAll : false,
                currentPage : 1,
                rowLimit : 20,
                selectedRows : [],
                currencyOption : []
            }
        },
        methods : {

            addProfile ( data ) {

                this.closeModal( 'add' );
                this.modalLoaderShow = true;
                this.isLoading = true;
                data['limit'] = 20;

                axios.post(this.API_URL+'/accounting/store-client',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if (response.data.success) {
                        
                        const clientsData = response.data.data.data;
                        const clientData = response.data;

                        this.currentPage = response.data.data.current_page;
                        this.clientData = clientData;

                        for ( const x in clientsData ) {
                            clientsData[x]['selected'] = false;
                        }
                        
                        this.clients = clientsData;
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

            editProfile ( data ) {

                this.closeModal( 'edit' );
                this.modalLoaderShow = true;
                this.isLoading = true;
                
                axios.post(this.API_URL+'/accounting/update-client',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if (response.data.success) {

                        this.clients[this.selectedIndex] = data
                        this.clients[this.selectedIndex]['selected'] = true;
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
            
            deleteClientProfile () {

                this.isLoading = true;

                axios.post(this.API_URL+'/accounting/delete-client',
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
                    
                    const clientsData = response.data.data.data;
                    const clientData = response.data;

                    this.currentPage = response.data.data.current_page;
                    this.clientData = clientData;

                    for ( const x in clientsData ) {
                        clientsData[x]['selected'] = false;
                    }
                    
                    this.clients = clientsData; 

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

            getClients ( page ) {
                
                this.currentPage = page;

                this.selectedRows = [];
                this.selectedIndex = "";
                this.isBtnDisableEdit = true;
                this.isBtnDisableDelete = true;

                this.getLoader = true;

                axios.get(this.API_URL+'/accounting/client-pgn',{
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
                        const clientsData = response.data.data.data;
                        const clientData = response.data;

                        this.currentPage = response.data.data.current_page;
                        this.clientData = clientData;

                        for ( const x in clientsData ) {
                            clientsData[x]['selected'] = false;
                        }
                        
                        this.clients = clientsData;
                        
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

            getCountries () {

                axios.get(this.API_URL+'/admin/country',{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        this.countries = response.data.data.data;
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            getRegionState ( id, regionId, stateId ) {

                axios.get(this.API_URL+'/admin/country/' + id,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        const data = response.data.data;
                        
                        this.selectedOptions['regions'] = data['regions'];
                        this.selectedOptions['states'] = data['states'];

                        this.getStates( regionId, stateId );

                    }

                }).catch((err)=>{
                    console.log(err)
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
                
            },

            getStates ( id, stateId ) {

                for ( const x in this.selectedOptions['regions'] ) {
                    
                    if (this.selectedOptions['regions'][x]['id'] == parseInt(id)) {
                        this.selectedOptions['states'] = this.selectedOptions['regions'][x]['states'];
                        
                        this.getTownCities( stateId );
                        break;
                    }
                }

                if ( id == 0 ) this.getTownCities( stateId );

            },

            getTownCities ( id ) {

                axios.get(this.API_URL+'/admin/state/' + id,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        const data = response.data.data;
                        this.selectedOptions['townCities'] = data['towncities']
                        
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            getClientTownCities ( id ) {

                axios.get(this.API_URL+'/admin/towncity/'+id,{
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{
                    
                    if ( response.data.success ) {
                        const data = response.data.data;
                        const state = data.state;

                        const countryId = state.region ? state.region.country.id 
                            : state.country.id;
                        
                        const regionId = state.region ? state.region.id: 0;
                        const stateId = state.id;
                        
                        this.clients[this.selectedIndex]['client_country'] = countryId;
                        this.clients[this.selectedIndex]['client_region'] = regionId;
                        this.clients[this.selectedIndex]['client_state'] = state.id;
                        this.clients[this.selectedIndex]['client_towncity'] = data.id;

                        this.getRegionState( countryId, regionId, stateId );

                    }

                }).catch((err)=>{
                    console.log(err)
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });

            },

            getCurrency () {
                axios({
                    method: 'get',
                    url: this.API_URL+`/admin/currency?page=1&limit=50&search=`,
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if ( response.data.success ) {
                        this.currencyOption = response.data.data.data
                    }

                }).catch((err)=>{
                    console.log(err)
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },

            selectRow ( selected ) {
                let index = 0;

                for(const x in this.clients){

                    if (selected.id == this.clients[x]['id']) {
                        index = x;

                        if (  this.selectedRows.includes(this.clients[x]['id']) ) {
                            this.selectedRows = this.selectedRows.filter(item => item !== this.clients[x]['id']);
                        }else {
                            this.selectedRows.push(this.clients[x]['id']);
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
                    this.selectedIndex = this.clients.findIndex((value) => value.id === this.selectedRows[0]);
                }

                this.clients[index].selected = this.clients[index].selected ? false : true;

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
                    this.deleteClientProfile();

                    return
                }

                if ( action == 'edit' ) {
                    this.getClientTownCities( this.clients[this.selectedIndex].client_towncity )
                }
                
                if ( this.actionType == 'edit' && action == 'yes' ) {
                    this.toggleModal('edit');
                    this.actionType = 'edit';
                    this.confirmModal = !this.confirmModal;

                    return
                }

                this.actionType = action;
                this.confirmModal = !this.confirmModal;

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

                return this.clients[i] ? this.clients[i] : "";

            },

        },

        watch : {

            searchQuery : {
                handler ( newValue, oldValue ) {
                    if ( this.isSearchAll && oldValue.length > 0 && newValue.length == 0 ) {
                        this.getClients(1);
                        this.isSearchAll = false;
                    }
                }
            }

        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getClients(1);
            this.getCountries();
            this.getCurrency();
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
                            v-model="searchQuery" @keyup.enter="getClients(1)"
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
                        :data="clients"
                        :columns="gridColumns"
                        :headers="headers"
                        :filter-key="searchQuery">
                    </DataGrid>
                </div>
                <div style="float: right">
                    <data-pagination v-if="clientData.success"
                        @currentPage="getClients"
                        :records="clientData"
                    />
                </div>
            </div>
            <div class="col-12">
                <Teleport to="body">
                    <the-add
                        v-if="showModal.add"
                        @close = "closeModal( 'add' )" 
                        @addProfile = "addProfile"
                        :show = "showModal.add"
                        :countries = "countries"
                        :currencyOption = "currencyOption">
                    </the-add>
                    <the-edit
                        v-if="showModal.edit"
                        @close = "closeModal( 'edit' )" 
                        @editProfile = "editProfile"
                        :show = "showModal.edit"
                        :countries = "countries"
                        :selectedOptions = "selectedOptions"
                        :selectedData = "getSelectedRow"
                        :selectedIndex = "selectedIndex"
                        :currencyOption = "currencyOption">
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
    .search-bar {
        float: right;
    }
    .action-bar {
        float: right;
    }
    .alert-message {
        padding-top: unset;
    }
    .f-action-btn {
        border-radius: 5px;
    }
    .fa-edit,.action-label{color: unset}
</style>