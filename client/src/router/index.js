import {createRouter, createWebHistory} from 'vue-router'
import ProductDetail from "@/views/ProductDetail.vue";
import Home from "@/views/Home.vue";
import Cart from "@/views/Cart.vue";
import Checkout from "@/views/Checkout.vue";
import Orders from "@/views/Order/Index.vue";
import Index from "@/views/Management/Index.vue";
import ProductIndex from "@/views/Management/Products/Index.vue"
import ProductCreate from "@/views/Management/Products/Create.vue"
import ProductEdit from "@/views/Management/Products/Edit.vue"
import CategoryIndex from "@/views/Management/Categories/Index.vue"
import CategoryCreate from "@/views/Management/Categories/Create.vue"
import CategoryEdit from "@/views/Management/Categories/Edit.vue"
import ProductsOfCategory from "@/views/ProductsOfCategory.vue";
import OrderComplete from "@/views/Order/Complete.vue";
import OrderDetail from "@/views/Order/Detail.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'notfound',
            component: NotFound,
            path: '/:pathMath(.*)*'
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/product/:slug',
            component: ProductDetail,
            name: 'product-detail'
        },
        {
            path: '/order-detail/:order_number',
            component: OrderDetail,
            name: 'order-detail'
        },
        {
            path: '/cart',
            component: Cart
        },
        {
            path: '/order-complete',
            component: OrderComplete
        },
        {
            path: '/checkout',
            component: Checkout
        },
        {
            path: '/orders',
            component: Orders
        },
        {
            path: '/management',
            component: Index,
            children: [
                {path: 'products', component: ProductIndex, name: 'product-index'},
                {path: 'product/create', component: ProductCreate, name: 'product-create'},
                {path: 'product/:id/edit', component: ProductEdit, name: 'product-edit'},

                {path: 'categories', component: CategoryIndex, name: 'category-index'},
                {path: 'category/create', component: CategoryCreate, name: 'category-create'},
                {path: 'category/:id/edit', component: CategoryEdit, name: 'category-edit'},
            ]
        },
        {
            path: '/categories/:category',
            component: ProductsOfCategory,
            name: 'products-of-the-category'
        }
    ]
})

export default router
