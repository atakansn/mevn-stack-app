import Joi from 'joi'

const categoryCreateSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.name': 'Geçerli bir kategori ismi giriniz.',
        'string.empty': 'Kategori alanı boş bırakılmamalı.',
        'string.required': 'Kategori alanı zorunludur.',
    })
})

const categoryUpdateSchema = Joi.object({
    name: Joi.string().messages({
        'string.name': 'Geçerli bir kategori ismi giriniz.',
        'string.empty': 'Kategori alanı boş bırakılmamalı.',
        'string.required': 'Kategori alanı zorunludur.'
    })
})

export {
    categoryCreateSchema,
    categoryUpdateSchema
}