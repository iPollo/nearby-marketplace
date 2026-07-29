import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ListingService } from '../../../../core/services/listing.service';
import { ListingResponse } from '../../../../core/models/listing.model';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.scss'
})
export class MyListings implements OnInit {

  listings = signal<ListingResponse[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(private listingService: ListingService, private router: Router) {}

  ngOnInit(): void {
    this.listingService.findMine().subscribe({
      next: (page) => {
        this.listings.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/listings', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/listings/new']);
  }

  markAsSold(event: Event, listing: ListingResponse): void {
    event.stopPropagation();

    this.listingService.markAsSold(listing.id).subscribe({
      next: () => {
        this.listings.update((items) =>
          items.map((item) => item.id === listing.id ? { ...item, status: 'SOLD' as any } : item)
        );
      },
      error: () => alert('Could not mark listing as sold.')
    });
  }

  deleteListing(event: Event, listing: ListingResponse): void {
    event.stopPropagation();

    const confirmed = confirm(`Delete "${listing.title}"? This cannot be undone.`);
    if (!confirmed) return;

    this.listingService.delete(listing.id).subscribe({
      next: () => this.listings.update((items) => items.filter((item) => item.id !== listing.id)),
      error: () => alert('Could not delete listing.')
    });
  }
}
