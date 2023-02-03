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
                invoice_item_type_id: [],
                particular:[],
                amount_add_on:[],
                hoursRendered:[],
                hourlyRate:[]
            });

            this.$watch('details.particular', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The particular is required."
                        );
                    } else if (newVal.length > 20) {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The particular must not exceed 30 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The Account Classification must not contain any special characters."
                        );
                    } 
                    else {
                        this.validations.errors.particular = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.hoursRendered', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.hoursRendered = [];
                        this.validations.errors.hoursRendered.push(
                            "No. of hours is required"
                        );
                    } else {
                        this.validations.errors.hoursRendered = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.hourlyRate', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.hourlyRate = [];
                        this.validations.errors.hourlyRate.push(
                            "Hourly Rate is required"
                        );
                    } else {
                        this.validations.errors.hourlyRate = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>