<template>
    <div class="d-flex align-items-center">
        <span class="me-3">
            <strong>Total Records:</strong> {{ records.total }}
        </span>
        <material-pagination size="sm" class="mt-3">
            <material-pagination-item
                :prev="true"
                :disabled="!records.currentPage"
                @click="goToPage(records.currentPage - 1)"
            />
            <span class="ms-2 me-2">Page {{ records.currentPage + 1 }} of {{ records.totalPage + 1 }}</span>
            <material-pagination-item
                :next="true"
                :disabled="records.currentPage >= records.totalPage"
                @click="goToPage(records.currentPage + 1)"
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
            goToPage(val) {
                if(val >= 0 && val <= this.records.totalPage) {
                    this.$emit('currentPage', val);
                }
                return false;
            }
        },
        props: ['records']
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
