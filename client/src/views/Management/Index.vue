<script setup>
</script>

<template>
    <div class="container px-5 my-5 min-vh-100">
        <div class="row mb-3">
            <div class="col-md-3">
                <div class="col p-3 bg-light">
                    <h4 class="text-center">Yönetim Menüsü</h4>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item">
                            <RouterLink exact class="nav-link link-dark" active-class="active"
                                        :to="{name:'category-index'}">
                                Kategoriler
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink exact class="nav-link link-dark" active-class="active"
                                        :to="{name:'product-index'}">
                                Ürünler
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-9">
                <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>

<style scoped>
.active {
    background-color: rgb(33, 37, 41) !important;
    color: rgb(500, 500, 500) !important;
}

.link-dark.active {
    color: rgb(500, 500, 500) !important;
}

</style>