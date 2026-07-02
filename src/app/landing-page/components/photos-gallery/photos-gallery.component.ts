import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Photo {
  src: string;
  alt: string;
  span?: 'wide' | 'tall' | 'normal';
}

interface VideoItem {
  src: string;
  poster?: string;
}

@Component({
  selector: 'app-photos-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photos-gallery.component.html',
  styleUrl: './photos-gallery.component.scss',
})
export class PhotosGalleryComponent {
  lightboxOpen = false;
  lightboxIndex = 0;

  photos: Photo[] = [
  ];

  videos: VideoItem[] = [
  ];

  activeVideo = 0;

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  prevPhoto(): void {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextPhoto(): void {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.photos.length;
  }

  setActiveVideo(index: number): void {
    this.activeVideo = index;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowLeft') this.prevPhoto();
    if (event.key === 'ArrowRight') this.nextPhoto();
  }
}
