import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  collectionData, 
  doc, 
  updateDoc 
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  /**
   * OBJETIVO: Traer los coches donde el campo 'reservadoPor' coincida con el UID de Sonia.
   * Usamos switchMap para que, si el usuario hace F5, la consulta espere a que el UID esté listo.
   */
  getMisReservas(): Observable<any[]> {
    return this.authService.firebaseUser$.pipe(
      switchMap(user => {
        if (!user) {
          // Si no hay usuario detectado aún, devolvemos un array vacío
          return of([]);
        }
        
        // Buscamos en la colección 'coches'
        const cochesRef = collection(this.firestore, 'coches');
        
        // Filtramos: reservadoPor debe ser igual al UID del usuario logueado
        const q = query(cochesRef, where('reservadoPor', '==', user.uid));
        
        // Retornamos los datos en tiempo real (si cambias algo en Firebase, la web se actualiza sola)
        return collectionData(q, { idField: 'id' });
      })
    );
  }

  /**
   * OBJETIVO: "Liberar" el coche.
   * No borramos el documento, solo ponemos el campo 'reservadoPor' a null.
   */
  async cancelarReserva(cocheId: string) {
    try {
      const cocheRef = doc(this.firestore, 'coches', cocheId);
      
      // Actualizamos el documento en Firestore
      await updateDoc(cocheRef, {
        reservadoPor: null
      });
      
      console.log("Coche liberado con éxito");
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      throw error;
    }
  }
}