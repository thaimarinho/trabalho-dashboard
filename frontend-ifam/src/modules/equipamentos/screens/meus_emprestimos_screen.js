import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Platform } from 'react-native';

// ==========================================
// --- CONSTANTES DE DESIGN (V2/Manual IF) ---
// [DesignSystem_Aplicativo_01_V2]
// ==========================================
const COLORS = {
  greenIF: '#2F9E41',
  redAccent: '#CD191E',
  warningYellow: '#FFC107', // Alerta para pendências
  black: '#000000',
  white: '#FFFFFF',
  neutralFundo: '#F5F5F5',
  neutralBorda: '#E0E0E0',
  neutralTexto: '#757575',
};

// ==========================================
// --- DADOS DE TESTE (Simulando API) ---
// Baseado no RF06 (Histórico e Relatórios)
// ==========================================
const mockEmprestimos = [
  // ATIVOS
  { id: '1', tipo: 'Datashow Epson', marca_modelo: 'X39 - SIAPE: 1234', data_hora_retirada_prevista: '18/08/2026 14:00', data_hora_devolucao_prevista: '18/08/2026 18:00', status_emprestimo: 'Aprovado', aba: 'ATIVOS' },
  { id: '2', tipo: 'Notebook Dell', marca_modelo: 'Inspiron 15 3000', data_hora_retirada_prevista: '19/08/2026 08:00', data_hora_devolucao_prevista: '19/08/2026 12:00', status_emprestimo: 'Pendente', aba: 'ATIVOS' },
  { id: '3', tipo: 'Cabo HDMI', marca_modelo: 'Standard 2m', data_hora_retirada_prevista: '17/08/2026 10:00', data_hora_devolucao_prevista: '17/08/2026 12:00', status_emprestimo: 'Atrasado', aba: 'ATIVOS' },
  
  // HISTÓRICO
  { id: '4', tipo: 'Extensão Elétrica', marca_modelo: '5 metros', data_hora_retirada_prevista: '10/08/2026 14:00', data_hora_devolucao_prevista: '10/08/2026 16:00', status_emprestimo: 'Concluido', aba: 'HISTORICO' },
  { id: '5', tipo: 'Datashow Epson', marca_modelo: 'X39 - SIAPE: 5678', data_hora_retirada_prevista: '05/08/2026 08:00', data_hora_devolucao_prevista: '05/08/2026 10:00', status_emprestimo: 'Rejeitado', aba: 'HISTORICO' },
];

export default function MeusEmprestimosScreen({ onBackToMenu }) {
  // Estado para controlar a aba ativa (Ativos vs Histórico)
  const [activeTab, setActiveTab] = useState('ATIVOS');

  // Filtra a lista com base na aba selecionada
  const displayedData = mockEmprestimos.filter(item => item.aba === activeTab);

  // Função para definir a cor do badge de status com base no Design System
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado':
      case 'Concluido':
        return COLORS.greenIF;
      case 'Atrasado':
      case 'Rejeitado':
        return COLORS.redAccent;
      case 'Pendente':
        return COLORS.warningYellow;
      default:
        return COLORS.neutralTexto;
    }
  };

  // Componente de Card para cada item da FlatList
  const renderItem = ({ item }) => (
    <View style={[styles.card, Platform.OS === 'ios' ? styles.cardShadowIOS : styles.cardShadowAndroid]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.itemTipo}>{item.tipo}</Text>
          <Text style={styles.itemMarcaModelo}>{item.marca_modelo}</Text>
        </View>
        
        {/* Badge de Status Semântico */}
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status_emprestimo) }]}>
          <Text style={[
            styles.badgeText, 
            // O texto do badge amarelo (Pendente) precisa ser escuro para dar contraste (Acessibilidade)
            item.status_emprestimo === 'Pendente' ? { color: COLORS.black } : { color: COLORS.white }
          ]}>
            {item.status_emprestimo}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Retirada:</Text>
          <Text style={styles.dateValue}>{item.data_hora_retirada_prevista}</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Devolução:</Text>
          <Text style={styles.dateValue}>{item.data_hora_devolucao_prevista}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      {/* Header com botão de Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Empréstimos</Text>
      </View>

      {/* Navegação por Abas (Tabs) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ATIVOS' && styles.activeTab]} 
          onPress={() => setActiveTab('ATIVOS')}
        >
          <Text style={[styles.tabText, activeTab === 'ATIVOS' && styles.activeTabText]}>
            Ativos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'HISTORICO' && styles.activeTab]} 
          onPress={() => setActiveTab('HISTORICO')}
        >
          <Text style={[styles.tabText, activeTab === 'HISTORICO' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Empréstimos */}
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum registro encontrado nesta categoria.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ==========================================
// --- ESTILOS ---
// ==========================================
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.neutralFundo 
  },
  
  // Header
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: COLORS.neutralFundo, 
  },
  backButton: { 
    marginBottom: 8 
  },
  backButtonText: { 
    color: COLORS.greenIF, 
    fontSize: 14, 
    fontWeight: '600' 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.black 
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorda,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.greenIF,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutralTexto,
  },
  activeTabText: {
    color: COLORS.greenIF,
  },

  // List & Cards
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    padding: 16,
    marginBottom: 16,
  },
  cardShadowIOS: { 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4 
  },
  cardShadowAndroid: { 
    elevation: 2 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralFundo,
    paddingBottom: 12,
  },
  itemTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  itemMarcaModelo: {
    fontSize: 14,
    color: COLORS.neutralTexto,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.neutralTexto,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: COLORS.neutralTexto,
    fontSize: 14,
  }
});