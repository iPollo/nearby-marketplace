import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ListingResponse } from '../../../core/models/listing.model';

@Component({
  selector: 'app-ad-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './ad-card.html',
  styleUrl: './ad-card.scss'
})
export class AdCard {
  @Input({ required: true }) listing!: ListingResponse;

  constructor(private router: Router) {}

  get thumbnail(): string | null {
    return this.listing.imageUrls?.length ? this.listing.imageUrls[0] : null;
  }

  goToDetail(): void {
    this.router.navigate(['/listings', this.listing.id]);
  }
}
