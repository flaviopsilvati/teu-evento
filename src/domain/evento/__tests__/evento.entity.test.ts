import { Evento } from "../evento.entity";
import { EventoId } from "../evento-id.value-object";
import { Localizacao } from "../localizacao.entity";
import { LineUp } from "../lineup.value-object";
import { Artista } from "../artista.entity";
import { EventoStatus } from "../evento-status.enum";

describe("Evento", () => {
  let evento: Evento;
  let eventoId: EventoId;
  const localizacao = new Localizacao("1", "Local Test", "Endereço Test", 100);
  const data = new Date("2024-12-31");
  const artista = new Artista("1", "Artista Test", "Rock");
  const lineUp = new LineUp([artista]);

  beforeEach(() => {
    eventoId = new EventoId();
    evento = Evento.criar(eventoId, localizacao, data, lineUp);
    // Mock Date.now() to return a fixed date
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("criação", () => {
    it("should create an event with correct initial values", () => {
      expect(evento.getId()).toBe(eventoId);
      expect(evento.getLocalizacao()).toBe(localizacao);
      expect(evento.getData()).toBe(data);
      expect(evento.getLineUp()).toBe(lineUp);
      expect(evento.getStatus()).toBe(EventoStatus.AGENDADO);
    });

    it("should create an event without lineup", () => {
      const eventoSemLineUp = Evento.criar(eventoId, localizacao, data);
      expect(eventoSemLineUp.getLineUp()).toBeNull();
    });
  });

  describe("remarcar", () => {
    it("should reschedule event to a future date", () => {
      const novaData = new Date("2025-01-01");
      evento.remarcar(novaData);
      expect(evento.getData()).toBe(novaData);
    });

    it("should not allow rescheduling a cancelled event", () => {
      evento.cancelar();
      expect(() => evento.remarcar(new Date())).toThrow(
        "Não é possível remarcar um evento cancelado"
      );
    });

    it("should not allow rescheduling to a past date", () => {
      const pastDate = new Date("2023-01-01");
      expect(() => evento.remarcar(pastDate)).toThrow(
        "A nova data deve ser no futuro"
      );
    });
  });

  describe("atualizarLineUp", () => {
    it("should update lineup successfully", () => {
      const novoArtista = new Artista("2", "Novo Artista", "Pop");
      const novoLineUp = new LineUp([novoArtista]);
      evento.atualizarLineUp(novoLineUp);
      expect(evento.getLineUp()).toBe(novoLineUp);
    });

    it("should not allow updating lineup of a cancelled event", () => {
      evento.cancelar();
      expect(() => evento.atualizarLineUp(lineUp)).toThrow(
        "Não é possível atualizar o line-up de um evento cancelado"
      );
    });
  });

  describe("cancelar", () => {
    it("should cancel event successfully", () => {
      evento.cancelar();
      expect(evento.getStatus()).toBe(EventoStatus.CANCELADO);
    });

    it("should not allow cancelling an already cancelled event", () => {
      evento.cancelar();
      expect(() => evento.cancelar()).toThrow("O evento já está cancelado");
    });
  });
});
