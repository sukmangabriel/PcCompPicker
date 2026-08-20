type ApiLikeError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

function isApiLikeError(error: unknown): error is ApiLikeError {
  return typeof error === 'object' && error !== null
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    isApiLikeError(error) &&
    typeof error.response?.data?.message === 'string'
  ) {
    return error.response.data.message
  }

  return fallback
}
