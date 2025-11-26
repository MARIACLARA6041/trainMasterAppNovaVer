export class Cronometro {
  private inicio: number | null = null;
  private fim: number | null = null;

  iniciar() {
    this.inicio = Date.now();
  }

  parar() {
    this.fim = Date.now();
  }

  getSegundos(): number {
    if (!this.inicio) return 0;
    const fim = this.fim ?? Date.now();
    return Math.round((fim - this.inicio) / 1000);
  }

  // 👉 Getter da data inicial
  getDataInicial(): string {
    return this.inicio ? new Date(this.inicio).toISOString() : new Date(Date.now()).toISOString();
  }

  // 👉 Getter da data final
  getDataFinal(): string {
    return this.fim ? new Date(this.fim).toISOString() : new Date(Date.now()).toISOString();
  }

  resetar() {
    this.inicio = null;
    this.fim = null;
  }
}