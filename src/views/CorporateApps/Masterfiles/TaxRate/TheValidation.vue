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
                        country_id: [],
                        region_id: [],
                        state_id: [],
                        description:[],
                        rate:[]

            });
            this.$watch('details.countryId', (newVal) => {
                    if (!newVal) {
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
                    if (!newVal) {
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
                    if (!newVal) {
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

            this.$watch('details.taxTypeId', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.tax_type_id = [];
                        this.validations.errors.tax_type_id.push(
                            "The Tax Type is required."
                        );
                    } else {
                        this.validations.errors.tax_type_id = [];
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
                            "The Tax Rate description is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Tax Rate description must not exceed 50 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Tax Rate must not contain any special characters."
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
            this.$watch('details.rate', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.rate = [];
                        this.validations.errors.rate.push(
                            "The Tax Rate is required."
                        );
                    } else if (isNaN(newVal)) {
                        this.validations.errors.rate = [];
                        this.validations.errors.rate.push(
                            "The Tax Rate should only contain numbers."
                        );
                    } else {
                        this.validations.errors.rate = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
         
        },
    }
</script>