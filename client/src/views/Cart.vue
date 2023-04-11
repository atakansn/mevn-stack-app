<script setup>
import CartItem from '@/components/CartItem.vue'
import {computed, onMounted} from "vue";
import {useRouter} from "vue-router";
import {useCartStore} from "@/stores/cart";

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => cartStore.fetchCart())

const deleteFromCart = item => cartStore.removeFromCart(item)

const isEmpty = computed(() => cartStore.getIsEmpty)
const calculateTotalPrice = computed(() => cartStore.calculateTotalPrice)
const cart = computed(() => cartStore.getCart)
</script>

<template>
    <div class="container px-3 my-5 clearfix min-vh-100">
        <!-- Shopping cart table -->
        <div class="card" v-if="!isEmpty">
            <div class="card-header">
                <h5 class="my-1">Alışveriş Sepeti</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table m-0">
                        <thead>
                        <tr>
                            <!-- Set columns width -->
                            <th class="text-center py-3 px-4" style="min-width: 400px;">Ürün Adı &amp; Detayları</th>
                            <th class="text-right py-3 px-4" style="width: 150px;">Fiyat</th>
                            <th class="text-center py-3 px-4" style="width: 160px;">Adet</th>
                            <th class="text-right py-3 px-4" style="width: 100px;">Toplam</th>
                            <th class="text-center align-middle py-3 px-0" style="width: 40px;">
                                <a href="#" class="shop-tooltip float-none text-light" data-original-title="Clear cart">
                                    <i class="ino ion-md-trash"></i>
                                </a>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            <CartItem v-for="product in cart" :product="product" @remove-from-cart="deleteFromCart"/>
                        </tbody>
                    </table>
                </div>
                <!-- / Shopping cart table -->

                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <div class="mt-3">
                        <button type="button" class="btn btn-md btn-dark mt-2 me-3" @click="router.push('/')">
                            Alışverişe Geri Dön
                        </button>
                        <button type="button" class="btn btn-md btn-dark mt-2" @click="router.push('/checkout')">
                            Ödemeye Git
                        </button>
                    </div>
                    <div class="mt-3">
                        <label class="text-muted font-weight-normal m-0">Toplam Fiyat</label>
                        <div class="text-lg-end"><strong>{{ currencyFormat(calculateTotalPrice) }}</strong></div>
                    </div>
                </div>

            </div>
        </div>

        <div class="card" v-else>
            <h3 class="text-center my-5">
                Sepette henüz ürün yok.
            </h3>
        </div>

    </div>
</template>

<style scoped>
body {
    margin-top: 20px;
    background: #eee;
}

.ui-w-40 {
    width: 40px !important;
    height: auto;
}

.card {
    box-shadow: 0 1px 15px 1px rgba(52, 40, 104, .08);
}

.ui-product-color {
    display: inline-block;
    overflow: hidden;
    margin: .144em;
    width: .875rem;
    height: .875rem;
    border-radius: 10rem;
    -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
    vertical-align: middle;
}
</style>