
<script setup>
    //images
    import profPic from "@/assets/img/blank.png";
    import editIcon from "@/assets/img/edit-icon.svg";
    import cropIcon from "@/assets/img/crop-icon.svg";
    import speedTestImage from "@/assets/img/speedtesting.jpg";
    import speedTestIcon from "@/assets/img/speedtest-icon.svg";
    import speedTestHistoryIcon from "@/assets/img/speedtest-history-icon.svg";
    import takeTestIcon from "@/assets/img/take-test-icon.svg";
    import uploadUcon from "@/assets/img/upload-icon.svg";
    import quickBreakIcon from "@/assets/img/quick-break-icon.svg";
    import lunchBreakIcon from "@/assets/img/lunch-break-icon.svg";
    import startWorkIcon from "@/assets/img/start-work-icon.svg";
    import startWorkWhiteIcon from "@/assets/img/start-work-white-icon.svg";
    import captureRunningIcon from "@/assets/img/timer-running.gif";

    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import MaterialAlert from "@/components/MaterialAlert.vue";
    import Loader from "@/components/Loader.vue";
    import MaterialInput from "@/components/MaterialInput.vue";
    import inputOutlined from "../../../layouts/sections/input-areas/inputs/components/InputOutlined.vue";

</script>

<script>
    import { Form } from 'vform';
    import api from "@/static/config.json";
    import axios from 'axios';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    import ThePagination from "@/views/CorporateApps/Widgets/ThePagination.vue";
    import AssessmentProgress from "../Widgets/AssessmentProgress.vue";
    import SpeedtestProgress from "../Widgets/SpeedtestProgress.vue";

    import "vue3-circle-progress/dist/circle-progress.css";
    import CircleProgress from "vue3-circle-progress";

    import { Cropper } from "vue-advanced-cropper";
    import "vue-advanced-cropper/dist/style.css";

    export default {
        data() {
            return {
                USERID : '',
                staffOverview: {
                    profile: [],
                    workReference: [],
                    contact: [],
                    speedtest: [],
                    speedtestHistory: [],
                    speedtestHistoryPagination: {
                        current: 1,
                        limit: 10
                    },
                    completeness: '',
                    validations: {
                        errors: [],
                        success: {
                            messsage: ""
                        }
                    }
                },
                profilePic: {
                    originSrc: profPic,
                    src: profPic,
                    type: "image/jpg",
                },
                profilePicForm: new Form({
                    photo : ""
                }),
                profilePicName: "",
                msg : "",
                color : "success",
                uploadLoader: false,
                showError: false,
                showModalSuccess : false,
                videoModalShow: false,
                showLoader: true,
                showSpinner: {
                    latency: false,
                    downloadSpeed: false,
                    uploadSpeed: false,
                },
                showSpeedtest: false,
                showSpeedtestHistory: false,
                showSpeedtestLoader: false,
                showModalImageCropper: false,
                showImageCropperLoader: false,
                showPhotoUploadSpinner: false,
                showPhotoCropSpinner: false,
                disableUploadButton: true,
                showTakeAssessment: false,
                showSpeedtestConfirmation: false,
                showGetAssessmentDataConfirmation: false,
                showDevelopmentMessage: false,
                voiceUrl: '',
                videoUrl: '',
                external_url : '',
                isUpdateProfile : false,
                isUpdateBasicInfo : false,
                voiceRecordingModalShow : false,
                file: {
                    name: '',
                    type: ''
                },
                filetype: '',
                isLoading: false,
                timetracker_time: "",
                uploadfield_error: '',
                uploadfieldfield_message: '',
                external_error: '',
                external_error_message: '',
            }
        },
        components:{
            Form,
            StandardModal,
            ThePagination,
            CircleProgress,
            AssessmentProgress,
            SpeedtestProgress,
            axios,
            Cropper
        },
        mounted() {
            this.USERID = localStorage.getItem('userid');
            this.getProfile();
            this.getWorkReference();
            this.getContact();
            this.getVoice();
            this.getVideo();
            this.getProfilePhoto();
        },
        methods:{
            unmounted() {
                // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
                if (this.profilePic.src) {
                    URL.revokeObjectURL(this.profilePic.src);
                }
            },
            change(result) {
                this.staffOverview.validations.success.messsage = "";
                this.showImageCropperLoader = false;
                this.isUpdateProfile = true;
                this.disableUploadButton = false;
            },
            cancelImageCropper() {
                this.isUpdateProfile = false;
                this.showModalImageCropper = false
                this.profilePic.src = this.profilePic.originSrc;
                this.disableUploadButton = true;
            },
            async cropImage() {
                this.showPhotoCropSpinner = true;

                const result = this.$refs.cropper.getResult();
                this.profilePic.src = result.canvas.toDataURL(
                    this.profilePic.type
                );

                const base64Response = await fetch(this.profilePic.src);
                const blob = await base64Response.blob();

                const file = new File([blob], this.file.name, {
                    type: this.file.type,
                });

                this.file = file;

                this.showPhotoCropSpinner = false;
                this.showModalImageCropper = false;
            },
            uploadImage(event) {
                /// Reference to the DOM input element
                const { files } = event.target;

                const imageFormat = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
                if(files[0].size > 10000000 && !imageFormat.includes(files[0].type)) {
                    this.staffOverview.validations.errors.file = [
                        'Only png, jpeg, jpg, and gif are allowed. - Max 10Mb.'
                    ];
                    
                    return;
                }

                if(files[0].size > 10000000) {
                    this.staffOverview.validations.errors.file = [
                        'File size should not be greater than 10MB.'
                    ];
                } else if(imageFormat.includes(files[0].type)) {
                    this.staffOverview.validations.errors.file = [];
                    this.showModalImageCropper = true;
                    this.showImageCropperLoader = true;

                    // Ensure that you have a file before attempting to read it
                    if (files && files[0]) {
                        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
                        if (this.profilePic.src) {
                            URL.revokeObjectURL(this.profilePic.src);
                        }
                        // 2. Create the blob link to the file to optimize performance:
                        const blob = URL.createObjectURL(files[0]);

                        // 3. Update the image. The type will be derived from the extension and it can lead to an incorrect result:
                        this.profilePic = {
                            originSrc: this.profilePic.originSrc,
                            src: blob,
                            type: files[0].type,
                        };

                        this.onFileChange(event);
                    }
                } else {
                    this.staffOverview.validations.errors.file = [
                        'Only png, jpeg, jpg, and gif are allowed.'
                    ];
                }
            },
            uploadProfilePhoto() {
                this.showPhotoUploadSpinner = true;

                let self = this;
                let formData = new FormData();

                formData.append('file', this.file);
                formData.append('filetype', 4);
                formData.append('jobseeker_id', this.USERID);

                axios.post(api.DEV_API_URL+'/upload-attachment/onboarding',
                        formData,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then((response)=>{
                        if(response.data.success){
                            self.profilePic.originSrc = response.data.s3_url;
                            self.emitter.emit("mapProfilePhoto", response.data.s3_url);
                            self.staffOverview.validations.errors = [];
                            self.staffOverview.validations.success.messsage = response.data.message;
                            self.showPhotoUploadSpinner = false;
                            self.isUpdateProfile = false;
                        }
                    })
                    .catch((errors) => {
                        if(errors.response.status === 401) {
                            self.removeToken();
                        }

                        if(errors.response.status === 422) {
                            self.staffOverview.validations.errors = errors.response.data;
                        }

                        self.showPhotoUploadSpinner = false;
                    });
            },
            getProfilePhoto() {
                let self = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/getfile/onboarding?jobseeker_id=${self.USERID}&filetype=4`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                .then((response)=>{
                    if(response.data.success){
                        self.profilePic.originSrc = response.data.data.url;
                        self.profilePic.src = response.data.data.url;
                        self.file.name = response.data.data.filename;
                        self.file.type = "image/jpeg";
                    }
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            getProfile() {
                let self = this;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/get-profile/onboarding',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: localStorage.getItem('userid'),
                        info_type: 'basic',
                    }
                })
                .then(function (response) {
                    if(response.data.success) {
                        self.staffOverview.profile = response.data.data;
                        self.staffOverview.completeness =  response.data.completeness;

                        if (self.staffOverview.profile) {
                            self.getAddress(self.staffOverview.profile.reg_home_addr_towncity);
                            self.getSpeedtest();
                        } else {
                            self.showLoader = false;
                        }
                    }
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            getWorkReference() {
                let self = this;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/get-workref/onboarding',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: localStorage.getItem('userid')
                    }
                })
                .then(function (response) {
                    self.staffOverview.workReference = response.data.data;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            getContact() {
                let self = this;

                axios({
                    method: 'post',
                    url: api.DEV_API_URL + '/get-contact/onboarding',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    data: {
                        jobseeker_id: localStorage.getItem('userid')
                    }
                })
                .then(function (response) {
                    self.staffOverview.contact = response.data;
                    if (self.staffOverview.contact.mobiles) {
                        response.data.mobiles.forEach(datum => {
                            if (datum.is_primary) {
                                self.staffOverview.contact.mobiles = datum;
                            }
                        });
                    }
                    if (self.staffOverview.contact.phones) {
                        response.data.phones.forEach(datum => {
                            if (datum.is_primary) {
                                self.staffOverview.contact.phones = datum;
                            }
                        });
                    }
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            getAddress(towncityId) {
                let self = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/towncity/' + towncityId,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    self.staffOverview.contact.address = response.data.data;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            getSpeedtest() {
                this.showSpinner.latency = true;
                this.showSpinner.downloadSpeed = true;
                this.showSpinner.uploadSpeed = true;

                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/speedtest/onboarding/${self.staffOverview.profile.reg_id}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if (response.data.success) {
                        self.staffOverview.speedtest = response.data.data;
                    }

                    self.showSpinner.latency = false;
                    self.showSpinner.downloadSpeed = false;
                    self.showSpinner.uploadSpeed = false;

                    self.showLoader = false;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }

                    self.showLoader = false;
                })
            },
            getSpeedtestHistory() {
                this.showSpeedtestLoader = true;
                this.showSpeedtestHistory = true;
                let self = this;

                axios({
                    method: 'get',
                    url: api.DEV_API_URL + `/speedtest-history/onboarding/${self.staffOverview.profile.reg_id}?page=${self.staffOverview.speedtestHistoryPagination.current}&limit=${self.staffOverview.speedtestHistoryPagination.limit}`,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if (response.data.success) {
                        self.staffOverview.speedtestHistory = response.data;
                    }

                    self.showSpeedtestLoader = false;
                })
                .catch(function (errors) {
                    if(errors.response.status === 401) {
                        self.removeToken();
                    }
                })
            },
            currentPageSpeedtestHistory(val) {
                this.staffOverview.speedtestHistoryPagination.current = val;
                this.getSpeedtestHistory();
            },
            async takeSpeedtest() {
                this.showSpinner.latency = true;
                this.showSpinner.downloadSpeed = true;
                this.showSpinner.uploadSpeed = true;

                var imageAddr = window.location.origin + speedTestImage;
                var downloadSize = 21348301;

                var startTime, endTime;

                const base64Response = await fetch(imageAddr);
                const blob = await base64Response.blob();

                const file = new File([blob], "speedtest", {
                    type: "image/jpeg",
                });
                
                let self = this;
                
                // Check latency and download user internet speed
                startTime = (new Date()).getTime();
                axios.get(imageAddr + `?timestamp=${startTime}`, {
                    onDownloadProgress: (donwloadEvent) => {
                        let progress = Math.round((donwloadEvent.loaded * 100) / donwloadEvent.total);
                        
                        if(progress > 50) {
                            this.showSpinner.latency = false;
                            this.showSpinner.downloadSpeed = false;

                            endTime = (new Date()).getTime();
                            const duration = (endTime - startTime) / 1000;

                            this.staffOverview.speedtest.latency = Math.round(Number(duration));

                            const bitsLoaded = downloadSize * 8;
                            const speedBps = (bitsLoaded / duration).toFixed(2);
                            const speedKbps = (speedBps / 1024).toFixed(2);
                            const speedMbps = (speedKbps / 1024).toFixed(2);
                            const speedMbits = (speedMbps * 8).toFixed(2);

                            this.staffOverview.speedtest.download_speed = Number(speedMbits);
                        }
                    }
                })
                .then((response)=>{
                    self.staffOverview.speedtest.downloadProgress = true;
                    self.storeSpeedtest();
                })
                .catch(error => {
                    console.log(error);
                });

                
                let formData = new FormData();
                formData.append('file', file);
            
                // Check upload user internet speed
                startTime = (new Date()).getTime();
                axios.post(api.DEV_API_URL+'/upload-file-speedtest/onboarding',
                        formData,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                        onUploadProgress: uploadEvent => {
                            let progress = Math.round((uploadEvent.loaded * 100) / uploadEvent.total)

                            if(progress > 50) {
                                self.showSpinner.uploadSpeed = false;

                                endTime = (new Date()).getTime();
                                const duration = (endTime - startTime) / 1000;
                                const bitsLoaded = downloadSize * 8;
                                const speedBps = (bitsLoaded / duration).toFixed(2);
                                const speedKbps = (speedBps / 1024).toFixed(2);
                                const speedMbps = (speedKbps / 1024).toFixed(2);
                                const speedMbits = (speedMbps * 8).toFixed(2);

                                self.staffOverview.speedtest.upload_speed = Number(speedMbits);
                            }
                        }
                    })
                    .then((response)=>{
                        self.staffOverview.speedtest.uploadProgress = true;
                        self.storeSpeedtest();
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
            },
            storeSpeedtest() {
                let self = this;

                if(this.staffOverview.speedtest.downloadProgress && this.staffOverview.speedtest.uploadProgress) {
                    axios({
                        method: 'post',
                        url: api.DEV_API_URL + '/store-speedtest/onboarding',
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                        data: {
                            reg_basic_id: self.staffOverview.profile.reg_id,
                            latency: self.staffOverview.speedtest.latency,
                            download_speed: self.staffOverview.speedtest.download_speed,
                            upload_speed: self.staffOverview.speedtest.upload_speed,
                        }
                    })
                    .then(function (response) {
                        self.showSpinner.latency = false;
                        self.showSpinner.downloadSpeed = false;
                        self.showSpinner.uploadSpeed = false;
                        self.staffOverview.speedtest.downloadProgress = false;
                        self.staffOverview.speedtest.uploadProgress = false;
                        self.showSpeedtestConfirmation = true;
                    })
                    .catch(function (errors) {
                        if(errors.response.status === 401) {
                            self.removeToken();
                        }
                    })
                }
            },
            removeToken() {
                localStorage.removeItem('userid');
                localStorage.removeItem('token');
                
                return;
            },
            toLocaleDateString(date) {
                var date = new Date(date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };

                return date.toLocaleDateString('en', options);
            },
            onPicSelected(e){

                let file = e.target.files[0];
                let reader = new FileReader();
                let limit = 1024 * 1024 * 2;

                if(file['size'] > limit){
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'You are uploading a large file',
                    })
                    return false;
                }

                reader.onloadend = (file) => {
                    this.profilePicForm.photo = reader.result;
                }

                reader.readAsDataURL(file);

                this.profilePicName = file.name;

                this.showModalImageCropper = true;
            },
            getProfilePic(){
                let photo = (this.profilePicForm.photo.length > 200) ? this.profilePicForm.photo : profPic ;
                this.profilePic.src = photo;

                return photo;
            },
            onUpdatePicture(){
                this.isUpdateProfile = !this.isUpdateProfile;
            },
            onUpdateBasic(){
                this.isUpdateBasicInfo = !this.isUpdateBasicInfo;
            },
            formatNumber (num) {
                if(num==0){
                    return num;
                }else{
                    return parseFloat(num).toFixed(1)
                }
            },
            toggleModalSuccess(){
                this.showModalSuccess = !this.showModalSuccess;
            },
            showPopUpRecording () {
                this.file = '';
                this.voiceRecordingModalShow = true;

            },
            closePopUpRecording () {
                this.voiceRecordingModalShow = false;
            },
            showPopUpVideo () {
                this.file = '';
                this.videoModalShow = true;

            },
            closePopUpVideo () {
                this.videoModalShow = false;
            },
            uploadVoice(){

                let formData = new FormData();

                formData.append('file', this.file);
                formData.append('filetype', 3);
                formData.append('jobseeker_id', this.USERID);

                this.isLoading = true;

                axios.post(api.DEV_API_URL+'/upload-attachment/onboarding',
                         formData
                    ,{
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }).then((response)=>{


                        if(response.data.success){
                            this.toggleModalSuccess();
                            this.closePopUpRecording();
                            this.isLoading = false;
                            this.voiceUrl = response.data.s3_url;
                            document.getElementById("audio-player").load();
                        }

                    }).catch((err)=>{
                        this.isLoading = false;
                        if(err.response.status == 422){
                            const data_file = err.response.data;
                            this.uploadfield_error = true;
                            this.uploadfieldfield_message = data_file.file[0];
                        }

                        if(err.response.status == 401){
                            localStorage.removeItem('userid');
                            localStorage.removeItem('token');
                        }

                    });
            },
            uploadVideo(){

                let formData = new FormData();
                let count_error = 0;

                this.file !="" ? formData.append('file', this.file) : '';

                if(this.file !="" && this.external_url == "" ){
                    formData.append('file', this.file);
                }
                
                if(this.external_url !="" && this.file ==""){
                    formData.append('external_url', this.external_url);
                }
                
                if(this.external_url =="" && this.file ==""){
                    // this.external_error = true;
                    // this.external_error_message = 'Exertnal url field is required.';
                    count_error++;
                }

                if(this.file !=="" && this.external_url==""){
                    formData.append('filetype', 6);
                }else if(this.file =="" && this.external_url!=""){
                    formData.append('filetype', 7);
                }


                formData.append('video_recording', 1);
                formData.append('jobseeker_id', this.USERID);

                    if(count_error==0){
                        count_error = 0;
                        this.isLoading = true;

                        this.uploadfieldfield_message = '';
                        this.external_error_message = '';

                        axios.post(api.DEV_API_URL+'/upload-attachment/onboarding',
                            formData
                        ,{
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        }).then((response)=>{


                            if(response.data.success){
                                this.toggleModalSuccess();
                                this.closePopUpVideo();
                                this.isLoading = false;
                                this.videoUrl = response.data.s3_url;
                                document.getElementById("video-player").load();
                            }

                        }).catch((err)=>{
                            this.isLoading = false;
                            if(err.response.status == 422){
                                const data_file = err.response.data;
                                const res = err.response.data;
                                Object.entries(res).forEach((entry) => {
                                    const [key, value] = entry;

                                    if(key == 'file'){
                                        this.uploadfield_error = true;
                                        this.uploadfieldfield_message = value[0];    
                                    }else if(key == 'external_url'){
                                        this.external_error = true;
                                        this.external_error_message = value[0];        
                                    }
                                });
                            }

                            if(err.response.status == 401){
                                localStorage.removeItem('userid');
                                localStorage.removeItem('token');
                            }

                        });
                    }else{
                        this.uploadfield_error = true;
                        this.uploadfieldfield_message = 'Upload file is required.'; 
                        this.external_error = true;
                        this.external_error_message = 'External url ink is required.';  
                    }
                
                },
            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                    this.file = files[0];
            },
            getVoice() {
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/getfile/onboarding?jobseeker_id=' + this.USERID + '&filetype=3',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if(response.data.success){
                        self.voiceUrl = response.data.data.url;
                    }

                });
            },
            getVideo() {
                let self = this;
                axios({
                    method: 'get',
                    url: api.DEV_API_URL + '/getvideo/onboarding?jobseeker_id=' + this.USERID + '&filetype=6',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(function (response) {
                    if(response.data.success){
                        self.videoUrl = response.data.data.url;
                    }
                });
            },
            
            toggleAudio() {
                var audio = document.getElementById("audio-player");
                if (audio.paused) {
                audio.play();
                } else {
                audio.pause();
                }
            },
            getAssessmentData() {

            }
        }
    }
</script>

<template>
    <div v-if="showLoader" class="row">
        <Loader></Loader>
    </div>
    <div v-else class="row">
        <div class="col-xl-12">
            <div class="row">
                <div class="col-xl-12">
                    <div class="container-fluid border-main p-3">
                        <div class="row">
                            <div class="col-md-3 col-sm-4 mt-2 mb-2">
                                <div id="profile-pic-container">
                                    <a id="crop-pic-icon" v-if="profilePic.src" @click="showModalImageCropper = true; showImageCropperLoader = true">
                                        <img :src="cropIcon" />
                                    </a>
                                    <a id="edit-pic-icon"
                                        @click="onUpdatePicture">
                                        <img :src="editIcon" />
                                    </a>
                                    <img
                                        :src="profilePic.src"
                                        alt="Profile Picture"
                                        loading="lazy"
                                        id="profilePic"
                                        class="img-fluid img-border"
                                    />
                                </div>
                                <template v-if="isUpdateProfile">
                                    <div class="form-row pt-2 float-end">
                                        <div class="form-group col-md-12">
                                            <div class="row">
                                                <div class="col-4">
                                                    <button class="btn bg-gradient-light black-font btn-sm command-btn" @click="$refs.fileInput.click()">+</button>
                                                </div>
                                                <div class="col-8">
                                                    <button :disabled="disableUploadButton" class="btn bg-gradient-light black-font btn-sm command-btn" @click="uploadProfilePhoto()">Upload</button>
                                                    <div v-if="showPhotoUploadSpinner" class="spinner-grow spinner-grow-sm" style="width: 1.5rem; height: 1.5rem;" role="status">
                                                        <span class="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <input @change="uploadImage($event)" name="file" style="display: none;" type="file" accept="image/png, image/gif, image/jpeg" id="upload-file" class="form-control form-control-md"
                                                ref="fileInput" required />
                                                <!-- {{profilePicName}} -->
                                        </div>
                                    </div>
                                    <div class="float-start">
                                        <template v-if="staffOverview.validations.errors.file">
                                            <p><span v-for="(error, index) in staffOverview.validations.errors.file" :key="index" class="error-font">{{ error }}</span></p>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="staffOverview.validations.success.messsage && !isUpdateProfile">
                                    <div class="form-row p-2">
                                        <div class="form-group col-md-12">
                                            <p class="small"><span>{{ staffOverview.validations.success.messsage }}</span></p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <div v-if="isUpdateBasicInfo" class="col-md-3 col-sm-4 mt-2 mb-2">
                                <MaterialInput
                                    class="input-group-outline"
                                    :label="{ text: 'First Name', class: 'form-label' }"
                                    type="text"
                                />
                                <MaterialInput
                                    class="input-group-outline"
                                    :label="{ text: 'Last Name', class: 'form-label' }"
                                    type="text"
                                />
                            </div>
                            <div v-if="isUpdateBasicInfo" class="col-md-3 col-sm-4 mt-2 mb-2">

                            </div>
                            <div v-if="!isUpdateBasicInfo" class="col-md-3 col-sm-4 mt-2 mb-2">
                                <p class="remove-line-height me-3">
                                    <sup>Full Name</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.profile">{{ staffOverview.profile.reg_firstname }} {{ staffOverview.profile.reg_lastname }}</span>

                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Latest Job Title</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.workReference">{{ staffOverview.workReference.wp_latest_job_title }}</span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Jobseeker Status</sup> <br>
                                    <span class="info-highlight" v-if="staffOverview.profile.registrant_type == 1">Unemployed</span>
                                    <span class="info-highlight" v-if="staffOverview.profile.registrant_type == 2">Employed</span>
                                </p>
                            </div>
                            <div v-if="!isUpdateBasicInfo" class="col-md-3 col-sm-4 mt-2 mb-2">
                                <p class="remove-line-height me-3">
                                    <sup>Date Registered</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.profile">{{ toLocaleDateString(staffOverview.profile.date_submitted) }}</span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Last Login</sup><br>
                                    <span class="info-highlight">{{ toLocaleDateString(new Date()) }}</span>
                                </p>
                                <template v-if="staffOverview.profile">
                                    <p class="remove-line-height me-3" v-if="staffOverview.profile.reg_datemodified">
                                        <sup>Last Update</sup><br>
                                        <span class="info-highlight">{{ toLocaleDateString(staffOverview.profile.reg_datemodified) }}</span>
                                    </p>
                                </template>
                            </div>
                            <div class="col-md-3 col-sm-12 mt-2 mb-2">
                                <h6 class="text-center">Resume Completeness Score</h6>
                                <div class="d-flex justify-content-center">
                                    <circle-progress 
                                        :percent="formatNumber(staffOverview.completeness)" 
                                        :show-percent="true"
                                        :viewport="true"
                                        fill-color="#5E44FF"
                                        linecap
                                        class="progress-value"
                                        size="130"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12">
                    <div class="container-fluid div-border">
                        <div class="row row pt-4 pb-3">
                            <div class="col-xl-4 col-md-4 col-sm-4 col-6 p-0">
                                <p class="remove-line-height me-3">
                                    <sup>Email Address</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact">{{ staffOverview.contact.email }}</span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Mobile Number</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact.mobiles">{{ staffOverview.contact.mobiles.mobile_number }}</span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Landline Number</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact.phones">{{ staffOverview.contact.phones.landline_number }}</span>
                                </p>
                            </div>
                            <div class="col-xl-4 col-md-4 col-sm-4 col-6 p-0">
                                <p class="remove-line-height me-3">
                                    <sup>Street</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.profile">{{ staffOverview.profile.reg_home_addr_line1 }}</span>
                                </p>
                                <template v-if="staffOverview.contact.address">
                                    <template v-if="staffOverview.contact.address.state.region">
                                        <p class="remove-line-height me-3">
                                            <sup>Region</sup><br>
                                            <span class="info-highlight">{{ staffOverview.contact.address.state.region.description }}</span>
                                        </p>
                                        <p class="remove-line-height me-3">
                                            <sup>Province</sup><br>
                                            <span class="info-highlight">{{ staffOverview.contact.address.state.description }}</span>
                                        </p>
                                        <!-- <p class="remove-line-height me-3">
                                            <sup>Barangay</sup><br>
                                            <span class="info-highlight" v-if="staffOverview.contact.address">Tondo</span>
                                        </p> -->
                                    </template>
                                    <template v-else>
                                        <p class="remove-line-height me-3">
                                            <sup>State</sup><br>
                                            <span class="info-highlight">{{ staffOverview.contact.address.state.description }}</span>
                                        </p>
                                    </template>
                                </template>
                            </div>
                            <div class="col-xl-4 col-md-4 col-sm-4 col-6 p-0">
                                <p class="remove-line-height me-3">
                                    <sup>Country</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact.address">
                                        <template v-if="staffOverview.contact.address.state.region">
                                            {{ staffOverview.contact.address.state.region.country.long_desc }}
                                        </template>
                                        <template v-else>
                                            {{ staffOverview.contact.address.state.country.long_desc }}
                                        </template>
                                    </span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>City</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact.address">{{ staffOverview.contact.address.description }}</span>
                                </p>
                                <p class="remove-line-height me-3">
                                    <sup>Zip Code</sup><br>
                                    <span class="info-highlight" v-if="staffOverview.contact.address">{{ staffOverview.contact.address.zip_code }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div class="col-xl-5 col-md-12">
            <div class="container-fluid div-border p-3">
                <div class="col-sm-12">
                    <div class="row">
                        <div class="col-4">
                            <h5 class="black-font">Voice</h5>
                        </div>
                        <div class="col-8">
                            <div class="d-flex flex-lg-row flex-sm-column justify-content-end">
                                <MaterialButton variant="gradient" color="light" class="w-auto black-font command-btn" @click="showPopUpRecording">
                                    <img class="btn-icon" :src="uploadUcon" />  Upload
                                </MaterialButton>
                            </div>
                        </div>
                    </div>
                </div>
                <audio id="audio-player" controls v-if="voiceUrl">
                     <source v-bind:src="voiceUrl" type="audio/mpeg">
                </audio>

                <audio id="audio-player" controls v-else>
                     <source src="" type="audio/mpeg">
                      Your browser does not support the audio element.
                </audio>

                


            </div>
        </div>

        <div class="col-xl-7 col-md-12">
            <div class="container-fluid div-border p-3">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="row">
                            <div class="col-4">
                                <h5 class="black-font">Speed Test</h5>
                            </div>
                            <div class="col-8">
                                <div class="d-flex flex-lg-row flex-sm-column justify-content-end">
                                    <MaterialButton :disabled="(showSpinner.latency && showSpinner.downloadSpeed && showSpinner.uploadSpeed) || !staffOverview.profile" @click="showSpeedtest = true" variant="gradient" color="light" class="command-btn black-font text-capitalize me-lg-4">
                                        <img class="btn-icon" :src="speedTestIcon" />  Test
                                    </MaterialButton>
                                    <MaterialButton @click="getSpeedtestHistory()" variant="gradient" color="light" class="command-btn black-font text-capitalize">
                                        <img class="btn-icon" :src="speedTestHistoryIcon" />  History
                                    </MaterialButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 col-4">
                        <div class="mb-0 d-flex flex-column">Ping (ms)
                            <!-- <img class="w-30" v-if="showSpinner.latency" src="@/assets/img/speedtest.gif"> -->
                            <span v-if="showSpinner.latency">Connecting...</span>
                            <h4 v-else class="black-font">
                                <template v-if="staffOverview.speedtest.latency">
                                    {{ staffOverview.speedtest.latency }}
                                </template>
                                <template v-else>
                                    --
                                </template>
                            </h4>
                        </div>
                    </div>
                    <div class="col-sm-4 col-4">
                        <div class="mb-0 d-flex flex-column">Download (Mbps)
                            <!-- <img class="w-30" v-if="showSpinner.downloadSpeed" src="@/assets/img/speedtest.gif"> -->
                            <span v-if="showSpinner.downloadSpeed">Connecting...</span>
                            <h4 v-else class="black-font">
                                <template v-if="staffOverview.speedtest.download_speed">
                                    {{ staffOverview.speedtest.download_speed }}
                                </template>
                                <template v-else>
                                    --
                                </template>
                            </h4>
                        </div>
                    </div>
                    <div class="col-sm-4 col-4">
                        <div class="mb-0 d-flex flex-column">Upload (Mbps)
                            <!-- <img class="w-30" v-if="showSpinner.uploadSpeed" src="@/assets/img/speedtest.gif"> -->
                            <span v-if="showSpinner.uploadSpeed">Connecting...</span>
                            <h4 v-else class="black-font">
                                <template v-if="staffOverview.speedtest.upload_speed">
                                    {{ staffOverview.speedtest.upload_speed }}
                                </template>
                                <template v-else>
                                    --
                                </template>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="col-xl-5 col-md-12">
            <div class="container-fluid div-border p-3">
                <div class="col-sm-12">
                    <div class="row">
                        <div class="col-4">
                            <h5 class="black-font">Video</h5>
                        </div>
                        <div class="col-8">
                        <div class="d-flex flex-lg-row flex-sm-column justify-content-end">
                            <MaterialButton variant="gradient" color="light" class="w-auto black-font command-btn" @click="showPopUpVideo">
                                <img class="btn-icon" :src="uploadUcon" />  Upload
                            </MaterialButton>
                            </div>
                        </div>
                        <video id="video-player" class="vid-dm" controls v-if="videoUrl">
                            <source v-bind:src="videoUrl" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <video id="video-player" class="vid-dm" controls v-else>
                            <source src="" type="video/mp4">
                        </video>
                    </div>
                 </div>
            </div>
        </div>

        <div class="col-xl-7 col-md-12">
            <div class="container-fluid div-border p-3">
                <div class="row">
                    <div class="col-6">
                        <h5 class="black-font">Behavioral and Cognitive Assessment</h5>
                    </div>
                    <div class="col-6">
                        <MaterialButton @click="showDevelopmentMessage = true" variant="gradient" color="light" class="black-font command-btn float-end"><img class="btn-icon" :src="takeTestIcon" />  Take Test</MaterialButton>
                    </div>
                </div>

                <div class="row" style="opacity: .2;">
                    <div class="col-xl-12 mt-3">
                        <div class="d-flex justify-content-center m-3">
                            <p class="pe-2">Collaborative</p>
                            <assessment-progress leftProgress="50" rightProgress="50"></assessment-progress>
                            <p class="ps-2">Independent</p>
                        </div>
                        <div class="d-flex justify-content-center m-3">
                            <p class="pe-2">Driving</p>
                            <assessment-progress leftProgress="50" rightProgress="50"></assessment-progress>
                            <p class="ps-2">Steady</p>
                        </div>
                        <div class="d-flex justify-content-center m-3">
                            <p class="pe-2">Flexible</p>
                            <assessment-progress leftProgress="50" rightProgress="50"></assessment-progress>
                            <p class="ps-2">Precise</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <teleport to="body">
        <standard-modal
        @close='showSpeedtestHistory = false'
        :show=showSpeedtestHistory
        :hasClose=true
        :hasHeader=true
        :hasFooter=false
        title="Speedtest History"
        size="dialog-xxxl"
        :isScrollable=true>
            <template #body>
                <div class="row">
                    <div class="scroll table-responsive-sm">
                        <div class="table-responsive tableFixHead text-dark" >
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date/Time</th>
                                            <th scope="col">Ping (ms)</th>
                                            <th scope="col">Download Speed (Mbps)</th>
                                            <th scope="col">Upload Speed (Mbps)</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="!showSpeedtestLoader">
                                        <template v-if="staffOverview.speedtestHistory.success">
                                            <tr v-for="history in staffOverview.speedtestHistory.data.data" :key="history.id">
                                                <td class="text-center">{{ history.datecreated }}</td>
                                                <td class="text-center">{{ history.latency }}</td>
                                                <td class="text-center">{{ history.download_speed }}</td>
                                                <td class="text-center">{{ history.upload_speed }}</td>
                                            </tr>
                                        </template>
                                        <template v-if="!staffOverview.speedtestHistory.success">
                                                <tr>
                                                    <td colspan="4" style="text-align: center; font-family: 'Inter-Bold' !important;">No data found.</td>
                                                </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Loader v-if="showSpeedtestLoader"></Loader>
                        <div class="right-floater">
                        <the-pagination v-if="staffOverview.speedtestHistory.success" :records="staffOverview.speedtestHistory" @currentPage="currentPageSpeedtestHistory"></the-pagination>
                        </div>
                    </div>
                </div>
            </template>
        </standard-modal>

        <standard-modal
        @close='showTakeAssessment = false'
        :show=showTakeAssessment
        :hasClose=true
        :hasHeader=true
        :hasFooter=true
        title="Behavioral and Cognitive Assessment"
        size="modal-fullscreen"
        :isScrollable=true>
            <template #body>
                <iframe src="https://assessment.predictiveindex.com/bo/EeF/Applicants" width="100%" height="100%"></iframe>
            </template>
            <template #footer>
                <MaterialButton variant="gradient" color="white" size="md" class="command-btn mb-0" @click="showGetAssessmentDataConfirmation = true">
                        Get Assessment Data
                </MaterialButton>
            </template>
        </standard-modal>

        <standard-modal
        @close='showGetAssessmentDataConfirmation = false'
        :show=showGetAssessmentDataConfirmation
        :hasClose=false
        :hasHeader=false
        :hasFooter=true
        size="dialog-md"
        :isScrollable=true>
            <template #body>
                <h5 class="text-center">Are you done taking behavioral and cognitive assessment?</h5>
            </template>
            <template #footer>
                <material-button @click="getAssessmentData(); showTakeAssessment = false" size="sm" variant="contained" color="success" class="bg-gradient-light mb-0 me-2 command-btn">
                    Yes
                </material-button>
                <material-button @click="showGetAssessmentDataConfirmation = false" size="sm" variant="contained" color="danger" class="bg-gradient-light mb-0 me-2 command-btn">
                    Cancel
                </material-button>
            </template>
        </standard-modal>

        <StandardModal
                    :show="voiceRecordingModalShow"
                    @close="closePopUpRecording"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="Voice Recording"
                    size='dialog-m'
                    :isScrollable=true>

                    <template #body>
                        <Loader v-if="isLoading"></Loader>
                        <form v-else role="form" id="contact-form" method="post" autocomplete="off">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <label for="filetype" class="labels my-0">Upload</label><br/>
                                                    <input type="file" id="file" @change="onFileChange"/><br/>
                                                    <div class="error" v-if="uploadfield_error">{{uploadfieldfield_message}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </form>

                     </template>
                    <template #footer>
                        <MaterialButton variant="gradient" color="white" size="md" class="btn bg-gradient-light btn-md false false w-auto black-font command-btn mb-0" @click="uploadVoice()">
                                Save
                        </MaterialButton>
                    </template>
        </StandardModal>

        <StandardModal
                    :show="videoModalShow"
                    @close="closePopUpVideo"
                    :hasClose=true
                    :hasHeader='true'
                    :hasFooter='true'
                    title="Video Recording"
                    size='dialog-m'
                    :isScrollable=true>

                    <template #body>
                        <Loader v-if="isLoading"></Loader>
                        <form v-else role="form" id="contact-form" method="post" autocomplete="off">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <label for="filetype" class="labels my-0">Upload</label><br/>
                                                    <input type="file" class="w-100" id="file" @change="onFileChange"/><br/>
                                                    <div class="error" v-if="uploadfield_error">{{uploadfieldfield_message}}</div>
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <h6>OR</h6>
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group mb-2">
                                                    <label for="filetype" class="labels my-0">External Video URL</label><br/>
                                                    <input type="text" class="w-100" id="url" v-model="external_url"/><br/>
                                                    <div class="error" v-if="external_error">{{external_error_message}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </form>

                     </template>
                    <template #footer>
                        <MaterialButton variant="gradient" color="success" size="md" class="btn bg-gradient-light btn-md false false w-auto black-font command-btn mb-0" @click="uploadVideo()">
                                Save
                        </MaterialButton>
                    </template>
        </StandardModal>
        
        <StandardModal
                    @close="showModalSuccess = !showModalSuccess"
                    :show="showModalSuccess"
                    :hasClose=true
                    size="dialog-sm"
                    >
                    <template #body>
                        <Loader v-if="isLoading"></Loader>
                        <div v-else style="text-align: center">
                            <h5> Successfully uploaded. </h5>
                            <span>&nbsp;</span>
                        </div>
                    </template>

        </StandardModal>
    </teleport>

    <teleport to="body">
        <standard-modal
        @close='cancelImageCropper()'
        :show=showModalImageCropper
        :hasClose=true
        :hasHeader=true
        :hasFooter=true
        title="Crop Image"
        size="dialog-xl"
        :isScrollable=true>
            <template #body>
                <div class="row">
                    <div class="col-lg-12">
                        <Loader v-if="showImageCropperLoader"></Loader>
                        <cropper 
                        ref="cropper" 
                        class="cropper" 
                        @change="change" 
                        :src="profilePic.src" 
                        :stencil-props="{
                            aspectRatio: 10/10
                        }">
                        </cropper>
                        <div class="button-wrapper">
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <material-button @click="cropImage()" class="bg-gradient-light command-btn black-font btn-md false false mb-0">
                    Crop Image
                </material-button>
                <div v-if="showPhotoCropSpinner" class="spinner-grow spinner-grow-sm" style="width: 1.5rem; height: 1.5rem;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </template>
        </standard-modal>
    </teleport>

    <teleport to="body">
        <standard-modal
        @close="showSpeedtest = false"
        :show=showSpeedtest
        :hasClose=true
        :hasHeader=false
        :hasFooter=false
        title=""
        size="dialog-xxl"
        :isScrollable=true>
            <template #body>
                <div class="row justify-content-center">
                    <div class="col-xl-12 col-md-12 text-center mb-4">
                        <h2 class="mb-3">Speed Test</h2>
                        <p class="mb-3">Please start Speed Test below. If you are applying for a role that would require calls, please do multiple speed tests at 9am, 1pm, and 3pm.</p>
                        <p>A good and stable internet connection is necessary to be considered for any remote position.</p>
                        <div class="d-flex mt-5">
                            <h5 class="w-20">Download:</h5>
                            <div class="w-100 px-2">
                                <speedtest-progress v-if="showSpinner.downloadSpeed" :label="`Connecting...`"></speedtest-progress>
                                <speedtest-progress v-else :progress="staffOverview.speedtest.download_speed"></speedtest-progress>
                            </div>
                        </div>
                        <div class="d-flex mt-5">
                            <h5 class="w-20">Upload:</h5>
                            <div class="w-100 px-2">
                                <speedtest-progress v-if="showSpinner.uploadSpeed" :label="`Connecting...`"></speedtest-progress>
                                <speedtest-progress v-else :progress="staffOverview.speedtest.upload_speed"></speedtest-progress>
                            </div>
                        </div>
                        <div class="row mt-5">
                            <div class="col-sm-4 col-4">
                                <div class="mb-0 d-flex flex-column">Ping (ms)
                                    <h4 class="black-font">
                                        <template v-if="showSpinner.latency">
                                            --
                                        </template>
                                        <template v-else>
                                            {{ staffOverview.speedtest.latency }}
                                        </template>
                                    </h4>
                                </div>
                            </div>
                            <div class="col-sm-4 col-4">
                                <div class="mb-0 d-flex flex-column">Download (Mbps)
                                    <h4 class="black-font">
                                        <template v-if="showSpinner.downloadSpeed">
                                            --
                                        </template>
                                        <template v-else>
                                            {{ staffOverview.speedtest.download_speed }}
                                        </template>
                                    </h4>
                                </div>
                            </div>
                            <div class="col-sm-4 col-4">
                                <div class="mb-0 d-flex flex-column">Upload (Mbps)
                                    <h4 class="black-font">
                                        <template v-if="showSpinner.uploadSpeed">
                                            --
                                        </template>
                                        <template v-else>
                                            {{ staffOverview.speedtest.upload_speed }}
                                        </template>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-xl-12">
                                <button v-if="staffOverview.speedtest.download_speed && staffOverview.speedtest.upload_speed" @click="takeSpeedtest()" :disabled="staffOverview.speedtest.downloadProgress || staffOverview.speedtest.uploadProgress" class="btn bg-gradient-light btn-lg my-0 false false w-auto black-font command-btn" type="button" variant="contained">Retake Speed Test</button>
                                <button v-else @click="takeSpeedtest()" :disabled="staffOverview.speedtest.downloadProgress || staffOverview.speedtest.uploadProgress" class="btn bg-gradient-light btn-lg my-0 false false w-auto black-font command-btn" type="button" variant="contained">Start Speed Test</button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </standard-modal>
    </teleport>

    <teleport to="body">
        <standard-modal
        @close='showSpeedtestConfirmation = false'
        :show=showSpeedtestConfirmation
        :hasClose=true
        :hasHeader=false
        :hasFooter=false
        title=""
        size="dialog-sm"
        :isScrollable=true>
            <template #body>
                <div class="row justify-content-center">
                    <div class="col-xl-12 col-md-12 text-center mb-4">
                        <h5>Speed test completed.</h5>
                    </div>
                </div>
            </template>
        </standard-modal>
    </teleport>

    <teleport to="body">
        <standard-modal 
        :show="showDevelopmentMessage" 
        @close="showDevelopmentMessage = false"
        :hasClose=false
        title="Test Alert"
        size="dialog-md"
        :isScrollable=true>
            <template #body>
                <div class="center my-1">
                <h4 class="alert-message">Lined-up for Development</h4>
                </div>
                <div class="d-grid gap-2 col-4 mx-auto bottom-gap">
                <button @click="showDevelopmentMessage = false" class="btn bg-gradient-light btn-sm my-0 false false w-auto black-font command-btn" type="button" variant="contained">Ok</button>
                </div>
            </template>
        </standard-modal>
    </teleport>
</template>

<style scoped>
    table td{
        color: #212529 !important;
    }
    .table > thead {
        color: #fff;
        background-color: #0B0724 !important;
    }
    .table thead th {
        padding: 0.75rem 0.5rem;
        text-transform: none;
    }
    .range-style{
        width:40%;
        accent-color: #5E44FF;
        overflow:hidden;
    }
    .black-font{
        color: black!important;
    }
    .white-font{
        color: white!important;
    }
    .gray-font{
        color: gray!important;
    }
    .player-width{
        width:100%;
    }
    .vid-dm{
        height: auto;
        width: 100%;
    }
    .div-border{
        border: 2px solid #dde1e1;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .img-border{
        border: 2px;
        border-radius: 5px;
    }
    .border-main{
        position: block;
        margin-bottom: 10px;
        border: 2px solid #dde1e1;
        border-radius: 5px;
        padding:2.6%;
        /* background-color: #F9F8FF; */
    }
    .remove-line-height{
        line-height:1!important;
    }

    .info-highlight{
        font-weight: bold;
        font-size : 100%!important;
        word-wrap: break-word;
    }

    .border-main #profile-basic {
        border: 2px solid #6bf22d;
        padding: 5px;
        border-radius: 16px;
        position: absolute;
        bottom:150px;
        left:807px;
    }
    .border-main #profile-basic:hover{
        cursor: pointer;
        background-color: #6bf22d;
    }
    #basic-edit-container {
        margin-top: -50px;
        text-align: right !important;
    }
    #edit-basic-icon {
        padding: 5px;
        border-radius: 16px;
    }
    #edit-basic-icon:hover{
        cursor: pointer;
        background-color: #4fb122;
        border: 2px solid #6bf22d;
    }

    #profile-pic-container {
        position: relative;
        overflow: hidden;
        /* border: 3px solid #5E44FF; */
    }

    #profile-pic-container img{
        display: block;
    }
    #profilePic {
        object-fit: contain;
    }
    #crop-pic-icon{
        background-color: #5E44FF;
        border: 2px solid #BAAFFF;
        padding: 5px;
        border-radius: 16px;
        position: absolute;
        bottom:5px;
    }
    #edit-pic-icon{
        background-color: #5E44FF;
        border: 2px solid #BAAFFF;
        padding: 5px;
        border-radius: 16px;
        position: absolute;
        bottom:5px;
        right: 0px;
    }
    #edit-pic-icon:hover{
        cursor: pointer;
        background-color: #BAAFFF;
    }
    #upload-btn {
        text-align: right;
    }
    .upload-btn{font-size:10px;}
    #upload-file{
        border: 2px solid #d2d6da !important;
        padding: 10px !important;
        font-weight: bold;
    }

    .complete-header{
        background: #0B0724;
        border-radius: 16px  16px 0px 0px;
    }

    .complete-header h4{
        color:#fff;
        font-size: 16px;
        padding: 23px 0px;

    }
    .complete-content{
        padding: 25px;
    }

    .complete-content h2{
        font-size: 25px;
    }

    .border-complete{
        border: 1px solid #BAAFFF;
        background-color: #F9F8FF;
        border-radius: 16px;

        padding: 0 10px!important;
        text-align: center;
    }
    
    .right-floater{
        float:right;
    }
    .progress-value {
        font-size: 40px;
        font-weight: 600;
    }

    .error-font{
        color:red !important;
        font-size: small;
    }

    .error{color:red;}
    .icon-paragraph-justify:before{display: none;}
    .icon-download{display:none;}
    #audio-player{width:100%; margin-bottom: 10px;}

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        color: black !important;
    }
</style>
<style scope lang="scss">
    .current-counter {
        &::after {
            content: "%";
        }
    }
</style>
<style scope src="../../../assets/css/standard-colors.css">
</style>