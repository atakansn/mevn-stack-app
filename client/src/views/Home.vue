<script setup>
import ProductItem from "@/components/ProductItem.vue";
import Pagination from "@/components/Pagination.vue";
import {computed, onMounted, watchEffect} from "vue";
import {useMainStore} from "@/stores";
import {useProductStore} from "@/stores/products";

const store = useMainStore()
const productStore = useProductStore()

const pageChange = page => store.onPageChanged(page)

onMounted(() => watchEffect(() => pageChange()))

const pagination = computed(() => store.getPagination)
const products = computed(() => productStore.getProducts)

</script>

<template>
    <section class="py-4 min-vh-100">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 d-flex justify-content-center"
                 style="min-height: 600px;">
                <ProductItem :products="products"/>
            </div>
            <Pagination :total-pages="pagination.totalPage"
                        :current-page="pagination.page"
                        @pageChanged="pageChange"
            />
        </div>
    </section>
</template>