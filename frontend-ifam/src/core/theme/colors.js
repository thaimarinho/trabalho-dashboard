/**
 * Paleta de cores oficial do IFAM (Design System V2).
 *
 * Referência: Documentação/docs/seq_03_design_system_V2.md
 * Toda nova interface deve usar exclusivamente estas cores.
 */

export const COLORS = {
  // --- Primárias e institucionais ---
  greenIF: '#2F9E41',
  greenLightBg: '#E8F5E9',

  // --- Alerta e atenção ---
  redAccent: '#CD191E',
  redLightBg: '#FFEBEE',
  yellowIF: '#FFC107',
  yellowLightBg: '#FFF8E1',

  // --- Módulo 2 (Laboratórios) ---
  blueIF: '#1976D2',
  blueLightBg: '#E3F2FD',

  // --- Neutras (fundo, superfícies e tipografia) ---
  neutralFundo: '#F5F5F5',
  white: '#FFFFFF',
  neutralBorda: '#E0E0E0',
  black: '#000000',
  neutralTexto: '#757575',
  neutralTextoEscuro: '#333333',
};

/** Raios de borda padronizados (seq_03, seção 2.D). */
export const RADIUS = {
  card: 12,
  botao: 8,
  chip: 16,
  badge: 8,
};

export default COLORS;
