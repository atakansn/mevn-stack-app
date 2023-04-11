import Joi from 'joi'

const nameValidation = {
    'string.base': 'Geçerli bir ürün ismi giriniz.',
    'any.required': 'Ürün adı alanı zorunludur.',
    'string.empty': 'Ürün adı alanı boş bırakılmamalı.',
};

const categoryValidation = {
    'string.base': 'Geçerli bir kategori ismi seçiniz.',
    'any.required': 'Kategori alanı zorunludur.',
    'string.empty': 'Kategori alanı boş bırakılmamalı.',
};

const descriptionValidation = {
    'string.base': 'Geçerli bir açıklama giriniz.',
    'any.required': 'Açıklama alanı zorunludur.',
    'string.empty': 'Açıklama alanı boş bırakılmamalı.',
};

const imageValidation = {
    'any.required': 'Resim alanı zorunludur.',
};

const priceValidation = {
    'number.base': 'Fiyat alanı rakam olmalıdır.',
    'any.required': 'Fiyat alanı zorunludur.',
    'string.empty': 'Fiyat alanı boş bırakılmamalı.',
};

const productCreateSchema = Joi.object({
    name: Joi.string().required().messages(nameValidation),
    category: Joi.string().required().messages(categoryValidation),
    description: Joi.string().required().messages(descriptionValidation),
    image: Joi.required().messages(imageValidation),
    price: Joi.number().required().messages(priceValidation),
});

const productUpdateSchema = Joi.object({
    name: Joi.string().messages(nameValidation),
    category: Joi.string().messages(categoryValidation),
    sku: Joi.string(),
    description: Joi.string().messages(descriptionValidation),
    image: Joi.string().messages(imageValidation),
    price: Joi.number().messages(priceValidation)
})

export {
    productCreateSchema,
    productUpdateSchema
}