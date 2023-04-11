<script setup>
import {computed, onMounted} from "vue";
import {useOrderStore} from "@/stores/order";

const orderStore = useOrderStore()

onMounted(async () => await orderStore.fetchOrders())

const orders = computed(() => orderStore.getOrders)
</script>

<template>
    <div class="container px-4 px-lg-5 my-4 min-vh-100">
        <h2>Siparişler</h2>

        <table class="table mt-3">
            <thead>
            <tr>
                <th>Sipariş Numarası</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Sipariş Tarihi</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders">
                <td class="align-middle">
                    <RouterLink :to="{name:'order-detail',params:{order_number: order.order_number}}">
                        {{ order.order_number }}
                    </RouterLink>
                </td>
                <td class="align-middle">{{ order.user.firstName }} {{ order.user.lastName }}</td>
                <td class="align-middle">{{ order.user.email }}</td>
                <td class="align-middle">{{ order.createdAt }}</td>
            </tr>
            </tbody>
            <caption v-if="orders.length === 0">
                <h3 class="fw-light text-dark">Kullanıcının siparişi bulunmamaktadır.</h3>
            </caption>
        </table>
    </div>
</template>