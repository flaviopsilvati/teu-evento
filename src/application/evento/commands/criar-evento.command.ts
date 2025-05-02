import {LineUp} from "../../../domain/evento/lineup.value-object";
import { Localizacao } from "../../../domain/evento/localizacao.entity";

export class CriarEventoCommand {
    constructor(
        public readonly localizacao: Localizacao,
        public readonly data: Date,
        public readonly lineUp?: LineUp
    ) {}
}