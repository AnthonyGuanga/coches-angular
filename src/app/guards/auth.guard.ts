import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise((resolve) => {
    // Esta función se queda escuchando a la base de datos de tus capturas
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // En cuanto Firebase responde (Usuario o null), dejamos de escuchar
      unsubscribe(); 
      
      if (user) {
        console.log("Guard: ¡Sesión encontrada! Entrando a:", state.url);
        resolve(true); // Permite el paso
      } else {
        console.warn("Guard: No hay sesión activa. Redirigiendo a login.");
        router.navigate(['/login']);
        resolve(false); // Bloquea el paso
      }
    });
  });
};