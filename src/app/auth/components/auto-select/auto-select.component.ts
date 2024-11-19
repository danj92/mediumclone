import { Component, Input, OnInit } from '@angular/core';
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

  // filteredItems$: Observable<StationData[]> = of<StationData[]>([]);
  filteredItems: StationData[] = [];
  searchControl = new FormControl('');
  isDropdownVisible = false;
  oldData = [];

  constructor() {}

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
    console.log('SET', item.stationName);
    this.searchControl.setValue(item.stationName, { emitEvent: false });
    // this.filterItems(item);
    this.isDropdownVisible = false;
  }

  public focusOutFunction(): void {
    console.log('FOCUS');
    this.isDropdownVisible = false;
    // this.oldData.push()
  }

  public focusFunction() {
    this.isDropdownVisible = true;
    // this.filterItems(this.searchControl.value as string);
  }

  // kiedy input jest focus a click był nie po elemencie, a poza komponentem, jak ukryć wybraną listę?
}
