import productModel from "../models/products.models.js";
import cartModel from "../models/cart.models.js";

class ProductManager {

  constructor() {
    console.log("Working on DB")
  }


  async getProducts(limit, page, sort) {
    let limitIn = limit ? limit : 10;
    let pageIn = page ? page : 1;
    let sortIn = sort ? { price: sort } : null;

    let Params = { limit: limitIn, page: pageIn, sort: sortIn, lean: true }
    try {
      const products = await productModel.paginate({}, Params)
      return products;
    } catch (error) {
      return [];
    }
  }


  async getProductById(id) {
    const aux = await productModel.findById(id);
    if (!aux) {
      console.log("Producto no encontrado");
    } else {
      return aux;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock, category, status, owner) {
    const product = { title, description, price, thumbnail, code, stock, category, status, owner }
    const result = await productModel.create(product);
    console.log("Producto Agregado!")
    return result;
  }

  async updateProduct(id, info) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate({ _id: id }, info);
      return updatedProduct;
    } catch (Error) {
      console.log("No se pudo actualizar el producto")
      throw new Error;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productModel.deleteOne({ _id: id });
      return result
    } catch (Error) {
      console.log("No se ha podido eliminar el producto")
      throw new Error;
    }
  }

  async reduceStock(id, stock) {
    try {
      const productToUpdate = await productModel.findById(id)
      if (productToUpdate.stock < stock) {
        return ("El stock del producto es menor que la cantidad solicitada ")
      } else {
        const newStock = Number(productToUpdate.stock) - Number(stock)
        const newinfo = {
          title: productToUpdate.title,
          description: productToUpdate.description,
          price: productToUpdate.price,
          thumbnail: productToUpdate.thumbnail,
          code: productToUpdate.code,
          stock: newStock,
          category: productToUpdate.category,
          status: productToUpdate.status,
          owner: productToUpdate.owner,
        }
        this.updateProduct(id, newinfo)
      }
    } catch (error) {
      throw new Error
    }
  }
}

export default ProductManager;
