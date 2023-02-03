<template>

    <div class="timetracker col-lg-12 col-md-12 col-sm-12 mx-3" v-bind:class="{ 'work-active': isWorking }">
        <div class="row container-fluid div-border pt-3 px-0">
            <div class="col-12 my-auto text-center">
                <h6 class="black-font">Time and Attendance</h6>
                <sup class="black-font">{{ timetracker_time }}</sup>
            </div>
            <div class="col-md-12 mt-3">
                <div class="row justify-content-center">
                    <div class="col-xl-12 col-md-12 text-center mb-3">
                        <MaterialButton v-if="!timetrackerLoading" @click="toggleWorkConfirm()" variant="gradient" color="light" class="start-work-btn command-btn black-font text-capitalize"  v-bind:class="{ 'disabled': isDisabled }"><img class="btn-icon me-1" :src="startWorkIcon"> {{ isWorking ? 'Finish Work' : 'Start Work' }}</MaterialButton>
                    </div>
                    <Loader v-if="timetrackerLoading" :labelVisible="false" :imgWidth="30"></Loader>
                    <div class="col-6 text-end">
                        <MaterialButton
                            v-if="!timetrackerLoading"
                            @click="toggleBreakConfirm('quick')"
                            variant="gradient"
                            color="light"
                            size="sm"
                            class="quick-break-btn pt-2 pb-3 command-btn black-font text-capitalize"
                            v-bind:class="{ 'invisible': !isWorking, 'disabled': isLunchBreak }">
                                <img class="btn-icon mb-1" :src="quickBreakIcon">
                                <br>Quick Break
                        </MaterialButton>
                    </div>
                    <div class="col-6 text-start">
                        <MaterialButton
                            v-if="!timetrackerLoading"
                            @click="toggleBreakConfirm('lunch')"
                            variant="gradient"
                            color="light"
                            size="sm"
                            class="lunch-break-btn pt-2 pb-3 command-btn black-font text-capitalize"
                            v-bind:class="{ 'invisible': !isWorking, 'disabled': isQuickBreak }">
                                <img class="btn-icon mb-1" :src="lunchBreakIcon">
                                <br>Lunch Break
                        </MaterialButton>
                    </div>
                </div>
            </div>
            <div class="col-md-12 mt-4 complete-footer">
                <div class="row justify-content-center">
                    <div class="col-12 text-start px-0 d-grid gap-2 border-top">
                        <MaterialButton variant="gradient" disabled="true" size="md" class="screen-capture-btn py-2 mb-0 text-capitalize" v-bind:class="{ 'gray-font': !isWorking || !captureScreen, 'black-font': captureScreen }">
                            <div class="row">
                                <div v-if="!captureScreen" class="col-8 mx-auto py-2" >Screen Capture: OFF</div>
                                <div v-if="captureScreen" class="col-8 my-2 p-0 ms-auto me-0 ms-lg-auto me-lg-auto ms-xl-auto me-xl-0" >Screen Capture: ON</div>
                                <div v-if="captureScreen" class="captureImgContainer col-4 p-0 ms-0 me-auto ms-lg-auto me-lg-auto ms-xl-0 me-xl-auto">
                                    <img class="btn-icon" :src="captureRunningIcon" width="35">
                                    <sup class="black-font">{{ screencapIntervalMinutes }}</sup>
                                </div>
                            </div>
                        </MaterialButton>
                    </div>
                    <div class="col-12 text-end px-0 d-grid gap-2 border-top">
                        <MaterialButton variant="gradient" disabled="true" size="md" class="camera-capture-btn py-2 mb-0 text-capitalize" v-bind:class="{ 'gray-font': !isWorking || !captureCamera, 'black-font': captureCamera }">
                            <div class="row">
                                <div v-if="!captureCamera" class="col-8 mx-auto py-2" >Camera Capture: OFF</div>
                                <div v-if="captureCamera" class="col-8 my-2 p-0 ms-auto me-0 ms-lg-auto me-lg-auto ms-xl-auto me-xl-0" >Camera Capture: ON</div>
                                <div v-if="captureCamera" class="captureImgContainer col-4 p-0 ms-0 me-auto ms-lg-auto me-lg-auto ms-xl-0 me-xl-auto">
                                    <img class="btn-icon" :src="captureRunningIcon" width="35">
                                    <sup class="black-font">{{ cameracapIntervalMinutes }}</sup>
                                </div>
                            </div>
                        </MaterialButton>
                    </div>
                </div>
            </div>
            <div class="canvasContainer">
                <video id="grabFrameVideo" width="0" height="0" controls></video>
                <canvas id="grabFrameCanvas"></canvas>
                <div class="overlay"></div>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <StandardModal
            :show="workConfirmShow"
            @close="workConfirmShow = false"
            :hasClose=workConfirmCommitText
            title="Start/Finish Work Confirmation"
            size="dialog-md"
            :isScrollable=true
        >
            <template #body>
                <div class="workConfirm">
                    <div v-if="!workConfirmCommitText" class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5>{{workConfirmText}}</h5>
                        </div>
                        <div class="col-8 mx-auto">
                            <div class="row justify-content-center">
                                <Loader v-if="confirmLoading" :labelVisible="false" :imgWidth="30"></Loader>
                                <div class="col-6 text-end d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton color="secondary" @click="toggleWorkConfirm()" class="black-font text-capitalize">No</MaterialButton>
                                </div>
                                <div class="col-6 text-start d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton variant="gradient" color="light" @click="triggerWorkSession()" class="command-btn black-font text-capitalize">Yes</MaterialButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5 class="pt-0">{{workConfirmCommitText}}</h5>
                        </div>
                    </div>
                </div>
            </template>
        </StandardModal>

        <StandardModal
            :show="workStartConfirmShow"
            @close="workStartConfirmShow = false"
            :hasClose=workConfirmCommitText
            title="Start/Finish Work Confirmation"
            size="dialog-md"
            :isScrollable=true
        >
            <template #body>
                <div class="workConfirm">
                    <div v-if="!workConfirmCommitText" class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5 class="pt-0">You are a {{reg_type}}</h5>
                            <div>Would you like the system to start your screen capture now?</div>
                            <select name="field" id="field" class="input-group-outline form-select" v-model="client_value">
                                    <option value="">Please seleact a client</option>
                                    <option v-for="(item, index) in clients" 
                                        :value="item.client_id" 
                                        :key="index">
                                    {{item.client_name}}
                                    </option>
                            </select> 
                        </div>
                        <div class="col-8 mx-auto">
                            <div class="row justify-content-center">
                                <Loader v-if="confirmLoading" :labelVisible="false" :imgWidth="30"></Loader>
                                <div class="col-6 text-end d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton color="secondary" @click="toggleConfirmStartWork()" class="black-font text-capitalize">No</MaterialButton>
                                </div>
                                <div class="col-6 text-start d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton variant="gradient" color="light" @click="triggerWorkSession()" class="command-btn black-font text-capitalize">Yes</MaterialButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5 class="pt-0">{{workConfirmCommitText}}</h5>
                        </div>
                    </div>
                </div>
            </template>
        </StandardModal>
        <StandardModal
            :show="breakConfirmShow"
            @close="breakConfirmShow = false"
            :hasClose=breakConfirmCommitText
            title="Break Confirmation"
            size="dialog-md"
            :isScrollable=true
        >
            <template #body>
                <div class="breakConfirm">
                    <div v-if="!breakConfirmCommitText" class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5>{{breakConfirmText}}</h5>
                        </div>
                        <div class="col-8 mx-auto">
                            <div class="row justify-content-center">
                                <Loader v-if="confirmLoading" :labelVisible="false" :imgWidth="30"></Loader>
                                <div class="col-6 text-end d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton color="secondary" @click="toggleBreakConfirm('close')" class="black-font text-capitalize">No</MaterialButton>
                                </div>
                                <div class="col-6 text-start d-grid gap-2" v-if="!confirmLoading">
                                    <MaterialButton v-if="lunchBreakClicked" variant="gradient" color="light" @click="triggerBreakSession('lunch')" class="command-btn black-font text-capitalize">Yes</MaterialButton>
                                    <MaterialButton v-if="quickBreakClicked" variant="gradient" color="light" @click="triggerBreakSession('quick')" class="command-btn black-font text-capitalize">Yes</MaterialButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5 class="pt-0">{{breakConfirmCommitText}}</h5>
                        </div>
                    </div>
                </div>
            </template>
        </StandardModal>
        <StandardModal
            :show="activityNotesShow"
            @close="activityNotesShow = false"
            :hasClose=activityNotesCommitText
            :hasHeader=true
            title="What are you working on right now?"
            size="dialog-xl"
            :isScrollable=true
        >
            <template #body>
                <div class="activityNotes">
                    <div v-if="!activityNotesCommitText" class="row">
                        <div class="col-xl-12 col-md-12 mb-4">
                            <div class="mb-3">
                                <p>The daily activity tracker appearing every {{ activityNotesIntervalText }} is designed to give you an update as well as the client on your full day's activities.</p>
                                <!-- <div class="mx-auto">
                                    <div class="text-center">
                                        <button
                                            class="btn bg-light btn-md command-btn black-font text-capitalize border-0"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseExample"
                                            aria-expanded="false"
                                            aria-controls="collapseExample"
                                        >
                                            read more
                                        </button>
                                    </div>
                                </div>
                                <div class="collapse" id="collapseExample">
                                  <div class="card card-body">
                                    <p>
                                        Often, especially when we are busy, we could easily forget what we have achieved for the day.<br><br>
                                        With the 20min daily activity tracker,  clients will be able to not only see your screen every 3min, but will also see the notes you make every 20min to help link what your doing with your screen.<br><br>
                                        These tools are in place not just to monitor your work, they are also designed to help clients better manage and work with you as well as to build trust between you and the clients.<br><br>
                                        The remotestaff system is what helps build the business relationship between you and the client so a future foundation can be built.<br><br>
                                        When you list your activities, let us know what you are focused on at that moment and what you are working on at that particular point in time.<br><br>
                                        Try and describe your activity in detail without getting into a full story. But please don't just use a few words like "stuff".
                                    </p>
                                  </div>
                                </div> -->
                            </div>
                            <form @submit.prevent="submitActivityNotes" class="add-form g-3 needs-validation" novalidate>
                                <div class="mb-3">
                                  <label for="activityDescription" class="form-label mx-0">Progress description</label>
                                  <textarea placeholder="I'm currently working on..." class="form-control border-bottom px-0" v-bind:class="{ 'is-invalid': activityDescriptionError }" v-model="activityDescription" name="activityDescription" rows="3" required :disabled="activityNotesLoading"></textarea>
                                  <div class="invalid-feedback">
                                    Please provide updates.
                                  </div>
                                </div>
                                <div class="mb-3">
                                    <div class="row">
                                        <div class="col-auto">
                                            <label for="activityCallWith" class="form-label mx-0">On a call with (Optional):</label>
                                        </div>
                                        <div class="col-8">
                                            <input type="text" placeholder="I'm in a call with..." class="form-control border-bottom px-2" v-bind:class="{ 'is-invalid': activityCallWithError }" v-model="activityCallWith" name="activityCallWith" :disabled="activityNotesLoading">
                                            <div class="invalid-feedback">
                                                Invalid value
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <div class="row">
                                      <div class="col-auto">
                                        <label for="activityPercentageSelect" class="form-label mx-0 my-2">Activity progress estimate:</label>
                                      </div>
                                      <div class="col-3">
                                        <select class="form-select p-2 pe-3 border-0 text-center" @change="activityPercentageChange" v-bind:class="{ 'is-invalid': activityPercentageSelectError }" v-model="activityPercentageSelect" name="activityPercentageSelect" aria-label="Default select example" required :disabled="activityNotesLoading">
                                          <option selected disabled value="">Select...</option>
                                          <option value="0">Just Started</option>
                                          <option value="10">10% Done</option>
                                          <option value="20">20% Done</option>
                                          <option value="30">30% Done</option>
                                          <option value="40">40% Done</option>
                                          <option value="50">50% Done</option>
                                          <option value="60">60% Done</option>
                                          <option value="70">70% Done</option>
                                          <option value="80">80% Done</option>
                                          <option value="90">90% Done</option>
                                          <option value="100">100% Done</option>
                                          <option value="manual">Manual Input</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select an estimate.
                                        </div>
                                      </div>
                                      <div class="row col-4 has-validation" v-if="activityPercentageSelect == 'manual'">
                                        <div class="col-9 px-0">
                                            <input type="text" maxlength="3" v-bind:class="{ 'is-invalid': activityPercentageError }" v-model="activityPercentage" name="activityPercentage" class="form-control px-2 text-end border-0" :disabled="activityNotesLoading">
                                            <div class="invalid-feedback">
                                              {{ activityPercentageErrorText }}
                                            </div>
                                        </div>
                                        <div class="col-3 px-0">
                                            <p class="py-2">%</p>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                                <div class="mx-auto">
                                    <div class="row justify-content-center">
                                        <Loader v-if="activityNotesLoading" :labelVisible="false" :imgWidth="15"></Loader>
                                        <div class="col-4 text-end d-grid gap-2" v-if="!activityNotesLoading">
                                            <MaterialButton color="secondary" class="black-font text-capitalize" type="submit">Submit</MaterialButton>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div v-else class="row justify-content-center">
                        <div class="col-xl-12 col-md-12 text-center mb-4">
                            <h5 class="pt-0">Successfully recorded.</h5>
                        </div>
                    </div>
                </div>
            </template>
        </StandardModal>
    </Teleport>
</template>


<script setup>
    //images
    import rsLogoCircle from "@/assets/img/rs-logo-circle.png";
    import quickBreakIcon from "@/assets/img/quick-break-icon.svg";
    import lunchBreakIcon from "@/assets/img/lunch-break-icon.svg";
    import startWorkIcon from "@/assets/img/start-work-icon.svg";
    import startWorkWhiteIcon from "@/assets/img/start-work-white-icon.svg";
    import captureRunningIcon from "@/assets/img/timer-running.gif";

    //components
    import MaterialButton from "@/components/MaterialButton.vue";
    import Loader from "@/components/Loader.vue";
</script>

<script>
    import { Form } from 'vform';
    import api from "@/static/config.json";
    import axios from 'axios';
    import StandardModal from "@/components/Modals/StandardModal.vue";
    export default {
        data() {
            return {
                USERID : '',
                CLIENTID : '',
                CLIENTNAME : '',
                workConfirmShow: false,
                workStartConfirmShow: false,
                workConfirmText: "",
                workConfirmCommitText: "",
                breakConfirmShow: false,
                breakConfirmText: "",
                breakConfirmCommitText: "",
                timetracker_time: "",
                isTimetrackerActive: false,
                isWorking: false,
                isLunchBreak: false,
                isQuickBreak: false,
                isDisabled:false,
                lunchBreakClicked: false,
                quickBreakClicked: false,
                captureScreen: false,
                captureCamera: false,
                imageCapture: false,
                imageCaptureCanvas: false,
                mediaStream: false,
                confirmLoading: false,
                timetrackerLoading: true,
                activityNotesLoading: false,
                cameracapIntervalMinutes: 1,
                screencapIntervalMinutes: api.SCREENSHOT_INTERVAL,
                grabScreenCapIntervalObj: false,
                activityNotesShow: false,
                activityNotesText: "",
                activityNotesCommitText: "",
                activityNotesIntervalMinutes: api.ACTIVITY_NOTES_INTERVAL,
                activityNotesIntervalText: "",
                activityNotesIntervalObj: false,
                activityDescription: "",
                activityCallWith: "",
                activityPercentageSelect: "",
                activityPercentage: "",
                activityDescriptionError: false,
                activityCallWithError: false,
                activityPercentageSelectError: false,
                activityPercentageError: false,
                activityPercentageErrorText: false,
                clients:"",
                client_value:"",
                reg_type:""
            }
        },
        components:{
            StandardModal,
            axios,
        },
        mounted() {
            this.USERID = localStorage.getItem('userid');
            this.CLIENTID = localStorage.getItem('tracker_client_id') ? localStorage.getItem('tracker_client_id') : localStorage.getItem('client_id');
            this.CLIENTNAME = localStorage.getItem('client_name');

           var client_list =  localStorage.getItem('client_list');

            if( typeof client_list !== 'undefined' ) {
                this.clients = JSON.parse(localStorage.getItem('client_list'));
            } 
            
            this.getWorkSession();

            setInterval(() => this.getTime(), 1000);

            if(this.CLIENTID==""){
                    this.workConfirmShow = true;
                    this.workConfirmCommitText = `No client is assign to you. The Start work button will not work. \n Please contact the IT Support.`;
                    this.isDisabled = true;
            }
                            
            this.emitter.emit("mapIsWorking", this.isWorking);
        },
        methods:{
            getTime() {
                let date = new Date();

                // Manila Time
                let tt_time = date.toLocaleString('en-US', {
                    timeZone: 'Hongkong',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
                this.timetracker_time = tt_time;
            },
            minutesToText(totalMinutes) {
                let self = this;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                let res = [];

                if (hours) {
                    res.push(`${hours} ${(hours > 1) ? "hours" : "hour"}`);
                }
                if (minutes) {
                    res.push(`${minutes} ${(minutes > 1) ? "minutes" : "minute"}`);
                }
                return res.join(" and ");
            },
            getWorkSession() {
                // This function checks if the user has any open timetracker sessions
                let self = this;
                axios({
                    method: 'get',
                    url: `${api.TIMETRACKER_API_URL}/${self.USERID}/${self.CLIENTID}/`,
                    headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` }
                })
                .then(function (response) {
                    let has_error = Object.keys(response.data).includes("errors");
                    if (!has_error) {
                        self.isWorking = response.data.is_working;
                        self.isLunchBreak = response.data.is_lunch_break;
                        self.isQuickBreak = response.data.is_quick_break;
                        self.captureScreen = self.isWorking;
                        if (self.isWorking && !self.isLunchBreak && !self.isQuickBreak) {
                            self.startScreenCapture();
                            self.startActivityNotes();
                        }else{
                            self.toggleConfirmStartWork();
                        }
                    }
                    
                    self.isTimetrackerActive = true;
                    self.timetrackerLoading = false;
                })
                .catch(function (errors) {
                    console.log(errors);
                    self.timetrackerLoading = false;
                })
            },
            getTimetrackerConfiguration() {
                // This function checks if the user has any open timetracker sessions
                let self = this;
                axios({
                    method: 'get',
                    url: `${api.TIMETRACKER_API_URL}/config/${self.USERID}/${self.CLIENTID}/`,
                    headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` }
                })
                .then(function (response) {
                    if (response.data.screen_cap_interval) {
                        self.screencapIntervalMinutes = response.data.screen_cap_interval;
                    }
                    if (response.data.activity_note_interval) {
                        self.activityNotesIntervalMinutes = response.data.activity_note_interval;
                    }
                    self.activityNotesIntervalText = self.minutesToText(self.activityNotesIntervalMinutes);

                })
                .catch(function (errors) {
                    console.log(errors);
                })
            },
            triggerWorkSession() {
                let self = this;
                if (self.isWorking) {
                    self.stopTimesheetDtl("work");
                } else {
                    self.startTimesheetDtl("work");
                }
            },
            triggerBreakSession(type='quick') {
                let self = this;
                if (type === 'lunch') {
                    if (self.isLunchBreak) {
                        self.stopTimesheetDtl(type);
                    } else {
                        self.startTimesheetDtl(type);
                    }
                } else {
                    if (self.isQuickBreak) {
                        self.stopTimesheetDtl(type);
                    } else {
                        self.startTimesheetDtl(type);
                    }
                }
            },
            toggleWorkConfirm() {
                let self = this;
                self.workConfirmShow = !self.workConfirmShow;

                if(!self.isWorking){
                    self.toggleConfirmStartWork();
                }else{
                    self.workConfirmCommitText = "";
                    let _text = `Are you sure you want to ${self.isWorking ? "finish working?" : "start work with "+`${self.CLIENTNAME}` + `?`}`;
                    self.workConfirmText = _text;
                }
                
            },
            toggleConfirmStartWork() {
                let registrant_type = localStorage.getItem('registrant_type');

                if(registrant_type=="remote-contractor"){
                    this.reg_type = 'remote worker';
                }else if(registrant_type=="admin"){
                    this.reg_type = 'corporate user';
                }

                this.workStartConfirmShow = !this.workStartConfirmShow;

            },
            toggleBreakConfirm(type='quick') {
                let self = this;
                let _text = "Are you sure you want to";
                self.breakConfirmShow = !self.breakConfirmShow;
                self.breakConfirmCommitText = "";

                switch (type) {
                    case "lunch":
                        self.lunchBreakClicked = !self.lunchBreakClicked
                        if (self.breakConfirmShow) {
                            _text = `${_text} ${self.isLunchBreak ? "finish lunch break?" : "take a lunch break?"}`;
                        } else {_text = ""}
                        break;
                    default:
                        self.quickBreakClicked = !self.quickBreakClicked
                        if (self.breakConfirmShow) {
                            _text = `${_text} ${self.isQuickBreak ? "finish quick break?" : "take a quick break?"}`;
                        } else {_text = ""}
                }
                self.breakConfirmText = _text;
            },
            grabScreenCapture() {
                let self = this;
                let date = new Date();

                // Manila Time
                let tt_time = date.toLocaleString('en-US', {
                    timeZone: 'Hongkong',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
                if (self.captureScreen) {
                    let video_elmnt = document.getElementById("grabFrameVideo");
                    if (video_elmnt) {
                        const tracks = self.mediaStream.getVideoTracks();
                        if (tracks) {
                            video_elmnt.srcObject = self.mediaStream;
                            self.imageCapture = new ImageCapture(tracks[0]);
                            self.imageCapture.grabFrame()
                            .then((imageBitmap) => {
                                console.log(`[${tt_time}] grabbing screen capture.`);
                                self.uploadScreenCapture(imageBitmap);
                            })
                            .catch(function (errors) {
                                if (errors.message === 'The associated Track is in an invalid state') {
                                    console.log(`[${tt_time}] Reinitiating screen capture.`);
                                    self.startScreenCapture();
                                } else {
                                    self.stopScreenCapture();
                                    console.log(errors);
                                }
                            })
                        } else {
                            self.startScreenCapture();
                        }
                    } else {
                        self.stopScreenCapture();
                    }
                }
            },
            startTimesheetDtl(type="work") {
                let self = this;
                navigator.mediaDevices.getDisplayMedia({video: {displaySurface: 'monitor' }})
                .then((mediaStream) => {
                    self.mediaStream = mediaStream;
                    let displaySurface = mediaStream.getVideoTracks()[0].getSettings().displaySurface;
                    console.log(displaySurface);
                    if (displaySurface === 'monitor') {
                        self.captureScreen = true;
                        self.grabScreenCapture();
                        console.log(`Screen capture interval: ${self.screencapIntervalMinutes} minutes`);
                        self.grabScreenCapIntervalObj = setInterval(() => self.grabScreenCapture(), (self.screencapIntervalMinutes * 60000));
                        self.confirmLoading = true;
                        
                        axios({
                            method: 'post',
                            url: `${api.TIMETRACKER_API_URL}/clockin/`,
                            headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` },
                            data: {
                                link_subcon_id: self.USERID,
                                link_client_id: self.CLIENTID == "" ? localStorage.getItem('client_id') : self.CLIENTID,
                                status_id: 1,
                                createdby: 1,
                                dtl_type: type
                            }
                        })
                        .then(function (response) {
                            let date = new Date();
                            let tt_time = date.toLocaleString('en-US', {
                                timeZone: 'Hongkong',
                                dateStyle: 'full',
                                timeStyle: 'short'
                            });

                            switch (type) {
                                case "quick":
                                    self.isQuickBreak = true;
                                    self.quickBreakClicked = false;
                                    self.breakConfirmCommitText = `Taking a quick break at ${tt_time}`;
                                    self.stopScreenCapture();
                                    self.stopActivityNotes();
                                    break;
                                case "lunch":
                                    self.isLunchBreak = true;
                                    self.lunchBreakClicked = false;
                                    self.breakConfirmCommitText = `Taking lunch break at ${tt_time}`;
                                    self.stopScreenCapture();
                                    self.stopActivityNotes();
                                    break;
                                default:
                                    self.isWorking = true;
                                    self.workConfirmCommitText = `Start of work as of ${tt_time}`;
                                    //self.startScreenCapture();
                                    self.startActivityNotes();
                                    self.emitter.emit("mapIsWorking", self.isWorking);
                            }
                            self.confirmLoading = false;
                        })
                        .catch(function (errors) {
                            self.workConfirmCommitText = `API connection is not yet working.`;
                            console.log(errors);
                            self.confirmLoading = false;
                        })
                    }
                    else{
                        self.workConfirmCommitText = `You need to reload the page and share your default monitor.`;
                        self.stopScreenCapture()
                        self.confirmLoading = false;
                    }
                })
                .catch(function (errors) {
                            self.workConfirmCommitText = `You need to reload the page and share your default monitor.`;
                            console.log(errors);
                            self.confirmLoading = false;
                        })
            },
            stopTimesheetDtl(type) {
                let self = this;
                self.confirmLoading = true;
                axios({
                    method: 'patch',
                    url: `${api.TIMETRACKER_API_URL}/clockout/`,
                    headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` },
                    data: {
                        link_subcon_id: self.USERID,
                        link_client_id: self.CLIENTID == "" ? localStorage.getItem('client_id') : self.CLIENTID,
                        dtl_type: type
                    }
                })
                .then(function (response) {
                    let date = new Date();
                    let tt_time = date.toLocaleString('en-US', {
                        timeZone: 'Hongkong',
                        dateStyle: 'full',
                        timeStyle: 'short'
                    });
                    switch (type) {
                        case "quick":
                            self.isQuickBreak = false;
                            self.quickBreakClicked = false;
                            self.breakConfirmCommitText = `Ending quick break at ${tt_time}`;
                            self.startScreenCapture();
                            self.startActivityNotes();
                            break;
                        case "lunch":
                            self.isLunchBreak = false;
                            self.lunchBreakClicked = false;
                            self.breakConfirmCommitText = `Ending lunch break at ${tt_time}`;
                            self.startScreenCapture();
                            self.startActivityNotes();
                            break;
                        default:
                            self.isWorking = false;
                            self.workConfirmCommitText = `End of work as of ${tt_time}`;
                            self.stopScreenCapture();
                            self.stopActivityNotes();
                            
                            self.emitter.emit("mapIsWorking", self.isWorking);
                    }
                    self.confirmLoading = false;
                })
                .catch(function (errors) {
                    if (errors.code === 'ERR_NETWORK') {
                        self.workConfirmCommitText = `API connection is not yet working.`;
                        console.log(errors);
                    }
                    self.confirmLoading = false;
                })
            },
            startScreenCapture() {
                let self = this;
                self.captureScreen = true;
                navigator.mediaDevices.getDisplayMedia({video: {mediaSource: "screen"}, displaySurface: ['monitor'],})
                .then((mediaStream) => {
                    self.mediaStream = mediaStream;
                    self.grabScreenCapture();
                    console.log(`Screen capture interval: ${self.screencapIntervalMinutes} minutes`);
                    self.grabScreenCapIntervalObj = setInterval(() => self.grabScreenCapture(), (self.screencapIntervalMinutes * 60000));
                })
                .catch((error) => console.error(error));
            },
            stopScreenCapture() {
                let self = this;
                self.captureScreen = false;
                clearInterval(self.grabScreenCapIntervalObj);
                let videoTracks = self.mediaStream.getVideoTracks()
                if (videoTracks) {
                    videoTracks.forEach(function(track) {
                        track.stop();
                    });
                }
            },
            showActivityNotesForm() {
                let self = this;
                if (self.activityNotesShow === false) {
                    self.activityNotesShow = true;
                    self.notifyActivityNotes();
                }
            },
            startActivityNotes() {
                let self = this;
                console.log(`Activity Tracker interval: ${self.activityNotesIntervalText}`);
                self.activityNotesIntervalObj = setInterval(() => self.showActivityNotesForm(), (self.activityNotesIntervalMinutes * 60000));
            },
            stopActivityNotes() {
                let self = this;
                clearInterval(self.activityNotesIntervalObj);
            },
            submitActivityNotes(form) {
                let self = this;
                self.activityDescriptionError = self.activityDescription ? false : true;
                self.activityPercentageSelectError = self.activityPercentageSelect ? false : true;

                if (self.activityPercentageSelect === 'manual' && !self.activityPercentage) {
                    self.activityPercentageError = true;
                    self.activityPercentageErrorText = "Please provide an estimate";
                } else {
                    if (Number.isNaN(+(self.activityPercentage))) {
                        self.activityPercentageError = true;
                        self.activityPercentageErrorText = "Must be numeric";
                    } else {
                        if(Number(self.activityPercentage) > 100) {
                            self.activityPercentageError = true;
                            self.activityPercentageErrorText = "Cannot be more than 100";
                        } else {
                            self.activityPercentageError = false;
                            self.activityPercentageErrorText = "";
                        }
                    }
                }

                if (!self.activityDescriptionError &&
                    !self.activityPercentageError &&
                    !self.activityPercentageSelectError &&
                    !self.activityCallWithError) {

                    self.activityNotesLoading = true

                    axios({
                        method: 'post',
                        url: `${api.TIMETRACKER_API_URL}/activitynote/`,
                        headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` },
                        data: {
                            link_subcon_id: self.USERID,
                            link_client_id: self.CLIENTID == "" ? localStorage.getItem('client_id') : self.CLIENTID,
                            description: self.activityDescription,
                            percentage: Number(self.activityPercentage),
                            call_with: self.activityCallWith,
                            createdby: 1
                        }
                    })
                    .then(function (response) {
                        Array.from(document.querySelectorAll('.activityNotes .is-invalid')).forEach((el) => el.classList.remove('is-invalid'));
                        self.activityNotesShow = false;
                        self.activityNotesLoading = false;
                        self.activityDescription = "";
                        self.activityCallWith = "";
                        self.activityPercentageSelect = "";
                        self.activityPercentage = "";
                    })
                    .catch(function (errors) {
                        self.activityNotesCommitText = `API connection is not yet working.`;
                        self.activityNotesLoading = false;
                        console.log(errors);
                    })
                }
            },
            activityPercentageChange() {
                self.activityPercentageError = false;
                self.activityPercentageErrorText = "";
                if (this.activityPercentageSelect === 'manual') {
                    this.activityPercentage = ""
                } else {
                    this.activityPercentage = this.activityPercentageSelect
                }
            },
            async notifyActivityNotes() {
                let permission = await Notification.requestPermission();
                const greeting = new Notification('Activity Monitoring',{
                  body: 'What are you working on right now?',
                  icon: rsLogoCircle,
                  requireInteraction: true
                });
            },
            async uploadScreenCapture(bitmap) {
                let self = this;
                const canvas = document.querySelector('#grabFrameCanvas');
                canvas.width = getComputedStyle(canvas).width.split('px')[0];
                canvas.height = getComputedStyle(canvas).height.split('px')[0];

                const bitmapCtx = canvas.getContext("bitmaprenderer");
                bitmapCtx.transferFromImageBitmap(bitmap);

                axios({
                    method: 'post',
                    url: `${api.TIMETRACKER_API_URL}/screencap/`,
                    headers: { Authorization: `Token ${localStorage.getItem('timetracker_token')}` },
                    data: {
                        link_subcon_id: self.USERID,
                        link_client_id: self.CLIENTID == "" ? localStorage.getItem('client_id') : self.CLIENTID,
                        screen_name: "sample",
                        photo: canvas.toDataURL("image/png"),
                        createdby: 1
                    }
                })
                .then(function (response) {})
                .catch(function (errors) {
                    self.workConfirmCommitText = `API connection is not yet working.`;
                    console.log(errors);
                })
            },
        }
    }
</script>

<style scoped>
    .timetracker button {
        transition: none;
    }
    .timetracker button.disabled {
        background-color: transparent;
    }
    .timetracker .btn-secondary, .workConfirm .btn-secondary, .breakConfirm .btn-secondary {
        background-color: #d1d1d1 !important;
    }
    .timetracker .command-btn, .workConfirm .command-btn, .breakConfirm .command-btn{
        border: 1px solid #DEDEDE !important;
    }
    .timetracker .screen-capture-btn {
        border-radius: 0 0 0 5px;
    }
    .timetracker .camera-capture-btn {
        border-radius: 0 0 5px 0;
    }

    button.quick-break-btn, button.lunch-break-btn {
        background-color: #C1C1C1 !important;
    }
    button.screen-capture-btn, button.camera-capture-btn {
        background-color: #d9d9d9;
        opacity: unset !important;
        padding-left: 1.9rem;
        padding-right: 1.9rem;
    }
    .div-border {
        border: 2px solid #dde1e1;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .timetracker.work-active button.screen-capture-btn,
    .timetracker.work-active button.camera-capture-btn {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }
    .timetracker .canvasContainer {
        position: relative;
        height: 1px;
        width: 100%;
    }
    .timetracker .canvasContainer canvas, .overlay {
        position: absolute;
    }
    .timetracker canvas {
        border: 1px solid #ffffff;
        width: 1px;
        height: 1px;
    }
    .timetracker .screen-capture-btn div div {
        position: relative;
        text-align: center;
        width: fit-content;
    }
    .timetracker .captureImgContainer sup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .form-select{
        padding: .5rem .5rem !important;
        background-color: #ededed !important;
        background-position: right 6px center !important;
    }
    .input-group-outline {
        background-color: #ededed !important;
        border-color: #ededed !important;
    }

</style>
<style scope src="../../../assets/css/standard-colors.css">
</style>