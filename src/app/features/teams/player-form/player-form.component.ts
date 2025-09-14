import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamService } from '@core/services/team.service';
import { PlayerPosition } from '@shared/interfaces/team.interface';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;
  teams = this.teamService.teams();

  positions = [
    { value: PlayerPosition.GOALKEEPER, label: 'Goleiro' },
    { value: PlayerPosition.DEFENDER, label: 'Zagueiro' },
    { value: PlayerPosition.MIDFIELDER, label: 'Meio-campista' },
    { value: PlayerPosition.FORWARD, label: 'Atacante' }
  ];

  playerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: ['', [Validators.required, Validators.min(16), Validators.max(50)]],
    teamId: ['', [Validators.required]],
    position: ['', [Validators.required]],
    number: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    photo: ['', [Validators.pattern('https?://.+\\.(jpg|jpeg|png|gif|svg)')]]
  });

  ngOnInit(): void {
    const teamId = this.route.snapshot.queryParams['teamId'];
    if (teamId) {
      this.playerForm.patchValue({ teamId });
    }
  }

  onSubmit(): void {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const playerData = this.playerForm.value;
      const playerId = this.teamService.addPlayer(playerData);

      this.snackBar.open('Jogador cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      setTimeout(() => {
        this.router.navigate(['/teams', playerData.teamId]);
      }, 1000);

    } catch {
      this.snackBar.open('Erro ao cadastrar jogador. Tente novamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/players']);
  }
}