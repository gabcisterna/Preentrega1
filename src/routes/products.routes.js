import { Router } from "express"
import ProductManager from '../../ProductManager.js'


const productManager = new ProductManager()
let products = productManager.getProducts()

const router = Router()

router.get('/', (req, res) => {
    let limit = req.query.limit

    if (!limit) {
        return res.send(products);
    } 

    limit = parseInt(limit);

    if (!isNaN(limit)) {
        let mostrarLimit = products.slice(0, limit);
        return res.send(mostrarLimit);
    }
    res.send("Error del servidor")
})

router.get('/:pid', async (req, res) => {
    let pid = req.params.pid

    pid = parseInt(pid)
    try {
        const productId = productManager.getProductById(pid)
        if (productId) {
            return res.send(productId);
        } else {
            return res.send("Producto no encontrado")
        }
    } catch(error) {
        res.send("Error del servidor")
        }
})

router.post('/', (req, res) => {
    let user = req.body
    const validar = productManager.addProduct(user)
    if (validar === true) {
        res.send({status:"Success", message:"Producto agregado"})
        return
    }
    res.status(400).send({status:"error", error:"Valores incompletos"})
})

router.put('/:pid', (req, res) => {
    let user = req.body
    let id = parseInt(req.params.pid)
    const validar = productManager.updateProduct(id, user)
    if (validar === true) {
        res.send({ status: "Success", message: "Producto actualizado" })
    } else {
        res.status(400).send({ status: "error", error: "Producto no encontrado o datos inválidos" })
    }
})

router.delete('/:pid', async (req, res) => {
    let pid = parseInt(req.params.pid)

    try {
        productManager.deleteProduct(pid)
        res.send({ status: "Success", message: "Producto eliminado con exito"})
    } catch (error) {
        res.status(400).send({stattus:"error", error:"No se pudo eliminar el producto"})
    }
})

export { router } 