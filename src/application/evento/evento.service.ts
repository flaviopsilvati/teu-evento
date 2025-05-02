import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {CriarEventoCommand} from "./commands/criar-evento.command";
import { EventoId } from '../../domain/evento/evento-id.value-object';
import { Evento } from '../../domain/evento/evento.entity';
import {RemarcarEventoCommand} from "./commands/remarcar-evento.command";
import {ObterEventoQuery} from "./queries/obter-evento.query";
import {AtualizarLineUpCommand} from "./commands/atualizar-line-up.command";
import { CancelarEventoCommand } from './commands/cancelar-evento.command';
import {IEventoRepository} from "../../domain/evento/evento-repository.interface";

@Injectable()
export class EventoService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly eventoRepository: IEventoRepository
    ) {}

    async criarEvento(command: CriarEventoCommand): Promise<string> {
        const eventoId = new EventoId();
        const evento = Evento.criar(
            eventoId,
            command.localizacao,
            command.data,
            command.lineUp
        );
        await this.eventoRepository.save(evento);
        return eventoId.toString();
    }

    async remarcarEvento(command: RemarcarEventoCommand): Promise<void> {
        const evento = await this.eventoRepository.findById(new EventoId(command.eventoId));
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        evento.remarcar(command.novaData);
        await this.eventoRepository.save(evento);
    }

    async atualizarLineUp(command: AtualizarLineUpCommand): Promise<void> {
        const evento = await this.eventoRepository.findById(new EventoId(command.eventoId));
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        evento.atualizarLineUp(command.novoLineUp);
        await this.eventoRepository.save(evento);
    }

    async cancelarEvento(command: CancelarEventoCommand): Promise<void> {
        const evento = await this.eventoRepository.findById(new EventoId(command.eventoId));
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        evento.cancelar();
        await this.eventoRepository.save(evento);
    }

    async obterEvento(query: ObterEventoQuery): Promise<Evento> {
        const evento = await this.eventoRepository.findById(new EventoId(query.id));
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        return evento;
    }
}