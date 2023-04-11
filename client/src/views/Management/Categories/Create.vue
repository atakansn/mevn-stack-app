<script>
import Alert from '@/components/Alert.vue'
import {computed, ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, helpers} from "@vuelidate/validators";
import {useCategoryStore} from "@/stores/categories";
import {useMainStore} from "@/stores";

export default {
    setup() {
        const categoryStore = useCategoryStore()
        const mainStore = useMainStore()

        const categoryName = ref('')
        mainStore.button.text = 'Kaydet'

        const rules = {
            categoryName: {
                required: helpers.withMessage('Bu alan zorunludur.', required),
                minLength: helpers.withMessage('Minimum 4 karakterli olmalıdır.', minLength(4))
            }
        }

        const v$ = useVuelidate(rules, {categoryName})

        const addCategory = async () => {
            const checkValidate = await v$.value.$validate()
            if (!checkValidate) return
            await categoryStore.onAddCategory(categoryName.value)
        }

        return {
            alert: computed(() => mainStore.getAlert),
            button: computed(() => mainStore.getButton),
            categoryName,
            addCategory,
            v$
        }
    },
    components: {
        Alert
    },
}
</script>

<template>
    <h3>Kategori Ekle</h3>
    <Alert :alert="alert"/>
    <form @submit.prevent="addCategory" class="mt-3 needs-validation">
        <div class="row g-3">
            <div class="col-sm-12">
                <label for="firstName" class="form-label">Kategori Adı</label>
                <input @blur="v$.categoryName.$touch"
                       v-model="categoryName"
                       type="text"
                       class="form-control"
                       :class="{'is-invalid': v$.categoryName.$error}"
                       id="firstName"
                       placeholder="Kategori Adı">
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