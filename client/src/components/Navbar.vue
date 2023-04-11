<script setup>
import {computed, onBeforeMount} from "vue";
import ProgressBar from "@/components/ProgressBar.vue";
import {useCategoryStore} from "../stores/categories";
import {useMainStore} from "../stores";
import {useCartStore} from "../stores/cart";

const categoryStore = useCategoryStore()
const mainStore = useMainStore()
const cartStore = useCartStore()

const categories = computed(() => categoryStore.getCategories)
const progress = computed(() => mainStore.getProgress)
const cartQuantity = computed(() => cartStore.getCart.length)
</script>

<template>
    <ProgressBar :progress="progress"/>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container px-4 px-lg-5">
            <RouterLink class="navbar-brand" :to="{path:'/'}">MEVN Stack Sepet</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span
                    class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button"
                           data-bs-toggle="dropdown"
                           aria-expanded="false">Kategoriler</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-for="(category,index) in categories" :key="index">
                                <RouterLink class="dropdown-item"
                                            :to="{name:'products-of-the-category',params:{category:category.slug}}">
                                    {{ category.name }}
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                    <RouterLink :to="{path:'/orders'}" class="nav-link" active-class="active" tag="li">
                        Siparişlerim
                    </RouterLink>
                    <RouterLink :to="{path:'/management/categories'}" class="nav-link" active-class="active" tag="li">
                        Yönetim
                    </RouterLink>
                </ul>
                <div class="d-flex">
                    <RouterLink :to="{path:'/cart'}" class="btn btn-outline-dark">
                        <i class="bi-cart-fill me-1"></i>
                        Sepet
                        <span class="badge bg-dark text-white ms-1 rounded-pill">{{ cartQuantity ?? 0}}</span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
</template>