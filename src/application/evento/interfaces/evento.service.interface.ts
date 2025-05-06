import { CriarEventoCommand } from "../commands/criar-evento.command";
import { RemarcarEventoCommand } from "../commands/remarcar-evento.command";
import { AtualizarLineUpCommand } from "../commands/atualizar-line-up.command";
import { CancelarEventoCommand } from "../commands/cancelar-evento.command";
import { ObterEventoQuery } from "../queries/obter-evento.query";
import { Evento } from "../../../domain/evento/evento.entity";

export interface IEventoService {
  criarEvento(command: CriarEventoCommand): Promise<string>;
  remarcarEvento(command: RemarcarEventoCommand): Promise<void>;
  atualizarLineUp(command: AtualizarLineUpCommand): Promise<void>;
  cancelarEvento(command: CancelarEventoCommand): Promise<void>;
  obterEvento(query: ObterEventoQuery): Promise<Evento>;
}
