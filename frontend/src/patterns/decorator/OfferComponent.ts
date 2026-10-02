// Patron Decorator - COMPONENTE.
// Interfaz comun entre la oferta base y sus decoradores.
export interface OfferComponent {
  getDescription(): string;
  getBasePrice(): number;
  getExtrasTotal(): number;
  getTotal(): number;
  getAdjustments(): { label: string; amount: number }[];
}
