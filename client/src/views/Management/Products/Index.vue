<script>
import Pagination from "@/components/Pagination.vue";
import Alert from "@/components/Alert.vue";
import {computed, onMounted, watchEffect} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "../../../stores";
import {useProductStore} from "../../../stores/products";

export default {
    setup() {
        const mainStore = useMainStore()
        const productStore = useProductStore()
        const router = useRouter()

        const pageChange = page => mainStore.onPageChanged(page)

        const deleteProduct = ({id, index}) => productStore.deleteProduct({id, index})

        onMounted(() => watchEffect(() => pageChange()))

        return {
            router,
            deleteProduct,
            pageChange,
            products: computed(() => productStore.getProducts),
            alert: computed(() => mainStore.getAlert),
            pagination: computed(() => mainStore.getPagination),
            isDelete: computed(() => mainStore.getIsDelete)
        }
    },
    components: {
        Pagination,
        Alert
    }
}
</script>

<template>
    <h3>Ürünler</h3>
    <Alert :alert="alert"/>
    <button class="btn btn-dark my-3"
            @click="router.push('/management/product/create')">
        Ürün Ekle
    </button>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Ürün Adı</th>
            <th scope="col">Aksiyon</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product,index) in products">
            <td>{{ product.name }}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2"
                        @click="router.push(`/management/product/${product._id}/edit`)"
                >
                    <i class="bi bi-pen-fill"></i>
                </button>
                <button :disabled="isDelete" class="btn btn-sm btn-danger"
                        @click="deleteProduct({id: product._id, index})"
                >
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        </tbody>
    </table>
    <Pagination
            :current-page="pagination.page"
            :total-pages="pagination.totalPage"
            @pageChanged="pageChange"
    />
</template>