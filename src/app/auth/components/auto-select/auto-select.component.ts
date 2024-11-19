import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs';
import { StationData } from './model';

// takeUntilDestroyed(),
@Component({
  selector: 'mc-auto-select',
  templateUrl: './auto-select.component.html',
  styleUrl: './auto-select.component.scss',
})
export class AutoSelectComponent implements OnInit {
  @Input() items: StationData[] = [];
  filteredItems: StationData[] = [];
  searchControl = new FormControl('');
  isDropdownVisible = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        map((value) => this.filterItems(value as string)),
      )
      .subscribe((v) => {
        this.filteredItems = v;
        this.isDropdownVisible = v.length > 0;
      });
  }

  private filterItems(query: string): StationData[] {
    if (!query) {
      return [];
    }
    const lowerQuery = query.toLowerCase();

    const sortedValues = this.items.toSorted((a, b) => a.stationName.localeCompare(b.stationName));

    const filteredItems = sortedValues.filter((station) =>
      station.stationName.toLowerCase().startsWith(lowerQuery),
    );

    return filteredItems;
  }

  public onSelect(item: any): void {
    this.searchControl.setValue(item.stationName);
    this.isDropdownVisible = false;
  }

  public focusOutFunction(): void {
    this.isDropdownVisible = false;
  }

  public focusFunction() {
    this.isDropdownVisible = true;
    this.filterItems(this.searchControl.value as string);
  }

  // kiedy input jest focus a click był nie po elemencie, a poza komponentem, jak ukryć wybraną listę?
  // podpowiadanie literek jak w placeholder
  // podpowiadanie starych wartości jak nic nie wpisane
}
