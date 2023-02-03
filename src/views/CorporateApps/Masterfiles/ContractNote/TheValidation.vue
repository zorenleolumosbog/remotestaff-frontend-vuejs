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
                return /^[a-zA-ZÑñ ,-]*$/.test(data);
            },
        },
        computed: {
            ...mapGetters(['inputHasChanged'])
        },
        mounted() {
            this.validations.errors.push({
                notes:[],
                file: []
            });

            this.$watch('details', (newVal) => {
                    if (newVal.fileTypeId != null && newVal.filename == '') {
                        this.validations.errors.file = [];
                        this.validations.errors.file.push(
                            "The File is required."
                        );
                    }
                    else {
                        this.validations.errors.file = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.notes', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.notes = [];
                        this.validations.errors.notes.push(
                            "The Notes is required."
                        );
                    } else if (newVal.length > 250) {
                        this.validations.errors.notes = [];
                        this.validations.errors.notes.push(
                            "The Notes must not exceed 250 characters."
                        );
                    } 
                    else {
                        this.validations.errors.notes = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
        },
    }
</script>