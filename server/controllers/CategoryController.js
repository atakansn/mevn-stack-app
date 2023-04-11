import CategoryService from "../services/CategoryService.js";
import {generateSlug} from "../utils/helpers.js";
import BaseError from "../errors/BaseError.js";
import Product from "../models/Product.js";

export default new class CategoryController {

    index(req, res, next) {
        CategoryService.get()
            .then(categories => res.status(200).json(categories))
            .catch(error => next(error))
    }

    store(req, res, next) {
        req.body.slug = generateSlug(req.body.name)

        CategoryService.findOne({name: req.body.name, slug: generateSlug(req.body.name)})
            .then(findCategory => {

                if (findCategory) throw new BaseError({
                    message: `${findCategory.name} adlı kategori zaten mevcut.`,
                    status: 409,
                    success: false
                })

                CategoryService.create(req.body).then(category => {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: `${category.name} adlı kategori oluşturuldu.`
                    })
                }).catch(error => next(error))

            }).catch(error => next(error))
    }

    show(req, res, next) {
        CategoryService.findOne({_id: req.params.id})
            .then(category => res.status(200).json(category))
            .catch(error => next(error))
    }

    update(req, res, next) {
        req.body.slug = generateSlug(req.body.name)

        CategoryService.findOne({name: req.body.name, slug: generateSlug(req.body.name)})
            .then(findCategory => {

                if (findCategory) throw new BaseError({
                    message: `${findCategory.name} adlı kategori zaten mevcut.`,
                    status: 409,
                    success: false
                })

                CategoryService.findOneAndUpdate({_id: req.params.id}, req.body)
                    .then(category => {
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: `${category.name} adlı kategori ${req.body.name} adıyla güncellendi.`
                        })
                    })
                    .catch(error => next(error))
            }).catch(error => next(error))
    }

    destroy(req, res, next) {
        CategoryService.delete({_id: req.params.id})
            .then(() => res.status(200).json({
                message: 'Kategori Silindi.',
                success: true,
                status: 200
            }))
            .catch(error => next(error))
    }

    async categoryOfProducts(req, res, next){
        CategoryService.findOne({slug: req.params.slug})
            .then(async findCategory => {
                if (!findCategory) throw new BaseError({
                    message: 'Böyle bir kategori bulunamadı.',
                    status: 404,
                    success: false
                })

                const page = +req.query.page || 1
                const limit = +req.query.limit || 8

                const skip = (page - 1) * limit

                const total = await Product.countDocuments({category: findCategory._id})
                const totalPages = Math.ceil(total / limit)
                const lastPageLimit = total % limit || limit
                const currentLimit = (page === totalPages) ? lastPageLimit : limit

                Product.find({category: findCategory._id})
                    .sort({created_at: -1})
                    .limit(limit)
                    .skip(skip)
                    .then(async listProducts => {
                        if (!listProducts) throw new BaseError({
                            message: 'Böyle bir ürün bulunamadı.',
                            status: 404,
                            success: false
                        })

                        res.status(200).json({
                            data: listProducts,
                            category: findCategory.name,
                            pagination: {
                                skip,
                                page,
                                currentLimit,
                                totalPages,
                                total
                            }
                        })
                    }).catch(err => next(err))

            }).catch(err => next(err))
    }

    async withPaginate(req, res, next){
        const page = +req.query.page || 1
        const limit = +req.query.limit || 8

        const skip = (page - 1) * limit

        const total = await CategoryService.count()
        const totalPages = Math.ceil(total / limit)
        const lastPageLimit = total % limit || limit
        const currentLimit = (page === totalPages) ? lastPageLimit : limit

        CategoryService.get({})
            .sort({created_at: -1})
            .limit(limit)
            .skip(skip)
            .then(categories => res.status(200).json({
                data: categories,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    currentLimit,
                    total
                }
            }))
            .catch(error => next(error))
    }

}