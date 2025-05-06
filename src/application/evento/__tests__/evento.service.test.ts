import { Test } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventoService } from "../evento.service";
import { IEventoRepository } from "../../../domain/evento/evento-repository.interface";
import { CriarEventoCommand } from "../commands/criar-evento.command";
import { RemarcarEventoCommand } from "../commands/remarcar-evento.command";
import { AtualizarLineUpCommand } from "../commands/atualizar-line-up.command";
import { CancelarEventoCommand } from "../commands/cancelar-evento.command";
import { ObterEventoQuery } from "../queries/obter-evento.query";
import { Evento } from "../../../domain/evento/evento.entity";
import { EventoId } from "../../../domain/evento/evento-id.value-object";
import { Localizacao } from "../../../domain/evento/localizacao.entity";
import { LineUp } from "../../../domain/evento/lineup.value-object";
import { Artista } from "../../../domain/evento/artista.entity";

describe("EventoService", () => {
  let service: EventoService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let eventoRepository: IEventoRepository;

  const mockEventoRepository = {
    save: jest
      .fn()
      .mockImplementation(async (evento: Evento) => Promise.resolve()),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EventoService,
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: "IEventoRepository",
          useValue: mockEventoRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<EventoService>(EventoService);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
    queryBus = moduleRef.get<QueryBus>(QueryBus);
    eventoRepository = moduleRef.get<IEventoRepository>("IEventoRepository");

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("criarEvento", () => {
    it("should create an event successfully", async () => {
      const localizacao = new Localizacao(
        "1",
        "Local Test",
        "Endereço Test",
        100
      );
      const data = new Date("2024-12-31");
      const artista = new Artista("1", "Artista Test", "Rock");
      const lineUp = new LineUp([artista]);

      const command = new CriarEventoCommand(localizacao, data, lineUp);
      const eventoId = await service.criarEvento(command);

      expect(eventoId).toBeDefined();
      expect(eventoRepository.save).toHaveBeenCalledTimes(1);
      expect(eventoRepository.save).toHaveBeenCalledWith(expect.any(Evento));
    });
  });

  describe("remarcarEvento", () => {
    it("should reschedule an event successfully", async () => {
      const eventoId = new EventoId();
      const novaData = new Date("2025-01-01");
      const evento = Evento.criar(
        eventoId,
        new Localizacao("1", "Local Test", "Endereço Test", 100),
        new Date("2024-12-31")
      );

      mockEventoRepository.findById.mockResolvedValue(evento);

      const command = new RemarcarEventoCommand(eventoId.toString(), novaData);
      await service.remarcarEvento(command);

      expect(eventoRepository.findById).toHaveBeenCalledWith(eventoId);
      expect(eventoRepository.save).toHaveBeenCalledWith(evento);
      expect(evento.getData()).toEqual(novaData);
    });

    it("should throw error when event is not found", async () => {
      mockEventoRepository.findById.mockResolvedValue(null);

      const command = new RemarcarEventoCommand("non-existent-id", new Date());
      await expect(service.remarcarEvento(command)).rejects.toThrow(
        "Evento não encontrado"
      );
      expect(eventoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("atualizarLineUp", () => {
    it("should update lineup successfully", async () => {
      const eventoId = new EventoId();
      const artista = new Artista("1", "Artista Test", "Rock");
      const novoLineUp = new LineUp([artista]);
      const evento = Evento.criar(
        eventoId,
        new Localizacao("1", "Local Test", "Endereço Test", 100),
        new Date("2024-12-31")
      );

      mockEventoRepository.findById.mockResolvedValue(evento);

      const command = new AtualizarLineUpCommand(
        eventoId.toString(),
        novoLineUp
      );
      await service.atualizarLineUp(command);

      expect(eventoRepository.findById).toHaveBeenCalledWith(eventoId);
      expect(eventoRepository.save).toHaveBeenCalledWith(evento);
      expect(evento.getLineUp()).toBe(novoLineUp);
    });

    it("should throw error when event is not found", async () => {
      mockEventoRepository.findById.mockResolvedValue(null);

      const command = new AtualizarLineUpCommand(
        "non-existent-id",
        new LineUp([new Artista("1", "Test", "Rock")])
      );
      await expect(service.atualizarLineUp(command)).rejects.toThrow(
        "Evento não encontrado"
      );
      expect(eventoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("cancelarEvento", () => {
    it("should cancel event successfully", async () => {
      const eventoId = new EventoId();
      const evento = Evento.criar(
        eventoId,
        new Localizacao("1", "Local Test", "Endereço Test", 100),
        new Date("2024-12-31")
      );

      mockEventoRepository.findById.mockResolvedValue(evento);

      const command = new CancelarEventoCommand(eventoId.toString());
      await service.cancelarEvento(command);

      expect(eventoRepository.findById).toHaveBeenCalledWith(eventoId);
      expect(eventoRepository.save).toHaveBeenCalledWith(evento);
      expect(evento.getStatus()).toBe("CANCELADO");
    });

    it("should throw error when event is not found", async () => {
      mockEventoRepository.findById.mockResolvedValue(null);

      const command = new CancelarEventoCommand("non-existent-id");
      await expect(service.cancelarEvento(command)).rejects.toThrow(
        "Evento não encontrado"
      );
      expect(eventoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("obterEvento", () => {
    it("should return event successfully", async () => {
      const eventoId = new EventoId();
      const evento = Evento.criar(
        eventoId,
        new Localizacao("1", "Local Test", "Endereço Test", 100),
        new Date("2024-12-31")
      );

      mockEventoRepository.findById.mockResolvedValue(evento);

      const query = new ObterEventoQuery(eventoId.toString());
      const result = await service.obterEvento(query);

      expect(eventoRepository.findById).toHaveBeenCalledWith(eventoId);
      expect(result).toBe(evento);
    });

    it("should throw error when event is not found", async () => {
      mockEventoRepository.findById.mockResolvedValue(null);

      const query = new ObterEventoQuery("non-existent-id");
      await expect(service.obterEvento(query)).rejects.toThrow(
        "Evento não encontrado"
      );
    });
  });
});
