import slug from 'slug'

function generateSKU(productName, productColor) {
    const firstThreeChars = productName.substring(0, 3).toUpperCase();
    const colorCode = productColor.substring(0, 3).toUpperCase();
    // const sizeCode = productSize.substring(0, 2).toUpperCase();

    return `${firstThreeChars}-${colorCode}-${Date.now()}`;
}

function generateSlug(value){
    return slug(value)
}


export {
    generateSKU,
    generateSlug
}