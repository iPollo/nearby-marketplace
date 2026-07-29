import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../../../../../core/services/listing.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { CityService } from '../../../../../core/services/city.service';
import { CategoryResponse, CityResponse } from '../../../../../core/models/listing.model';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-listing.html',
  styleUrl: './create-listing.scss'
})
export class CreateListing implements OnInit {

  title = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  cityId: number | null = null;

  categories = signal<CategoryResponse[]>([]);
  cities = signal<CityResponse[]>([]);

  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private listingService: ListingService,
    private categoryService: CategoryService,
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe({
      next: (data) => this.categories.set(data)
    });

    this.cityService.findAll().subscribe({
      next: (data) => this.cities.set(data)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('Image must be smaller than 5MB.');
      return;
    }

    this.errorMessage.set(null);
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);
  }

  onSubmit(): void {
    if (!this.categoryId || !this.cityId || this.price === null) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.listingService.create({
      title: this.title,
      description: this.description,
      price: this.price,
      categoryId: this.categoryId,
      cityId: this.cityId
    }).subscribe({
      next: (listing) => {
        if (this.selectedFile) {
          this.listingService.uploadImage(listing.id, this.selectedFile).subscribe({
            next: () => this.finish(listing.id),
            error: () => this.finish(listing.id) // listing já foi criado; falha de imagem não deve travar o fluxo
          });
        } else {
          this.finish(listing.id);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      }
    });
  }

  private finish(listingId: number): void {
    this.loading.set(false);
    this.router.navigate(['/listings', listingId]);
  }
}
