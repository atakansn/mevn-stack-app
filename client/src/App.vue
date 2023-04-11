<script setup>
import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import {useCategoryStore} from "./stores/categories";
import {useMainStore} from "./stores";

const categoryStore = useCategoryStore()
const mainStore = useMainStore()

onMounted(async () => await categoryStore.fetchCategories())
</script>

<template>
    <Navbar/>
    <Header/>
    <RouterView/>
    <Footer/>
</template>
