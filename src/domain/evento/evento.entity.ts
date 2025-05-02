import {EventoId} from "./evento-id.value-object";
import {AggregateRoot} from "../common/aggregate-root.stereotype";
import {Localizacao} from "./localizacao.entity";
import {LineUp} from "./lineup.value-object";
import {EventoStatus} from "./evento-status.enum";

export class Evento extends AggregateRoot {
    private constructor(
        private readonly id: EventoId,
        private localizacao: Localizacao,
        private data: Date,
        private lineUp: LineUp | null,
        private status: EventoStatus
    ) {
        super();
    }

    public static criar(
        id: EventoId,
        localizacao: Localizacao,
        data: Date,
        lineUp?: LineUp
    ): Evento {
        return new Evento(
            id,
            localizacao,
            data,
            lineUp || null,
            EventoStatus.AGENDADO
        );
    }

    // Getters
    getId(): EventoId { return this.id; }
    getLocalizacao(): Localizacao { return this.localizacao; }
    getData(): Date { return this.data; }
    getLineUp(): LineUp | null { return this.lineUp; }
    getStatus(): EventoStatus { return this.status; }

    remarcar(novaData: Date): void {
        if (this.status === EventoStatus.CANCELADO) {
            throw new Error('Não é possível remarcar um evento cancelado');
        }
        if (novaData <= new Date()) {
            throw new Error('A nova data deve ser no futuro');
        }
        this.data = novaData;
    }

    atualizarLineUp(novoLineUp: LineUp): void {
        if (this.status === EventoStatus.CANCELADO) {
            throw new Error('Não é possível atualizar o line-up de um evento cancelado');
        }
        this.lineUp = novoLineUp;
    }

    cancelar(): void {
        if (this.status === EventoStatus.CANCELADO) {
            throw new Error('O evento já está cancelado');
        }
        this.status = EventoStatus.CANCELADO;
    }
}