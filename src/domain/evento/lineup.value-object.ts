import {Artista} from "./artista.entity";

export class LineUp {
    constructor(private readonly artistas: Artista[]) {
        if (artistas.length === 0) {
            throw new Error('LineUp deve ter pelo menos um artista');
        }
    }

    getArtistas(): Artista[] {
        return [...this.artistas];
    }
}