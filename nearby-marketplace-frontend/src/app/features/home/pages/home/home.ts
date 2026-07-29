import { Component, OnInit, signal } from '@angular/core';
import { ListingService } from '../../../../core/services/listing.service';
import { ListingResponse } from '../../../../core/models/listing.model';
import { AdCard } from '../../../../shared/components/ad-card/ad-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  listings = signal<ListingResponse[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.listingService.findActive().subscribe({
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
}
