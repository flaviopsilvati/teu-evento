import { Artista } from "./artista.entity";
import { ILineUp } from "./interfaces/lineup.interface";
import { IArtista } from "./interfaces/artista.interface";

export class LineUp implements ILineUp {
  constructor(private readonly artistas: Artista[]) {
    if (artistas.length === 0) {
      throw new Error("LineUp deve ter pelo menos um artista");
    }
  }

  getArtistas(): IArtista[] {
    return [...this.artistas];
  }
}
