import type { EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron Memento (frontend) — Recuerdo del borrador de oferta (rol «Memento»).
 *
 * Instantánea INMUTABLE del estado del asistente "Publica tu energía":
 * productor, fuente, cantidad, precio, descripción y paso actual. No
 * expone setters: solo el originator (CreateOffer) puede leerla para
 * restaurar su estado anterior.
 */
export class OfferDraftMemento {
  private constructor(
    public readonly producerName: string,
    public readonly energyType: string | null,
    public readonly totalKwh: string,
    public readonly pricePerKwh: string,
    public readonly description: string,
    public readonly step: number,
    public readonly createdAt: string,
  ) {}

  /** Captura una instantánea del estado actual del asistente. */
  static capture(state: {
    producerName: string;
    energyType: string | null;
    totalKwh: string;
    pricePerKwh: string;
    description: string;
    step: number;
  }): OfferDraftMemento {
    return new OfferDraftMemento(
      state.producerName,
      state.energyType,
      state.totalKwh,
      state.pricePerKwh,
      state.description,
      state.step,
      new Date().toLocaleTimeString(),
    );
  }

  /** Descripción corta para el historial visible en la interfaz. */
  label(): string {
    const who = this.producerName.trim() || 'Sin productor';
    const kwh = this.totalKwh || '—';
    return `Paso ${this.step} · ${who} · ${kwh} kWh`;
  }
}

/** Oferta construida a partir de un borrador (para el panel). */
export interface DraftOfferPreview extends Partial<EnergyOffer> {
  producerName: string;
}
