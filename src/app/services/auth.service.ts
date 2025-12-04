import { Injectable, inject } from '@angular/core';
// Importaciones de Firebase Auth
import { Auth, User, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';
// Importaciones de Firestore
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Inyección de servicios
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Observable que rastrea el estado de la autenticación: emite el objeto User o null.
  public user$: Observable<User | null> = authState(this.auth);

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
   * Intenta registrar un nuevo usuario y crea su documento de perfil en Firestore.
   */
  public async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      const user = userCredential.user;
      
      // CRUCIAL: Creamos el documento de perfil en Firestore, usando el UID como ID del Documento.
      // Colección: 'usuarios' -> Documento: user.uid
      const userDocRef = doc(this.firestore, 'usuarios', user.uid);
      
      // Perfil básico
      await setDoc(userDocRef, {
        email: user.email,
        uid: user.uid,
        rol: 'cliente',
        fechaRegistro: new Date()
      });
      
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