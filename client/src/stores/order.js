import {defineStore} from "pinia";
import axios from "axios";
import {useToast} from "vue-toast-notification";

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
    }),
    getters: {
        getOrders: state => state.orders
    },
    actions: {
        fetchOrders() {
            axios.get('http://localhost:3000/orders')
                .then(orders => this.orders = orders.data)
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        fetchOrder(param) {
            axios.get(`http://localhost:3000/orders/${param}`)
                .then(order => this.orders = [order.data])
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        }
    }
})