import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
// Importaciones de Firebase Auth
import { 
  Auth, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
// Importaciones de Firestore
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
// RxJS
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

// Definimos los tipos de rol
export type UserRole = 'cliente' | 'vendedor' | 'administrador';

// Interfaz para el Perfil Completo de la Aplicación
export interface AppUser {
  uid: string;
  email: string;
  rol: UserRole;
  fechaRegistro: any; // Usamos any para manejar el Timestamp de Firebase o Date
  nombre: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router = inject(Router);

  // BehaviorSubject interno para controlar appUser$
  private _user$ = new BehaviorSubject<AppUser | null>(null);
  public appUser$: Observable<AppUser | null> = this._user$.asObservable().pipe(shareReplay(1));;

  // 1. Observable del estado de Firebase Auth (identidad básica)
  public firebaseUser$ = authState(this.auth);

  constructor() {
    // Escucha cambios en firebaseUser$ y actualiza _user$ automáticamente
    this.firebaseUser$.pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestore, 'usuarios', user.uid);
          return docData(userDocRef, { idField: 'uid' }) as Observable<AppUser>;
        } else {
          return of(null);
        }
      })
    ).subscribe(u => this._user$.next(u));
  }

  /**
 * Devuelve true si el usuario actual es administrador
 */
  public isAdmin(): Observable<boolean> {
    return this.appUser$.pipe(
      switchMap(user => {
        if (!user) return of(false);
        return of(user.rol === 'administrador');
      })
    );
  }

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
   * Registra un nuevo usuario y crea su documento de perfil en Firestore.
   */
  public async register(email: string, password: string, nombre: string, telefono: string): Promise<void> {
    try {
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // 2. Crear el objeto de perfil
      const newUserProfile: AppUser = {
        uid: user.uid,
        email: email,
        rol: 'cliente',
        fechaRegistro: new Date(),
        nombre: nombre,
        telefono: telefono
      };

      // 3. Guardar en la colección 'usuarios' de Firestore
      const userDocRef = doc(this.firestore, 'usuarios', user.uid);
      await setDoc(userDocRef, newUserProfile);

    } catch (error: any) {
      console.error("Error al registrar el usuario:", error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("El correo ya está registrado.");
      }
      throw new Error("Error en el registro. Mínimo 6 caracteres en la contraseña.");
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  public async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this._user$.next(null); // fuerza actualización
      // Aquí es donde usamos el router:
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
}