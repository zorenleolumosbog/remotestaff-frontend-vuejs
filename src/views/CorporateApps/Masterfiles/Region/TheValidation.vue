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
                        description:[]

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

            this.$watch('details.description', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Region is required."
                        );
                    } else if (newVal.length > 20) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Region must not exceed 20 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Region must not contain any special characters."
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