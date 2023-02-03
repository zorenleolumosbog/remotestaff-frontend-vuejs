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
                    short_desc: [],
                    long_desc:[]

            });
            
            this.$watch('details.shortDescription', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.short_desc = [];
                        this.validations.errors.short_desc.push(
                            "The Tax Type Code is required."
                        );
                    } else if (newVal.length > 10) {
                        this.validations.errors.short_desc = [];
                        this.validations.errors.short_desc.push(
                            "The Tax Type Code must not exceed 10 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.short_desc = [];
                        this.validations.errors.short_desc.push(
                            "The Tax Type Code must not contain any special characters."
                        );
                    } 
                    else {
                        this.validations.errors.short_desc = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.longDescription', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.long_desc = [];
                        this.validations.errors.long_desc.push(
                            "The Tax Type is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.long_desc = [];
                        this.validations.errors.long_desc.push(
                            "The Tax Type must not exceed to 50 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.long_desc = [];
                        this.validations.errors.long_desc.push(
                            "The Tax Type Code must not contain any special characters."
                        );
                    } 
                    else {
                        this.validations.errors.long_desc = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
         
        },
    }
</script>