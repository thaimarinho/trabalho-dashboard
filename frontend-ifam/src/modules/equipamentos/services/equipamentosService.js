/**
 * Service do Módulo 1 — Empréstimo de Equipamentos & Inventário.
 *
 * Referência: Documentação/docs/seq_04_mapa_frontend.md
 *             — `src/modules/equipamentos/services/equipamentosService.js`.
 *
 * Escopo atual: RF-EQ01 (catálogo de tipos de recursos).
 * TODO(RF-EQ02/03/05): recursos, reservas e operações de check-in/out
 * entram neste mesmo arquivo, conforme as outras duplas entregarem.
 *
 * -------------------------------------------------------------------------
 * FALLBACK OFFLINE
 * -------------------------------------------------------------------------
 * As funções chamam a API real. Se `useMock` estiver ligado no app.json ou se
 * a API não responder (erro de rede), caem automaticamente no mock in-memory
 * com o mesmo contrato — assim a tela nunca quebra em uma demonstração.
 * O modo em uso é exposto por `isModoMock()`.
 * -------------------------------------------------------------------------
 */

import api, { USE_MOCK } from '../../../core/services/api';
import { isErroDeRede } from '../../../core/services/interceptors';
import * as mock from './tiposRecursoMock';

const ROTA_TIPOS = '/api/v1/equipamentos/tipos/';

// Fica `true` depois que uma chamada falhar por rede, para as ações
// seguintes já irem direto ao mock dentro da mesma sessão.
let usandoMock = USE_MOCK;

/** Indica se os dados exibidos vêm do mock (API indisponível ou desligada). */
export function isModoMock() {
  return usandoMock;
}

/**
 * Executa a chamada real e, em caso de falha de conectividade, repete no mock.
 * Erros de negócio da API (404, 409, 422) são propagados normalmente.
 */
async function comFallback(chamadaApi, chamadaMock) {
  if (usandoMock) {
    return chamadaMock();
  }

  try {
    return await chamadaApi();
  } catch (erro) {
    if (isErroDeRede(erro)) {
      usandoMock = true;
      return chamadaMock();
    }
    throw erro;
  }
}

/**
 * Lista as categorias do catálogo.
 * @param {{categoria?: string, busca?: string}} filtros
 */
export async function listarTiposRecurso(filtros = {}) {
  return comFallback(
    async () => {
      const { data } = await api.get(ROTA_TIPOS, { params: filtros });
      return data;
    },
    () => mock.listar(),
  );
}

/** Busca uma categoria pelo id. */
export async function obterTipoRecurso(idTipoRecurso) {
  return comFallback(
    async () => {
      const { data } = await api.get(`${ROTA_TIPOS}${idTipoRecurso}`);
      return data;
    },
    async () => {
      const lista = await mock.listar();
      return lista.find((item) => item.id_tipo_recurso === idTipoRecurso) ?? null;
    },
  );
}

/**
 * Cadastra uma nova categoria (perfil Administrador).
 * @param {{descricao: string, categoria: string}} dados
 */
export async function criarTipoRecurso(dados) {
  return comFallback(
    async () => {
      const { data } = await api.post(ROTA_TIPOS, dados);
      return data;
    },
    () => mock.criar(dados),
  );
}

/** Atualiza uma categoria existente (perfil Administrador). */
export async function atualizarTipoRecurso(idTipoRecurso, dados) {
  return comFallback(
    async () => {
      const { data } = await api.put(`${ROTA_TIPOS}${idTipoRecurso}`, dados);
      return data;
    },
    () => mock.atualizar(idTipoRecurso, dados),
  );
}

/** Exclui uma categoria (perfil Administrador). Responde 409 se estiver em uso. */
export async function excluirTipoRecurso(idTipoRecurso) {
  return comFallback(
    async () => {
      await api.delete(`${ROTA_TIPOS}${idTipoRecurso}`);
    },
    () => mock.excluir(idTipoRecurso),
  );
}
