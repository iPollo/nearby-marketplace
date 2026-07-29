import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../../core/services/listing.service';
import { CategoryService } from '../../../../core/services/category.service';
import { CityService } from '../../../../core/services/city.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryResponse, CityResponse } from '../../../../core/models/listing.model';

@Component({
  selector: 'app-edit-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.scss'
})
export class EditListing implements OnInit {

  listingId!: number;

  title = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  cityId: number | null = null;

  categories = signal<CategoryResponse[]>([]);
  cities = signal<CityResponse[]>([]);

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  notFoundOrForbidden = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private categoryService: CategoryService,
    private cityService: CityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.listingId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.findAll().subscribe({ next: (data) => this.categories.set(data) });
    this.cityService.findAll().subscribe({ next: (data) => this.cities.set(data) });

    this.listingService.findById(this.listingId).subscribe({
      next: (listing) => {
        const currentUser = this.authService.currentUser();

        if (!currentUser || listing.sellerId !== currentUser.id) {
          this.notFoundOrForbidden.set(true);
          this.loading.set(false);
          return;
        }

        this.title = listing.title;
        this.description = listing.description;
        this.price = listing.price;
        this.categoryId = listing.category.id;
        this.cityId = listing.city.id;

        this.loading.set(false);
      },
      error: () => {
        this.notFoundOrForbidden.set(true);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.categoryId || this.price === null) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.errorMessage.set(null);
    this.saving.set(true);

    this.listingService.update(this.listingId, {
      title: this.title,
      description: this.description,
      price: this.price,
      categoryId: this.categoryId,
      cityId: this.cityId!
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/listings', this.listingId]);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(
          err.status === 403 ? 'You are not allowed to edit this listing.' : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/listings', this.listingId]);
  }
}
