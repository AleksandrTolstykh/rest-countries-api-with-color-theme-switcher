import { Component } from '@angular/core';
import { faMoon as faMoonSolid } from '@fortawesome/free-solid-svg-icons';
import { faMoon as faMoonRegular } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';

class Country {
  name = "";
  flag = "";
  population = "";
  region = "";
  capital = "";
  nativeName = "";
  subRegion = "";
  topLevelDomain: string[] = [];
  currencies: string[] = [];
  languages: string[] = [];
  borderCountries: string[] = [];

  constructor(name: string, flag: string, population: string, region: string, capital: string) {
    this.name = name;
    this.flag = flag;
    this.population = population;
    this.region = region;
    this.capital = capital;
  }

  addDetails(nativeName: string, subRegion: string, topLevelDomain: string[], currencies: string[], languages: string[], borderCountries: string[]) {
    this.nativeName = nativeName;
    this.subRegion = subRegion;
    this.topLevelDomain = topLevelDomain;
    this.currencies = currencies;
    this.languages = languages;
    this.borderCountries = borderCountries;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rest-countries-api-with-color-theme-switcher';
  columns = 0;
  darkMode = false;
  solidMoonIcon = faMoonSolid;
  regularMoonIcon = faMoonRegular;
  searchIcon = faSearch;
  backIcon = faArrowLeft;
  error = false;
  countries: Country[] = [];
  selectedRegion = "";
  selectedCountry = "";
  detailed = false;
  countryInfo: Country = new Country("", "", "", "", "");

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.columns = (window.innerWidth <= 768) ? 1 : 4;
    this.http.get("https://restcountries.com/v2/all", {})
    .subscribe(
      (data: any) => {
        this.error = false;
        for (let elem of data) {
          this.countries.push(new Country(elem.name, elem.flags.svg, elem.population, elem.region, elem.capital));
        }
      },
      (error: any) => {
        this.error = true;
      }
    );
  }

  onResize(event: any) {
    this.columns = (event.target.innerWidth <= 768) ? 1 : 4;
  }

  toggleTheme(event: any) {
    this.darkMode = !this.darkMode;
  }

  filterRegion(event: any) {
    this.countries = [];
    this.http.get("https://restcountries.com/v2/region/" + event.target.outerText, {})
    .subscribe(
      (data: any) => {
        this.error = false;
        for (let elem of data) {
          this.countries.push(new Country(elem.name, elem.flags.svg, elem.population, elem.region, elem.capital));
        }
      },
      (error: any) => {
        this.error = true;
      }
    );
  }

  searchCountry(event: any) {
    this.detailed = true;
    this.http.get("https://restcountries.com/v2/name/" + this.selectedCountry, {})
    .subscribe(
      (data: any) => {
        this.error = false;
        console.log(data);
        this.countryInfo = new Country(data[0].name, data[0].flags.svg, data[0].population, data[0].region, data[0].capital);
        let currencies: string[] = [];
        for (let currency of data[0].currencies) {
          currencies.push(currency.name);
        }
        let languages: string[] = [];
        for (let language of data[0].languages) {
          languages.push(language.name);
        }
        this.countryInfo.addDetails(data[0].nativeName, data[0].subregion, data[0].topLevelDomain, currencies, languages, data[0].borders);
      },
      (error: any) => {
        this.error = true;
      }
    );
  }

  backToMain(event: any) {
    this.detailed = false;
  }
}
