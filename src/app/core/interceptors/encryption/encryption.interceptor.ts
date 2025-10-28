import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EncryptionService } from '../../services/encryption/encryption.service';

export const encryptionInterceptor: HttpInterceptorFn = (req, next) => {
  const encryptionService = inject(EncryptionService);

  if (!environment.encryption) {
    return next(req);
  }

  if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req = req.clone({ body: encryptionService.encrypt(req.body) });
  }

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        try {
          const decryptedBody = encryptionService.decrypt(
            event.body as Record<string, string>
          );
          return event.clone({ body: decryptedBody });
        } catch (e) {
          throw new Error('Failed to decrypt the server response');
        }
      }
      return event;
    })
  );
};
