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
                        department_id: [],
                        description:[]

            });
            
            this.$watch('details.departmentId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.department_id = [];
                        this.validations.errors.department_id.push(
                            "The Department is required."
                        );
                    } else {
                        this.validations.errors.department_id = [];
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
                            "The Section is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Section must not exceed 50 characters."
                        );
                    } 
                    else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.description = [];
                        this.validations.errors.description.push(
                            "The Section must not contain any special characters."
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