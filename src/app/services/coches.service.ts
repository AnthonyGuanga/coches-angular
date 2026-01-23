import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  doc,
  docData,
  query, // 👈 Nuevo
  where, // 👈 Nuevo
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Coche {
  id: string;
  anio?: number;
  cambio?: string;
  combustible?: string;
  kilometraje?: number;
  marca?: string;
  modelo?: string;
  motor?: string;
  nombreImagen?: string;
  precio?: number;
  fotoPrincipal?: string;
  fotos?: string[]; // Array de URLs de fotos

  // 👇 IMPORTANTE: Ahora es un array de strings (ej: ['suv', 'sedan'])
  tipo?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CochesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private cochesCollection: CollectionReference<DocumentData> = collection(
    this.firestore,
    'coches'
  );

  /** * 🔹 OBTENER COCHES (Con filtro opcional)
   * Si pasas un tipo (ej: 'SUV'), filtra. Si no, trae todos.
   */
  public getCoches(tipoFiltrado?: string | null): Observable<Coche[]> {
    const colRef = this.cochesCollection;

    let q;

    if (tipoFiltrado) {
      // Normalizamos a minúsculas para asegurar coincidencia
      const valorBusqueda = tipoFiltrado.toLowerCase().trim();

      // Usamos 'array-contains' porque en la BD 'tipo' es una lista: ['suv', 'hatchback']
      q = query(colRef, where('tipo', 'array-contains', valorBusqueda));
    } else {
      // Sin filtro, traemos toda la colección
      q = query(colRef);
    }

    return collectionData(q, { idField: 'id' }) as Observable<Coche[]>;
  }

  /** 🔹 OBTENER UN SOLO COCHE POR ID */
  public getCocheById(id: string): Observable<Coche> {
    const ref = doc(this.firestore, `coches/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Coche>;
  }

  /** 🔹 OBTENER FOTOS DE LA SUBCOLECCIÓN (Si la usas) */
  public getFotosCoche(id: string): Observable<any[]> {
    const ref = collection(this.firestore, `coches/${id}/fotos`);
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  public addCoche(coche: Coche): Promise<any> {
    //const user = this.auth.currentUser;
    //if (!user) throw new Error('No autenticado');

    const { id, ...cocheSinId } = coche;

    const datosParaGuardar = {
      ...cocheSinId,
      uidVendedor: 'ID_TEMPORAL_PRUEBAS',
      fechaCreacion: new Date(),
    };

    return addDoc(this.cochesCollection, datosParaGuardar);
  }
  public updateCoche(id: string, coche: Coche): Promise<void> {
    // Quitamos el id del objeto antes de guardar
    const { id: _, ...cocheSinId } = coche;

    const ref = doc(this.firestore, `coches/${id}`);

    const datosParaActualizar = {
      ...cocheSinId,
      fechaActualizacion: new Date(),
    };

    return updateDoc(ref, datosParaActualizar);
  }
}
