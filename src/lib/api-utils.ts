import { NextResponse } from 'next/server';

/**
 * Utility per gestire errori API in modo consistente
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = 'Errore interno del server',
  status: number = 500
) {
  console.error(defaultMessage, error);
  
  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
      details: error instanceof Error ? error.message : 'Errore sconosciuto'
    },
    { status }
  );
}

/**
 * Utility per creare risposte API di successo standardizzate
 */
export function createSuccessResponse(
  data: Record<string, any>,
  message?: string
) {
  return NextResponse.json({
    success: true,
    ...data,
    ...(message && { message })
  });
}

/**
 * Utility per validare parametri richiesti
 */
export function validateRequiredParams(
  params: Record<string, any>,
  required: string[]
): string | null {
  for (const param of required) {
    if (!params[param]) {
      return `Parametro mancante: ${param}`;
    }
  }
  return null;
}

/**
 * Utility per validare email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Utility per validare password
 */
export function isValidPassword(password: string): boolean {
  // Almeno 8 caratteri, una maiuscola, una minuscola, un numero
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Utility per sanitizzare input utente
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '');
}