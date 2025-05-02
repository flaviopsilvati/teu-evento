export class RemarcarEventoCommand {
    constructor(public readonly eventoId: string, public readonly novaData: Date) {

    }
}