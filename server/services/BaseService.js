class BaseService {
    baseModel = null

    constructor(model) {
        this.baseModel = model
    }

    create(data){
        return new this.baseModel(data)?.save()
    }

    get(where){
        return this.baseModel?.find(where || {})
    }

    findOne(where){
        return this.baseModel?.findOne(where)
    }

    update(id, data){
        return this.baseModel?.findOneAndUpdate(id,data,{
            new: true
        })
    }

    updateWhere(where,data){
        return this.baseModel?.findOneAndUpdate(where,data,{
            new: true
        })
    }

    delete(id){
        return this.baseModel?.findOneAndDelete(id)
    }

    count(){
        return this.baseModel?.countDocuments()
    }
}

export default BaseService