const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message || 'Bir hata oluştu...',
            status: error.status || 500,
            success: false,

        }
    })
}

export default errorHandler