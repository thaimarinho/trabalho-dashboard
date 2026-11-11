from pydantic import BaseModel


class OcupacaoPorTurno(BaseModel):
    matutino: float
    vespertino: float
    noturno: float


class RankingLaboratorio(BaseModel):
    posicao: int
    laboratorio: str
    horas_semana: float
    taxa: float


class AlertaManutencao(BaseModel):
    laboratorio: str
    mensagem: str


class DashboardKPIsLaboratorios(BaseModel):
    taxa_ocupacao_media: float
    labs_em_uso_agora: int
    total_labs_cadastrados: int
    aulas_agendadas_hoje: int
    maquinas_em_manutencao: int

    ocupacao_por_turno: OcupacaoPorTurno

    ranking_mais_demandados: list[RankingLaboratorio]

    alertas_manutencao: list[AlertaManutencao]