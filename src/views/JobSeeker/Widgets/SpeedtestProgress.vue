<template>
    <div class="progress mt-1" style="height: 50px;">
        <h5 v-if="label === 'Connecting...'" class="text-dark w-100" style="font-size: 20px !important;">{{ label }}</h5>
        <template v-else>
            <div class="progress-bar" role="progressbar" :style="`width:${progress}%;height: 50px;background-color: #0b0724;border-radius: 0px;`" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
                <h5 class="text-light">{{ progress }}</h5>
            </div>
            <div class="progress-bar" role="progressbar" :style="`width:${300 - progress}%;height: 50px;background-color: #5e44ff;border-radius: 0px;`" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
        </template>
    </div>
</template>>
<script>
export default {
    props: ['label', 'progress']
}
</script>