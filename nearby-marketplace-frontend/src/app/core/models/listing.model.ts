export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  INACTIVE = 'INACTIVE'
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CityResponse {
  id: number;
  name: string;
}

export interface ListingResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  status: ListingStatus;
  category: CategoryResponse;
  city: CityResponse;
  sellerName: string;
  sellerId: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingRequest {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  cityId: number;
}
