<script setup>
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useOrderStore} from "@/stores/order";

const orderStore = useOrderStore()
const route = useRoute()

onMounted(async () => await orderStore.fetchOrder(route.params.order_number))

const order = computed(() => orderStore.getOrders[0])

</script>

<template>
    <div class="container my-5">
        <h1 class="mb-4">Sipariş Detayı</h1>
        <div class="row">
            <div class="col-md-6">
                <h4>Sipariş Bilgisi</h4>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Sipariş Numarası</strong>
                        <span>#{{ order?.order_number }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Sipariş Tarihi</strong>
                        <span>{{ order?.createdAt }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Ödeme Türü</strong>
                        <span>{{ order?.payment_method }}</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h4>Fatura Bilgisi</h4>
                <ul class="list-group" v-if="order?.user !== 'undefined'">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Ad
                        <span>{{ order?.user?.firstName }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Adres
                        <span>{{ order?.billing_information?.address }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Şehir
                        <span>{{ order?.billing_information?.city }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Ülke
                        <span>{{ order?.billing_information?.country }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-md-12">
                <h4>Sipariş Öğeleri</h4>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">Ürün Adı</th>
                        <th scope="col">Adet</th>
                        <th scope="col">Fiyat</th>
                        <th scope="col">Toplam</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="data in order?.products">
                        <td>{{ data.name }}</td>
                        <td>{{ data.count }}</td>
                        <td>{{ data.price }} TL</td>
                        <td>{{ currencyFormat(data.price * data.count) }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="3" class="text-end">Toplam</th>
                        <td>{{ currencyFormat(order?.totalPrice) }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>