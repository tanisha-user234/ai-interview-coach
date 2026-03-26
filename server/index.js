const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')
require('dotenv').config()

fastify.register(cors, {
  origin: '*'
})

fastify.register(require('./routes'))

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
