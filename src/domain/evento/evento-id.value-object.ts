import {newId} from "../common/id.generator";

export class EventoId {
    constructor(private readonly id: string = newId('evento')) {
        if (!id) {
            throw new Error('EventoId não pode ser vazio');
        }
    }

    toString(): string {
        return this.id;
    }
}