import { NextResponse } from 'next/server';

/**
 * Handles API errors and returns a standardized error response
 * @param error - The error object
 * @param message - Custom error message
 * @param status - HTTP status code (default: 500)
 * @returns NextResponse with error details
 */
export function handleApiError(
  error: unknown, 
  message: string = 'An error occurred', 
  status: number = 500
): NextResponse {
  console.error('API Error:', error);
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: errorMessage
    },
    { status }
  );
}

/**
 * Creates a standardized success response
 * @param data - The response data
 * @param message - Success message
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success data
 */
export function createSuccessResponse(
  data: any = null,
  message: string = 'Operation successful',
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status }
  );
}

/**
 * Validates required fields in request data
 * @param data - The data object to validate
 * @param requiredFields - Array of required field names
 * @returns Object with isValid boolean and missing fields array
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Sanitizes input data by trimming strings and removing null/undefined values
 * @param data - The data object to sanitize
 * @returns Sanitized data object
 */
export function sanitizeInput(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}