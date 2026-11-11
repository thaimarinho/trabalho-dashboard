import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';

// Constantes de Design do IFAM
const COLORS = {
  greenIF: '#2F9E41',
  redAccent: '#CD191E',
  warningYellow: '#FFC107',
  black: '#000000',
  white: '#FFFFFF',
  neutralFundo: '#F5F5F5',
  neutralBorda: '#E0E0E0',
  neutralTexto: '#757575',
};

export default function DashboardAdminScreen({ onBackToMenu, onNavigate }) {
  // Dados simulados de indicadores gerais
  const kpis = {
    pendentesAprovacao: 3,
    emprestimosAtivos: 12,
    devolucoesAtrasadas: 2,
    itensManutencao: 1,
  };

  const alertasCriticos = [
    { id: '1', solicitante: 'Marcos Souza', equipamento: 'Cabo HDMI', diasAtraso: 3 },
    { id: '2', solicitante: 'Ana Silva', equipamento: 'Datashow Epson', diasAtraso: 1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard de Gestão</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Seção 1: Grid de KPIs */}
        <Text style={styles.sectionTitle}>Indicadores Gerais</Text>
        <View style={styles.kpiGrid}>
          
          <TouchableOpacity 
            style={[styles.kpiCard, { borderLeftColor: COLORS.warningYellow }]}
            onPress={() => onNavigate && onNavigate('APROVACOES')}
          >
            <Text style={styles.kpiValue}>{kpis.pendentesAprovacao}</Text>
            <Text style={styles.kpiLabel}>Pendentes de Aprovação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.kpiCard, { borderLeftColor: COLORS.greenIF }]}>
            <Text style={styles.kpiValue}>{kpis.emprestimosAtivos}</Text>
            <Text style={styles.kpiLabel}>Empréstimos Ativos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.kpiCard, { borderLeftColor: COLORS.redAccent }]}>
            <Text style={[styles.kpiValue, { color: COLORS.redAccent }]}>{kpis.devolucoesAtrasadas}</Text>
            <Text style={styles.kpiLabel}>Devoluções em Atraso</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.kpiCard, { borderLeftColor: COLORS.neutralTexto }]}>
            <Text style={styles.kpiValue}>{kpis.itensManutencao}</Text>
            <Text style={styles.kpiLabel}>Em Manutenção</Text>
          </TouchableOpacity>

        </View>

        {/* Seção 2: Alertas Críticos de Atraso */}
        <Text style={styles.sectionTitle}>⚠️ Atrasos Críticos (Regra RN03)</Text>
        <View style={styles.alertsContainer}>
          {alertasCriticos.map((alerta) => (
            <View key={alerta.id} style={styles.alertCard}>
              <View style={styles.alertInfo}>
                <Text style={styles.alertSolicitante}>{alerta.solicitante}</Text>
                <Text style={styles.alertEquipamento}>Recurso: {alerta.equipamento}</Text>
              </View>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{alerta.diasAtraso}d em atraso</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Seção 3: Atalhos de Operação Rápida */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('CHECK_OUT')}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Realizar Check-out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => onNavigate && onNavigate('CHECK_IN')}
          >
            <Text style={styles.actionIcon}>📥</Text>
            <Text style={styles.actionText}>Realizar Check-in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutralFundo },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.neutralFundo, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  backButton: { marginBottom: 8 },
  backButtonText: { color: COLORS.greenIF, fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 12, marginTop: 8 },
  
  // KPIs
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  kpiCard: { backgroundColor: COLORS.white, width: '48%', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, borderLeftWidth: 6, marginBottom: 16, ...(Platform.OS === 'ios' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 } : { elevation: 2 }) },
  kpiValue: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, marginBottom: 4 },
  kpiLabel: { fontSize: 12, color: COLORS.neutralTexto, fontWeight: '500' },

  // Alertas
  alertsContainer: { marginBottom: 20 },
  alertCard: { backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  alertInfo: { flex: 1 },
  alertSolicitante: { fontSize: 15, fontWeight: 'bold', color: COLORS.black },
  alertEquipamento: { fontSize: 13, color: COLORS.neutralTexto, marginTop: 2 },
  alertBadge: { backgroundColor: '#FFF0F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#FFD6D6' },
  alertBadgeText: { color: COLORS.redAccent, fontSize: 12, fontWeight: 'bold' },

  // Ações Rápidas
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { backgroundColor: COLORS.white, width: '48%', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, alignItems: 'center' },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: COLORS.black, textAlign: 'center' },
});