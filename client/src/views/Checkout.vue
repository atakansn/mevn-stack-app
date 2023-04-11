<script>
import axios from "axios";
import {computed, inject, reactive} from "vue";
import {useRouter} from "vue-router";
import {required, minLength, email, maxLength, numeric} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useMainStore} from "@/stores";
import {useCartStore} from "@/stores/cart";

export default {
    setup() {
        const router = useRouter()
        const mainStore = useMainStore()
        const cartStore = useCartStore()
        const $cookies = inject('$cookies')

        mainStore.button.text = 'Siparişi Tamamla'

        const checkout = reactive({
            user: {
                firstName: '',
                lastName: '',
                email: '',
            },
            billing_information: {
                address1: '',
                address2: '',
                country: '',
                city: '',
                zip: '',
            },
            payment: {
                payment_method: 'Kredi Kartı',
                cc_name: '',
                cc_number: '',
                cc_expiration: '',
                cc_ccv: ''
            }
        })

        const rules = computed(() => {
            const localeRules = {
                user: {
                    firstName: {
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(50),
                    },
                    lastName: {
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(50),
                    },
                    email: {
                        required,
                        maxLength: maxLength(255),
                        email
                    },
                },
                billing_information: {
                    address1: {
                        required,
                        minLength: maxLength(50),
                    },
                    address2: {
                        minLength: maxLength(50),
                    },
                    country: {
                        required,
                        maxLength: maxLength(30),
                    },
                    city: {
                        required,
                        maxLength: maxLength(30),
                    },
                    zip: {
                        required,
                        maxLength: maxLength(10),
                        numeric
                    }
                }
            }


            if (checkout.payment.payment_method === 'Kredi Kartı') {
                localeRules.payment = {
                    cc_name: {
                        required,
                        maxLength: maxLength(25)
                    },
                    cc_number: {
                        required
                    },
                    cc_expiration: {
                        required
                    },
                    cc_ccv: {
                        required
                    },
                }
            }

            return localeRules
        })

        const v$ = useVuelidate(rules, checkout)

        const getCart = () => cartStore.fetchCart()

        const shortDescription = text => {
            if (text.length > 30) {
                return text.slice(0, 30) + '...'
            }
            return text
        }

        const onSubmit = async () => {

            mainStore.button.text = 'Sipariş Alınıyor'
            mainStore.button.disable = true

            const checkValidate = await v$.value.$validate()

            if (!checkValidate) {
                mainStore.button.text = 'Sipariş Tamamlandı'
                mainStore.button.disable = false
                return
            }

            axios.post('http://localhost:3000/orders', {
                order: {
                    user: checkout.user,
                    billing_information: checkout.billing_information,
                    payment_method: checkout.payment.payment_method,
                    products: cartStore.getCart,
                    totalPrice: cartStore.calculateTotalPrice
                }
            })
                .then(() => {
                    setTimeout(() => {
                        mainStore.button.text = 'Sipariş Tamamlandı'
                        mainStore.button.disable = false
                    }, 2000)
                    $cookies.set('_complete', true)
                    router.push('/order-complete')
                })
                .catch(err => console.log(err))
        }

        getCart()

        return {
            checkout,
            shortDescription,
            onSubmit,
            getButton: computed(() => mainStore.getButton),
            getCart: computed(() => cartStore.getCart),
            cartTotalPrice: computed(() => cartStore.calculateTotalPrice),
            v$
        }
    },
}
</script>

<template>
    <div class="container px-4 px-lg-5 my-5">
        <div class="row g-5">
            <div class="col-md-5 col-lg-4 order-md-last">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-dark">Sepetiniz</span>
                    <span class="badge bg-dark rounded-pill">{{ getCart.length }}</span>
                </h4>
                <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-sm" v-for="data in getCart">
                        <div>
                            <h6 class="my-0">{{ data.name }} (x{{ data.count }})</h6>
                            <small class="text-muted">{{ shortDescription(data.description) }}</small>
                        </div>
                        <span class="text-muted">{{ currencyFormat(data.price * data.count) }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Toplam (TL)</span>
                        <strong>{{ currencyFormat(cartTotalPrice) }}</strong>
                    </li>
                </ul>

            </div>
            <div class="col-md-7 col-lg-8">
                <h4 class="mb-3">Fatura Bilgileri</h4>
                <form @submit.prevent="onSubmit">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="firstName" class="form-label">Ad</label>
                            <input @blur="v$.user.firstName.$touch"
                                   :class="{'is-invalid': v$.user.firstName.$error}"
                                   v-model="checkout.user.firstName"
                                   type="text"
                                   class="form-control"
                                   id="firstName"
                                   placeholder="Ad"
                            >
                            <div class="invalid-feedback"
                                 v-if="v$.user.firstName.$error">
                                {{ v$.user.firstName.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <label for="lastName" class="form-label">Soyadınız</label>
                            <input @blur="v$.user.lastName.$touch"
                                   :class="{'is-invalid': v$.user.lastName.$error}"
                                   v-model="checkout.user.lastName"
                                   type="text"
                                   class="form-control"
                                   id="lastName"
                                   placeholder="Soyad"
                            >
                            <div class="invalid-feedback"
                                 v-if="v$.user.lastName.$error">
                                {{ v$.user.lastName.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="email" class="form-label">E-posta</label>
                            <input @blur="v$.user.email.$touch"
                                   :class="{'is-invalid': v$.user.email.$error}"
                                   v-model="checkout.user.email"
                                   type="email"
                                   class="form-control"
                                   id="email"
                                   placeholder="mail@ornek.com">
                            <div class="invalid-feedback"
                                 v-if="v$.user.email.$error">
                                {{ v$.user.email.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="address" class="form-label">Adres</label>
                            <input @blur="v$.billing_information.address1.$touch"
                                   :class="{'is-invalid': v$.billing_information.address1.$error}"
                                   v-model="checkout.billing_information.address1"
                                   type="text"
                                   class="form-control"
                                   id="address"
                                   placeholder="Zamazingo mahallesi bilmem ne sokak">
                            <div class="invalid-feedback"
                                 v-if="v$.billing_information.address1.$error">
                                {{ v$.billing_information.address1.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="address2" class="form-label">Adres 2 <span
                                    class="text-muted">(İsteğe Bağlı)</span></label>
                            <input @blur="v$.billing_information.address2.$touch"
                                   :class="{'is-invalid': v$.billing_information.address2.$error}"
                                   v-model="checkout.billing_information.address2"
                                   type="text"
                                   class="form-control"
                                   id="address2"
                                   placeholder="Aparmant Blok 2">
                            <div class="invalid-feedback"
                                 v-if="v$.billing_information.address2.$error">
                                {{ v$.billing_information.address2.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-5">
                            <label for="country" class="form-label">Ülke</label>
                            <input @blur="v$.billing_information.country.$touch"
                                   :class="{'is-invalid': v$.billing_information.country.$error}"
                                   v-model="checkout.billing_information.country"
                                   type="text"
                                   class="form-control"
                                   id="country"
                                   placeholder="Ülke">
                            <div class="invalid-feedback"
                                 v-if="v$.billing_information.country.$error">
                                {{ v$.billing_information.country.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label for="city" class="form-label">Şehir</label>
                            <input @blur="v$.billing_information.city.$touch"
                                   :class="{'is-invalid': v$.billing_information.city.$error}"
                                   v-model="checkout.billing_information.city"
                                   type="text"
                                   class="form-control"
                                   id="city"
                                   placeholder="Şehir">
                            <div class="invalid-feedback"
                                 v-if="v$.billing_information.city.$error">
                                {{ v$.billing_information.city.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="zip" class="form-label">Posta Kodu</label>
                            <input @blur="v$.billing_information.zip.$touch"
                                   :class="{'is-invalid': v$.billing_information.zip.$error}"
                                   v-model="checkout.billing_information.zip"
                                   type="text"
                                   class="form-control"
                                   id="zip"
                                   placeholder="Posta Kodu">
                            <div class="invalid-feedback"
                                 v-if="v$.billing_information.zip.$error">
                                {{ v$.billing_information.zip.$errors[0].$message }}
                            </div>
                        </div>
                    </div>

                    <hr class="my-4">

                    <h4 class="mb-3">Ödeme</h4>
                    <div class="my-3">
                        <div class="form-check">
                            <label class="form-check-label" for="credit">Kredi Kartı</label>
                            <input v-model="checkout.payment.payment_method"
                                   value="Kredi Kartı"
                                   id="credit"
                                   name="paymentMethod"
                                   type="radio"
                                   class="form-check-input"
                                   checked>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label" for="pay_at_the_door">Kapıda Ödeme</label>
                            <input v-model="checkout.payment.payment_method"
                                   value="Kapıda Ödeme"
                                   id="pay_at_the_door"
                                   name="paymentMethod"
                                   type="radio"
                                   class="form-check-input">
                        </div>
                    </div>

                    <div class="row gy-3" v-if="checkout.payment.payment_method === 'Kredi Kartı'">
                        <div class="col-md-6">
                            <label for="cc-name" class="form-label">Ad Soyad</label>
                            <input @blur="v$.payment.cc_name.$touch"
                                   :class="{'is-invalid': v$.payment.cc_name.$error}"
                                   v-model="checkout.payment.cc_name"
                                   type="text"
                                   class="form-control"
                                   id="cc-name"
                                   placeholder=""
                            >
                            <small class="text-muted">Kartta görüntülendiği şekliyle tam ad</small>
                            <div class="invalid-feedback"
                                 v-if="v$.payment.cc_name.$error">
                                {{ v$.payment.cc_name.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="cc-number" class="form-label">Kart Numarası</label>
                            <input @blur="v$.payment.cc_number.$touch"
                                   :class="{'is-invalid': v$.payment.cc_number.$error}"
                                   v-credit-cart-number
                                   v-model="checkout.payment.cc_number"
                                   type="text"
                                   class="form-control"
                                   id="cc-number"
                                   placeholder=""
                            >
                            <div class="invalid-feedback"
                                 v-if="v$.payment.cc_number.$error">
                                {{ v$.payment.cc_number.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="cc-expiration" class="form-label">Son Kullanma Tarihi</label>
                            <input @blur="v$.payment.cc_expiration.$touch"
                                   :class="{'is-invalid': v$.payment.cc_expiration.$error}"
                                   v-credit-card-exp
                                   v-model="checkout.payment.cc_expiration"
                                   type="text"
                                   class="form-control"
                                   id="cc-expiration"
                                   placeholder="">
                            <div class="invalid-feedback"
                                 v-if="v$.payment.cc_expiration.$error">
                                {{ v$.payment.cc_expiration.$errors[0].$message }}
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="cc-cvv" class="form-label">CVV</label>
                            <input @blur="v$.payment.cc_ccv.$touch"
                                   :class="{'is-invalid': v$.payment.cc_ccv.$error}"
                                   v-credit-card-ccv
                                   v-model="checkout.payment.cc_ccv"
                                   type="text"
                                   class="form-control"
                                   id="cc-cvv"
                                   placeholder=""
                            >
                            <div class="invalid-feedback"
                                 v-if="v$.payment.cc_ccv.$error">
                                {{ v$.payment.cc_ccv.$errors[0].$message }}
                            </div>
                        </div>
                    </div>

                    <hr class="my-4">

                    <button class="w-100 btn btn-dark btn-lg"
                            type="submit"
                            :disabled="getButton.disable">
                        <span v-if="getButton.disable"
                              class="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"></span>
                        {{ getButton.text }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>