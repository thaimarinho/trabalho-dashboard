/**
 * Ponto de entrada do aplicativo Portal IFAM.
 *
 * Entrada temporária para demonstrar o RF-LAB08 integrado à API.
 *
 * TODO(equipe de navegação): substituir o corpo deste componente pelo
 * `AppNavigator` (src/navigation/AppNavigator.js), que alterna entre o
 * AuthNavigator e o HubNavigator. A TiposRecursoScreen deve então ser
 * registrada no `EquipamentosNavigator` sob a rota `TIPOS_RECURSO`
 * (ver menu_principal_screen.js, item "Categorias (Tipos)").
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';

import DashboardLaboratoriosScreen from './src/modules/laboratorios/screens/dashboard_laboratorios_screen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <DashboardLaboratoriosScreen onBackToMenu={() => {}} />
    </>
  );
}
