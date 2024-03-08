import mongoose, { Schema, model } from "mongoose";

const cartSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        quantity: {
            type: Number,
            default: 1
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true

        }
    }]
});

export default model('Cart', cartSchema);