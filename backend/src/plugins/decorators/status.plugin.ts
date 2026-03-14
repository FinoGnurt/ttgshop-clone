// src/plugins/status-decorator.ts

import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { STATUS_CODE } from '~/constants/statusCode.ts'
import { STATUS_TEXT } from '~/constants/statusText.ts'

const statusDecorator: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('statusCode', STATUS_CODE)
  fastify.decorate('statusText', STATUS_TEXT)
}

export default fp(statusDecorator)
