
<script>
    import Avatar from "@/assets/img/blank.png";
    import MaterialInput from "@/components/MaterialInput.vue";
    import ViewContract from "./ViewContract.vue";
    import { useRoute } from 'vue-router';
    import api  from "@/static/config.json";
    import axios from "axios";
    import ThePagination from "../../Widgets/ThePagination.vue";

    export default {
        components : {
            MaterialInput,
            ViewContract,
            api,
            axios,
            ThePagination
        },
        data() {
            return {
                API_URL : '',
                TOKEN : '',
                USERID : '',
                avatar : Avatar,
                showContract : false,
                subcontractors : [],
                records : {},
                isLoading : false,
                searchData : ''
            }
        },
        methods : {
            selectContract ( contractId ) {
                console.log(this.$router.currentRoute.na);
                window.location.href = "?id="+contractId+"&init=2";
            },

            getContracts ( page, search='' ) {
                console.log(search);
                this.isLoading = true;
                axios.get(this.API_URL+'/admin/subcontractor',{
                    params:{
                        limit:20,
                        page: page,
                        search: search
                    },
                    headers:{
                        'Authorization': `Bearer ${this.TOKEN}`
                    }
                }).then((response)=>{

                    if ( response.data.success ) {
                        this.isLoading = false;
                        this.subcontractors = response.data.data.data;
                        this.records = response.data;
                        console.log(this.records)
                        console.log(this.subcontractors)
                    }

                }).catch((err)=>{
                    if(err.response.status == 401){
                        localStorage.removeItem('userid');
                        localStorage.removeItem('token');
                        this.$router.push('/'); 
                    }
                });
            },

        },
        
        mounted () {
            this.API_URL = api.DEV_API_URL;
            this.TOKEN = localStorage.getItem('token');
            this.USERID = localStorage.getItem('userid');
            this.getContracts(1);
        }

    }
</script>

<template>
    
    <div class="container-fluid div-border p-3">
        <div class="row">
            <div class="col-12 mb-2">
                <div class="action-bar mx-1">
                    <MaterialInput class="d-flex mx-1 size border search-input" icon="search mx-2" placeholder="Search Contract" size="sm"
                    v-model="searchData"
                    @keyup.enter="getContracts(1, searchData)" />
                </div>
            </div>
        </div>
        <div class="row ">
            <div class="scroll table-responsive-sm">
                <div class="table-responsive tableFixHead text-dark" >
                    <div class="table-responsive">
                        <table id="table" class="table table-bordered table-hover table-striped">
                            <thead class="bg-header">
                                <tr>
                                    <th scope="col">Contractor</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Working Details</th>
                                    <th scope="col">Manager</th>
                                    <th scope="col">Recuiter</th>
                                    <th scope="col">Compliance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoading">
                                    <td colspan="7" class="text-center">
                                        <br /><br />
                                        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                        <br /><br /><br />
                                    </td>
                                </tr>
                                <tr v-else v-for="subcontractor in subcontractors" @click="selectContract(subcontractor.id)">
                                    <td>
                                        <div class="row px-2 contractor-info">
                                            <div class="col-3 p-0 m-0">
                                                <img class="contractor-avatar" :src="avatar" alt="" />
                                            </div>
                                            <div class="col-9 p-0 m-0 contractor">
                                                <p class="contract-id m-0 p-0">Contract ID : {{ subcontractor.id }}</p>
                                                <p class="staff-name m-0 p-0">{{ subcontractor.reg_firstname }} {{ subcontractor.reg_lastname }}</p>
                                                <p class="staff-email m-0 p-0">{{ subcontractor.personal_email }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td> {{ subcontractor.status }} </td>
                                    <td>No data to display.</td>
                                    <td>No data to display.</td>
                                    <td>No data to display.</td>
                                    <td>No data to display.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="right-floater mt-n2">
                        <the-pagination v-if="records.success" :records="records" @currentPage="getContracts"></the-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <view-contract
        v-if="showContract"
        @close = "showContract = false" 
        @updateContract = "updateContract"
        :show = "showContract"
    />

</template>

<style scoped>
table {
    border: 0px #fff;
    margin: 0 auto;
    outline-offset: -2px;
}
table th:first-child {
    border-radius: 5px 0 0 0;
}
table th:last-child {
    border-radius: 0 5px 0 0;
}
table tr:last-child > td:first-child {
    border-radius: 0 0 0 5px;
}
table tr:last-child > td:last-child {
    border-radius: 0  0 5px 0;
}
table td, th {
    padding: .5rem;
    outline: 1px solid rgb(230, 230, 230);
}
table th {
    color: #fff !important;
}
table tbody tr:hover {
    background-color: #BAAFFF;
    cursor: pointer;
}

.right-floater{
    float:right !important;
}
.contractor-info {
    width: 300px;
}
.contractor-avatar {
    width: 50px;
    height: 50px;
    border-radius: unset;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
}
.div-border{
    border: 1px solid #dde1e1;
    border-radius: 5px;
    min-height: 640px !important;
    /* height: auto; */
}
.action-bar {
    float: right;
    min-width: 300px;
    max-width: 300px;
}
.contractor p{
    font-size: 10px;
}
.staff-name {
    font-size: 12px !important;
    font-weight: 700 !important;
}
.search-input{
    border-radius: 5px;
}

</style>