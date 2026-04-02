import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { withInterceptors, provideHttpClient } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor-interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor-interceptor';
import { loadingInterceptor } from './core/interceptors/loader.interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor, loadingInterceptor])),
  ],
};
