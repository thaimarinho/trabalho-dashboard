import json
from pathlib import Path

from fastapi import APIRouter, Query

from app.schemas.laboratorio_schemas import DashboardKPIsLaboratorios

router = APIRouter(prefix="/api/v1/laboratorios/dashboard", tags=["Laboratórios - Dashboard"])

CAMINHO_MOCK = Path(__file__).resolve().parents[2] / "mocks" / "laboratorios" / "dashboard.json"


def _carregar_dados_mock() -> dict:
    with open(CAMINHO_MOCK, encoding="utf-8") as f:
        return json.load(f)


@router.get(
    "/kpis",
    response_model=DashboardKPIsLaboratorios,
    summary="Dashboard e KPIs de Ocupação dos Laboratórios",
)
def obter_dashboard_kpis(periodo: str = Query(default="Semana")):
    dados = _carregar_dados_mock()
    return DashboardKPIsLaboratorios(**dados)