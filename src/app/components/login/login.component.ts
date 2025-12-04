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

  // Propiedad para el formulario reactivo
  public authForm: FormGroup;
  // Propiedad para mostrar mensajes de error al usuario
  public errorMessage: string = '';
  // Bandera para cambiar entre modo 'login' y 'register'
  public isLoginMode: boolean = true; 

  constructor() {
    // Inicialización del formulario con validadores
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  /**
   * Cambia entre el modo de Login y el modo de Registro.
   */
  public toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    // Opcional: limpiar el formulario al cambiar de modo
    this.authForm.reset(); 
    this.errorMessage = '';
  }

  /**
   * Maneja el envío del formulario, llamando a login o register según el modo.
   */
  public async onSubmit(): Promise<void> {
    this.errorMessage = ''; // Limpiar errores previos
    
    if (this.authForm.invalid) {
        this.errorMessage = 'Por favor, introduce un correo válido y una contraseña de al menos 6 caracteres.';
        return;
    } 
    
    const { email, password } = this.authForm.value;
    
    try {
        if (this.isLoginMode) {
            // Modo Login
            await this.authService.login(email, password);
            console.log("Login exitoso. Redirigiendo.");
        } else {
            // Modo Registro
            await this.authService.register(email, password);
            console.log("Registro exitoso. Redirigiendo.");
        }
        
        // Si el login/registro es exitoso, redirige a la página principal
        this.router.navigate(['/']); 
        
    } catch (error) {
        // Captura el error lanzado por el AuthService
        this.errorMessage = (error as Error).message;
    }
  }
}