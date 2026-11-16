import type { EnergyOffer } from '../singleton/energy-api.service';
import type { DeviceElement, MarketElementVisitor, SourceElement } from './MarketElementVisitor';

export interface MarketIssue {
  severity: 'error' | 'warning' | 'info';
  element: string;
  reference: string;
  message: string;
}

/**
 * Patron Visitor (frontend) — Visitante concreto «Auditoría del mercado».
 *
 * MISMO recorrido, operación distinta: en lugar de un reporte, detecta
 * incidencias —ofertas agotadas o sin descripción, precios en cero,
 * dispositivos fuera de línea y fuentes con bajo rendimiento— sin
 * cambiar ninguna clase visitada.
 */
export class MarketAuditVisitor implements MarketElementVisitor {
  private producerCounts: Record<string, number> = {};
  private issues: MarketIssue[] = [];

  visitOffer(offer: EnergyOffer): void {
    const id = offer.id ?? '?';
    this.producerCounts[offer.producerName] = (this.producerCounts[offer.producerName] ?? 0) + 1;

    if (offer.availableKwh <= 0) {
      this.issues.push({
        severity: 'info',
        element: 'oferta',
        reference: `#${id}`,
        message: `La oferta #${id} de ${offer.producerName} está agotada (no tiene energía disponible)`,
      });
    }

    if (!offer.description || offer.description.trim() === '') {
      this.issues.push({
        severity: 'warning',
        element: 'oferta',
        reference: `#${id}`,
        message: `La oferta #${id} no tiene descripción para los compradores`,
      });
    }

    if (offer.pricePerKwh <= 0) {
      this.issues.push({
        severity: 'error',
        element: 'oferta',
        reference: `#${id}`,
        message: `La oferta #${id} tiene un precio de ${offer.pricePerKwh} COP/kWh`,
      });
    }
  }

  visitSource(source: SourceElement): void {
    if (source.efficiency < 75) {
      this.issues.push({
        severity: 'info',
        element: 'fuente',
        reference: source.type,
        message: `La fuente ${source.name} tiene un rendimiento de ${source.efficiency}%, por debajo del umbral de 75%`,
      });
    }
  }

  visitDevice(device: DeviceElement): void {
    if (!device.online) {
      this.issues.push({
        severity: 'error',
        element: 'dispositivo',
        reference: device.deviceId,
        message: `El dispositivo ${device.displayName} (${device.deviceId}) está fuera de línea: sus lecturas no se actualizarán`,
      });
    }
  }

  result(): Record<string, unknown> {
    // Ofertas duplicadas por productor (posible publicación repetida).
    for (const [producer, count] of Object.entries(this.producerCounts)) {
      if (count > 1) {
        this.issues.push({
          severity: 'info',
          element: 'oferta',
          reference: producer,
          message: `${producer} tiene ${count} ofertas activas: verificar que no sean publicaciones repetidas`,
        });
      }
    }

    const bySeverity: Record<string, number> = { error: 0, warning: 0, info: 0 };
    for (const issue of this.issues) {
      bySeverity[issue.severity]++;
    }

    return {
      visitor: 'Auditoría del mercado (MarketAuditVisitor)',
      totalIssues: this.issues.length,
      bySeverity,
      issues: this.issues,
    };
  }
}
