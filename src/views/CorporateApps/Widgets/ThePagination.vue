<template>
    <div class="d-flex align-items-center">
        <span class="me-3">
            <small class="font-weight-bold">Total Records:</small> {{ records.data.total }}
        </span>
        <material-pagination size="sm" class="mt-3">
            <!-- Number list pagination -->
            <!-- <template v-for="(link, index) in records.data.links" :key="index">
                <material-pagination-item 
                    :prev="link.label.includes('Previous')"
                    :next="link.label.includes('Next')"
                    :label="link.label" 
                    :active="link.active"
                    :disabled="!link.url"
                    @click="getPageNumberFromURLParam(link.url)"
                />
            </template> -->
            <!-- Next and Previous pagination -->
            <material-pagination-item
                :first="true"
                :disabled="!records.data.prev_page_url"
                @click="getPageNumberFromURLParam(records.data.first_page_url)"
            />
            <material-pagination-item
                :prev="true"
                :disabled="!records.data.prev_page_url"
                @click="getPageNumberFromURLParam(records.data.prev_page_url)"
            />
            <small class="ms-2 me-2 mt-1">Page {{ records.data.current_page }} of {{ records.data.last_page }}</small>
            <material-pagination-item
                :next="true"
                :disabled="!records.data.next_page_url"
                @click="getPageNumberFromURLParam(records.data.next_page_url)"
            />
            <material-pagination-item
                :last="true"
                :disabled="!records.data.next_page_url"
                @click="getPageNumberFromURLParam(records.data.last_page_url)"
            />
        </material-pagination>
    </div>
</template>
<script>
    import MaterialPagination from "@/components/MaterialPagination.vue";
    import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
    
    export default {
        components: {
            MaterialPagination,
            MaterialPaginationItem
        },
        methods: {
            getPageNumberFromURLParam(val) {
                if(val) {
                    var url = new URL(val);
                    var pageNumber = url.searchParams.get("page");
                    this.$emit('currentPage', pageNumber);
                }

                return false;
            }
        },
        props: ['records'],
        watch: { 
            "records.data.total": function(newVal, oldVal) { // watch it
                if (newVal > oldVal) {
                    this.$emit('currentPage', 1);
                }
            }
        }
    }
</script>

<style scoped>
.text{
    color: #6c757d;
    margin-top: 2px; 
    font-size: 12pt;  
}
.disabled {
    opacity: 0.6;
}
</style>
