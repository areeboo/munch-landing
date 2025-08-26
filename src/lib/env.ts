// Environment validation - like checking your car has gas before a road trip
export function validateRequiredEnvVars() {
  const required = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  };

  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(required)) {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMsg = `🚨 Missing required environment variables: ${missing.join(', ')}\n\nYour app needs these to work, like a car needs gas!`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return required as Record<string, string>;
}

// Get validated environment variables (safe to use anywhere)
export const env = validateRequiredEnvVars();