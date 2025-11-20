import { VendasClientPage } from '@/components/vendas-client-page';
import { PlaceHolderImages, PreviewImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export default function SalesPage() {
  const carouselImages: ImagePlaceholder[] = PlaceHolderImages;
  const previewImages: ImagePlaceholder[] = PreviewImages;

  return <VendasClientPage carouselImages={carouselImages} previewImages={previewImages} />;
}
