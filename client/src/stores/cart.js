import {defineStore} from "pinia";
import {useMainStore} from "./index";
import axios from "axios";
import {useToast} from "vue-toast-notification";
import {reactive} from "vue";

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
        totalPrice: 0,
        isEmpty: false,
        error: []
    }),
    getters: {
        getIsEmpty: state => state.isEmpty,
        getCart: state => state.cart,
        calculateTotalPrice: state => state.cart.reduce((total, item) => total + item.count * item.price, 0),
    },
    actions: {
        fetchCart() {
            axios.get('http://localhost:3000/cart')
                .then(response => {
                    if (response.data.cart) {
                        this.cart = response.data.cart
                        this.totalPrice = response.data.cardTotalPrice
                        this.isEmpty = false
                    }

                    if (!response.data.cart || response.data.cart.length === 0) {
                        this.isEmpty = true
                    }
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        addCart({product, count}) {
            const mainStore = useMainStore()

            mainStore.button.disable = true
            mainStore.button.text = 'Sepete Ekleniyor'

            const config = {
                withCredentials: true,
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    mainStore.progress.value = percentCompleted
                    mainStore.progress.view = true
                },
            }

            axios.post('http://localhost:3000/cart', {product, count}, config)
                .then(response => {
                    setTimeout(response => {
                        mainStore.button.disable = false
                        mainStore.button.text = 'Sepete Ekle'
                    }, 1500)
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
                .finally(() => {
                    mainStore.progress.value = 0
                    mainStore.progress.view = false
                })
        },
        removeFromCart(item) {
            const indexItem = this.cart.indexOf(item)
            return this.cart.splice(indexItem, 1)
        },
        changeCount(product) {
            const mainStore = useMainStore()
            const config = {
                withCredentials: true,
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    mainStore.progress.value = percentCompleted
                    mainStore.progress.view = true
                },
            }
            axios.post('http://localhost:3000/cart/change', {product},config)
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
        },
        deleteProduct(product) {
            axios.post('http://localhost:3000/cart/delete', {product})
                .catch(err => {
                    useToast().error(err.message, {
                        position: 'top-right',
                        queue: true
                    })
                })
        },
    }
})