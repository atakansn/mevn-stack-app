<script>
export default {
    name: "Alert",
    props: {
        alert: {
            required: true
        }
    }
}
</script>

<template>
    <div v-if="Array.isArray(alert.message) && alert.warning" class="alert alert-warning" role="alert">
        <div class="fw-semibold" v-for="error in alert.message">
            <ul class="mb-1">
                <li>{{ error }}</li>
            </ul>
        </div>
    </div>
    <div v-else>
        <div v-if="alert.success" class="alert alert-success d-flex align-items-center" role="alert">
            <div class="fw-semibold">
                {{ alert.message }}
            </div>
        </div>
        <div v-if="alert.warning" class="alert alert-warning d-flex align-items-center" role="alert">
            <div class="fw-semibold">
                {{ alert.message }}
            </div>
        </div>
    </div>
</template>