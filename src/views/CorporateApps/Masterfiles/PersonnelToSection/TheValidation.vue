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
                    description:[]

            });

            // this.$watch('details.description', (newVal) => {
            //         if (newVal == "") {
            //             this.validations.errors.description = [];
            //             this.validations.errors.description.push(
            //                 "The Description field is required."
            //             );
            //         } else if (newVal.length > 50) {
            //             this.validations.errors.description = [];
            //             this.validations.errors.description.push(
            //                 "The Description must not exceed 50 characters."
            //             );
            //         } else {
            //             this.validations.errors.description = [];
            //         }
            //     }, 
            //     {
            //         immediate: true 
            //     }
            // );

            this.$watch('details.selectedJobseeker', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.link_prereg_id = [];
                        this.validations.errors.link_prereg_id.push(
                            "The Personnel is required."
                        );
                    } else {
                        this.validations.errors.link_prereg_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.sectionId', (newVal) => {
                    if (!newVal) {
                        this.validations.errors.link_sec_id = [];
                        this.validations.errors.link_sec_id.push(
                            "The Section is required."
                        );
                    } else {
                        this.validations.errors.link_sec_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>