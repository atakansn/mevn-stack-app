import {defineStore} from "pinia";
import {useMainStore} from "./index";
import axios from "axios";
import {useToast} from "vue-toast-notification";

export const useProductStore = defineStore('product',{
    state: () => ({
        products: [],
        product: {},
        productOfCategories: [],
        errors: []
    }),
    getters: {
        getProducts: (state) => state.products,
        getProduct: state => state.product,
        shuffledProducts: state => {
            return state.productOfCategories
                .slice(0, 4)
                .sort(() =>  Math.random() - 0.5)
        },
    },
    actions: {
        addProduct(product) {
            const mainStore = useMainStore()

            mainStore.button.disable = true
            mainStore.button.text = 'Kaydediliyor...'

            const formData = new FormData
            formData.append('name', product.name)
            formData.append('category', product.category)
            formData.append('description', product.description)
            formData.append('price', product.price)
            formData.append('image', product.image)

            axios.post('http://localhost:3000/products', formData)
                .then(response => {
                    mainStore.alert.success = true
                    mainStore.button.text = 'Kayıt Edildi.'
                    mainStore.button.disable = true
                    mainStore.alert.message = response.data.message
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Kayıt Et'
                    }, 2000)
                })
                .catch(error => {
                    console.log(error)
                    mainStore.button.text = 'İptal Ediliyor'
                    mainStore.alert.warning = true
                    mainStore.alert.message = error.response.data.error.message
                    setTimeout(() => {
                        mainStore.alert.warning = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Kayıt Et'
                    }, 2000)
                })

        },
        updateProduct({routeParam, newImage}) {
            const mainStore = useMainStore()

            mainStore.button.disable = true
            mainStore.button.text = 'Düzenleniyor...'
            const formData = new FormData
            formData.append('name', this.product.name)
            formData.append('category', this.product.category)
            formData.append('description', this.product.description)
            formData.append('price', this.product.price)

            if (newImage) {
                formData.append('image', newImage)
            }

            axios.patch(`http://localhost:3000/products/${routeParam}`, formData)
                .then(response => {
                    mainStore.alert.success = true
                    mainStore.button.text = 'Düzenlendi'
                    mainStore.alert.message = response.data.message
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Düzenle'
                    }, 2500)
                })
                .catch(error => {
                    mainStore.button.text = 'İptal Ediliyor'
                    mainStore.alert.warning = true
                    mainStore.alert.message = error.response.data.error.message
                    setTimeout(() => {
                        mainStore.alert.warning = false
                        mainStore.button.disable = false
                        mainStore.button.text = 'Düzenle'
                    }, 2500)
                })
        },
        deleteProduct({id,index}) {
            const mainStore = useMainStore()
            mainStore.isDelete = true
            axios.delete(`http://localhost:3000/products/${id}`)
                .then(response => {
                    this.products.splice(index, 1)
                    mainStore.alert.success = true
                    mainStore.alert.message = response.data.message
                    setTimeout(() => {
                        mainStore.alert.success = false
                        mainStore.isDelete = false
                    }, 2500)
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        getProductWithCategory(routeParam) {
            axios.get(`http://localhost:3000/products/${routeParam}/detail`)
                .then(response => {
                    this.product = response.data.product
                    this.productOfCategories = response.data.productByCategory
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        fetchOneProduct(routeParam) {
            axios.get(`http://localhost:3000/products/${routeParam}`)
                .then(response => this.product = response.data)
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
    }
})