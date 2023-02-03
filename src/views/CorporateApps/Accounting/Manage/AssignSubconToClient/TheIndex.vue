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
                subconPersData: {
                    success : false
                },
                countries : [],
                selectedIndex : "",
                isBtnDisabled : true,
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
                gridColumns : ['link_subcon_id', 'subcon_name', 'link_client_id', 'client_name'],
                headers : ['Subcon ID', 'Subcon Name', 'Client ID', 'Client Name'],
                searchQuery : '',
                getLoader : false,
                isSearchAll : false,
                currentPage : 1,
                rowLimit : 20,
            }
        },
        methods : {

            addProfile ( data ) {

                this.closeModal( 'add' );
                this.modalLoaderShow = true;
                this.isLoading = true;

                axios.post(this.API_URL+'/accounting/store-clientsubcon',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    if (response.data.success) {

                        const returnData = response.data.data;
                
                        data['id'] = returnData.id;
                        this.clients.unshift(data);

                        this.isLoading = false;
                        this.getClientSubcon(1);

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
                
                axios.post(this.API_URL+'/accounting/update-clientsubcon',
                    data
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if (response.data.success) {

                        this.clients[this.selectedIndex] = data
                        this.isLoading = false;
                        this.getClientSubcon(1);

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

                axios.post(this.API_URL+'/accounting/delete-clientsubcon',
                    { id : this.clients[this.selectedIndex]['id'] }
                ,{
                    headers: { Authorization: `Bearer ${this.TOKEN}` }
                }).then((response)=>{
                    
                    if (response.data.success) {

                        this.clients.splice(this.selectedIndex, 1)
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

            getClientSubcon ( page ) {

                this.currentPage = page;
                this.selectedIndex = "";
                
                this.getLoader = true;

                axios.get(this.API_URL+'/accounting/clientsubcon',{
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

                        this.currentPage = response.data.data.current_page;
                        this.subconPersData = response.data;
                        
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

            selectRow ( selected ) {
                let index = 0;

                for(const x in this.clients){
                    this.clients[x].selected = false;

                    if (selected.id == this.clients[x]['id']) {
                        index = x;
                    }

                }

                this.isBtnDisabled = false;
                this.selectedIndex = index;
                this.clients[index].selected = true;

            },
            
            toggleModal ( action ) {
                
                this.actionType = action;
                this.showModal[action] = true;

                console.log(action)
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
                
                const i = this.selectedIndex;

                return this.clients[i] ? this.clients[i] : "";

            },

        },

        watch : {

            searchQuery : {
                handler ( newValue, oldValue ) {
                    if ( this.isSearchAll && oldValue.length > 0 && newValue.length == 0 ) {
                        this.getClientSubcon(1);
                        this.isSearchAll = false;
                    }
                }
            }

        },

        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getClientSubcon(1);
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
                            <MaterialButton variant="gradient" class="mb-0 yes-btn" 
                                @click="toggleModal( 'add' )">
                                <span class="fas fa-plus"></span> &nbsp;Add
                            </MaterialButton> &nbsp;
                            <MaterialButton variant="gradient" class="mb-0 yes-btn"
                                @click="toggleConfirmModal( 'edit' )" :class="{disabled: isBtnDisabled}">
                                <span class="fas fa-edit"></span> &nbsp;Edit
                            </MaterialButton> &nbsp;
                            <MaterialButton variant="gradient" class="mb-0 yes-btn"
                                @click="toggleConfirmModal( 'delete' )" :class="{disabled: isBtnDisabled}">
                                <span class="fas fa-trash"></span> &nbsp;Delete
                            </MaterialButton> 
                        </div>
                        <div class="search-bar mx-4 mt-2 mt-md-0">
                            <MaterialInput class="border" icon="search mx-3" placeholder="Search" size="sm" 
                            v-model="searchQuery" @keyup.enter="getClientSubcon(1)"
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
                    <data-pagination v-if="subconPersData.success"
                        @currentPage="getClientSubcon"
                        :records="subconPersData"
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
                        :countries = "countries">
                    </the-add>
                    <the-edit
                        v-if="showModal.edit"
                        @close = "closeModal( 'edit' )" 
                        @editProfile = "editProfile"
                        :show = "showModal.edit"
                        :countries = "countries"
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

                            <h5 v-if="actionType == 'delete'" class="alert-message" >You have selected {{ getSelectedRow.subcon_name }} - {{ getSelectedRow.client_name }} to be deleted. Would you like to proceed?</h5>
                        
                            <h5 v-if="actionType == 'edit'" class="alert-message" >You have selected {{ getSelectedRow.subcon_name }} - {{ getSelectedRow.client_name }} to be edited. Would you like to proceed?</h5>
                        
                            <h5 v-if="confirmClose" class="alert-message" >Do you want to save the changes you made?</h5>
                        
                        </template>
                        
                        <template #footer>

                            <div v-if="confirmClose">
                                <MaterialButton size="sm" variant="contained" class="command-btn mb-0" @click="toggleModal('yes')">
                                    Yes
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" class="no-btn mb-0" @click="toggleModal('no')">
                                    no
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" class="no-btn mb-0" @click="toggleModal('cancel')">
                                    cancel
                                </MaterialButton>
                            </div>

                            <div v-else>
                                <MaterialButton size="sm" variant="contained" class="command-btn mb-0" @click="toggleConfirmModal('yes')">
                                    Yes
                                </MaterialButton>&nbsp;
                                <MaterialButton size="sm" variant="contained" class="no-btn mb-0" @click="toggleConfirmModal('no')">
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