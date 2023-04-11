<script setup>
import {computed} from "vue";

const productProp = defineProps({
    products: {}
})

const products = computed(() => productProp.products)
const currencyFormat = value => new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY'}).format(value)
</script>

<template>
    <div class="col mb-5" v-for="product in products">
        <div class="card h-100">
            <img class="card-img-top" :src="product.image" :alt="product.name"/>
            <div class="card-body p-4">
                <div class="text-center">
                    <h5 class="fw-bolder">{{ product.name }}</h5>
                    {{ currencyFormat(product.price) }}
                </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <RouterLink class="btn btn-outline-dark mt-auto"
                                :to="{name:'product-detail',params:{slug: product.slug}}">
                        Görüntüle
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>