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

  async loginWithUsername(username: string, password: string): Promise<void> {
    const q = query(collection(this.firestore, 'usuarios'), where('nombre', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw new Error('El usuario no existe');

    const email = querySnapshot.docs[0].data()['email'];
    await signInWithEmailAndPassword(this.auth, email, password);
    this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 3000 });
  }

  async register(email: string, password: string, nombre: string, telefono: string): Promise<void> {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.firestore, 'usuarios', res.user.uid), {
      uid: res.user.uid,
      email,
      nombre,
      telefono,
      rol: 'cliente',
      fechaRegistro: new Date()
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}