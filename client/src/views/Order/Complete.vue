<script>
import {inject, onBeforeMount} from "vue";
import {useRouter} from "vue-router";

export default {
    setup() {
        const cookies = inject('$cookies')
        const router = useRouter()

        onBeforeMount(() => {
            if (!cookies.get('_complete')) {
                return router.push({name: 'home'})
            }

            if (cookies.get('_complete')) {
                return cookies.remove('_complete')
            }
        })
    },
}
</script>

<template>
    <div class="container py-5">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center fw-bold">Sipariş Tamamlandı</h1>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-3">
            <svg width="300" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5 -5 60.00 60.00" xml:space="preserve"
                 fill="#000000"
                 stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> <circle style="fill:#038623;" cx="25" cy="25" r="25"></circle>
                    <polyline
                            style="fill:none;stroke:#FFFFFF;stroke-width:4.85;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;"
                            points=" 38,15 22,33 12,25 "></polyline> </g></svg>
        </div>
        <div class="row mt-5">
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-center">Teşekkürler</h5>
                        <p class="card-text text-center">
                            Siparişiniz başarıyla alındı.
                        </p>
                        <p class="card-text text-center">
                            Siparişlerim menüsünden siparişlerinizi takip edebilirsiniz.
                        </p>
                        <div class="text-center">
                            <RouterLink :to="{name:'home'}" class="btn btn-dark">Alışverişe Devam Et</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>