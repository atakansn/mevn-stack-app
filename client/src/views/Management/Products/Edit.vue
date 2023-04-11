<script>
import Alert from '@/components/Alert.vue'
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {helpers, numeric, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useMainStore} from "../../../stores";
import {useProductStore} from "../../../stores/products";
import {useCategoryStore} from "../../../stores/categories";

export default {
    setup() {
        const mainStore = useMainStore()
        const productStore = useProductStore()
        const categoryStore = useCategoryStore()

        const route = useRoute()
        const image = reactive({
            src: '',
            view: false
        })
        const fileInput = ref(null)

        mainStore.button.text = 'Düzenle'

        onBeforeMount(() => productStore.fetchOneProduct(route.params.id))

        const product = computed(() => productStore.getProduct)


        const rules = computed(() => ({
            name: {
                required: helpers.withMessage('Bu alan zorunludur.', required)
            },
            category: {
                required: helpers.withMessage('Bu alan zorunludur.', required)
            },
            description: {
                required: helpers.withMessage('Bu alan zorunludur.', required)
            },
            price: {
                required: helpers.withMessage('Bu alan zorunludur.', required),
                numeric: helpers.withMessage('Bu alan rakam olmalıdır.', numeric)
            },
            image: {
                required: helpers.withMessage('Bu alan zorunludur.', required),
            }
        }))

        const v$ = useVuelidate(rules, product)

        const onFileSelected = () => {
            const files = fileInput.value.files
            if (files.length > 0) {
                const reader = new FileReader()
                reader.addEventListener('load', () => image.src = reader.result)
                image.view = true
                product.image = files[0]
                reader.readAsDataURL(files[0])
            }
        }

        const onUpdate = async () => {
            const checkValidation = await v$.value.$validate()
            if (!checkValidation) return
            await productStore.updateProduct({routeParam: route.params.id, newImage: product.image})
        }

        return {
            product,
            categories: computed(() => categoryStore.getCategories),
            button: computed(() => mainStore.getButton),
            alert: computed(() => mainStore.getAlert),
            image,
            onFileSelected,
            onUpdate,
            fileInput,
            v$
        }
    },
    components: {
        Alert
    },
}
</script>

<template>
    <h3>Ürün Düzenle</h3>
    <Alert :alert="alert"/>
    <form enctype="multipart/form-data" @submit.prevent="onUpdate">
        <div class="row g-3">
            <div class="col-sm-6">
                <label for="name" class="form-label">Ürün Adı</label>
                <input @blur="v$.name.$touch" type="text"
                       class="form-control"
                       id="name"
                       placeholder="Ürün Adı"
                       v-model="product.name"
                       :class="{'is-invalid': v$.name.$error}"
                >
                <div class="invalid-feedback" v-if="v$.name.$error">
                    {{ v$.name.$errors[0].$message }}
                </div>
            </div>

            <div class="col-sm-6">
                <label for="categories" class="form-label">Kategoriler</label>
                <select @blur="v$.category.$touch"
                        :class="{'is-invalid': v$.category.$error}"
                        v-model="product.category"
                        id="categories"
                        class="form-select">
                    <option :key="category._id"
                            v-for="category in categories"
                            :value="category._id"
                            :selected="category._id === product.category"
                    >
                        {{ category.name }}
                    </option>
                </select>
                <div class="invalid-feedback"
                     v-if="v$.category.$error"
                >
                    {{ v$.category.$errors[0].$message }}
                </div>
            </div>

            <div class="col-12">
                <label for="description"
                       class="form-label"
                >
                    Açıklama
                </label>
                <textarea @blur="v$.description.$touch"
                          :class="{'is-invalid': v$.description.$error}"
                          v-model="product.description"
                          rows="10"
                          cols="10"
                          class="form-control"
                          id="description"
                          placeholder="Ürün Açıklaması"
                >
                </textarea>
                <div class="invalid-feedback"
                     v-if="v$.description.$error">
                    {{ v$.description.$errors[0].$message }}
                </div>
            </div>

            <div class="col-6">
                <label for="image" class="form-label">Resim</label>
                <input type="file"
                       ref="fileInput"
                       @change="onFileSelected"
                       class="form-control"
                       id="image"
                       accept="image/jpeg, image/png"
                       :class="{'is-invalid': v$.image.$error}"
                >
                <div class="invalid-feedback" v-if="v$.description.$error">
                    {{ v$.description.$errors[0].$message }}
                </div>
                <picture v-if="!image.view">
                    <source :srcset="product.image" type="image/svg+xml">
                    <img :src="product.image" class="img-fluid img-thumbnail my-4" :alt="product.name">
                </picture>
                <picture v-else>
                    <source :srcset="image.src" type="image/svg+xml">
                    <img :src="image.src" class="img-fluid img-thumbnail my-4" alt="Yeni Ürün Resmi">
                </picture>
            </div>

            <div class="col-6">
                <label for="price" class="form-label">Fiyat</label>
                <input @blur="v$.price.$touch" :class="{'is-invalid': v$.price.$error}" v-model="product.price"
                       type="text" class="form-control" id="price" placeholder="Ürün Fiyatı">
                <div class="invalid-feedback" v-if="v$.price.$error">
                    {{ v$.price.$errors[0].$message }}
                </div>
            </div>
        </div>
        <button class="btn btn-dark" :disabled="button.disable">
            <span v-if="button.disable" class="spinner-border spinner-border-sm me-1" role="status"
                  aria-hidden="true"></span>
            {{ button.text }}
        </button>
    </form>
</template>