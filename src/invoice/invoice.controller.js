'use strict'

import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import Invoice from '../invoice/invoice.model.js'
import PDFDocument from 'pdfkit'
import fs from 'fs'

export const test = (req, res)=>{
    console.log('server is running')
    res.send({message:'test invoice is running '})
}


export const createInvoice = async (req, res) => {
    try {
        let userId = req.user.id // Obtener el ID del usuario desde el token o sesión
        let cartId = req.params.cartId // Obtener el ID del carrito desde los parámetros de la ruta

        // Buscar el carrito asociado al usuario y poblar la información del producto
        let cart = await Cart.findOne({ _id: cartId, user: userId }).populate('items.product')

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' })
        }

        // Calcular el total y los subtotales de la factura
        let total = cart.items.reduce((acc, item) => {
            const subtotal = item.product.price * item.quantity
            item.subtotal = subtotal // Agregar el subtotal al objeto item
            return acc + subtotal
        }, 0)

        // Descontar el stock de los productos
        for (let item of cart.items) {
            let product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).send({ message: 'Product not found' })
            }

            if (product.onStock < item.quantity) {
                return res.status(400).send({ message: `Insufficient stock for ${product.name}` })
            }

            // Actualizar el stock del producto
            product.onStock -= item.quantity
            product.sold += item.quantity

            await product.save()
        }

        // Crear la factura
        let invoice = new Invoice({
            user: userId,
            cart: cartId,
            total,
        })

        // Guardar la factura en la base de datos
        await invoice.save()

        
        // Generar el PDF
        let pdfDoc = new PDFDocument()
        // Configurar el contenido del PDF
        pdfDoc.text(`Factura creada para ${req.user.name}`)
        pdfDoc.text(`Email del usuario: ${req.user.email}`)
        pdfDoc.text('Detalles del carrito:')

        // Agregar detalles de los productos en el carrito al PDF
        cart.items.forEach((item, index) => {
            pdfDoc.text(`Producto #${index + 1}`)
            pdfDoc.text(`  Nombre: ${item.product.name}`)
            pdfDoc.text(`  Descripción: ${item.product.description}`)
            pdfDoc.text(`  Precio: ${item.product.price}`)
            pdfDoc.text(`  Cantidad: ${item.quantity}`)
            pdfDoc.text(`  Subtotal: ${item.subtotal}`)
            pdfDoc.moveDown()
        })

        pdfDoc.text(`Total: Q..${total}`)

        // Guardar el PDF en un archivo (opcional)
        let pdfPath = `invoice_${invoice._id}.pdf`
        pdfDoc.pipe(fs.createWriteStream(pdfPath))
        pdfDoc.end()

        // Configurar los encabezados de la respuesta para un archivo PDF
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=${pdfPath}`)

        // Enviar el contenido del PDF como respuesta al cliente
        pdfDoc.pipe(res)


        //limpiar carrito

       // cart.items = []
       // await cart.save()

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating invoice and generating PDF' })
    }
}


export const getInvoices = async(req,res)=>{
    try{
        let userId = req.user.id
        let invoices = await Invoice.find({user: userId})
        return res.send({message: 'invoices of the user ', invoices})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error getting invoices'})
    }
}