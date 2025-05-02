export class Localizacao {
    constructor(
        private readonly id: string,
        private nome: string,
        private endereco: string,
        private capacidade: number
    ) {}

    // Getters
    getId(): string { return this.id; }
    getNome(): string { return this.nome; }
    getEndereco(): string { return this.endereco; }
    getCapacidade(): number { return this.capacidade; }
}