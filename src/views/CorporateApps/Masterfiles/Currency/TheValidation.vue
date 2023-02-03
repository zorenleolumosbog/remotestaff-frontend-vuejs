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
                        code:[],
                        symbol: [],
                        description:[],
                        rate:[]

            });
            this.$watch('details.countryId', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.country_id = [];
                        this.validations.errors.country_id.push(
                            "The Country field is required."
                        );
                    } else {
                        this.validations.errors.country_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.code', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.code = [];
                        this.validations.errors.code.push(
                            "The Currency Code field is required."
                        );
                    } else if (newVal.length > 5) {
                        this.validations.errors.code = [];
                        this.validations.errors.code.push(
                            "The Currency Code must not exceed 5 characters."
                        );
                    } else {
                        this.validations.errors.code = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            this.$watch('details.symbol', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.symbol = [];
                        this.validations.errors.symbol.push(
                            "The Currency Symbol field is required."
                        );
                    } else if (newVal.length > 5) {
                        this.validations.errors.symbol = [];
                        this.validations.errors.symbol.push(
                            "The Currency Symbol must not exceed 5 characters."
                        );
                    } else {
                        this.validations.errors.symbol = [];
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
                            "The Currency field is required."
                        );
                    } else if (newVal.length > 40) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Currency must not exceed 40 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Country must not contain any special characters."
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
                            "The Currency Rate field is required."
                        );
                    } else if (isNaN(newVal)) {
                        this.validations.errors.rate = [];
                        this.validations.errors.rate.push(
                            "The Currency Rate should only contain numbers."
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