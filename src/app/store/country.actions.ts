import { Country, Vote } from '../models/country.interface';

export class LoadCountries {
  static readonly type = '[Country] Load Countries';
}

export class LoadCountriesSuccess {
  static readonly type = '[Country] Load Countries Success';
  constructor(public countries: Country[]) {}
}

export class LoadCountriesFailure {
  static readonly type = '[Country] Load Countries Failure';
  constructor(public error: string) {}
}

export class AddVote {
  static readonly type = '[Country] Add Vote';
  constructor(public voteData: { name: string; email: string; country: string }) {}
}

export class AddVoteSuccess {
  static readonly type = '[Country] Add Vote Success';
  constructor(public vote: Vote) {}
}

export class ClearErrors {
  static readonly type = '[Country] Clear Errors';
}