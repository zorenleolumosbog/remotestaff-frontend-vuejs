<template>
    <nav>
        <the-menu></the-menu>
    </nav>
</template>
<script>
    import TheMenu from "../../Accounting/components/TheMenu.vue";

    export default {
        components: {
            TheMenu
        }
    }
</script>
<style scoped>
    nav {
        padding: 10px 15px;
        /* background-color: #002316; */
        background-color: #0B0724;
        height: 650px;
        border-radius: 5px;
    }
</style>