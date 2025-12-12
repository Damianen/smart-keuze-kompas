import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const handleError = (error: HttpErrorResponse) => {
  if (error.error && typeof error.error === 'object' && !Array.isArray(error.error)) {
    console.error('API Validation Error:', error.error);
    return throwError(() => error.error);
  }

  const message = error.error?.message || 'Fout bij het verwerken van de aanvraag.';
  return throwError(() => ({ errorMessage: message }));
};
