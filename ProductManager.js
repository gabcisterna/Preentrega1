import fs, { stat } from 'fs'
class ProductManager{
    constructor(){
        this.products = []
        this.nextId = 1
        this.path = "../products.json"
        this.loadProducts()
    }

    loadProducts(){
        try {
            const data = fs.readFileSync(this.path, 'utf-8')
            this.products = JSON.parse(data)
            if (this.products.length > 0){
                this.nextId = Math.max(...this.products.map((product) => product.id))
            }
        } catch (error) {
            this.products = []
        }
    }

    saveProducts(){
        const data = JSON.stringify(this.products, null, 2)
        fs.writeFileSync(this.path, data)
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock, status, category } = productData
        // Valida que los datos no estén incompletos
        if (!title || !description || isNaN(price) || !code || isNaN(stock) || status === undefined || !category) {
            console.log("Los datos del producto son inválidos o están incompletos.");
            return false;
        }
    
        // Asegura que el nextId sea único
        while (this.products.some(product => product.id === this.nextId)) {
            this.nextId++;
        }
    
        // Valida el código para que no se repita
        if (this.products.some(product => product.code === code)) {
            console.log(`El código ${code} ya está en uso. Elige un código único.`);
            return false;
        }
    
        // Carga los datos del producto
        let nuevoEvento = {
            id: this.nextId,
            title,          // nombre del producto
            description,    // descripción del producto
            price,          // precio
            thumbnail,      // ruta de imagen
            code,           // código identificador
            stock,
            status,
            category           // número de piezas disponibles
        };
    
        // Agrega al array de productos un producto nuevo
        this.products.push(nuevoEvento);
        this.nextId++; // Incrementar el ID para el próximo producto
        this.saveProducts(); // Guarda los productos en el archivo
        return true
    }
    
    

    getProductById(id){
        let indice = this.products.findIndex(products => products.id === id)
        if (indice === -1){
            console.log(`Not found code:${id}`)
        } else{
            return this.products[indice]
        }
    }

    getProducts() {
        return this.products
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            console.log(`Producto no encontrado con ID: ${id}`);
            return;
        }

        this.products.splice(productIndex, 1);

        // Actualizamos los IDs de los productos restantes
        for (let i = productIndex; i < this.products.length; i++) {
            this.products[i].id--;
        }

        this.saveProducts(); // Guarda los cambios en el archivo
    }

    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            console.log(`Producto no encontrado con ID: ${id}`);
            return;
        }
    
        const existingProduct = this.products[productIndex];
    
        // Copia los campos existentes del producto
        const updatedFields = {
            title: existingProduct.title,
            description: existingProduct.description,
            price: existingProduct.price,
            thumbnail: existingProduct.thumbnail,
            code: existingProduct.code,
            stock: existingProduct.stock,
            status: existingProduct.status,
            category: existingProduct.category,
            id, // Asegura que el ID no cambie
        };
    
        // Actualiza los campos proporcionados en updatedProduct
        for (const field in updatedProduct) {
            if (updatedFields.hasOwnProperty(field)) {
            updatedFields[field] = updatedProduct[field];
            }
        }
    
        this.products[productIndex] = updatedFields;
        this.saveProducts(); // Guarda los cambios en el archivo
        return true
    }
}

export default ProductManager