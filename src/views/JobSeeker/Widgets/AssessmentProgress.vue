<template>
    <div class="progress w-40 mt-1" style="height: 20px;">
        <div class="progress-bar rounded-start" role="progressbar" :style="`width:${leftProgress}%;height: 20px;background-color: #0b0724;`" :aria-valuenow="leftProgress" aria-valuemin="0" aria-valuemax="100">{{ leftProgress }}%</div>
        <div class="progress-bar rounded-end" role="progressbar" :style="`width:${leftProgress}%;height: 20px;background-color: #5e44ff;`" :aria-valuenow="rightProgress" aria-valuemin="0" aria-valuemax="100">{{ rightProgress }}%</div>
    </div>
</template>>
<script>
export default {
    props: ['leftProgress', 'rightProgress']
}
</script>