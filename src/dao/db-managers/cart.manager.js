import cartModel from "../models/cart.models.js"
import productModel from "../models/products.models.js";
import { Logger2 } from "../../Logger/logger.js";
import { ProductManager } from "../../config/persistance.js";



class CartManager {

  constructor() {
    console.log("Working on DB")
  }

  async getCart() {
    try {
      const carts = await cartModel.find().lean();
      return carts
    } catch (error) {
      return [];
    }
  }

  async addCart() {
    try {
      const newCart = { products: [] }
      const result = await cartModel.create(newCart)
      return result
    } catch (error) {
      console.log("No se ha creado el carrito")
    }
  }
  async checkCart(id) {
    const cart = await cartModel.findById(id).populate("products.product").lean();
    if (!cart) {
      console.log("No se encontro el carrito")
    } else {
      return cart;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      const prodIndex = cart.products.findIndex(prod => prod.product._id.toString() === pid)
      if (prodIndex >= 0) {
        cart.products[prodIndex].quantity = cart.products[prodIndex].quantity + 1,
          await cart.save();
      } else {
        cart.products.push({ product: pid, quantity: 1 })
        await cart.save()
      }
    } catch (error) {
      throw new Error;
    }
  }

  async deleteCar(cid) {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw new Error("No existe el carrito")
    } else {
      cartModel.deleteOne(cid);
      return ("Se ha eliminado el carrito correctamente")
    }
  }

  async deletProdfromCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      const prod = cart.products.find(p => p.product._id == pid)

      if (!prod) {
        throw new Error("El producto buscado no se encuentra en ningún carrito")
      }
      if (prod.quantity > 1) {
        prod.quantity = prod.quantity - 1;
        cart.save();
      } else if (prod.quantity <= 1) {
        const index = cart.products.findIndex(prod => prod.product._id.toString() == pid)
        cart.products.splice(index, 1)
        cart.save();
      }
    } catch (Error) {
      throw new Error("no se pudo eliminar el producto");
    }
  }

  async emptycart(cid) {
    try {
      const cart = await cartModel.findOneAndReplace({ _id: cid }, [])
      cart.save()
    } catch (error) {
      throw new Error;
    }
  }

  async purchase(cid) {
    const ticketProducts = [];
    const rejectedProducts = [];
    try {
      const cartToPurchase = await cartModel.findById(cid)
      if (!cartToPurchase) {
        return ("Carrito inexistente")
      } else {
        if (!cartToPurchase.products.length) {
          return ("No hay productos en el carrito")
        }
        for (let i = 0; i < cartToPurchase.products.length; i++) {
          const cartProduct = cartToPurchase.products[i];
          const productDB = await productModel.findById(cartProduct.product._id);
          //comparar la cantidad de ese producto en el carrito con el stock del producto
          if (cartProduct.quantity <= productDB.stock) {
            ticketProducts.push(cartProduct);
            this.sellStock(ticketProducts)
          } else {
            const qty = productDB.stock
            cartProduct.quantity = qty
            ticketProducts.push(cartProduct)
            this.sellStock(ticketProducts)
          }
        }
        this.emptycart(cid)
        return (ticketProducts)
      }
    } catch (error) {
      throw new Error
    }
  };

  async sellStock(p) {
    const stockReduce = p
    const newmanager = new ProductManager()
    try {
      stockReduce.forEach((prod) => {
        const reducedId = prod.product._id.toString()
        const reducedQty = prod.quantity;
        newmanager.reduceStock(reducedId, reducedQty)
      })
    } catch (error) {
      return ("no se pudo confirmar la compra")
    }
  };

}

export default CartManager;
