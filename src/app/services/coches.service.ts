import { Injectable } from '@angular/core';
import { 
  Firestore, // El servicio principal de Firestore
  collection, // Función para referenciar una colección
  collectionData, // Función para obtener datos de una colección
  CollectionReference, 
  DocumentData 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs'; // Necesario para la reactividad en Angular

// 1. Define la interfaz de los datos. Esto ayuda a Angular a entender qué tipo de datos esperamos.
export interface Coche {
  id?: string; // El ID que Firestore asigna al documento
  marca: string;
  modelo: string;
  precio: number;
  // Puedes añadir más campos (color, año, km...)
}

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación (Singleton)
})
export class CochesService {
  
  // Referencia a la colección 'coches' de Firestore
  private cochesCollection: CollectionReference<DocumentData>;

  // 2. Inyecta el servicio Firestore en el constructor
  constructor(private firestore: Firestore) {
    // Inicializa la referencia a la colección de la base de datos.
    // Usamos el nombre 'coches' para la colección.
    this.cochesCollection = collection(this.firestore, 'coches');
  }

  /**
   * Obtiene todos los coches de la colección 'coches' en tiempo real.
   * @returns Un Observable que emite la lista de coches (Coche[]).
   */
  public getCoches(): Observable<Coche[]> {
    // 3. collectionData transforma la referencia de la colección en un Observable.
    return collectionData(this.cochesCollection, {
      idField: 'id' // Esto asegura que el ID de Firestore se mapee al campo 'id' de nuestra interfaz Coche.
    }) as Observable<Coche[]>; // Aseguramos el tipo de retorno
  }
}