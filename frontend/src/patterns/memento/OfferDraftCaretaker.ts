import { OfferDraftMemento } from './OfferDraftMemento';

/**
 * Patron Memento — Guardián del borrador (rol «Caretaker»).
 *
 * Mantiene la pila de deshacer/rehacer de las instantáneas del
 * asistente de publicación. Nunca inspecciona el contenido del
 * memento: solo guarda, recupera y lista.
 */
export class OfferDraftCaretaker {
  private undoStack: OfferDraftMemento[] = [];
  private redoStack: OfferDraftMemento[] = [];

  private readonly maxDepth = 20;

  /** Guarda una nueva instantánea (elimina la rama de rehacer). */
  save(memento: OfferDraftMemento): void {
    this.undoStack.push(memento);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  /** Deshacer: devuelve la última instantánea guardada. */
  undo(): OfferDraftMemento | null {
    const memento = this.undoStack.pop();
    if (!memento) return null;
    this.redoStack.push(memento);
    return memento;
  }

  /** Rehacer: devuelve la última instantánea deshecha. */
  redo(): OfferDraftMemento | null {
    const memento = this.redoStack.pop();
    if (!memento) return null;
    this.undoStack.push(memento);
    return memento;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  history(): string[] {
    return this.undoStack.map((m) => m.label());
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

/** Instancia única compartida (el guardian vive durante toda la sesión). */
export const offerDraftCaretaker = new OfferDraftCaretaker();
