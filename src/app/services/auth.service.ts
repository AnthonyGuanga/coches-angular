import { Injectable, inject } from '@angular/core';
// Importaciones de Firebase Auth
import { Auth, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, switchMap, of } from 'rxjs';
// Importaciones de Firestore
import { Firestore, doc, setDoc, docData, getDoc } from '@angular/fire/firestore'; // Necesitamos docData y getDoc

// Definimos los tipos de rol
export type UserRole = 'cliente' | 'vendedor' | 'administrador';

// Interfaz para el Perfil Completo de la Aplicación
export interface AppUser {
  uid: string;
  email: string;
  rol: UserRole;
  fechaRegistro: Date;
  nombre: string; 
  telefono: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // 1. Observable del estado de Firebase Auth (solo identidad)
  public firebaseUser$ = authState(this.auth);

  // 2. Observable del Perfil Completo (Identidad + Rol de Firestore)
  public appUser$: Observable<AppUser | null> = this.firebaseUser$.pipe(
    switchMap(user => {
      if (user) {
        const userDocRef = doc(this.firestore, 'usuarios', user.uid);
        return docData(userDocRef, { idField: 'uid' }) as Observable<AppUser>;
      } else {
        return of(null);
      }
    })
  );

  /**
   * Intenta iniciar sesión con Email y Contraseña.
   */
  public async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }
  }

  /**
   * registrar un nuevo usuario y crea su documento de perfil en firestore
   */
  public async register(email: string, password: string, nombre: string, telefono: string): Promise<void> {
    try {
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      const user = userCredential.user;
      
      // 2. Crear el documento de perfil en Firestore
      const userDocRef = doc(this.firestore, 'usuarios', user.uid);
      
      // Perfil completo con los nuevos datos
      const newUserProfile: AppUser = {
        email: email, 
        uid: user.uid,
        rol: 'cliente', 
        fechaRegistro: new Date(),
        nombre: nombre, 
        telefono: telefono 
      };
      
      await setDoc(userDocRef, newUserProfile);
      
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw new Error("El correo ya está en uso o la contraseña es muy débil (mínimo 6 caracteres).");
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  public async logout(): Promise<void> {
    await signOut(this.auth);
  }
}