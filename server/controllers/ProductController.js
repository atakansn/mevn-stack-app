import ProductService from "../services/ProductService.js";
import {generateSKU, generateSlug} from "../utils/helpers.js";
import BaseError from "../errors/BaseError.js";
import sharp from "sharp";
import path from "node:path";
import {S3, S3DeleteObject} from "../utils/s3.js";
export default new class ProductController {

    async index(req, res, next) {
        const page = +req.query.page || 1
        const limit = +req.query.limit || 8

        const skip = (page - 1) * limit

        const total = await ProductService.count()
        const totalPages = Math.ceil(total / limit)
        const lastPageLimit = total % limit || limit
        const currentLimit = (page === totalPages) ? lastPageLimit : limit

        ProductService.get({})
            .sort({created_at: -1})
            .limit(limit)
            .skip(skip)
            .then(async categories => {
                res.status(200).json({
                    data: categories,
                    pagination: {
                        page,
                        limit,
                        currentLimit,
                        totalPages,
                        total
                    }
                })
            }).catch(error => next(error))
    }

    store(req, res, next) {
        const slugConvert = generateSlug(req.body.name)

        ProductService.findOne({name: req.body.name, slug: slugConvert})
            .then(async findProduct => {

                if (findProduct) throw new BaseError({
                    message: 'Böyle bir ürün mevcut.',
                    status: 409,
                    success: false
                })

                if (!req?.files?.image) throw new BaseError({
                    message: 'Resim alanı zorunludur.',
                    status: 400,
                    success: false
                })

                const allowedMimeType = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

                if (!allowedMimeType.includes(req?.files?.image?.mimetype)) throw new BaseError({
                    message: 'Resim alanı JPEG,PNG,WEBP olmalıdır.',
                    status: 400,
                    success: false
                })

                const allowedExtension = ['.png', '.jpg', '.jpeg', '.webp']

                const fileExtension = path.extname(req.files.image.name)

                if (!allowedExtension.includes(fileExtension)) throw new BaseError({
                    message: 'Resim alanı uzantısı JPEG,PNG,WEBP olmalıdır.',
                    status: 400,
                    success: false
                })

                const {data, info} = await sharp(req.files.image.data)
                    .resize(255, 262)
                    .webp({quality: 100})
                    .toBuffer({resolveWithObject: true})

                req.body.image = await S3({
                    fileName: `product_img_${Date.now()}.${info.format}`,
                    imageData: data
                })

                req.body.slug = slugConvert

                req.body.sku = generateSKU(req.body.name, req.body.category)

                ProductService.create(req.body)
                    .then(product => res.status(200).json({
                        message: `${product.name} isimli ürün oluşturuldu.`,
                        status: 200,
                        success: true
                    }))
                    .catch(error => next(error))

            }).catch(error => next(error))
    }

    show(req, res, next) {
        ProductService.findOne({_id: req.params.id})
            .then(product => res.status(200).json(product))
            .catch(error => next(error))
    }

    update(req, res, next) {
        ProductService.findOne({_id: req.params.id})
            .then(async findProduct => {
                if (findProduct) throw new BaseError({
                    message: 'Böyle bir ürün mevcut.',
                    status: 409,
                    success: false
                })

                const imageKey = findProduct.image
                const filename = imageKey.substring(imageKey.lastIndexOf('/') + 1)

                if (req?.body?.name) {
                    req.body.slug = generateSlug(req.body.name)
                }

                if (req?.files?.image) {
                    await S3DeleteObject(filename)

                    const {data, info} = await sharp(req.files.image.data)
                        .webp({quality: 100})
                        .toBuffer({resolveWithObject: true})

                    req.body.image = await S3({
                        fileName: `product_img_${Date.now()}.${info.format}`,
                        imageData: data
                    })
                }

                ProductService.update({_id: req.params.id}, req.body)
                    .then(() => {
                        res.status(200).json({
                            success: false,
                            status: 200,
                            message: 'Ürün Güncellendi.'
                        })
                    })
                    .catch(error => next(error))
            })
            .catch(error => next(error))
    }

    destroy(req, res, next) {
        ProductService.delete({_id: req.params.id})
            .then(async deleteProduct => {
                if (!deleteProduct) throw new BaseError({
                    message: 'Böyle bir ürün mevcut.',
                    status: 409,
                    success: false
                })

                const imageKey = deleteProduct.image
                const filename = imageKey.substring(imageKey.lastIndexOf('/') + 1)

                await S3DeleteObject(filename)

                res.status(200).json({
                    message: `${deleteProduct.name} adlı ürün silindi.`,
                    success: true,
                    status: 200
                })
            })
            .catch(error => next(error))
    }

    async productWithCategory(req, res, next) {
        ProductService.findOne({slug: req.params.slug})
            .populate({
                path: 'category',
                select: '_id name',
                model: 'Category'
            })
            .then(product => {
                if (!product) throw new BaseError({
                    message: 'Böyle bir ürün yok.',
                    status: 404,
                    success: false
                })

                ProductService.get({category: product.category._id})
                    .then(productByCategory => {
                        if (!productByCategory) return res.status(404).json({
                            message: 'İlgili ürün bulunamadı.',
                            status: 404,
                            success: false
                        })

                        productByCategory = productByCategory.filter(product2 => product2._id.toString() !== product._id.toString())

                        res.status(200).json({
                            product,
                            productByCategory
                        })
                    }).catch(error => next(error))

            }).catch(error => next(error))
    }

}