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
                        ou_name: [],
                        registered_legal_name: [],
                        address_line1: [],
                        address_line2: [],
                        country_id: [],
                        region_id: [],
                        state_id: [],
                        town_city: [],
            });
            
            this.$watch('details.organizationalUnitName', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.ou_name = [];
                        this.validations.errors.ou_name.push(
                            "The Organizational Unit Name is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.ou_name = [];
                        this.validations.errors.ou_name.push(
                            "The Organizational Unit Name must not exceed 50 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.ou_name = [];
                        this.validations.errors.ou_name.push(
                            "The Organizational Unit must not contain any special characters."
                        );
                    } 
                    else {
                        this.validations.errors.ou_name = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.registeredLegalName', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.registered_legal_name = [];
                        this.validations.errors.registered_legal_name.push(
                            "The Registered Legal Name is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.registered_legal_name = [];
                        this.validations.errors.registered_legal_name.push(
                            "The Registered Legal Name must not exceed to 50 characters."
                        );
                    } else if (this.letterOnly(newVal) == false ) {
                        this.validations.errors.registered_legal_name = [];
                        this.validations.errors.registered_legal_name.push(
                            "The Account Classification must not contain any special characters."
                        );
                    } 
                    else {
                        this.validations.errors.registered_legal_name = [];
                    }
                }, 
                { 
                    immediate: true 
                }
            );

            this.$watch('details.addressLine1', (newVal) => {
                    if (newVal == "") {
                        this.validations.errors.address_line1 = [];
                        this.validations.errors.address_line1.push(
                            "The Address Line 1 is required."
                        );
                    } else if (newVal.length > 50) {
                        this.validations.errors.address_line1 = [];
                        this.validations.errors.address_line1.push(
                            "The Address Line 1 must not exceed to 50 characters."
                        );
                    } else {
                        this.validations.errors.address_line1 = [];
                    }
                }, 
                { 
                    immediate: true 
                }
            );

            this.$watch('details.addressLine2', (newVal) => {
                    if (newVal && newVal.length > 50) {
                        this.validations.errors.address_line2 = [];
                        this.validations.errors.address_line2.push(
                            "The Address Line 2 must not exceed to 50 characters."
                        );
                    } else {
                        this.validations.errors.address_line2 = [];
                    }
                }, 
                { 
                    immediate: true 
                }
            );

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

            this.$watch('details.regionId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.region_id = [];
                        this.validations.errors.region_id.push(
                            "The Region is required."
                        );
                    } else {
                        this.validations.errors.region_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );
            
            this.$watch('details.stateId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.state_id = [];
                        this.validations.errors.state_id.push(
                            "The State/Province is required."
                        );
                    } else {
                        this.validations.errors.state_id = [];
                    }
                }, 
                {
                    immediate: true 
                }
            );

            this.$watch('details.towncityId', (newVal) => {
                    if (!newVal || newVal === "") {
                        this.validations.errors.town_city = [];
                        this.validations.errors.town_city.push(
                            "The Town/City is required."
                        );
                    } else {
                        this.validations.errors.town_city = [];
                    }
                }, 
                { 
                    immediate: true 
                }
            );
        }
    }
</script>