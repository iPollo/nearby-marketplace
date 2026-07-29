import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ListingService } from '../../../../core/services/listing.service';
import { ListingResponse } from '../../../../core/models/listing.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss'
})
export class ListingDetail implements OnInit {

  listing = signal<ListingResponse | null>(null);
  loading = signal(true);
  error = signal(false);

  activeImageIndex = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.listingService.findById(id).subscribe({
      next: (data) => {
        this.listing.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  get isOwner(): boolean {
    const listing = this.listing();
    const user = this.authService.currentUser();
    return !!listing && !!user && listing.sellerId === user.id;
  }

  markAsSold(): void {
    const item = this.listing();
    if (!item) return;

    this.listingService.markAsSold(item.id).subscribe({
      next: () => this.listing.set({ ...item, status: 'SOLD' as any }),
      error: () => alert('Could not mark listing as sold. Please try again.')
    });
  }

  deleteListing(): void {
    const item = this.listing();
    if (!item) return;

    const confirmed = confirm('Are you sure you want to delete this listing? This cannot be undone.');
    if (!confirmed) return;

    this.listingService.delete(item.id).subscribe({
      next: () => this.router.navigate(['/listings/mine']),
      error: () => alert('Could not delete listing. Please try again.')
    });
  }

  editListing(): void {
    this.router.navigate(['/listings', this.listing()!.id, 'edit']);
  }

  selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
