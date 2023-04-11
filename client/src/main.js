import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import VueCookies from 'vue-cookies'
import axios from 'axios'
import directives from "@/composables/directives";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-toast-notification/dist/theme-sugar.css'

axios.defaults.withCredentials = true

const app = createApp(App)

app.config.globalProperties.currencyFormat = value => new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
}).format(value)

app.directive('credit-cart-number', directives.cardNumber)
app.directive('credit-card-exp', directives.cardExp)
app.directive('credit-card-ccv', directives.cardCCV)

app.use(VueCookies)
app.use(router)
app.use(createPinia())

app.mount('#app')
