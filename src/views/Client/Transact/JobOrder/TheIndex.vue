<script>
import api  from "@/static/config.json";
import axios from "axios";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialAlert from "@/components/MaterialAlert.vue";
import StandardModal from "@/components/Modals/StandardModal.vue";
import Loader from "@/components/Loader.vue";
import ViewUpdate from "./ViewUpdate.vue";
import ThePagination from "./ThePagination.vue";
import moment from 'moment';

export default {
    components: {
    axios,
    api,
    MaterialButton,
    MaterialAlert,
    StandardModal,
    Loader,
    ViewUpdate,
    ThePagination,
    moment
},
    data(){
        return {
            USERID : "",
            TOKEN : "",
            joList : [],
            joDetails : {},
            industries : [],
            isEditable : false,
            modalLoaderShow: false,
            isLoadingSubmit : false,
            isLoading : false,
            isSuccess : false,
            showModalViewUpdate : false,
            pageCount : 10,
            clientBhId : 0,
        }
    },
    methods: {

        submitCrf ( data ) {
            
            console.log('formdata', data );
            this.showModalViewUpdate = false;
            this.modalLoaderShow = true;
            this.isLoadingSubmit = true;

            axios.post(this.API_URL+'/crf/updateJobOrder',
                data
            ,{
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{

                this.getAllJobOrder(this.joList['currentPage']);

                this.showModalViewUpdate = false,
                this.isLoadingSubmit = false;
                this.isSuccess = true;

            }).catch((err)=>{
                console.log(err)
                this.isSuccess = false;
                if(err.response.status == 401){
                    localStorage.removeItem('userid');
                    localStorage.removeItem('token');
                    this.$router.push('/'); 
                }
            });

        },

        async getAllJobOrder ( page = 0 ) {

            this.isLoading = true;
            await axios.get(this.API_URL+'/crf/getAllJobOrder/'+page+'/' + this.pageCount +'/' + this.clientBhId, {
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{
                if ( response.data.success ) {
                    this.isLoading = false;
                    this.joList = response.data.data;

                    this.joList['totalPage'] = parseInt( this.joList.total / this.pageCount );
                    this.joList['currentPage'] = page;

                    if ( this.joList['total'] > 0 ) {
                        this.clientBhId = this.joList['data'][0]['clientContact']['id'];
                    }

                }
            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },

        viewJo (data) {

            this.isEditable = data['customText14'] == 'No' ? false : true;
            const clientContact = data['clientContact'];
            const businessSector = data['businessSectors']['data'];
            this.joDetails.name = clientContact['firstName']+" "+clientContact['lastName'];
            this.joDetails.clientCorporation = data['clientCorporation']['name'];

            this.joDetails.client_portal_id = data['externalID'];
            this.joDetails.joId = data['id'];
            this.joDetails.joIndustry = businessSector.map(a => a.id);
            this.joDetails.joOffshore = data["customText4"];
            this.joDetails.joTitle = data['title'];
            this.joDetails.joDescription = data['description'];
            this.joDetails.joRoleObj = data['customTextBlock1'];
            this.joDetails.joType = data['employmentType'];
            this.joDetails.joExpectedTof = data["customText13"];
            this.joDetails.joOpenings = data['numOpenings'];
            this.joDetails.joTimezone = data['customText2'];
            this.joDetails.joHourlyRate = data["customText6"];
            this.joDetails.joExpertise = data["customText7"];
            this.joDetails.joMidSkills = data['customTextBlock3'];
            this.joDetails.joAdvSkills = data['customTextBlock2'];
            
            this.joDetails.joOs = data['customText17'];
            this.joDetails.joTools = data['customText18'] ? data['customText18'] : [''];
            this.joDetails.joAuNumber = data['customText19'];
            this.joDetails.joMonitors = data['customText20'];
            this.joDetails.joCommTools = data['customText21'];
            this.joDetails.joTeam = data['customText22'];
            this.joDetails.joCommOthers = data['customText23'];
            
            this.joDetails.joCompanyAge = data['customInt5'];
            this.joDetails.joEmployees = data['customText27'];
            this.joDetails.joSourcing = data['customText8'];
            this.joDetails.joSize = data['customText9'];

            this.joDetailsString = JSON.stringify(this.joDetails);
            
            this.showModalViewUpdate = true;
        },

        async getIndustries () {
            
            await axios.get(this.API_URL+'/crf/getIndustries',{
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{
                if ( response.data.success ) {
                    const data = response.data.data.data;
                    this.industries = data;
                }
            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },

        updateJobOrder () {
            
            axios.post(this.API_URL+'/crf/updateJobOrder',{
                headers: { Authorization: `Bearer ${this.TOKEN}` }
            }).then((response)=>{
                console.log(response);
            }).catch((err)=>{
                if(err.response.status == 401){
                    console.log("Test")
                }
            });
        },
        
        formatDisplayedDate ( value ) {
            if (value) {
                return moment(String(value)).format( "MMM. DD, YYYY" );
            }
        }
    },

    mounted(){
        this.API_URL = api.DEV_API_URL;
        this.TOKEN = localStorage.getItem('token');
        this.USERID = localStorage.getItem('userid');
        this.getAllJobOrder();
        this.getIndustries();
    }
}

</script>
<template>
        
    <div class="container-fluid">



        <div class="row">
            <div class="col-md-12 p-0 px-1">
                <div class="table-responsive tableFixHead text-light" >
                    <table class="table table-hover table-striped">
                            <thead class="bg-header text-light">
                                    <th scope="col">Job ID</th>
                                    <th scope="col">Job Title</th>
                                    <th scope="col">Job Type</th>
                                    <th scope="col">Date Created</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                            </thead>
                            <tbody v-if="!isLoading">
                                <template v-if="joList.count > 0">
                                    <tr v-for="jo in joList.data" >
                                        <td>{{ jo.id }} </td>
                                        <td>{{ jo.title }}</td>
                                        <td>{{ jo.employmentType }}</td>
                                        <td>{{ formatDisplayedDate(jo.convertedDatetime) }}</td>
                                        <td>{{ jo.status }}</td>
                                        <td width="50px">
                                        <MaterialButton size="sm" variant="contained" color="none" class="command-btn mb-0 py-1"
                                        @click="viewJo(jo)">
                                            View
                                        </MaterialButton><span>&nbsp;</span></td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="6">No info available.</td>
                                    </tr>
                                </template>
                            </tbody>
                    </table>
                    <Loader v-if="isLoading"></Loader>
                </div>
                <div class="right-floater mt-n3" v-if="joList.length != 0">
                    <the-pagination :records="joList" @currentPage="getAllJobOrder"></the-pagination>
                </div>
            </div>
        </div>

        <div class="col-12">
            <Teleport to="body">
                <ViewUpdate
                v-if="showModalViewUpdate"
                @close = "showModalViewUpdate = false" 
                @submitCrf = "submitCrf"
                :show = "showModalViewUpdate"
                :joDetails = "joDetails"
                :joDetailsString = "joDetailsString"
                :industries = "industries"
                />
            </Teleport>
        </div>
        <!-- Success Loader -->
        <StandardModal 
            @close="modalLoaderShow = !modalLoaderShow"
            :show="modalLoaderShow" 
            :hasClose=true
            size="dialog-sm"
            >
            <template v-if="isLoadingSubmit == true" #body>
                <Loader></Loader>
            </template>

            <template v-else #body>
                <div style="text-align: center">
                    <h5 class="alert-message" v-if="isSuccess"> Successfully saved. </h5>
                    <h5 class="alert-message" v-else> There was an error submitting the form. </h5>
                    <span>&nbsp;</span>
                </div>
            </template>

        </StandardModal>
    </div>
</template>
<style scoped>
tbody {
    border-bottom: 1px solid lightgray !important;
}
th, td {
    border-left: 1px solid lightgray !important;
    border-right: 1px solid lightgray !important;
}
.right-floater{
    float:right;
}
</style>
