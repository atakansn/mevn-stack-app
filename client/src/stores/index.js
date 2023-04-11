import {defineStore} from "pinia";
import {useProductStore} from "./products";
import axios from 'axios'
import {useToast} from "vue-toast-notification";

export const useMainStore = defineStore('main', {
    state: ()=> ({
        isDelete: false,
        alert: {
            success: false,
            warning: false,
            message: '',
            show: false
        },
        pagination: {
            totalPage: 1,
            page: 1,
            limit: 8
        },
        button: {
            disable: false,
            text: ''
        },
        productsOfCategoryData: {},
        progress: {
            value: 0,
            view: false
        }
    }),
    getters: {
        getAlert: state => state.alert,
        getPagination: state => state.pagination,
        getButton: state => state.button,
        getIsDelete: state => state.isDelete,
        getProductsOfCategoryData: state => state.productsOfCategoryData,
        getProgress: state => state.progress,
    },
    actions: {
        onPageChanged(page) {
            let link = `http://localhost:3000/products`
            if (page) {
                link = `http://localhost:3000/products?page=${page}`
            }
            axios.get(link)
                .then(response => {
                    const product = useProductStore()
                    this.pagination.page = response.data.pagination.page
                    this.pagination.totalPage = response.data.pagination.totalPages
                    product.products = response.data.data
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        },
        productsOfCategory({routeParam, page}) {
            let link = `http://localhost:3000/categories/${routeParam}/products`
            if (page) {
                link = `http://localhost:3000/categories/${routeParam}/products?page=${page}`
            }

            axios.get(link)
                .then(response => {
                    this.pagination.page = response.data.pagination.page
                    this.pagination.totalPage = response.data.pagination.totalPages
                    this.productsOfCategoryData = response.data
                })
                .catch(err => {
                    useToast().error(err.message,{
                        position: 'top-right',
                        queue: true
                    })
                })
        }
    }
})