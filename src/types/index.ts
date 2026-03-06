export interface Cursinho {
  _id?: string;
  nome?: string;
  regiao?: string;
  enderecoCompleto?: string;
  horario?: string;
  temProcessoSeletivo?: string;
  modalidadeRemota?: string;
  vagasDisponiveisPresencial?: string | number;
  vagasDisponiveisRemoto?: string | number;
  telefone?: string;
  email?: string;
  observacoes?: string;
  urlSite?: string;
  urlFacebook?: string;
  urlInstagram?: string;
  latitude?: number;
  longitude?: number;
}

export interface Endereco {
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Filtros {
  tipoCurso?: 'checkboxTodos' | 'checkboxGratuitos' | 'checkboxPagosBolsa' | 'checkboxPagosAcessiveis';
  distancia?: number; // km
  endereco?: Endereco | string;
}

export interface Cursinhos {
  gratuitos: Cursinho[];
  caros: Cursinho[];      // pagos com bolsa
  acessiveis: Cursinho[];
}

export interface PostMessageEvent {
  cursinhos: Cursinhos;
  filtros: Filtros;
}
