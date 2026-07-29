import { Component, OnInit } from '@angular/core';
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

  listings: ListingResponse[] = [];
  loading = true;
  error = false;

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    console.log("Home On Init");

    this.listingService.findActive().subscribe({
      next: (page) => {
        console.log("RESPONSE RECEIVED");
        console.log(page.content);


        this.listings = page.content;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

}
