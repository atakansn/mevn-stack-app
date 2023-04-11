import {defineStore} from "pinia";
import {useMainStore} from "./index";
import axios from 'axios'
import {useToast} from "vue-toast-notification";

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        category: '',
        categoriesPaginateData: []
    }),
    getters: {
        getCategories: state => state.categories,
        getCategoriesPaginate: state => state.categoriesPaginateData,
        getCategory: state => state.category
    },
    actions: {
        categoryPaginate(page) {
            const mainStore = useMainStore()

            let endpoint = `http://localhost:3000/categories/paginate`
            if (page) {
                endpoint = `http://localhost:3000/categories/paginate?page=${page}`
            }
            axios.get(endpoint)
                .then(categories => {
                    mainStore.pagination.totalPage = categories.data.pagination.totalPages
                    mainStore.pagination.page = categories.data.pagination.page
                    this.categoriesPaginateData = categories.data.data
                })
                .catch(err => {
                    useToast().error(err.message, {
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        fetchCategories() {
            axios.get('http://localhost:3000/categories')
                .then(categories => this.categories = categories.data)
                .catch(err => {
                    useToast().error('Sunucu Kaynaklı hata oluştu lütfen tekrar deneyin.', {
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        fetchOneCategory(id) {
            axios.get(`http://localhost:3000/categories/${id}`)
                .then(response => this.category = response.data.name)
                .catch(err => {
                    useToast().error(err.message, {
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        onAddCategory(data) {
            const mainStore = useMainStore()

            mainStore.button.disable = true
            mainStore.button.text = 'Kaydediliyor'
            axios.post('http://localhost:3000/categories', {name: data})
                .then(response => {
                    mainStore.alert.success = true
                    mainStore.button.text = 'Kaydedildi'
                    mainStore.alert.message = response.data.message
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Kaydet'
                    }, 2500)
                })
                .catch(error => {
                    mainStore.button.text = 'İptal Ediliyor'
                    if (error.response.data.error) {
                        mainStore.alert.message = error.response.data.error.message[0]
                    } else {
                        mainStore.alert.message = error.response.data.message
                    }
                    mainStore.alert.warning = true
                    setTimeout(() => {
                        mainStore.alert.warning = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Kaydet'
                    }, 2000)
                })
        },
        onEditCategory({id, data}) {
            const mainStore = useMainStore()

            mainStore.button.disable = true
            mainStore.button.text = 'Düzenleniyor'
            axios.patch(`http://localhost:3000/categories/${id}`, {name: data})
                .then(response => {
                    mainStore.alert.success = true
                    mainStore.button.text = 'Düzenlendi'
                    mainStore.button.disable = true
                    mainStore.alert.message = response.data.message
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Düzenle'
                    }, 2000)
                })
                .catch(error => {
                    mainStore.button.text = 'İptal Ediliyor'
                    mainStore.alert.warning = true
                    if (error.response.data.error) {
                        mainStore.alert.message = error.response.data.error.message[0]
                    } else {
                        mainStore.alert.message = error.response.data.message
                    }
                    setTimeout(() => {
                        mainStore.alert.warning = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Düzenle'
                    }, 2000)

                })
        },
        deleteCategory({id, index}) {
            const mainStore = useMainStore()

            mainStore.isDelete = true

            axios.delete(`http://localhost:3000/categories/${id}`, {
                onUploadProgress: progressEvent => {
                    mainStore.progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    mainStore.progress.view = true

                },
            })
                .then(response => {
                    mainStore.alert.success = true
                    mainStore.alert.message = response.data.message
                    this.categories.splice(index, 1)
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.isDelete = false
                    }, 2000)
                })
                .catch(err => {
                    useToast().error(err.message, {
                        position: 'top-right',
                        queue: true
                    })
                })
                .finally(() => {
                    mainStore.progress.value = 0
                    mainStore.progress.view = false
                })
        }
    }
})