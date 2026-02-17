import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public authForm: FormGroup;
  public isLoginMode = true;
  public errorMessage = '';

  constructor() {
    this.authForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', Validators.pattern('^[0-9]{9}$')],
      terminos: [false],
    });
    this.setValidators();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
    this.setValidators();
  }

  private setValidators() {
    const email = this.authForm.get('email');
    const tel = this.authForm.get('telefono');
    const term = this.authForm.get('terminos');

    if (this.isLoginMode) {
      email?.clearValidators();
      tel?.clearValidators();
      term?.clearValidators();
    } else {
      email?.setValidators([Validators.required, Validators.email]);
      tel?.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
      term?.setValidators(Validators.requiredTrue);
    }
    email?.updateValueAndValidity();
    tel?.updateValueAndValidity();
    term?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    this.errorMessage = '';

    try {
      const { email, password, nombre, telefono } = this.authForm.value;
      if (this.isLoginMode) {
        await this.authService.loginWithUsername(nombre, password);
      } else {
        await this.authService.register(email, password, nombre, telefono);
      }
      // Navegación inmediata: el Guard se encargará de esperar si es necesario
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = err.message;
    }
  }
}
