import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// --- NUEVAS IMPORTACIONES DE FIREBASE ---
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// ¡AÑADIR ESTA IMPORTACIÓN!
import { getAuth, provideAuth } from '@angular/fire/auth'; 
import { environment } from '../environments/environment'; 
// -----------------------------------------

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),

    // --- PROVEEDORES DE FIREBASE ---
    // 1. Inicializa la aplicación de Firebase con la configuración del entorno.
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    // 2. Provee la conexión de Firestore (Base de Datos).
    provideFirestore(() => getFirestore()),
    
    // 3. ¡NUEVO! Provee la conexión de Authentication (LOGIN/USUARIOS).
    provideAuth(() => getAuth()) 
    // -----------------------------------------
  ]
};