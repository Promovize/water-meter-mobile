export const getErrorMessage = (error: any): string => {
  // If error is a string, return it directly
  if (typeof error === "string") {
    return error;
  }

  // If error is an instance of Error, return its message
  if (error instanceof Error) {
    return error.message;
  }

  // If error is a Supabase PostgrestError or a similar structured error
  if ("message" in error && "details" in error && "code" in error) {
    let errorMessage = `Supabase Error: ${error.message}`;
    if (error.details) {
      errorMessage += ` - Details: ${error.details}`;
    }
    if (error.hint) {
      errorMessage += ` - Hint: ${error.hint}`;
    }
    return errorMessage;
  }

  // If error is an OpenAI error, return its message
  if ("code" in error && "message" in error) {
    return `OpenAI Error: ${error.code} - ${error.message}`;
  }

  // If error is an Axios error, return its response message or default message
  if ("isAxiosError" in error && error.isAxiosError) {
    return error.response?.data?.message || error.message || "An error occurred while making a request";
  }

  // Improved Fetch error handling
  if ("type" in error && error.type === "fetch") {
    return error.response?.statusText || "Failed to fetch";
  }

  // Nested error objects (e.g., error wrapped in another object)
  if ("error" in error && typeof error.error === "string") {
    return error.error;
  }

  // Default to a generic error message if none of the above conditions are met
  return "An unexpected error occurred";
};
