import { Component, inject } from '@angular/core';
// Importamos módulos de formularios y utilidades
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, etc.
import { Router } from '@angular/router'; // Para la navegación

// Importar el servicio de autenticación
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // IMPORTANTE: Debemos importar CommonModule y ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  // Inyección de servicios (FormBuilder para formularios, AuthService y Router)
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public authForm: FormGroup;
  public errorMessage: string = '';
  public isLoginMode: boolean = true; 

  constructor() {
    // Inicialización del formulario con validadores
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''],
      telefono: ['', Validators.pattern('^[0-9]{9}$')] // Validación simple de 9 dígitos
    });
    
    // Configuración inicial de los campos de registro
    this.setValidators();
  }
  
  /**
   * Establece o elimina los validadores para nombre y teléfono
   * según si estamos en modo Login o Registro.
   */
  private setValidators(): void {
    const nombreControl = this.authForm.get('nombre');
    const telefonoControl = this.authForm.get('telefono');

    if (this.isLoginMode) {
      // En modo LOGIN, hacemos los campos de registro opcionales
      nombreControl?.clearValidators();
      telefonoControl?.clearValidators();
    } else {
      // En modo REGISTRO, hacemos los campos de registro obligatorios
      nombreControl?.setValidators(Validators.required);
      telefonoControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
    }
    
    // Forzamos la actualización del estado del formulario
    nombreControl?.updateValueAndValidity();
    telefonoControl?.updateValueAndValidity();
    
    // Siempre validamos email y password
    this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.authForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.authForm.updateValueAndValidity();
  }
  
  /**
   * Cambia entre el modo de Login y el modo de Registro.
   */
  public toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset(); 
    this.errorMessage = '';
    // Llama a setValidators cada vez que cambia el modo
    this.setValidators(); 
  }

  /**
   * Maneja el envío del formulario, llamando a login o register según el modo.
   */
  public async onSubmit(): Promise<void> {
    this.errorMessage = ''; 
    
    // Verificamos si el formulario es inválido con los validadores actuales
    if (this.authForm.invalid) {
        this.errorMessage = 'Por favor, rellena todos los campos requeridos correctamente.';
        return;
    } 
    
    const { email, password, nombre, telefono } = this.authForm.value;
    
    try {
        if (this.isLoginMode) {
            // Modo Login
            await this.authService.login(email, password);
        } else {
            // Modo Registro: Pasamos nombre y telefono
            await this.authService.register(email, password, nombre, telefono);
        }
        
        // Si el login/registro es exitoso, redirige a la página principal
        this.router.navigate(['/']); 
        
    } catch (error) {
        this.errorMessage = (error as Error).message;
    }
  }
}