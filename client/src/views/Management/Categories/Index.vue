<script setup>
import Alert from "@/components/Alert.vue";
import Pagination from "@/components/Pagination.vue";
import {computed, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "@/stores";
import {useCategoryStore} from "@/stores/categories";

const mainStore = useMainStore()
const categoryStore = useCategoryStore()
const router = useRouter()

const deleteCategory = (categoryId, index) => categoryStore.deleteCategory({
    id: categoryId,
    index
})

const changePage = page => categoryStore.categoryPaginate(page)

onBeforeMount(() => changePage())

const alert = computed(() => mainStore.getAlert)
const isDelete = computed(() => mainStore.getIsDelete)
const pagination = computed(() => mainStore.getPagination)
const getCategories = computed(() => categoryStore.getCategoriesPaginate)
</script>

<template>
    <h3>Kategoriler</h3>
    <Alert :alert="alert"/>
    <button class="btn btn-dark my-3" @click="router.push('/management/category/create')">Kategori Ekle</button>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Kategori</th>
            <th scope="col">Aksiyon</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(category, index) in getCategories" :key="index">
            <td>{{ category.name }}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2"
                        @click="router.push(`/management/category/${category._id}/edit`)">
                    <i class="bi bi-pen-fill"></i>
                </button>
                <button :disabled="isDelete" class="btn btn-sm btn-danger"
                        @click="deleteCategory(category._id,index)">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        </tbody>
    </table>
    <Pagination @pageChanged="changePage"
                :total-pages="pagination.totalPage"
                :current-page="pagination.page"/>
</template>