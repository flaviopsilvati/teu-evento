import { IArtista } from "./interfaces/artista.interface";

export class Artista implements IArtista {
  constructor(
    private readonly id: string,
    private nome: string,
    private genero: string
  ) {}

  // Getters
  getId(): string {
    return this.id;
  }
  getNome(): string {
    return this.nome;
  }
  getGenero(): string {
    return this.genero;
  }
}
