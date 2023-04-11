const validateFields = schema => (req, res, next) => {
    const validationFields = Object.assign(req.body,req.files)

    const {value, error} = schema.validate(validationFields, {abortEarly: false})

    if (error) {
        const errorMessage = error?.details.map(detail => detail.message)

        return res.status(400).json({
            error: {
                message: errorMessage,
                success: false,
                status: 400
            }
        })
    }

    Object.assign(req, value)

    return next()
}

export default validateFields