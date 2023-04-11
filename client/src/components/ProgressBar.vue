<script setup>
defineProps({
    progress: {
        required: true
    }
})
</script>

<template>
    <div class="progress"
         :style="{opacity: progress.view ? 1 : 0, width: '100%', height: progress.view ? '8px' : 0}"
         role="progressbar"
         aria-label="Warning example"
         :aria-valuenow="progress.value"
         aria-valuemin="0"
         aria-valuemax="100">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success"
             :style="{width: progress.value + '%'}">
        </div>
    </div>
</template>

<style scoped>
.progress {
    border-radius: 0;
    overflow: hidden;
}

.progress-bar {
    border-radius: 0;
}
</style>