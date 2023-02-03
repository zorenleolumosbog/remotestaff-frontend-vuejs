<script setup>
    import { ref, computed } from 'vue'

    const emit = defineEmits(['selectRow'])

    const props = defineProps({
        data: Array,
        columns: Array,
        headers: Array,
        filterKey: String,
        alignItemToRight: Array,
    })

    const sortKey = ref('')
    const sortOrders = ref(
        props.columns.reduce((o, key) => ((o[key] = 1), o), {})
    )

    const filteredData = computed(() => {
        let { data, filterKey } = props

        if (filterKey) {
            filterKey = filterKey.toLowerCase()
                data = data.filter((row) => {
                return Object.keys(row).some((key) => {
                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                })
            })
        }

        const key = sortKey.value
        if (key) {
            const order = sortOrders.value[key]
                data = data.slice().sort((a, b) => {
                a = a[key]
                b = b[key]
                return (a === b ? 0 : a > b ? 1 : -1) * order
            })
        }
        return data
    })

    function sortBy(key) {
        console.log(key)
    sortKey.value = key
    sortOrders.value[key] *= -1
    }

    function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function handleSelect(data) {
        emit('selectRow', data)
    }

    function alignRight(key) {
        if ( props.alignItemToRight && props.alignItemToRight.includes(key) ){
            return 'align-right';
        }

        return ''
    }

</script>

<template>

<div class="scroll table-responsive-sm" v-if="filteredData.length">
<div class="table-responsive tableFixHead text-dark" >
    <div class="table-responsive">
        <table id="table" class="table table-bordered table-hover table-striped">
            <thead class="bg-header">
                <tr>
                    <th v-for="(key, index) in columns"
                    @click="sortBy(key)"
                    :class="{ active: sortKey == key }">
                    {{ capitalize(headers[index]) }}
                    <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                    </span>
                    </th>
                </tr>
            </thead>

            <tbody>
                <!-- {{filteredData}} -->
                <tr v-for="entry in filteredData" @click="handleSelect(entry)"
                class="select_row" :class="{selected_row: entry.selected}">
                <!-- :class="{selected_row: v.selected}" -->
                    <td v-for="key in columns" :class="alignRight(key)"> 
                    {{entry[key]}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</div>
<div v-else class="text-center">
    <br /><br /><br />
    <div >No data found.</div>
    <br /><br /><br />
</div>
</template>

<style scoped>

table {
    border: 0px #fff;
    /* margin: 0 auto; */
    outline-offset: -2px;
}
table th:first-child {
    border-radius: 5px 0 0 0;
}
table th:last-child {
    border-radius: 0 5px 0 0;
}
table tr:last-child > td:first-child {
    border-radius: 0 0 0 5px;
}
table tr:last-child > td:last-child {
    border-radius: 0  0 5px 0;
}
table td, th {
    padding: .5rem;
    outline: 1px solid rgb(230, 230, 230);
}
table th {
    color: #fff !important;
}
table tbody tr:hover {
    background-color: #BAAFFF;
    cursor: pointer;
}
/* .select_row:hover{
    background-color: #99f89c;
    cursor: pointer;
}
.selected_row{
    background-color: #99f89c;
} */

th.active {
color: #fff;
}

th.active .arrow {
opacity: 1;
}

.arrow {
display: inline-block;
vertical-align: middle;
width: 0;
height: 0;
margin-left: 5px;
opacity: 0.66;
}

.arrow.asc {
border-left: 4px solid transparent;
border-right: 4px solid transparent;
border-bottom: 4px solid #fff;
}

.arrow.dsc {
border-left: 4px solid transparent;
border-right: 4px solid transparent;
border-top: 4px solid #fff;
}

.align-right {
    text-align: right;
}
</style>