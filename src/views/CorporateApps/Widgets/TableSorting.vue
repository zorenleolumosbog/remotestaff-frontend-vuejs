<script>
    import tablesort from "tablesort";

    export default {
        mounted() {
            const element = document.getElementById("table");
            const thead = element.getElementsByTagName("thead")[0];
            const tr    = thead.getElementsByTagName("tr")[0];
            for ( const x in tr.getElementsByTagName("th") ) {
                if ( parseInt(x) || parseInt(x) == 0) {
                    const th = tr.getElementsByTagName("th")[parseInt(x)]
                    th.setAttribute("aria-sort", "descending");
                }
            }
            tablesort(element);
        }
    };
</script>

<style>
    th[role=columnheader]:not(.no-sort) {
        cursor: pointer;
    }
    th[role=columnheader]:not(.no-sort):after {
        content: '';
        float: right;
        margin-top: 7px;
        border-width: 0 6px 6px;
        border-style: solid;
        border-color: #FFFFFF transparent;
        visibility: hidden;
        opacity: 0;
        -ms-user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    th[aria-sort=descending]:not(.no-sort):after {
        border-bottom: none;
        border-width: 6px 6px 0;
    }
    th[aria-sort]:not(.no-sort):after {
        visibility: visible;
        opacity: 1;
    }
    th[role=columnheader]:not(.no-sort):after {
        visibility: visible;
        opacity: 1;
    }
</style>