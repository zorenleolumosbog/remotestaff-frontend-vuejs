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
                amount_add_on:[]
            });

            this.$watch('details.particular', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The Particular is required."
                        );
                    } else if (newVal.length > 20) {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The Particular must not exceed 30 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.particular = [];
                        this.validations.errors.particular.push(
                            "The Particular must not contain any special characters."
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
            
            this.$watch('details.invoiceItemType', (newVal) => {
                    if (!newVal || newVal.length < 0) {
                        this.validations.errors.invoice_item_type_id = [];
                        this.validations.errors.invoice_item_type_id.push(
                            "The Invoice Item Type is required."
                        );
                    } else {
                        this.validations.errors.invoice_item_type_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.hourlyRate', (newVal) => {
                    if (newVal === null || newVal === "") {
                        this.validations.errors.hourly_rate = [];
                        this.validations.errors.hourly_rate.push(
                            "The Hourly Rate is required."
                        );
                    } else {
                        this.validations.errors.hourly_rate = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.totalHours', (newVal) => {
                    if (newVal === null || newVal === "") {
                        this.validations.errors.total_hours = [];
                        this.validations.errors.total_hours.push(
                            "The Tolal Hours is required."
                        );
                    } else {
                        this.validations.errors.total_hours = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.amountAddOn', (newVal) => {
                    if (newVal === null || newVal === "") {
                        this.validations.errors.amount_add_on = [];
                        this.validations.errors.amount_add_on.push(
                            "The Amount (add on) is required."
                        );
                    } else {
                        this.validations.errors.amount_add_on = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>