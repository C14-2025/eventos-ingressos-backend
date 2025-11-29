import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { EventCard } from "@/components/EventCard";
import { EventDetailsModal } from "@/components/EventDetailsModal";
import { Event } from "@/types/event";
import musicFestivalImage from "@/assets/event-music-festival.jpg";
import techConferenceImage from "@/assets/event-tech-conference.jpg";
import sportsGameImage from "@/assets/event-sports-game.jpg";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Festival de Música Eletrônica 2024",
    description: `Prepare-se para a maior experiência de música eletrônica do ano! O Festival de Música Eletrônica 2024 traz os melhores DJs internacionais e nacionais para uma noite inesquecível.

Com 3 palcos simultâneos, efeitos visuais de última geração e uma produção impecável, você vai vivenciar a música eletrônica como nunca antes.

Line-up confirmado:
• Martin Garrix
• Alok
• Vintage Culture
• E muitos mais!

O festival conta com área VIP, lounges exclusivos, food trucks gourmet e muito mais. Garanta seu ingresso antes que esgotem!`,
    date: "2024-12-15",
    time: "20:00",
    price: 250.00,
    capacity: 150,
    file: {
      file_url: musicFestivalImage
    }
  },
  {
    id: "2",
    title: "Tech Summit Brasil - Inovação e Futuro",
    description: `O maior evento de tecnologia e inovação da América Latina está de volta! O Tech Summit Brasil reúne os principais líderes, empreendedores e visionários do setor tech.

Durante dois dias intensos, você terá acesso a:
• Palestras inspiradoras com CEOs de unicórnios
• Workshops práticos sobre IA, blockchain e cloud
• Networking com mais de 5.000 profissionais
• Área de startups e demos de produtos inovadores

Palestrantes confirmados incluem executivos de Google, Microsoft, Nubank e outras gigantes tech.

Este é o evento essencial para quem quer estar à frente das tendências tecnológicas e fazer conexões valiosas no ecossistema de inovação.`,
    date: "2024-11-28",
    time: "09:00",
    price: 450.00,
    capacity: 0,
    file: {
      file_url: techConferenceImage
    }
  },
  {
    id: "3",
    title: "Final do Campeonato Brasileiro - Flamengo x Palmeiras",
    description: `A decisão mais esperada do ano! Flamengo e Palmeiras se enfrentam na grande final do Campeonato Brasileiro em um confronto épico que promete emocionar milhões de torcedores.

Detalhes do evento:
• Jogo decisivo pelo título nacional
• Estádio com capacidade total
• Transmissão nos telões em 4K
• Apresentação especial no pré-jogo
• Estrutura completa de alimentação e bebidas

Os dois maiores times do Brasil em campo para decidir quem levará a taça. A atmosfera será eletrizante, com milhares de torcedores apaixonados celebrando o futebol brasileiro.

Não perca a chance de fazer parte da história e vivenciar essa final memorável ao vivo no estádio!`,
    date: "2024-12-08",
    time: "16:00",
    price: 180.00,
    capacity: 320,
    file: {
      file_url: sportsGameImage
    }
  }
];

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onSearch={setSearchQuery} />

      <main className="container py-12 md:py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Eventos em destaque
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubra experiências incríveis próximas a você
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Nenhum evento encontrado para "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <EventDetailsModal
        event={selectedEvent}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
