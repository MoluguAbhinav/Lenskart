const cds = require('@sap/cds')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'REPLACE_THIS_WITH_A_STRONG_SECRET'

module.exports = cds.service.impl(async function() {
  const { Users, Orders, OrderItems } = this.entities

  // Signup
  this.on('signup', async (req) => {
    let { email, password, username, mobilenumber } = req.data
    if (!email || !password || !username || !mobilenumber)
      return req.reject(400, "All fields required")
    let exists = await SELECT.one.from(Users).where({ email })
    if (exists) return req.reject(400, "Email already exists")
    let hash = await bcrypt.hash(password, 10)
    let id = cds.utils.uuid()
    await INSERT.into(Users).entries({ ID: id, email, password: hash, username, mobilenumber, createdAt: new Date() })
    return { success: true }
  })

  // Login
  this.on('login', async (req) => {
    let { email, password } = req.data
    let user = await SELECT.one.from(Users).where({ email })
    if (!user) return req.reject(401, "Invalid credentials")
    let valid = await bcrypt.compare(password, user.password)
    if (!valid) return req.reject(401, "Invalid credentials")
    let token = jwt.sign({ id: user.ID, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
    return { token, username: user.username }
  })

  // Middleware to extract JWT user
  this.before('*', (req) => {
    if (req.event === 'signup' || req.event === 'login') return
    let auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return req.reject(401, "Missing JWT")
    try {
      let decoded = jwt.verify(auth.replace('Bearer ','').trim(), JWT_SECRET)
      req.userId = decoded.id
    } catch(e) {
      return req.reject(401, "Invalid JWT")
    }
  })

  // Place order
  this.on('placeOrder', async (req) => {
    let { items, total } = req.data
    if (!items || !items.length) return req.reject(400, "Cart empty")
    let orderId = cds.utils.uuid()
    await INSERT.into(Orders).entries({ ID: orderId, user_ID: req.userId, total, date: new Date() })
    for (let item of items) {
      await INSERT.into(OrderItems).entries({
        ID: cds.utils.uuid(),
        order_ID: orderId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })
    }
    return { success: true, orderId }
  })

  // Fetch my orders
  this.on('myOrders', async (req) => {
    let orders = await SELECT
      .from(Orders)
      .where({ user_ID: req.userId })
      .columns('ID', 'date', 'total', { items: ['name','quantity','price','image'] })
      .orderBy('date desc')
    return orders
  })
})