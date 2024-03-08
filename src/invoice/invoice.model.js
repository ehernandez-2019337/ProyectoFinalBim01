import mongoose, { Schema, model } from 'mongoose'

const invoiceSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'cart',
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default model('invoice', invoiceSchema)
