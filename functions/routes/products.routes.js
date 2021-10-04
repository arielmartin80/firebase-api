const { Router } =require('express')
const router = Router()

const admin = require('firebase-admin')

const db = admin.firestore()

router.post('/api/products', async (req, res) => {
    try {
        await db.collection("products")
            .doc("/" + req.body.id + "/")
            .create({ 
                name: req.body.name,
                price: req.body.price
            })
        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

router.get('/api/products/:id', (req, res) => {
    (async () => {
        try {
            const doc = db.collection('products').doc(req.params.id)
            const item = await doc.get()
            const product = item.data()
            return res.status(200).json(product)
        } catch (error) {
            return res.status(500).json(error)
        }
    })()
})

router.get('/api/products', async (req, res) => {
    try {
        const query = db.collection('products')
        const querySnapshot = await query.get()
        const docs = querySnapshot.docs

        const response = docs.map(doc => ({
            id: doc.id,
            product: doc.data()
        }))

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json(error)
    }

})

router.delete('/api/products/:id', async (req, res) => {
    try {
        const document = db.collection('products').doc(req.params.id)
        await document.delete()
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json()
    }
})

router.put('/api/products/:id', async (req, res) => {
    try {
        const document = db.collection('products').doc(req.params.id)
        await document.update({
            name: req.body.name,
            price:req.body.price
        })
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json()
    }
})

module.exports = router