import api from '../../../core/services/api';

const ROTA_DASHBOARD = '/api/v1/laboratorios/dashboard/kpis';

/** Busca os indicadores do dashboard de laboratórios no backend. */
export async function obterDashboardLaboratorios(periodo = 'Semana') {
  const { data } = await api.get(ROTA_DASHBOARD, { params: { periodo } });
  return data;
}
