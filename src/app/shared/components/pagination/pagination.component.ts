import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = model.required<number>();
  totalPages = input.required<number>();
  limit = input.required<number>();

  nbPage = computed(() => {
    return Math.ceil(this.totalPages() / this.limit())
  });
}
