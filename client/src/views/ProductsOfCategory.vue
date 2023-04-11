<script setup>
import Pagination from "@/components/Pagination.vue";
import ProductItem from "@/components/ProductItem.vue";
import {computed, onMounted, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useMainStore} from "@/stores";

const mainStore = useMainStore()
const route = useRoute()

const productsByCategory = page => mainStore.productsOfCategory({routeParam: route.params.category, page})

onMounted(() => watchEffect(() => productsByCategory()))

const getProductsOfCategoryData = computed(() => mainStore.getProductsOfCategoryData)
const pagination = computed(() => mainStore.getPagination)
</script>

<template>
    <div class="container px-4 px-lg-5 my-5 min-vh-100">
        <h4 v-if="getProductsOfCategoryData?.data?.length !== 0"
            class="my-5">
            {{ getProductsOfCategoryData.category }} kategorisine ait ürünler
        </h4>
        <div v-if="getProductsOfCategoryData.length !== 0"
             class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
            <ProductItem :products="getProductsOfCategoryData.data"/>
        </div>
        <Pagination
                @pageChanged="productsByCategory"
                :current-page="pagination.page"
                :total-pages="pagination.totalPage"
                :max-visible-buttons="3"
        />
        <div v-if="getProductsOfCategoryData?.data?.length === 0" class="mx-5">
            <h3 class="text-center">{{getProductsOfCategoryData.category}} kategorisine ait ürün bulunamadı.</h3>
        </div>
    </div>
</template>