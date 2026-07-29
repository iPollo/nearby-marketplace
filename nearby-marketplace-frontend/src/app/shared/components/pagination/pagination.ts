import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {
  @Input({ required: true }) currentPage = 0; // 0-indexed, igual ao backend
  @Input({ required: true }) totalPages = 0;

  @Output() pageChange = new EventEmitter<number>();

  get displayPages(): number[] {
    const maxButtons = 5;
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i);
    }

    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + maxButtons - 1);
    start = Math.max(0, end - maxButtons + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goTo(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  previous(): void {
    this.goTo(this.currentPage - 1);
  }

  next(): void {
    this.goTo(this.currentPage + 1);
  }
}
