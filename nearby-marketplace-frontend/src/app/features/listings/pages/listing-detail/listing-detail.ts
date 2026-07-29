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
    const email = this.authService.currentUserEmail();
    // comparação simples por enquanto: refinamos quando tivermos o e-mail do vendedor no DTO
    return !!listing && !!email && listing.sellerId === this.getCurrentUserId();
  }

  private getCurrentUserId(): number | null {
    // placeholder: o token hoje só carrega o e-mail (sub), não o id do usuário
    return null;
  }

  selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
