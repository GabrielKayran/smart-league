import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  teamForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    foundedYear: ['', [
      Validators.required, 
      Validators.min(1850), 
      Validators.max(new Date().getFullYear())
    ]],
    stadium: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    logo: ['', [Validators.pattern('https?://.+\\.(jpg|jpeg|png|gif|svg)')]]
  });

  onSubmit(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const teamData = this.teamForm.value;
      const teamId = this.teamService.addTeam(teamData);

      this.snackBar.open('Time cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      setTimeout(() => {
        this.router.navigate(['/teams', teamId]);
      }, 1000);

    } catch  {
      this.snackBar.open('Erro ao cadastrar time. Tente novamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/teams']);
  }
}
