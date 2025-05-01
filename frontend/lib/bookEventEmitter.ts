import { EventEmitter } from 'events';

interface BookEvents {
    'favoriteUpdated': (data: { bookId: number; isFavorite: boolean }) => void;
    'bookStatusUpdated': (data: { bookId: number; status: string }) => void;
    'profileNeedsUpdate': () => void;
}

// Create a typed event emitter
const bookEventEmitter = new EventEmitter();

// Type-safe emit method
const emit = <K extends keyof BookEvents>(
    event: K,
    ...args: Parameters<BookEvents[K]>
) => bookEventEmitter.emit(event, ...args);

// Type-safe on method
const on = <K extends keyof BookEvents>(
    event: K,
    listener: BookEvents[K]
) => bookEventEmitter.on(event, listener);

// Type-safe off method
const off = <K extends keyof BookEvents>(
    event: K,
    listener: BookEvents[K]
) => bookEventEmitter.off(event, listener);

export { bookEventEmitter, emit, on, off }; 