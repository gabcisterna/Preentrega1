import express from 'express'

import { router as cartsRoutes } from './routes/carts.routes.js'
import { router as productsRoutes } from './routes/products.routes.js'


const PORT = 8080

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/carts/', cartsRoutes)
app.use('/api/products/', productsRoutes)

app.get('/',(req, res) => {
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

const server = app.listen(PORT,() => {
    console.log(`Escuchando puerto ${PORT}`)
})

