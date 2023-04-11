<template>
    <nav v-if="totalPages > 1">
        <ul class="pagination">
            <li class="page-item" :class="{disabled:isInFirstPage}">
                <button class="page-link" @click="onClickFirstPage" :disabled="isInFirstPage">
                    İlk
                </button>
            </li>
            <li class="page-item" :class="{disabled:isInFirstPage}">
                <button class="page-link" @click="onClickPreviousPage">Geri</button>
            </li>
            <li class="page-item" :class="{active:isPageActive(page.name)}" v-for="page in pages">
                <button class="page-link"
                        @click="onClickPage(page.name)"
                        :disabled="page.isDisabled">
                    {{ page.name }}
                </button>
            </li>
            <li class="page-item" :class="{disabled:isInLastPage}">
                <button class="page-link" @click="onClickPageNext" :disabled="isInLastPage">
                    İleri
                </button>
            </li>
            <li class="page-item" :class="{disabled:isInLastPage}">
                <button class="page-link" @click="onClickLastPage" :disabled="isInLastPage">
                    Son
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>

export default {
    props: {
        // maxVisibleButtons: {
        //     type: Number,
        //     required: false,
        //     // default: 4
        // },
        totalPages: {
            type: Number,
            required: true
        },
        // total: {
        //   type: Number,
        //   required: true
        // },
        // perPage: {
        //   type: Number,
        //   required: true
        // },
        currentPage: {
            type: Number,
            required: true
        }
    },
    watch: {
        currentPage(newValue) {
            if (newValue < 1) {
                this.$emit('pageChanged', 1)
            } else if (newValue > this.totalPages) {
                console.log(newValue)
                this.$emit('pageChanged', this.totalPages)
            }
        }
    },
    computed: {
        startPage() {
            if (this.currentPage === 1) return 1

            if (this.currentPage === this.totalPages) return (this.totalPages - this.maxVisibleButtons) + 1

            return this.currentPage - 1
        },
        endPage() {
            return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages)
        },
        pages() {
            const range = []

            for (let i = this.startPage; i <= this.endPage; i++) {
                if (i !== 0) {
                    range.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    })
                }
            }

            return range
        },
        isInFirstPage() {
            return this.currentPage === 1
        },
        isInLastPage() {
            return this.currentPage === this.totalPages
        },
        maxVisibleButtons(){
            const minVisibleButtons = 1
            const maxVisibleButtons = this.totalPages

            if(this.totalPages <= maxVisibleButtons){
                return this.totalPages
            }

            const half = Math.floor(maxVisibleButtons / 2)

            if(this.currentPage <= half){
                return maxVisibleButtons + (half * 2)
            }

            if(this.currentPage >= this.totalPages - half){
                return minVisibleButtons + (half * 2)
            }

            return this.maxVisibleButtons
        }
    },
    methods: {
        onClickFirstPage() {
            this.$emit('pageChanged', 1)
        },
        onClickPreviousPage() {
            this.$emit('pageChanged', this.currentPage - 1)
        },
        onClickPage(page) {
            this.$emit('pageChanged', page)
        },
        onClickPageNext() {
            this.$emit('pageChanged', this.currentPage + 1)
        },
        onClickLastPage() {
            this.$emit('pageChanged', this.totalPages)
        },
        isPageActive(page) {
            return this.currentPage === page
        }
    }

}
</script>

<style scoped>
.pagination .page-link {
    color: #000;
    background-color: #fff;
    border: 1px solid #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: rgb(37, 41, 45);
    color: #FFFFFF;
}

.pagination .page-item.disabled .page-link {
    background-color: #ecebeb;
    border: 1px solid #bbbbbb;
}
</style>