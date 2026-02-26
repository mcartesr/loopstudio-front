import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Country, Vote } from '../models/country.interface';
import { CountryService } from '../services/country.service';
import { LoadCountries, LoadCountriesSuccess, LoadCountriesFailure, AddVote, AddVoteSuccess, ClearErrors } from './country.actions';

export interface CountryStateModel {
  countries: Country[];
  votes: Vote[];
  loading: boolean;
  error: string | null;
}

@State<CountryStateModel>({
  name: 'country',
  defaults: {
    countries: [],
    votes: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class CountryState {

  constructor(private countryService: CountryService) {}

  @Selector()
  static getCountries(state: CountryStateModel) {
    return state.countries;
  }

  @Selector()
  static getVotes(state: CountryStateModel) {
    return state.votes;
  }

  @Selector()
  static isLoading(state: CountryStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: CountryStateModel) {
    return state.error;
  }

  @Action(LoadCountries)
  loadCountries(ctx: StateContext<CountryStateModel>) {
    const state = ctx.getState();
    
    // Si ya tenemos países cargados, no hacer nueva llamada HTTP
    if (state.countries && state.countries.length > 0) {
      console.log('Countries already loaded from store, skipping HTTP call');
      return;
    }

    ctx.patchState({ loading: true, error: null });
    console.log('Loading countries from API...');

    return this.countryService.getSpecificCountries().pipe(
      tap((countries: Country[]) => {
        ctx.dispatch(new LoadCountriesSuccess(countries));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadCountriesFailure(error.message || 'Error loading countries'));
        return throwError(error);
      })
    );
  }

  @Action(LoadCountriesSuccess)
  loadCountriesSuccess(ctx: StateContext<CountryStateModel>, action: LoadCountriesSuccess) {
    ctx.patchState({
      countries: action.countries,
      loading: false,
      error: null
    });
  }

  @Action(LoadCountriesFailure)
  loadCountriesFailure(ctx: StateContext<CountryStateModel>, action: LoadCountriesFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(AddVote)
  addVote(ctx: StateContext<CountryStateModel>, action: AddVote) {
    const state = ctx.getState();
    
    // Validar si el email ya votó
    const emailAlreadyExists = state.votes.some(vote => 
      vote.email.toLowerCase() === action.voteData.email.toLowerCase()
    );
    
    if (emailAlreadyExists) {
      ctx.dispatch(new LoadCountriesFailure('Este correo ya ha registrado un voto'));
      return;
    }
    
    const voteId = Date.now().toString();
    
    const newVote: Vote = {
      id: voteId,
      name: action.voteData.name,
      email: action.voteData.email,
      country: action.voteData.country,
      timestamp: new Date()
    };

    // Actualizar votos del país
    const updatedCountries = state.countries.map(country => 
      country.name === action.voteData.country 
        ? { ...country, votes: country.votes + 1 }
        : country
    ).sort((a, b) => b.votes - a.votes); // Re-ordenar por votos

    ctx.patchState({
      countries: updatedCountries,
      votes: [...state.votes, newVote]
    });

    ctx.dispatch(new AddVoteSuccess(newVote));
  }

  @Action(AddVoteSuccess)
  addVoteSuccess(ctx: StateContext<CountryStateModel>, action: AddVoteSuccess) {
    // Aquí podrías agregar lógica adicional como mostrar un toast de éxito
    console.log('Vote added successfully:', action.vote);
  }

  @Action(ClearErrors)
  clearErrors(ctx: StateContext<CountryStateModel>) {
    ctx.patchState({
      error: null
    });
  }
}