import { Router } from "express"
import CartsManager from "../../CartsManager.js"

const cartsManager = new CartsManager()

const router = Router()

router.get('/:cid', async (req, res) => {
    let cid = parseInt(req.params.cid)

    try {
        const cartId = cartsManager.getCartById(cid)
        if (cartId) {
            return res.send(cartId);
        } else {
            return res.send("Cart no encontrado")
        }
    } catch(error) {
        res.send("Error del servidor")
        }
})

router.post('/', (req, res) => {
    let cart = req.body
    const validar = cartsManager.addCart(cart)
    if (validar === true) {
        res.send({status:"Success", message:"Cart agregado"})
        return
    }
    res.status(400).send({status:"error", error:"Valores incompletos"})
})

router.post('/:cid/product/:pid', (req, res) => {
    let cid = parseInt(req.params.cid)
    let pid = parseInt(req.params.pid)
    const validar = cartsManager.updateCart(pid, cid)
    if (validar === true) {
        res.send({status:"Success", message:"Cart modificado"})
        return
    }
    res.status(400).send({status:"error", error:"Valores incompletos"})
})

export { router } 
