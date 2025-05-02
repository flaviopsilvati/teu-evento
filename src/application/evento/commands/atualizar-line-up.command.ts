import {LineUp} from "../../../domain/evento/lineup.value-object";

export class AtualizarLineUpCommand {
    constructor(public readonly eventoId:string, public readonly novoLineUp: LineUp) {
    }
}