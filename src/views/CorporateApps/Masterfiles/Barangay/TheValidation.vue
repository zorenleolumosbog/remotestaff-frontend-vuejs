<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        inject: ['details', 'validations', 'confirmations'],
        watch: {
            details: {
                handler(newVal) {
                    this.checkInputHasChanged({
                        newVal: newVal,
                        oldVal: this.validations.previousDetails
                    });
                    
                    this.confirmations.inputHasChanged = this.inputHasChanged;
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(['checkInputHasChanged']),
            
            letterOnly(data){
                return /^[a-zA-Z0-9Ññ ,-]*$/.test(data);
            },
        },
        computed: {
            ...mapGetters(['inputHasChanged'])
        },
        mounted() {
            this.validations.errors.push({
                        description:[],
                        country_id: [],
                        region_id: [],
                        state_id: [],
                        towncity_id:[],

            });
            
            this.$watch('details.countryId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.country_id = [];
                        this.validations.errors.country_id.push(
                            "The Country is required."
                        );
                    } else {
                        this.validations.errors.country_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.regionId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.region_id = [];
                        this.validations.errors.region_id.push(
                            "The Region is required."
                        );
                    } else {
                        this.validations.errors.region_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.stateId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.state_id = [];
                        this.validations.errors.state_id.push(
                            "The State is required."
                        );
                    } else {
                        this.validations.errors.state_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.towncityId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.towncity_id = [];
                        this.validations.errors.towncity_id.push(
                            "The Town/City is required."
                        );
                    } else {
                        this.validations.errors.towncity_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.description', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Barangay/Village is required."
                        );
                    } else if (newVal.length > 20) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Barangay/Village must not exceed 20 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Barangay/Village must not contain any special characters."
                        );
                    } 
                     else {
                        this.validations.errors.description = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>