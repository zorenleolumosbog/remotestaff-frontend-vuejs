<script setup>
    import CloseIcon from "@/assets/img/x-symbol-svgrepo-com.svg";
    
    defineProps(['show', 'hasClose', 'hasHeader', 'hasFooter', 'title', 'size', 'isScrollable'])
</script>

<template>
    <Transition name="modal">

        <div v-if="show" class="modal">

            <div class="modal-dialog modal-dialog-centered" :class="[{ 'modal-dialog-scrollable' : isScrollable }, size]">

                <div class="modal-content">

                    <div v-if="hasHeader" class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
                        <button
                            class="btn-close"
                            aria-label="Close"
                            @click="$emit('close')"
                        ><img :src="CloseIcon" /></button>
                    </div>

                    <div v-else style="text-align: right; padding-right: 10px; padding-top: 3px;">
                        <button v-if="hasClose"
                            class="btn-close"
                            aria-label="Close"
                            @click="$emit('close')"
                        ><img :src="CloseIcon" /></button>
                    </div>

                    <div class="modal-body">
                        <slot name="body">Body</slot>

                    </div>

                    <div v-if="hasFooter" class="modal-footer justify-content-between">
                        <span>&nbsp;</span>
                        <div>
                            <slot name="footer">Footer</slot>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    </Transition>

</template>

<style scoped>



    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */


</style>