<script>
import Alert from '@/components/Alert.vue'
import {useVuelidate} from "@vuelidate/core";
import {required, numeric, helpers} from "@vuelidate/validators";
import {computed, reactive, ref} from "vue";
import {useProductStore} from "../../../stores/products";
import {useMainStore} from "../../../stores";
import {useCategoryStore} from "../../../stores/categories";

export default {
    setup() {
        const mainStore = useMainStore()
        const productStore = useProductStore()
        const categoryStore = useCategoryStore()

       mainStore.button.text = 'Kaydet'

        const fileInput = ref(null)

        const product = reactive({
            name: '',
            category: '',
            description: '',
            image: '',
            price: '',
        })
        const image = reactive({
            view: false,
            src: ''
        })
        const imageError = reactive([])

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
                required: helpers.withMessage('Bu alan zorunludur.', required)
            }
        }))

        const v$ = useVuelidate(rules, product)

        const onFileSelected = async () => {
            const files = fileInput.value.files
            if (files.length > 0) {
                const reader = new FileReader()
                reader.addEventListener('load', () => image.src = reader.result)
                image.view = true
                product.image = files[0]
                reader.readAsDataURL(files[0])
            }
        }

        const addProduct = async () => {
            const checkValidation = await v$.value.$validate()
            if (!checkValidation) return
            await productStore.addProduct(product)
        }

        return {
            alert: computed(() => mainStore.getAlert),
            button: computed(() => mainStore.getButton),
            categories: computed(() => categoryStore.getCategories),
            product,
            image,
            imageError,
            addProduct,
            onFileSelected,
            v$,
            fileInput
        }
    },
    components: {
        Alert
    },
}
</script>

<template>
    <h3>Ürün Ekle</h3>
    <Alert :alert="alert"/>
    <form enctype="multipart/form-data" @submit.prevent="addProduct">
        <div class="row g-3">
            <div class="col-sm-6">
                <label for="name" class="form-label">Ürün Adı</label>
                <input v-model.trim="product.name"
                       :class="{'is-invalid': v$.name.$error}"
                       @blur="v$.name.$touch"
                       type="text"
                       class="form-control"
                       id="name"
                       placeholder="Ürün Adı">
                <div class="invalid-feedback" v-if="v$.name.$error">
                    {{ v$.name.$errors[0].$message }}
                </div>
            </div>

            <div class="col-sm-6">
                <label for="categories" class="form-label">Kategoriler</label>
                <select v-model="product.category"
                        @blur="v$.name.$touch"
                        id="categories"
                        class="form-select"
                        :class="{'is-invalid': v$.category.$error}">
                    <option selected value disabled>Kategori Seçimi</option>
                    <option :value="category._id"
                            :key="category._id"
                            v-for="category in categories">
                        {{ category.name }}
                    </option>
                </select>
                <div class="invalid-feedback" v-if="v$.category.$error">
                    {{ v$.category.$errors[0].$message }}
                </div>
            </div>

            <div class="col-12">
                <label for="description" class="form-label">Açıklama</label>
                <textarea :class="{'is-invalid': v$.description.$error}"
                          @blur="v$.description.$touch"
                          v-model.trim="product.description"
                          class="form-control"
                          id="description"
                          placeholder="Ürün Açıklaması"
                          rows="10"
                          cols="10"
                >
                </textarea>
                <div class="invalid-feedback" v-if="v$.description.$error">
                    {{ v$.description.$errors[0].$message }}
                </div>
            </div>

            <div class="col-6">
                <label for="image" class="form-label">Resim</label>
                <input type="file"
                       ref="fileInput"
                       @change="onFileSelected"
                       class="form-control"
                       :class="{'is-invalid': v$.image.$error}"
                       id="image"
                       accept="image/jpeg, image/png"
                >
                <div class="invalid-feedback" v-if="v$.image.$error">
                    {{ v$.image.$errors[0].$message }}
                </div>
                <picture>
                    <source :srcset="image.src" type="image/svg+xml">
                    <img v-if="image.view" :src="image.src" class="img-fluid img-thumbnail my-4" alt="Yeni Ürün Resmi">
                </picture>
            </div>

            <div class="col-6">
                <label for="price" class="form-label">Fiyat</label>
                <input :class="{'is-invalid': v$.price.$error}"
                       @blur="v$.price.$touch"
                       v-model.number="product.price"
                       type="text"
                       class="form-control"
                       id="price"
                       placeholder="Ürün Fiyatı">
                <div class="invalid-feedback" v-if="v$.price.$error">
                    {{ v$.price.$errors[0].$message }}
                </div>
            </div>
        </div>
        <button class="btn btn-dark" :disabled="button.disable" :class="{'mt-3': !image.view}">
            <span v-if="button.disable" class="spinner-border spinner-border-sm me-1" role="status"
                  aria-hidden="true"></span>
            {{ button.text }}
        </button>
    </form>
</template>