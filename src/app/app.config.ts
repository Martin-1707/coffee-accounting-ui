import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: environment.base ? [new URL(environment.base).hostname] : [],
          disallowedRoutes: environment.base ? [`${environment.base}/login/forget`] : [],
        },
      })
    )
    , provideAnimationsAsync()
  ],
};
