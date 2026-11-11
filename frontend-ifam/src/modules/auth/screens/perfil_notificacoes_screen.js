import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Platform } from 'react-native';

// ==========================================
// --- CONSTANTES DE DESIGN (V2/Manual IF) ---
// ==========================================
const COLORS = {
  greenIF: '#2F9E41',
  redAccent: '#CD191E',
  warningYellow: '#FFC107',
  black: '#000000',
  white: '#FFFFFF',
  neutralFundo: '#F5F5F5',
  neutralBorda: '#E0E0E0',
  neutralTexto: '#757575',
  unreadDot: '#2F9E41', // Ponto indicativo de nova notificação
};

// ==========================================
// --- DADOS DE TESTE (Simulando API) ---
// Baseado no RF01 (Usuário) e RF07 (Notificações)
// ==========================================
const mockUsuario = {
  nome_completo: 'Carlos Bento',
  email: 'carlos.bento@ifam.edu.br',
  perfil: 'Solicitante',
};

const mockNotificacoes = [
  { 
    id_notificacao: '1', 
    tipo_evento: 'Reserva_Aprovada', 
    mensagem_corpo: 'Sua reserva do Datashow Epson X39 foi aprovada pelo almoxarifado. Retire no horário previsto.', 
    data_hora_envio: '18/08/2026 10:30', 
    status_leitura: false 
  },
  { 
    id_notificacao: '2', 
    tipo_evento: 'Lembrete_Devolucao', 
    mensagem_corpo: 'Lembre-se: a devolução do Notebook Dell Inspiron está programada para hoje às 18:00.', 
    data_hora_envio: '18/08/2026 14:00', 
    status_leitura: false 
  },
  { 
    id_notificacao: '3', 
    tipo_evento: 'Alerta_Atraso', 
    mensagem_corpo: 'URGENTE: A devolução do Cabo HDMI está atrasada. Novas reservas estão bloqueadas até a regularização (Regra RN03).', 
    data_hora_envio: '17/08/2026 18:15', 
    status_leitura: true 
  },
  { 
    id_notificacao: '4', 
    tipo_evento: 'Reserva_Rejeitada', 
    mensagem_corpo: 'Sua reserva da Extensão Elétrica foi rejeitada. Motivo: Equipamento indisponível no momento.', 
    data_hora_envio: '16/08/2026 09:00', 
    status_leitura: true 
  },
];

export default function PerfilNotificacoesScreen({ onBackToMenu }) {
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes);

  // Função para marcar a notificação como lida ao clicar
  const handleMarcarComoLida = (id) => {
    setNotificacoes(prevNotificacoes => 
      prevNotificacoes.map(notif => 
        notif.id_notificacao === id ? { ...notif, status_leitura: true } : notif
      )
    );
  };

  // Função para pegar as iniciais do nome para o Avatar
  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Função para definir a cor semântica e o ícone baseado no tipo_evento
  const getEventStyle = (tipo) => {
    switch (tipo) {
      case 'Reserva_Aprovada': return { color: COLORS.greenIF, icon: '✅' };
      case 'Lembrete_Devolucao': return { color: COLORS.warningYellow, icon: '⚠️' };
      case 'Alerta_Atraso': return { color: COLORS.redAccent, icon: '🚨' };
      case 'Reserva_Rejeitada': return { color: COLORS.redAccent, icon: '❌' };
      default: return { color: COLORS.neutralTexto, icon: '🔔' };
    }
  };

  // Renderização de cada card de notificação
  const renderNotificacao = ({ item }) => {
    const isUnread = !item.status_leitura;
    const { color, icon } = getEventStyle(item.tipo_evento);

    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard, 
          { borderLeftColor: color },
          isUnread ? styles.notificationCardUnread : styles.notificationCardRead,
          Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid
        ]}
        onPress={() => handleMarcarComoLida(item.id_notificacao)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationIconContainer}>
          <Text style={styles.notificationIcon}>{icon}</Text>
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationDate}>{item.data_hora_envio}</Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={[styles.notificationMessage, isUnread && styles.textBold]}>
            {item.mensagem_corpo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      {/* Header com botão de Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil e Alertas</Text>
      </View>

      {/* Seção Superior: Perfil do Usuário */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(mockUsuario.nome_completo)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{mockUsuario.nome_completo}</Text>
          <Text style={styles.profileEmail}>{mockUsuario.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{mockUsuario.perfil}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Título da Lista */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Minhas Notificações</Text>
        {/* Contador de não lidas */}
        {notificacoes.filter(n => !n.status_leitura).length > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {notificacoes.filter(n => !n.status_leitura).length} novas
            </Text>
          </View>
        )}
      </View>

      {/* Lista de Notificações (FlatList) */}
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id_notificacao}
        renderItem={renderNotificacao}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você não possui nenhuma notificação.</Text>
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

  // Perfil Superior
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: COLORS.neutralFundo,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.greenIF,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.neutralTexto,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.neutralBorda,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.neutralBorda,
    marginHorizontal: 20,
    marginBottom: 16,
  },

  // Cabeçalho da Lista
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  unreadBadge: {
    backgroundColor: COLORS.redAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Lista e Cards de Notificação
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 6, // Destaque da cor semântica
    borderColor: COLORS.neutralBorda,
    marginBottom: 12,
    padding: 16,
  },
  notificationCardUnread: {
    backgroundColor: COLORS.white, // Fundo branco para não lidas
  },
  notificationCardRead: {
    backgroundColor: '#FAFAFA', // Fundo levemente acinzentado para lidas
    opacity: 0.8,
  },
  shadowIOS: { 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2 
  },
  shadowAndroid: { 
    elevation: 1 
  },
  
  notificationIconContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  notificationIcon: {
    fontSize: 20,
  },
  
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
    color: COLORS.neutralTexto,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.unreadDot, // Verde IF como destaque
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  textBold: {
    fontWeight: 'bold',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: COLORS.neutralTexto,
    fontSize: 14,
  },
});
