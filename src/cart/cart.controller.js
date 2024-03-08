'use strict'

import Cart from './cart.model.js'


export const test = (req, res)=>{
    console.log('server is running')
    res.send({message:'test product is running '})
}

//agregar producto al carrito

export const addToCart = async (req, res) => {
    try {
        let { product, quantity } = req.body
        let userId = req.user.id
        quantity = parseInt(quantity, 10)

        console.log(userId)

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            try {
                cart = new Cart({ user: userId, items: [] })
                await cart.save()
                return res.send({ message: 'a new cart was created' })
            } catch (error) {
                console.error(error);
                return res.status(500).send({ message: 'error creating cart' })
            }
        }

        let existingItem = cart.items.findIndex(item => item.product == product)

        if (existingItem !== -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            cart.items[existingItem].quantity += quantity
        } else {
            // Si no está en el carrito, agrégalo
            cart.items.push({ product: product, quantity })
        }

        await cart.save()
        res.send(cart)
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'error adding to the car' })
    }
}




// Eliminar un producto del carrito
export const removeProduct = async (req, res) => {
    try {
        let { product } = req.body
        let userId = req.user.id

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(404).send({ message: 'cart not found' })
        }

        // Verificar si el producto existe antes de eliminarlo
        const existingItem = cart.items.find(item => item.product === product);

        if (!existingItem) {
            return res.status(404).send({ message: 'product not found in the cart' });
        }

        //crea un nuevo array en el cual se excluyen los productos a eliminar

        let updatedItems = cart.items.filter(item => item.product != product)

        cart.items = updatedItems//<- se le asignan los iems actualizados al carrito
        await cart.save()

        res.send({ message: 'product delated successfully from the cat', cart })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'error deleting product from the cart' })
    }
}

//obtener elementos del carrito 
export const getItemsCart = async (req, res) => {
    let userId = req.user.id

    try {
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.send(cart);
    } catch (err) {
        console.error(err);
        res.status(500).res({ message: 'error getting items of the car' });
    }
};