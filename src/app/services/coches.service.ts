import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  doc,
  docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Coche {
  id: string;
  ANIO?: number;
  CAMBIO?: string;
  COMBUSTIBLE?: string;
  KILOMETRAJE?: number;
  MARCA?: string;
  MODELO?: string;
  MOTOR?: string;
  NOMBREIMAGEN?: string;
  PRECIO?: number;
  fotoPrincipal?: string;

  fotos?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CochesService {

  // usar inject() → recomendado por Angular & AngularFire
  private firestore = inject(Firestore);

  private cochesCollection: CollectionReference<DocumentData> =
    collection(this.firestore, 'coches');

  /** 🔹 OBTENER TODOS LOS COCHES */
  public getCoches(): Observable<Coche[]> {
    return collectionData(this.cochesCollection, {
      idField: 'id'
    }) as Observable<Coche[]>;
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
}
