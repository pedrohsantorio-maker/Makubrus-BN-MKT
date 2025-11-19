import { VendasClientPage } from '@/components/vendas-client-page';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const featureCardsData = [
  {
    title: "Plano Oculto 🔥",
    description: "Acesse o grupo VIP fechado e descubra os segredos que ninguém mais conhece.",
    imageId: 'print1'
  },
  {
    title: "Acesso Reservado 🗝️",
    description: "Materiais raros e exclusivos disponíveis apenas para membros com acesso vitalício.",
    imageId: 'print2'
  },
  {
    title: "Comunidade Secreta ⚠️",
    description: "Faça parte de uma comunidade seleta. As vagas são extremamente limitadas.",
    imageId: 'print3'
  },
  {
    title: "Material Ultra-Privado 👁️",
    description: "Arquivos privados que nunca foram revelados ao público. Uma oportunidade única.",
    imageId: 'print4'
  },
  {
    title: "Arquivos Nunca Vistos 🥷",
    description: "Tenha em mãos uma coleção de materiais raros que poucos tiveram o privilégio de ver.",
    imageId: 'print5'
  },
  {
    title: "Acesso Vitalício 💎",
    description: "Pague uma vez e tenha acesso para sempre a todos os conteúdos e futuras atualizações.",
    imageId: 'print6'
  },
];

export default function SalesPage() {
  const typedFeatureCards = featureCardsData.map(card => {
    const image = PlaceHolderImages.find(img => img.id === card.imageId);
    return {
      ...card,
      image: image ? { 
        id: image.id,
        description: image.description,
        imageUrl: image.imageUrl,
        imageHint: image.imageHint,
      } : undefined
    };
  });

  return <VendasClientPage featureCards={typedFeatureCards} />;
}
