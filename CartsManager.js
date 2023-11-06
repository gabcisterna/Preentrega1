import fs from 'fs'
import ProductManager from './ProductManager.js'
const productManager = new ProductManager()
const products = productManager.getProducts()

class CartsManager{
    constructor(){
        this.carts = []
        this.nextId = 1
        this.path = "../carts.json"
        this.loadCarts()
    }

    loadCarts(){
        try {
            const data = fs.readFileSync(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            if (this.carts.length > 0){
                this.nextId = Math.max(...this.carts.map((cart) => cart.id))
            }
        } catch (error) {
            this.carts = []
        }
    }

    saveCarts(){
        const data = JSON.stringify(this.carts, null, 2)
        fs.writeFileSync(this.path, data)
    }

    addCart(idProducts) {
        const { idProduct } = idProducts
        // Valida que los datos no estén incompletos
        const product = productManager.getProductById(idProduct)
    
        if (!product){return false}
        // Asegura que el nextId sea único
        while (this.carts.some(cart => cart.id === this.nextId)) {
            this.nextId++;
        }

        // Carga los datos del cart
        let nuevoEvento = {
            id: this.nextId,
            products: [{product: idProduct, quantity: 1}]
        };

        this.carts.push(nuevoEvento);
        this.nextId++; // Incrementar el ID para el próximo cart
        this.saveCarts(); // Guarda los productos en el archivo
        return true
    }
    

    getCartById(id){
        let indice = this.carts.findIndex(carts => carts.id === id)
        if (indice === -1){
            console.log(`Not found code:${id}`)
        } else{
            return this.carts[indice]
        }
    }

    getCarts() {
        return this.carts
    }

    deleteCart(id) {
        const productIndex = this.carts.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            console.log(`Producto no encontrado con ID: ${id}`);
            return;
        }

        this.carts.splice(productIndex, 1);

        // Actualizamos los IDs de los carts restantes
        for (let i = productIndex; i < this.carts.length; i++) {
            this.carts[i].id--;
        }

        this.saveProducts(); // Guarda los cambios en el archivo
    }

    updateCart(idProduct, idCart) {
        const product = productManager.getProductById(idProduct);
        const cart = this.getCartById(idCart);
    
        if (!product || !cart || !Array.isArray(cart.products)) {
            return false;
        }
    
        const productIndex = cart.products.findIndex((item) => item.product === idProduct);
    
        if (productIndex !== -1) {
            // El producto ya existe en el carrito, aumenta la cantidad en 1
            cart.products[productIndex].quantity += 1;
        } else {
            // El producto no está en el carrito, agrégalo como un nuevo objeto
            cart.products.push({ product: idProduct, quantity: 1 });
        }
    
        // Guardar el carrito actualizado
        this.carts[idCart - 1] = cart;
        this.saveCarts();
    
        return true;
    }
    
}

export default CartsManager