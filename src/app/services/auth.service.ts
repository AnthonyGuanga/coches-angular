import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, collection, query, where, getDocs } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public firebaseUser$ = authState(this.auth);
  private _user$ = new BehaviorSubject<any | null>(null);
  public appUser$ = this._user$.asObservable().pipe(shareReplay(1));

  constructor() {
    this.firebaseUser$.pipe(
      switchMap(user => user ? docData(doc(this.firestore, 'usuarios', user.uid)) : of(null))
    ).subscribe(u => this._user$.next(u));
  }

  // --- LOGIN CON NOMBRE DE USUARIO ---
  async loginWithUsername(username: string, password: string): Promise<void> {
    const q = query(collection(this.firestore, 'usuarios'), where('nombre', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      this.snackBar.open('El usuario no existe', 'Cerrar', { duration: 3000 });
      throw new Error('El usuario no existe');
    }

    const email = querySnapshot.docs[0].data()['email'];
    await signInWithEmailAndPassword(this.auth, email, password);
    this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 3000 });
  }

  // --- REGISTRO CON COMPROBACIONES ---
  async register(email: string, password: string, nombre: string, telefono: string): Promise<void> {
    try {
      // 1. Comprobar si el NOMBRE DE USUARIO ya existe en Firestore
      const q = query(collection(this.firestore, 'usuarios'), where('nombre', '==', nombre));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        this.snackBar.open(`El nombre "${nombre}" ya está en uso.`, 'Cerrar', { duration: 4000 });
        throw new Error('Nombre de usuario duplicado');
      }

      // 2. Crear el usuario en Firebase Authentication (Email y Pass)
      const res = await createUserWithEmailAndPassword(this.auth, email, password);

      // 3. Guardar los datos adicionales en la colección 'usuarios'
      await setDoc(doc(this.firestore, 'usuarios', res.user.uid), {
        uid: res.user.uid,
        email: email,
        nombre: nombre,
        telefono: telefono,
        rol: 'cliente',
        fechaRegistro: new Date()
      });

      this.snackBar.open('¡Cuenta creada con éxito!', 'OK', { duration: 3000 });

    } catch (error: any) {
      // Manejo de errores específicos de Firebase Auth
      if (error.code === 'auth/email-already-in-use') {
        this.snackBar.open('Este email ya está registrado.', 'Cerrar', { duration: 4000 });
        throw new Error('Email duplicado');
      }
      
      if (error.code === 'auth/weak-password') {
        this.snackBar.open('La contraseña es muy débil.', 'Cerrar', { duration: 4000 });
        throw new Error('Contraseña débil');
      }

      // Si no es un error controlado, lanzamos el original
      throw error;
    }
  }

  /** Obtener usuario por UID */
  getUserById(uid: string) {
    return docData(doc(this.firestore, `usuarios/${uid}`));
  }

  // --- LOGOUT ---
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}