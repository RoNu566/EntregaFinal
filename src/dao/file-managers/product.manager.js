import fs from "fs";
import { __dirname } from "../../utils.js";

const path = __dirname + "/dao/json/products.json"

class ProductManager {


  constructor() {
    console.log("Working on FileSystem")
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }

  async Contador() {
    const products = await this.getProducts();
    let contador = products.length + 1;
    if (contador < 0) {
      return 1;
    } else {
      return contador
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const aux = products.find((product) => product.id == id);
    if (!aux) {
      console.log("Producto no encontrado");
    } else {
      return aux;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock, category, status) {
    const products = await this.getProducts();
    const contador = await this.Contador();

    const newProduct = {
      id: `${contador}`,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    };
    if (!title || !price || !thumbnail || !code || !stock) {
      console.log("Faltan cargar Paramentros");
    } else {
      const productoRepetido = products.find((prod) => prod.code == code);
      if (!productoRepetido) {
        await fs.promises.writeFile(path, JSON.stringify([...products, newProduct])
        );
        console.log(`Producto ${title} agregado con exito y con id generado ${contador}`
        );
      } else {
        console.log(
          `El producto con el código ${code} ya se encuentra cargado, modifique el codigo`
        );
      }
    }
  }

  async updateProduct(id, propModify) {
    const products = await this.getProducts();
    let auxiliar = products.find((prod) => prod.id == id);
    if (!auxiliar) {
      console.log(
        `El producto con id: ${id} no se encuentra en la base de datos`
      );
    } else {
      if (Object.keys(propModify).includes("price")) {
        propModify.price = parseInt(propModify.price)
      }
      if (Object.keys(propModify).includes("stock")) {
        propModify.stock = parseInt(propModify.stock)
      }
      auxiliar = { ...auxiliar, ...propModify };
      let newArray = products.filter((prod) => prod.id !== id);
      newArray = [...newArray, auxiliar];
      await fs.promises.writeFile(path, JSON.stringify(newArray));
      console.log("Modificación exitosa");
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const auxiliar = products.filter((prod) => prod.id !== id);
    await fs.promises.writeFile(path, JSON.stringify(auxiliar)); //reescribo el archivo
    return ("Se elimino el Producto");
  }
}

export default ProductManager;
