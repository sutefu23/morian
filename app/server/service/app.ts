import Fastify, { FastifyServerFactory } from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import fastifyJwt from 'fastify-jwt'
import {
  API_JWT_SECRET,
  API_BASE_PATH,
  NODE_ENV
} from '$/envValues'
import server from '$/$server'

export const init = (serverFactory?: FastifyServerFactory) => {
  const app = Fastify({ serverFactory })
  console.log("環境:" + NODE_ENV)
  app.register(helmet)
  app.register(cors)

  app.addHook('onError', (req, reply, err) => {
    console.error("onError")
    console.error(err)
    reply.send(JSON.stringify(err))
  })

  app.register(fastifyJwt, { secret: API_JWT_SECRET, decode: { complete: true } })
  server(app, { basePath: API_BASE_PATH })
  return app
}
