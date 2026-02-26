import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Country } from '../../models/country.interface';
import { CountryState } from '../../store/country.state';
import { LoadCountries, AddVote, ClearErrors } from '../../store/country.actions';

interface VoteForm {
  name: string;
  email: string;
  country: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  voteForm: VoteForm = {
    name: '',
    email: '',
    country: ''
  };

  searchTerm = signal('');
  
  countries = signal<Country[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  voteError = signal<string | null>(null); // Error específico para validación de votos

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Limpiar errores al inicializar la página
    this.store.dispatch(new ClearErrors());
    this.error.set(null);
    this.voteError.set(null);
    
    // Suscribirse a los observables del store usando store.select()
    this.subscriptions.push(
      this.store.select(CountryState.getCountries).subscribe(countries => {
        console.log('Countries received:', countries); // Debug log
        this.countries.set(countries);
      }),
      this.store.select(CountryState.isLoading).subscribe(loading => {
        console.log('Loading state:', loading); // Debug log
        this.isLoading.set(loading);
      }),
      this.store.select(CountryState.getError).subscribe(error => {
        console.log('Error state:', error); // Debug log
        // Distinguir entre errores de carga y errores de validación
        if (error && error.includes('Este correo ya ha registrado un voto')) {
          this.voteError.set(error);
          this.error.set(null); // Limpiar error de carga para mostrar países
        } else {
          this.error.set(error);
          this.voteError.set(null);
        }
      })
    );
    
    this.loadSpecificCountries();
  }

  ngOnDestroy(): void {
    // Limpiar las subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public loadSpecificCountries(): void {
    this.store.dispatch(new LoadCountries());
  }

  public retryLoadCountries(): void {
    // Solo limpiar errores de carga, mantener errores de validación
    this.error.set(null);
    this.store.dispatch(new LoadCountries());
  }

  isFormValid(): boolean {
    return !!(this.voteForm.name?.trim() && 
             this.voteForm.email?.trim() && 
             this.voteForm.country?.trim() &&
             this.isValidEmail(this.voteForm.email));
  }

  isEmailInvalid(): boolean {
    return !!(this.voteForm.email?.trim() && !this.isValidEmail(this.voteForm.email));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get filteredCountries(): Country[] {
    const search = this.searchTerm().toLowerCase();
    const allCountries = this.countries();
    
    if (!search) return allCountries;
    
    return allCountries.filter(country => 
      country.name.toLowerCase().includes(search) ||
      country.capital.toLowerCase().includes(search) ||
      country.region.toLowerCase().includes(search) ||
      country.subregion.toLowerCase().includes(search)
    );
  }

  onSubmitVote(): void {
    if (!this.voteForm.name || !this.voteForm.email || !this.voteForm.country) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Limpiar errores anteriores
    this.error.set(null);
    this.voteError.set(null);

    // Enviar voto al store
    this.store.dispatch(new AddVote({
      name: this.voteForm.name,
      email: this.voteForm.email,
      country: this.voteForm.country
    }));

    // Manejar respuesta
    setTimeout(() => {
      if (!this.voteError() && !this.error()) {
        this.voteForm = {
          name: '',
          email: '',
          country: ''
        };
        alert('¡Voto registrado exitosamente! Redirigiendo a la página de votos...');
        setTimeout(() => {
          this.router.navigate(['/vote']);
        }, 1000);
      } else if (this.voteError()) {
        alert(this.voteError() || 'Error al registrar el voto');
      }
    }, 100);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
