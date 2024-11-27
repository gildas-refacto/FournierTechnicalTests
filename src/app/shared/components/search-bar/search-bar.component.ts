import { Component, input, model, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements OnInit {
  searchValue = model<string>();
  placeholder = input<string>('Tapez votre recherche ...');

  search = new FormControl();

  constructor() {
    this.search.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchValue.set(this.search.value ?? '');
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.search.patchValue(this.searchValue());
  }
}
