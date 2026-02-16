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
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
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
  fotos?: string[];
  reservadoPor?: string;
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

  /** 🔹 OBTENER COCHES (Con filtro opcional) */
  public getCoches(tipoFiltrado?: string | null): Observable<Coche[]> {
    const colRef = this.cochesCollection;
    let q;

    if (tipoFiltrado) {
      const valorBusqueda = tipoFiltrado.toLowerCase().trim();
      q = query(colRef, where('tipo', 'array-contains', valorBusqueda));
    } else {
      q = query(colRef);
    }

    return collectionData(q, { idField: 'id' }) as Observable<Coche[]>;
  }

  /** 🔹 OBTENER UN SOLO COCHE POR ID */
  public getCocheById(id: string): Observable<Coche> {
    const ref = doc(this.firestore, `coches/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Coche>;
  }

  /** 🔹 OBTENER FOTOS DE LA SUBCOLECCIÓN */
  public getFotosCoche(id: string): Observable<any[]> {
    const ref = collection(this.firestore, `coches/${id}/fotos`);
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  /** 🔹 AÑADIR COCHE */
  public addCoche(coche: Coche): Promise<any> {
    const { id, ...cocheSinId } = coche;
    const datosParaGuardar = {
      ...cocheSinId,
      uidVendedor: 'ID_TEMPORAL_PRUEBAS',
      fechaCreacion: new Date(),
    };
    return addDoc(this.cochesCollection, datosParaGuardar);
  }

  /** 🔹 ACTUALIZAR COCHE */
  public updateCoche(id: string, coche: Coche): Promise<void> {
    const { id: _, ...cocheSinId } = coche;
    const ref = doc(this.firestore, `coches/${id}`);
    const datosParaActualizar = {
      ...cocheSinId,
      fechaActualizacion: new Date(),
    };
    return updateDoc(ref, datosParaActualizar);
  }

  /** 🔹 RESERVAR COCHE (El método que te faltaba) */
  public async reservarCoche(idCoche: string, uidUsuario: string): Promise<void> {
    const ref = doc(this.firestore, `coches/${idCoche}`);
    
    // Solo actualizamos el campo reservadoPor para no sobrescribir todo el coche
    return updateDoc(ref, {
      reservadoPor: uidUsuario,
      fechaReserva: new Date() 
    });
  }

  /** ELIMINAR COCHE */
  public async deleteCar(id: string) {
    const ref = doc(this.firestore, 'coches', id);
    await deleteDoc(ref);
  }

  /** QUITAR RESERVA (solo admin o desbloquear coche) */
  public async quitarReserva(idCoche: string): Promise<void> {
    const ref = doc(this.firestore, `coches/${idCoche}`);
    await updateDoc(ref, {
      reservadoPor: null,
      fechaReserva: null
    });
  }

}