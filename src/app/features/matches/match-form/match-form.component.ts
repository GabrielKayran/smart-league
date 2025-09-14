import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatchService } from '@core/services/match.service';
import { TeamService } from '@core/services/team.service';
import { MatchStatus } from '@shared/interfaces/match.interface';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './match-form.component.html',
  styleUrl: './match-form.component.scss'
})
export class MatchFormComponent {
  private fb = inject(FormBuilder);
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;
  teams = this.teamService.teams();

  matchForm: FormGroup = this.fb.group({
    homeTeam: ['', [Validators.required]],
    awayTeam: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    stadium: ['', [Validators.required, Validators.minLength(2)]]
  }, { validators: this.sameTeamValidator });

  sameTeamValidator(form: FormGroup) {
    const homeTeam = form.get('homeTeam')?.value;
    const awayTeam = form.get('awayTeam')?.value;
    
    if (homeTeam && awayTeam && homeTeam === awayTeam) {
      return { sameTeam: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.matchForm.invalid) {
      this.matchForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.matchForm.value;
      
      const matchDate = new Date(formValue.date);
      const [hours, minutes] = formValue.time.split(':');
      matchDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const matchData = {
        homeTeam: formValue.homeTeam,
        awayTeam: formValue.awayTeam,
        date: matchDate,
        stadium: formValue.stadium,
        status: MatchStatus.SCHEDULED
      };

      const matchId = this.matchService.createMatch(matchData);

      this.snackBar.open('Partida agendada com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      setTimeout(() => {
        this.router.navigate(['/matches', matchId]);
      }, 1000);

    } catch {
      this.snackBar.open('Erro ao agendar partida. Tente novamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/matches']);
  }
}