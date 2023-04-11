import aws from "aws-sdk";
import appConfig from "../config/index.js"

const s3 = new aws.S3({
    accessKeyId: appConfig.S3.ACCESS_KEY_ID,
    secretAccessKey: appConfig.S3.SECRET_ACCESS_KEY
})

const S3 = async ({fileName, imageData}) => {

    return (await s3.upload({
        Bucket: appConfig.S3.BUCKET,
        Key: fileName,
        Body: imageData,
        ACL: appConfig.S3.ACL
    }).promise()).Location
}

const S3DeleteObject = async (fileName) => {
    return (await s3.deleteObject({
        Bucket: appConfig.S3.BUCKET,
        Key: fileName
    }).promise())
}

export {
    S3,
    S3DeleteObject
}