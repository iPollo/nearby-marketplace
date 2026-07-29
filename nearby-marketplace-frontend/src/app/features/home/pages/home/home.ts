import { Component, OnInit, signal } from '@angular/core';
import { ListingService } from '../../../../core/services/listing.service';
import { ListingResponse } from '../../../../core/models/listing.model';
import { AdCard } from '../../../../shared/components/ad-card/ad-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdCard, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  listings = signal<ListingResponse[]>([]);
  loading = signal(true);
  error = signal(false);

  currentPage = signal(0);
  totalPages = signal(0);

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  onPageChange(page: number): void {
    this.loadPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  totalElements = signal(0);

  private loadPage(page: number): void {
    this.loading.set(true);

    this.listingService.findActive(page).subscribe({
      next: (data) => {
        this.listings.set(data.content);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
