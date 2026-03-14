import type { FastifyError } from 'fastify'

type ErrorDetails = Record<string, string>

/**
 * Custom Error class for validation errors with custom messages and status codes.
 * Extends `Error` and implements `FastifyError`.
 *
 * @class CustomError
 * @extends {Error}
 * @implements {FastifyError}
 * @property {string} code - Custom error code (e.g., `DB_ERR_VALIDATION`).
 * @property {number} statusCode - HTTP status code (e.g., `400`, `500`).
 * @property {ErrorDetails} [validationErrors] - Optional validation errors.
 *
 * @param {number} statusCode - HTTP status code.
 * @param {ErrorDetails} [input] - Optional validation errors.
 *
 * @example new CustomError(400, { email: "INVALID_EMAIL", password: "INVALID_PASSWORD" });
 * @example new CustomError(500);
 */

export class CustomError extends Error implements FastifyError {
  code: string // Required by FastifyError
  statusCode: number
  validationErrors?: ErrorDetails // Holds field error details

  constructor(statusCode: number, input?: ErrorDetails) {
    super(
      input
        ? Object.values(input)
            .map((value) => value)
            .join(', ')
        : 'There was an error working with data in the database!'
    )

    this.statusCode = statusCode
    this.code = 'DB_ERR_VALIDATION' // DB_ERR_VALIDATION => Database Error Validation

    if (input) this.validationErrors = input // Store the processed error details
  }
}
