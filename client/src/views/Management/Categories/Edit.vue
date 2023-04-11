<script>
import Alert from '@/components/Alert.vue'
import {useRoute} from "vue-router";
import {computed, onBeforeMount} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {alpha, helpers, minLength, required} from "@vuelidate/validators";
import {useMainStore} from "@/stores";
import {useCategoryStore} from "@/stores/categories";

export default {
    setup() {
        const mainStore = useMainStore()
        const categoryStore = useCategoryStore()

        const route = useRoute()
        mainStore.button.text = 'Düzenle'

        const rules = {
            categoryName: {
                required: helpers.withMessage('Bu alan zorunludur.', required),
                alpha: helpers.withMessage('Bu alan alfa(a-zA-Z) karakterler içermelidir.', alpha),
                minLength: helpers.withMessage('Minimum 4 karakterli olmalıdır.', minLength(4))
            }
        }

        const categoryName = computed({
            set(value) {
                categoryStore.category = value
            },
            get() {
                return categoryStore.getCategory
            }
        })

        const v$ = useVuelidate(rules, {categoryName})

        const onUpdate = async () => {
            const checkValidate = await v$.value.$validate()
            if (!checkValidate) return
            await categoryStore.onEditCategory({id: route.params.id, data: categoryName.value})
        }

        onBeforeMount(async () => await categoryStore.fetchOneCategory(route.params.id))

        return {
            alert: computed(() => mainStore.getAlert),
            button: computed(() => mainStore.getButton),
            onUpdate,
            categoryName,
            v$
        }
    },
    components: {
        Alert
    }
}
</script>

<template>
    <h3>Kategori Düzenle</h3>
    <Alert :alert="alert"/>
    <form @submit.prevent="onUpdate" class="mt-3">
        <div class="row g-3">
            <div class="col-sm-12">
                <label for="category_name" class="form-label">Kategori Adı</label>
                <input @blur="v$.categoryName.$touch"
                       v-model="categoryName"
                       type="text"
                       class="form-control"
                       :class="{'is-invalid': v$.categoryName.$error}"
                       id="category_name">
                <div class="invalid-feedback"
                     v-if="v$.categoryName.$error">
                    {{ v$.categoryName.$errors[0].$message }}
                </div>
            </div>
        </div>
        <button class="btn btn-dark mt-3"
                :disabled="button.disable">
            <span v-if="button.disable"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true">
            </span>
            {{ button.text }}
        </button>
    </form>
</template>