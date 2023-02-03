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
                    percentage: null
            });

            this.$watch('details.description', (newVal) => {
                    if (newVal === "") {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Invoice Item Type is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Invoice Item Type must not exceed 50 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Invoice Item Type must not contain any special characters."
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

            this.$watch('details.percentage', (newVal) => {
                    if(this.details.is_percentage === true) {
                        if (!newVal || newVal === "") {
                            this.validations.errors.percentage = [];
                            this.validations.errors.percentage.push(
                                "The Percentage is required."
                            );
                        } else if (isNaN(newVal)) {
                            this.validations.errors.percentage = [];
                            this.validations.errors.percentage.push(
                                "The Percentage should only contain numbers."
                            );
                        } else {
                            this.validations.errors.percentage = [];
                        }
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>