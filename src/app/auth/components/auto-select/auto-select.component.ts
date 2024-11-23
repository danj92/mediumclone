import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { StationData } from './station-model';

// @UntilDestroy()
@Component({
  selector: 'mc-auto-select',
  templateUrl: './auto-select.component.html',
  styleUrl: './auto-select.component.scss',
})
export class AutoSelectComponent implements OnInit {
  @Input() set suggestions(value: StationData[]) {
    this._suggestions = value.sort((a: StationData, b: StationData) => {
      const aName = (a.stationName || '').toLowerCase();
      const bName = (b.stationName || '').toLowerCase();
      return aName.localeCompare(bName);
    });
  }
  get suggestions() {
    return this._suggestions;
  }
  private _suggestions: StationData[];
  private destroyRef = inject(DestroyRef);

  searchInput: FormControl = new FormControl('');

  filteredSuggestions: StationData[] = [];
  typedText: string = ''; // Wpisany tekst (przezroczysty)
  remainingHint: string = ''; // Podpowiedź (szara)
  selectedHistory: StationData[] = []; // Historia wyborów

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.filteredSuggestions = [];
    }
  }

  public ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        tap((val) => {
          if (!val) {
            this.remainingHint = '';
            this.typedText = '';
          }
        }),
        distinctUntilChanged<any>(this.destroyRef),
        takeUntilDestroyed(),
      )
      .subscribe((value) => this.updateSuggestions(value));
  }

  public selectSuggestion(suggestion: StationData): void {
    this.searchInput.setValue(suggestion.stationName, { emitEvent: false });
    this.filteredSuggestions = [];
    this.typedText = suggestion.stationName;
    this.remainingHint = '';

    if (
      !this.selectedHistory.some(
        (historySuggestion) => historySuggestion.stationName === suggestion.stationName,
      )
    ) {
      this.selectedHistory.push(suggestion);
    }
  }

  public onFocus(): void {
    if (!this.searchInput.value) {
      // Jeśli input jest pusty, pokaż historię
      this.filteredSuggestions = [...this.selectedHistory];
    }
    this.updateSuggestions(this.searchInput.value);
  }

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && this.filteredSuggestions.length) {
      event.preventDefault();
      this.selectSuggestion(this.filteredSuggestions[0]);
    }
  }

  private updateSuggestions(input: string): void {
    this.typedText = input; // Wpisany tekst
    if (!input) {
      this.remainingHint = ''; // Brak podpowiedzi
      // Jeśli pole jest puste, pokaż historię wyborów
      this.filteredSuggestions = this.selectedHistory.length ? [...this.selectedHistory] : [];
      return;
    }

    // Filtruj sugestie
    this.filteredSuggestions = this.suggestions.filter((suggestion) =>
      suggestion.stationName.toLowerCase().startsWith(input.toLowerCase()),
    );

    // Wyznacz podpowiedź (reszta słowa)
    if (this.filteredSuggestions.length > 0) {
      const suggestion = this.filteredSuggestions[0]; // Pierwszy pasujący
      this.remainingHint = suggestion.stationName.substring(input.length); // Reszta brakujących znaków
    } else {
      this.remainingHint = ''; // Brak dopasowania
    }
  }
}
