import { VendasClientPage } from '@/components/vendas-client-page';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export default function SalesPage() {
  // Directly use the placeholder images as the data source for the carousel
  const carouselImages: ImagePlaceholder[] = PlaceHolderImages;

  return <VendasClientPage carouselImages={carouselImages} />;
}
