/**
 * Mock in-memory do catálogo de tipos de recursos (RF-EQ01).
 *
 * Reproduz exatamente o contrato de `/api/v1/equipamentos/tipos/`
 * (Documentação/docs/seq_06_mapa_backend.md, seções 2.1 e 2.2), incluindo os
 * mesmos nomes de campo e uma latência artificial.
 *
 * Serve como fallback quando a API não está no ar, para que a tela possa ser
 * demonstrada no Expo Snack / apresentação sem depender do back-end.
 */

const LATENCIA_MS = 250;

// Mesmos registros semeados no back-end (app/repositories/tipos_recursos.py).
const SEED = [
  {
    id_tipo_recurso: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    descricao: 'Datashow Epson 3000 lumens',
    categoria: 'Eletrônicos',
    criado_em: '2026-08-01T08:00:00Z',
  },
  {
    id_tipo_recurso: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    descricao: 'Cabo HDMI 2.0 (2 metros)',
    categoria: 'Cabos',
    criado_em: '2026-08-01T08:05:00Z',
  },
  {
    id_tipo_recurso: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
    descricao: 'Extensão Elétrica 5 metros',
    categoria: 'Acessórios',
    criado_em: '2026-08-01T08:10:00Z',
  },
];

let registros = SEED.map((item) => ({ ...item }));

const esperar = () => new Promise((resolve) => setTimeout(resolve, LATENCIA_MS));

function gerarId() {
  // UUID v4 simplificado — suficiente para o mock.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function naoEncontrado() {
  const erro = new Error('Tipo de recurso não encontrado.');
  erro.mensagem = erro.message;
  erro.status = 404;
  return erro;
}

export async function listar() {
  await esperar();
  return registros.map((item) => ({ ...item }));
}

export async function criar({ descricao, categoria }) {
  await esperar();
  const novo = {
    id_tipo_recurso: gerarId(),
    descricao: descricao.trim(),
    categoria: categoria.trim(),
    criado_em: new Date().toISOString(),
  };
  registros = [...registros, novo];
  return { ...novo };
}

export async function atualizar(id, { descricao, categoria }) {
  await esperar();
  const indice = registros.findIndex((item) => item.id_tipo_recurso === id);
  if (indice === -1) {
    throw naoEncontrado();
  }

  const atualizado = {
    ...registros[indice],
    ...(descricao !== undefined && { descricao: descricao.trim() }),
    ...(categoria !== undefined && { categoria: categoria.trim() }),
  };
  registros = registros.map((item, i) => (i === indice ? atualizado : item));
  return { ...atualizado };
}

export async function excluir(id) {
  await esperar();
  const existia = registros.some((item) => item.id_tipo_recurso === id);
  if (!existia) {
    throw naoEncontrado();
  }
  registros = registros.filter((item) => item.id_tipo_recurso !== id);
}

/** Restaura o estado inicial (útil em testes e demonstrações). */
export function reiniciar() {
  registros = SEED.map((item) => ({ ...item }));
}
