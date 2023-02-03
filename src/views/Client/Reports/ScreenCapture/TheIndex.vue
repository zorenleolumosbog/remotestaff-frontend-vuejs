<script setup>
    import MaterialButton from "@/components/MaterialButton.vue";
    import VueEasyLightbox from 'vue-easy-lightbox'
    import axios from "axios";
    import api from "@/static/config.json";
    import Loader from "@/components/Loader.vue";
    import StartEndDate from "../Inputs/StartEndDate.vue";
    import ThePagination from "../../Widgets/ThePagination.vue";
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import VLazyImage from "v-lazy-image";
</script>
<script>
    export default {
        components: {
            VueEasyLightbox,
            Loader,
            StartEndDate,
            StandardModal,
            VLazyImage
        },
        data(){
            return{
                format: 'MM/dd/yyyy',
                TOKEN: '',
                searchParams:{
                    startDate:'',
                    endDate:'',
                    subcon:'',
                    staff_value:'',
                    dataSource: 'current',
                },
                details: {
                    records: {
                        success: false
                    },
                    pagination: {
                        current: 1,
                        limit: 12
                    },
                    staff_value:'',
                    images: [],
                },
                client_value: '',
                subcons:[],
                images: [],
                index: null,
                visible: false,
                showModalSuccess : false,
                showModalError: false,
                error_msg:'',
                isLoading: false,
                index: 0, // default: 0
                found:false,
                first_load:false,
                total_records:'',
                userdata:[],
                small_loader:false,
                no_file:false,
                renderComponent: true,
            }
        },
        provide() {
            return {
                format: this.format,
                searchParams: this.searchParams,
                client_value: localStorage.getItem('client_id'),
                subcons: this.subcons,
            }
        },
        mounted(){
            this.client_value = localStorage.getItem('client_id');
            this.first_load = true;
            this.TOKEN = localStorage.getItem('token');
            this.userdata = localStorage.getItem('userdata');
            this.getImages();
        },
        methods:{
            forceRerender() {
                // Removing my-component from the DOM
                this.renderComponent = false;

                this.$nextTick(() => {
                // Adding the component back in
                this.renderComponent = true;
                });
            },
            showImg(index) {
                this.index = index
                this.visible = true
            },
            handleHide() {
                this.visible = false
            }, 
            getImages() {
                let _this = this;

                if(this.first_load){
                    _this.showModalSuccess = true;
                }
                

                if(_this.searchParams.staff_value==""){
                    _this.found = false;
                }else{

                    _this.isLoading = true;

                        axios({
                            method: 'get',
                            url: api.DEV_API_URL + '/client/get-screenshots?subcon_id='+_this.searchParams.staff_value+'&source='+_this.searchParams.dataSource+'&start_date='+_this.searchParams.startDate+'&end_date='+_this.searchParams.endDate+'&client_id='+_this.client_value+'&limit='+_this.details.pagination.limit+'&page='+_this.details.pagination.current,
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        })
                        .then(function (response) {
                            if(response.data.success){
                                _this.details.records = response.data;
                                _this.total_records = response.data.data.total;
                                _this.found = true;
                            }else{
                                _this.found = false;
                            }

                            _this.isLoading = false;
                        
                        });
                
                }
                
               
            }, 
            fetchScreenShots(){
                if(this.searchParams.startDate==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select start date.';
                }else if(this.searchParams.endDate==""){
                    this.showModalError = true;
                    this.error_msg = 'Please select end date.';
                }else if(this.searchParams.startDate > this.searchParams.endDate){
                    this.showModalError = true;
                    this.error_msg = 'End date should be greater than or equal to start date.';
                }else if(this.searchParams.staff_value==""){
                    this.showModalError = true;
                    this.error_msg = 'Please Staff.';
                }else{
                    this.getImages();
                    this.error_msg = '';
                    this.showModalError = false;
                }
                
            },
            currentPage(val) {
                this.details.pagination.current = val;
                this.getImages();
            },closeModalError(){
                this.showModalError = false;
            },
            getToLocaleTimeString(date) {
                var date = new Date(date);
                return date.toLocaleString('en-US');
            },
            formatDate(d_date){
                var date = new Date(d_date);
                var dateFormat = (date.getMonth()+1) + "-" + date.getDate() + "-"  + date.getFullYear();
                return dateFormat;
            },
            showSmallLoader(){
                this.small_loader = true;
            },
            closeSmallLoader(){
                this.small_loader = false;
            },nofile(){
                this.no_file = true;
            }
        }
    }
</script>
<template>
    <div class="container-fluid p-3">
        <div class="row">
            <start-end-date></start-end-date>
            <div class="col-md-2 p-0">
                <div class="date-label">&nbsp;</div>
                <MaterialButton :disabled="!searchParams.staff_value" size="sm" class="btn-icon mx-1 command-btn" @click="fetchScreenShots">
                    <div class="buttons d-flex align-items-center"> Fetch </div>
                </MaterialButton>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 p-0 px-1">
                     <div class="loader-large" v-if="isLoading">
                        <Loader v-if="isLoading"></Loader>
                    </div>
                <template v-if="details.records.success && !isLoading">
                    <vue-easy-lightbox
                    escDisabled
                    :visible="visible"
                    :imgs="details.records.data.data"
                    :index="index"
                    @hide="handleHide"
                    ></vue-easy-lightbox>
                
                    <div class="screenshots-wrap">
                    <div v-for="(datum, index) in details.records.data.data" :key="datum.id" class="screenshots"  @click="() => showImg(index)">
                            <div class="img_wrap">
                                <span class="loader" v-if="small_loader && !no_file"></span>
                                <h6 v-if="no_file" class="no-filex">No image found.</h6>
                                <v-lazy-image :src="datum.src"  v-on:click="clickImage(index)" @intersect="showSmallLoader" @load="closeSmallLoader" @error="nofile" v-if="!no_file"/>
                            </div> 
                            <div class="img_date">
                                {{datum.formatted_date}} {{getToLocaleTimeString(datum.date_time)}}
                            </div>    
                        </div>
                    </div>

                    <div class="pagination-wrap">
                        <the-pagination v-if="details.records.success && total_records!=0" :records="details.records" @currentPage="currentPage"></the-pagination>
                    </div>
                    

               </template>
                    <div class="screenshots-wrap" v-if="total_records==0 && !isLoading">
                        <h5 class="not-found text-center">No screenshots found.</h5>
                    </div>
                

            </div>
        </div>
    </div>

        <StandardModal 
                        :show="showModalError"
                        @close="closeModalError"
                        :hasClose=true
                        :hasHeader='false'
                        :hasFooter='false'
                        title="Error"
                        size='dialog-sm'>
                        <template #body>
                            <h5 class="error-msg alert-message text-center">{{error_msg}}</h5>
                        </template>
                        <template #footer>
                            &nbsp;
                        </template>
        </StandardModal>
    
</template>
<style scoped>

.not-found{margin-top: 150px;}
.modal-body{height: 133px!important;}

.date-label {
    padding-top: 7px;
    padding-right: 0;
    font-size: 12px;
}
.input-date{
    border: var(--vs-border-width) var(--vs-border-style) var(--vs-border-color); 
    border-radius: var(--vs-border-radius); 
    padding: 4px 10px!important;
}
tbody {
    border-bottom: 1px solid lightgray !important;
}
th, td {
    border-left: 1px solid lightgray !important;
    border-right: 1px solid lightgray !important;
}

.loader-large{text-align: center; margin-top:150px;}
.screenshots{display: inline-block;   margin-right: 25px;     margin-bottom: 30px;}
.screenshots img{width: 100%; width: 250px;  height: 150px;}
.screenshots-wrap{margin-top:40px;}
.img_date{text-align: center; font-weight: bold; margin-top: 15px;}
.img_wrap{cursor:pointer;}
.pagination-wrap{float: right;}
.loader {
    width: 20px;
    height: 20px;
    border: 3px solid #63FF42;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    margin-top: 58px;
    margin-left: 110px;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 

    .no-filex{text-align:center;}
</style>
<style>
.toolbar-btn__rotate{display:none;}
.vel-img-title{font-size: 20px!important;  font-weight: bold!important;  color: #fff!important;}
</style>
