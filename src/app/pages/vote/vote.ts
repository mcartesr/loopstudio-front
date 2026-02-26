import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { Vote } from '../../models/country.interface';
import { CountryState } from '../../store/country.state';
import { ClearErrors } from '../../store/country.actions';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.html',
  styleUrl: './vote.scss'
})
export class VoteComponent implements OnInit, OnDestroy {
  votes = signal<Vote[]>([]);
  isLoading = signal(false);
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Limpiar errores del store al navegar a esta página
    this.store.dispatch(new ClearErrors());
    
    // Suscribirse a los votos del store
    this.subscriptions.push(
      this.store.select(CountryState.getVotes).subscribe(votes => {
        console.log('Votes received:', votes);
        this.votes.set(votes || []);
      }),
      this.store.select(CountryState.isLoading).subscribe(loading => {
        this.isLoading.set(loading);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
