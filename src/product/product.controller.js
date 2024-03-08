'use strict';
 
import Product from './product.model.js';
import Category from  '../category/category.model.js'




export const test = (req, res)=>{
    console.log('server is running')
    res.send({message:'test product is running '})
}


export const save = async(req,res)=>{
    try{
        //capturar data
        let data = req.body
        //validar que la categoria exista
        let category = await Category.findOne({_id: data.category})
        if(!Category) return res.status(404).send({message:'category not found'})
        // crear instancia del producto
        let product = new Product(data)
        //guardar en la db
        await product.save()
        //responder si todo esta bien
        return res.send({message:'product saved succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error saving product'})
    }
}

export const get = async(req, res)=>{
    try{
        let products = await Product.find()
        if(!products) return res.status(404).send({message:'not found'}).populate('category',['category'])
        return res.send({products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error getting courses'})
    }

}

    export const search = async (req, res)=>{
        try{
            //obtener el paremetro de busqueda
            let {name} = req.body
            let regex = new RegExp(name,'i')

            //buscar
            let products = await Product.find(    
                {name: regex}
            )

            //validar la respuesta
            if(!products) return res.status(400).send({message: 'products not found'})

            //responder al usuario
            return res.send({message:`products found`, products})
        }catch(err){
            console.error(err)
            return res.status(500).send({message:'error searching products'})
        }
    }  


    export const update = async(req, res) =>{
        try{
            //Capturar el id 
            let { id } = req.params
            // Ver si el curso existe
            let product = await Product.findOne({_id: id})
            if(!product) return res.status(404).send({message: 'product not exists'})
            // Capturar los datos
            let data = req.body
            //Actualizar 
            await Product.findOneAndUpdate(
                {_id: id},
                data,
                {new: true}
            )    
            // Responder al usuario
            return res.send({message: 'product updated successfully'})
        }catch(err){
            console.error(err)
            return res.status(500).send({message: 'error editing product'})
        }
    }

    export const inventario = async (req, res) => {
        try {
          let {id} = req.params
          let data  = req.body;
          const producto = await Product.findOne({_id: id})
          if (!producto) {
            return res.status(404).send({ message: 'product not found ' })
          }
          // Actualizar stock
          data.onStock = producto.onStock + parseInt(data.onStock)
          let updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
          )
    
          return res.send({ mensaje: 'product updated successfully', updatedProduct })
        } catch (error) {
          console.error(error)
          return res.status(500).send({ message: 'error updating stock' })
        }
      }


      export const deleteProduct = async(req, res)=>{
        try{
            //capturar el id 
            let {id} = req.params
            //eliminar
            let deleteProduct = await Product.findOneAndDelete(
                {_id: id}
            )
            //verificar que se elimine
            if(deleteProduct.deleteCount == 0) return res.status(400).send({message:'product not fpound'})
    
            //responder al usuario
            return res.send({message:'product deleted succesfully'})
    
        }catch(err){
            console.error(err)
            return res.status(500).send({message:'error deleting product'})
        }
    }


    export const searchByCategory = async (req, res)=>{
        try{
            //obtener el paremetro de busqueda
            let {category} = req.body

            //buscar
            let categoria = await Category.findOne(    
                {category: category}
            )

            let products = await Product.findOne({
                category: categoria
            }).populate('category',['category'])

        

            //validar la respuesta
            if(!products) return res.status(400).send({message: 'products not found'})

            //responder al usuario
            return res.send({message:`products found`, products})
        }catch(err){
            console.error(err)
            return res.status(500).send({message:'error searching products'})
        }
    } 


    export const orderSold = async (req, res) => {
        try {
            let products = await Product.find().sort({sold: -1})
            return res.send({ products })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'Error getting products' })
        }
    }