import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DatePipe } from "@angular/common";
import { RankingService } from "@core/services/ranking.service";

@Component({
  selector: "app-ranking",
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
  ],
  templateUrl: "./ranking.component.html",
  styleUrl: "./ranking.component.scss",
})
export class RankingComponent {
  rankingService = inject(RankingService);

  displayedColumns: string[] = [
    "position",
    "team",
    "points",
    "matches",
    "wins",
    "draws",
    "losses",
    "goalsFor",
    "goalsAgainst",
    "goalDifference",
    "form",
  ];

  getPositionClass(position: number): string {
    if (position <= 4)
      return `position-${position} position-champions basic-position`;
    if (position <= 6) return "position-europa basic-position";
    if (position >= 17) return "position-relegation basic-position";
    return "basic-position";
  }

  getGoalDifferenceClass(difference: number): string {
    if (difference > 0) return "goal-difference-positive";
    if (difference < 0) return "goal-difference-negative";
    return "";
  }

  getFormChipClass(result: string): string {
    switch (result) {
      case "W":
        return "form-win";
      case "D":
        return "form-draw";
      case "L":
        return "form-loss";
      default:
        return "";
    }
  }
}
