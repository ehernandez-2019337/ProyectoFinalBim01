import mongoose, { Schema, model } from "mongoose"

const categorySchema = mongoose.Schema({
    category: {
        type:String,
        required: true
    },

    description: {
        type:String,
        required:true
    }
})

export default model('category', categorySchema)
