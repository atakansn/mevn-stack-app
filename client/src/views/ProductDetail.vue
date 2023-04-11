<script setup>
import ProductItem from "@/components/ProductItem.vue"
import {computed, onMounted, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useMainStore} from "@/stores";
import {useProductStore} from "@/stores/products";
import {useCartStore} from "@/stores/cart";

const productQuantity = ref(1)
const route = useRoute()

const mainStore = useMainStore()
const productStore = useProductStore()
const cartStore = useCartStore()

mainStore.button.text = 'Sepete Ekle'

const productDetail = () => productStore.getProductWithCategory(route.params.slug)
onMounted(() => watchEffect(async () => await productDetail()))

const onAddCart = product => cartStore.addCart({product, count: productQuantity.value})

const button = computed(() => mainStore.getButton)
const product = computed(() => productStore.getProduct)
const shuffleProducts = computed(() => productStore.shuffledProducts)
</script>

<template>
    <section>
        <div class="container px-4 px-lg-5 my-5">
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6">
                    <img class="card-img-top mb-5 mb-md-0" :src="product.image" :alt="product.name"/>
                </div>
                <div class="col-md-6">
                    <div class="small mb-1"><strong>SKU:</strong> {{ product.sku }}</div>
                    <div class="small mb-1"><strong>Kategori:</strong> {{ product?.category?.name }}</div>
                    <h1 class="display-5 fw-bolder">{{ product.name }}</h1>
                    <div class="fs-5 mb-5">
                        <span>{{ currencyFormat(product.price) }}</span>
                    </div>
                    <p class="lead">{{ product.description }}</p>
                    <div class="d-flex">
                        <input ref="productCount"
                               v-model="productQuantity"
                               class="form-control text-center me-3"
                               id="inputQuantity"
                               type="number"
                               style="max-width: 4rem"
                        />
                        <button :disabled="button.disable"
                                class="btn btn-outline-dark flex-shrink-0"
                                type="button"
                                @click="onAddCart(product)">
                              <span v-if="button.disable"
                                    class="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"></span>
                            <i v-else class="bi-cart-fill me-1"></i>
                            {{ button.text }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

  <!-- Related items section-->
    <section class="py-5 bg-light">
        <div class="container px-4 px-lg-5 mt-5">
            <h2 class="fw-bolder mb-4">İlgili Ürünler</h2>
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                <ProductItem :products="shuffleProducts" />
            </div>
        </div>
    </section>
</template>