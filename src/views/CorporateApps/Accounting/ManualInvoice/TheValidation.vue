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
            
            this.$watch('details.invoiceItemTypeId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.invoice_item_type_id = [];
                        this.validations.errors.invoice_item_type_id.push(
                            "The Invoice Type is required."
                        );
                    } else {
                        this.validations.errors.invoice_item_type_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.amountAddOn', (newVal) => {
                    if (!newVal || newVal === "") {
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