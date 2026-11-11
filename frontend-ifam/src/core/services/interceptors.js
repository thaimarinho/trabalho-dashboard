/**
 * Interceptores do cliente Axios: injeção do token JWT e normalização de erros.
 *
 * Referência: Documentação/docs/seq_04_mapa_frontend.md
 *             — `src/core/services/interceptors.js`.
 *
 * =========================================================================
 * PONTO DE TROCA DA AUTENTICAÇÃO
 * =========================================================================
 * O RF-CORE01 (SSO / AuthContext) pertence à Equipe 1 e ainda não existe.
 * `obterTokenArmazenado` já é chamado a cada requisição, mas devolve `null`
 * por enquanto. Quando o login entrar, basta ler o token do AuthContext /
 * SecureStore aqui — nenhum service ou tela precisa mudar.
 * =========================================================================
 */

import api from './api';

/**
 * TODO(RF-CORE01, Equipe 1): ler o token do AuthContext / storageUtils.
 * @returns {Promise<string|null>}
 */
async function obterTokenArmazenado() {
  return null;
}

/** Erro de rede/timeout — a API não respondeu. */
export const ERRO_DE_REDE = 'ERRO_DE_REDE';

/**
 * Converte um erro do Axios numa mensagem legível para o usuário.
 * O FastAPI devolve o motivo no campo `detail`.
 */
export function extrairMensagemDeErro(erro) {
  const detail = erro?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  // Erros de validação do Pydantic (422) vêm como lista de objetos.
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).join(' · ');
  }

  if (!erro?.response) {
    return 'Não foi possível conectar ao servidor.';
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/** Indica se o erro foi de conectividade (e não uma resposta da API). */
export function isErroDeRede(erro) {
  return erro?.codigoInterno === ERRO_DE_REDE;
}

export function registrarInterceptors() {
  api.interceptors.request.use(async (config) => {
    const token = await obterTokenArmazenado();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
      erro.mensagem = extrairMensagemDeErro(erro);
      erro.status = erro?.response?.status ?? null;
      if (!erro.response) {
        erro.codigoInterno = ERRO_DE_REDE;
      }
      return Promise.reject(erro);
    },
  );
}

registrarInterceptors();

export default registrarInterceptors;
