export default class BaseError extends Error {
    constructor({message, status, success}) {
        super(message);
        this.message = message
        this.status = status
        this.success = success
    }
}

//export default BaseError