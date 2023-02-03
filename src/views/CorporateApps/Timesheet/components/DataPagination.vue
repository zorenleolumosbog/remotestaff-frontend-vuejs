<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

export default {
    props: ['records'],
    components: {
        MaterialPagination,
        MaterialPaginationItem
    }
}
</script>

<template>
    <material-pagination size="sm">
        <template v-for="(link, index) in records" :key="index">
            <material-pagination-item 
                :prev="link.label.includes('Previous')"
                :next="link.label.includes('Next')"
                :label="link.label" 
                :active="link.active"
                :disabled="!link.url"
                @click="$emit('goToPage', link.url)"
            />
        </template>
    </material-pagination>
</template>