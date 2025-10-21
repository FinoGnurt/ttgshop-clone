# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

# error

If you encounter the error `Error: FastifyError [Error]: Failed building the validation schema for POST: /api/user, due to error Unexpected token ':'`

```bash
npm dedupe ajv
```
