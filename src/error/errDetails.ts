export function errDetails(err: Error | unknown): string {
  let errorDetails: string

  if (err instanceof Error) {
    errorDetails = err.message
  } else {
    errorDetails = err as string
  }

  return errorDetails
}