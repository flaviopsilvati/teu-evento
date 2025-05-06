import { EventoId } from "../evento-id.value-object";
import { Localizacao } from "../localizacao.entity";
import { LineUp } from "../lineup.value-object";
import { EventoStatus } from "../evento-status.enum";

export interface IEvento {
  getId(): EventoId;
  getLocalizacao(): Localizacao;
  getData(): Date;
  getLineUp(): LineUp | null;
  getStatus(): EventoStatus;
  remarcar(novaData: Date): void;
  atualizarLineUp(novoLineUp: LineUp): void;
  cancelar(): void;
}
