import type { FastifyReply, FastifyRequest } from 'fastify'

export const check = async (req: FastifyRequest, res: FastifyReply) => {
  const jwt = req.server.jwt
  const prisma = req.server.prisma
  const a = req.headers['authorization']?.split(' ')[1]
  // console.log(getToken)
  const decode = jwt.decode(a!)

  const aaa = jwt.verify(a!)
  console.log({ decode, aaa })
  return res.send({ a: 'ccas' })
}
