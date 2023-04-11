<script setup>
import {computed} from "vue";
import {useCartStore} from "../stores/cart";

const productProp = defineProps({
    product:{
        required: true
    }
})

const cartStore = useCartStore()
const emit = defineEmits(['remove-from-cart'])

const onChangeCount = count => {
    productProp.product.count += count
    cartStore.changeCount(productProp.product)
}

const onDeleteProduct = product => {
    emit('remove-from-cart',product)
    cartStore.deleteProduct(product)
}

const productCount = computed(() => productProp.product.count)
const product = productProp.product
</script>

<template>
    <tr>
        <td class="p-4">
            <div class="media align-items-center">
                <img :src="product.image" width="70" alt="">
                <div class="media-body">
                    <RouterLink class="d-block text-dark" :to="{name:'product-detail',params:{slug:product.slug}}">
                        {{ product.name }}
                    </RouterLink>
                    <small>
                        <span class="text-muted">SKU: {{ product.sku }}</span>
                    </small>
                </div>
            </div>
        </td>
        <td class="text-right font-weight-semibold align-middle p-4">{{ currencyFormat(product.price) }}</td>
        <td class="align-middle">
            <div class="d-flex">
                <button class="btn btn-danger btn-sm me-2" @click="onChangeCount(-1)" :disabled="product.count === +1">
                    <i class="bi bi-dash text-white"></i>
                </button>
                <input type="text" class="form-control text-sm-center" style="width: 70px" v-model.number="productCount"
                       min="1">
                <button class="btn btn-success btn-sm ms-2" @click="onChangeCount(1)">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
        </td>
        <td class="text-right font-weight-semibold align-middle p-4">{{ currencyFormat(product.price * product.count) }}</td>
        <td class="text-center align-middle px-2">
            <button class="btn btn-sm btn-danger" @click="onDeleteProduct(product)">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    </tr>
</template>