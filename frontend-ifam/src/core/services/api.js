/**
 * Cliente HTTP compartilhado (Axios) da API RESTful do IFAM.
 *
 * Referência: Documentação/docs/seq_04_mapa_frontend.md — `src/core/services/api.js`.
 *
 * A URL base vem de `expo.extra.apiBaseUrl` no app.json. Em dispositivo físico
 * `localhost` não resolve para a máquina de desenvolvimento — troque o valor
 * pelo IP da sua rede local (ex.: "http://192.168.0.10:8000").
 */

import axios from 'axios';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const API_BASE_URL = extra.apiBaseUrl ?? 'http://localhost:8000';

/** Quando `true`, os services usam dados mockados e não chamam a API. */
export const USE_MOCK = extra.useMock === true;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
