import { Evento } from './evento.entity';
import { EventoId } from './evento-id.value-object';

export interface IEventoRepository {
    save(evento: Evento): Promise<void>;
    findById(id: EventoId): Promise<Evento | null>;
}