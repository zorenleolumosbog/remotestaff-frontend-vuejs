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

            this.$watch('details.forexId', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.forex_id = [];
                        this.validations.errors.forex_id.push(
                            "The Forex Rate Type is required."
                        );
                    } else {
                        this.validations.errors.forex_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.currencyId', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.currency_id = [];
                        this.validations.errors.currency_id.push(
                            "The Currency is required."
                        );
                    } else {
                        this.validations.errors.currency_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.month_year', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.month_year = [];
                        this.validations.errors.month_year.push(
                            "The Month/Year Effective is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.month_year = [];
                        this.validations.errors.month_year.push(
                            "The Tax Rate description must not exceed 50 characters."
                        );
                    } else {
                        this.validations.errors.month_year = [];
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
                            "The New Rate is required."
                        );
                    } else if (isNaN(newVal)) {
                        this.validations.errors.rate = [];
                        this.validations.errors.rate.push(
                            "The New Rate should only contain numbers."
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