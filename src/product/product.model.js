import mongoose, { Schema, model } from "mongoose"

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    sold:{
        type: Number,
        required: true,
        default: 0
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required:true
    },
    onStock: {
        type: Number,
        required: true,
        default: 0
      },
      state: {
        type: String,
        uppercase: true,
        enum: ['AVAILABLE', 'SOLD_OUT'],
        default: 'AVAILABLE', 
        required: true
    }
})

export default model('product', productSchema)
