type ErrorT = {
  name: string | null,
  message: string,
  cause: Error | null | undefined,
  stack: string | null | undefined
} | string

export function errDetails(err: Error | unknown): ErrorT {
  let errorDetails: ErrorT = {
    name : null,
    message: "",
    cause: null,
    stack: null
  }

  if (err instanceof Error) {
    errorDetails.name = err.name
    errorDetails.message = err.message
    errorDetails.cause = err.cause
    errorDetails.stack = err.stack
  } else {
    errorDetails.name = null
    errorDetails.message = err as string
    errorDetails.cause = null
    errorDetails.stack = null
  }

  return errorDetails
}