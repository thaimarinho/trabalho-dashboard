import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert
} from 'react-native';

// ==========================================
// --- CONSTANTES DE DESIGN (V2 / Manual IFAM) ---
// ==========================================
const COLORS = {
  greenIF: '#2F9E41',
  greenLight: '#E8F5E9',
  redAccent: '#CD191E',
  warningYellow: '#FFC107',
  warningLight: '#FFF8E1',
  blueAccent: '#1976D2',
  blueLight: '#E3F2FD',
  black: '#000000',
  white: '#FFFFFF',
  neutralFundo: '#F5F5F5',
  neutralBorda: '#E0E0E0',
  neutralTexto: '#757575',
  neutralDark: '#333333',
};

export default function HubModulosScreen({ onNavigate, onLogout }) {
  // Estado para simular perfil do usuário (Para teste no Snack / Expo Go)
  const [perfilUsuario, setPerfilUsuario] = useState('Solicitante');
  const nomeUsuario = "Prof. Carlos Bento";
  const campus = "IFAM - Campus Manaus Centro";

  // Alternador de perfil para facilitar testes de interface
  const togglePerfil = () => {
    setPerfilUsuario(prev => prev === 'Solicitante' ? 'Administrador' : 'Solicitante');
  };

  // ==========================================
  // --- DADOS DOS MÓDULOS INSTITUCIONAIS ---
  // ==========================================
  const modulos = [
    {
      id: 'equipamentos',
      titulo: 'Empréstimo de Equipamentos',
      subtitulo: 'Setor de Suporte e TI',
      descricao: 'Reserva de datashows, notebooks, adaptadores, caixas de som e controle de inventário com QR Code.',
      icone: '📦',
      tag: 'Ativo',
      tagColor: COLORS.greenIF,
      tagBg: COLORS.greenLight,
      destaque: true,
      acao: () => {
        if (onNavigate) {
          onNavigate('MODULO_EQUIPAMENTOS');
        } else {
          Alert.alert('Navegação', 'Acessando o Módulo de Empréstimo de Equipamentos');
        }
      },
      atalhos: perfilUsuario === 'Administrador' 
        ? [
            { label: 'Aprovações', action: 'APROVACOES_PENDENTES' },
            { label: 'Check-out (QR)', action: 'CHECKOUT' },
            { label: 'Inventário', action: 'INVENTARIO' }
          ]
        : [
            { label: 'Novo Pedido', action: 'CATALOGO_SOLICITANTE' },
            { label: 'Meus Empréstimos', action: 'MEUS_EMPRESTIMOS' }
          ]
    },
    {
      id: 'laboratorios',
      titulo: 'Alocação de Laboratórios',
      subtitulo: 'Coordenação de Informática',
      descricao: 'Consulta de disponibilidade de salas, softwares instalados, agendamento de aulas práticas e eventos.',
      icone: '💻',
      tag: 'Novo',
      tagColor: COLORS.blueAccent,
      tagBg: COLORS.blueLight,
      destaque: true,
      acao: () => {
        if (onNavigate) {
          onNavigate('MODULO_LABORATORIOS');
        } else {
          Alert.alert('Navegação', 'Acessando o Módulo de Alocação de Laboratórios');
        }
      },
      atalhos: perfilUsuario === 'Administrador'
        ? [
            { label: 'Grade Semestral', action: 'GRADE_LABS' },
            { label: 'Abertura (QR)', action: 'CHECKIN_LAB_PORTA' },
            { label: 'Softwares', action: 'GESTAO_SOFTWARES' }
          ]
        : [
            { label: 'Consultar Salas', action: 'CATALOGO_LABS' },
            { label: 'Solicitar Lab', action: 'SOLICITAR_LAB' }
          ]
    },
    {
      id: 'auditorios',
      titulo: 'Auditórios e Salas Nobres',
      subtitulo: 'Departamento de Eventos & Extensão',
      descricao: 'Agendamento para palestras, formaturas, bancas examinadoras e reuniões institucionais.',
      icone: '🏛️',
      tag: 'Em Breve',
      tagColor: COLORS.warningYellow,
      tagBg: COLORS.warningLight,
      destaque: false,
      acao: () => {
        Alert.alert('Módulo em Desenvolvimento', 'O agendamento de auditórios estará disponível nas próximas versões.');
      },
      atalhos: []
    },
    {
      id: 'chaves',
      titulo: 'Gestão de Chaves e Acessos',
      subtitulo: 'Prefeitura de Campus / Portaria',
      descricao: 'Retirada e devolução de chaves de salas de aula e departamentos com assinatura digital.',
      icone: '🔑',
      tag: 'Em Breve',
      tagColor: COLORS.warningYellow,
      tagBg: COLORS.warningLight,
      destaque: false,
      acao: () => {
        Alert.alert('Módulo em Desenvolvimento', 'O controle de chaves físicas e acessos será liberado em breve.');
      },
      atalhos: []
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenIF} />

      {/* HEADER PRINCIPAL UNIFICADO */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greetingText}>Olá, {nomeUsuario} 👋</Text>
            <Text style={styles.campusText}>{campus}</Text>
            <View style={styles.badgePerfil}>
              <Text style={styles.badgePerfilText}>Perfil: {perfilUsuario}</Text>
            </View>
          </View>

          {/* Botão de Notificações Unificado */}
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => onNavigate && onNavigate('PERFIL_NOTIFICACOES')}
            activeOpacity={0.8}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTÃO DE TESTE (ALTERNAR PERFIL) */}
      <TouchableOpacity style={styles.testBtn} onPress={togglePerfil} activeOpacity={0.8}>
        <Text style={styles.testBtnText}>
          🔄 Alternar visão para: {perfilUsuario === 'Solicitante' ? 'Administrador' : 'Solicitante'}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BANNER INSTITUCIONAL / RESUMO */}
        <View style={[styles.infoBanner, styles.shadow]}>
          <View style={styles.infoBannerIcon}>
            <Text style={{ fontSize: 24 }}>🏛️</Text>
          </View>
          <View style={styles.infoBannerTextContainer}>
            <Text style={styles.infoBannerTitle}>Portal de Serviços IFAM</Text>
            <Text style={styles.infoBannerSubtitle}>
              Selecione abaixo o módulo desejado para realizar suas solicitações e acompanhar seus agendamentos.
            </Text>
          </View>
        </View>

        {/* SEÇÃO DE MÓDULOS */}
        <Text style={styles.sectionTitle}>Módulos Institucionais</Text>

        <View style={styles.modulosContainer}>
          {modulos.map((mod) => (
            <View
              key={mod.id}
              style={[
                styles.moduloCard,
                mod.destaque && styles.moduloCardDestaque,
                styles.shadow
              ]}
            >
              {/* Topo do Card: Ícone, Título e Tag */}
              <TouchableOpacity
                onPress={mod.acao}
                activeOpacity={0.7}
                style={styles.cardHeaderArea}
              >
                <View style={styles.iconAndTitleRow}>
                  <View style={styles.cardIconWrapper}>
                    <Text style={styles.cardIcon}>{mod.icone}</Text>
                  </View>
                  <View style={styles.cardTitleWrapper}>
                    <Text style={styles.cardTitle}>{mod.titulo}</Text>
                    <Text style={styles.cardSubtitle}>{mod.subtitulo}</Text>
                  </View>
                </View>

                <View style={[styles.tagBadge, { backgroundColor: mod.tagBg }]}>
                  <Text style={[styles.tagBadgeText, { color: mod.tagColor }]}>
                    {mod.tag}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Descrição */}
              <Text style={styles.cardDescription}>{mod.descricao}</Text>

              {/* Linha Divisória para Módulos Ativos */}
              {mod.destaque && <View style={styles.cardDivider} />}

              {/* Ações e Atalhos Rápidos */}
              {mod.destaque ? (
                <View style={styles.cardActionsContainer}>
                  <View style={styles.atalhosRow}>
                    {mod.atalhos.map((atalho, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.atalhoChip}
                        onPress={() => onNavigate && onNavigate(atalho.action)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.atalhoChipText}>⚡ {atalho.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.acessarModuloBtn}
                    onPress={mod.acao}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acessarModuloBtnText}>Acessar Módulo ➔</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.cardDisabledFooter}>
                  <Text style={styles.cardDisabledText}>Disponível nas próximas atualizações</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout || (() => Alert.alert('Logout', 'Sessão encerrada com sucesso.'))}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
        </TouchableOpacity>

        <Text style={styles.versionFooter}>IFAM Mobile v2.0 • Plataforma Multi-Módulos</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// --- ESTILOS DO COMPONENTE ---
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralFundo,
  },

  // Header Institucional
  header: {
    backgroundColor: COLORS.greenIF,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  campusText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 8,
  },
  badgePerfil: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgePerfilText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  notificationBtn: {
    position: 'relative',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.redAccent,
    borderWidth: 2,
    borderColor: COLORS.greenIF,
  },

  // Botão de Teste de Perfil
  testBtn: {
    backgroundColor: COLORS.warningYellow,
    marginHorizontal: 20,
    marginTop: -14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  testBtnText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 12,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Banner Informativo
  infoBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.greenIF,
  },
  infoBannerIcon: {
    marginRight: 12,
  },
  infoBannerTextContainer: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 2,
  },
  infoBannerSubtitle: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    lineHeight: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 14,
  },

  // Cards dos Módulos
  modulosContainer: {
    marginBottom: 12,
  },
  moduloCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  moduloCardDestaque: {
    borderColor: '#C8E6C9',
  },
  cardHeaderArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconAndTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.neutralFundo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitleWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    marginTop: 1,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.neutralDark,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.neutralFundo,
    marginBottom: 12,
  },

  // Ações do Card
  cardActionsContainer: {
    marginTop: 2,
  },
  atalhosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  atalhoChip: {
    backgroundColor: COLORS.neutralFundo,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  atalhoChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutralDark,
  },
  acessarModuloBtn: {
    backgroundColor: COLORS.greenIF,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acessarModuloBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  cardDisabledFooter: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralFundo,
  },
  cardDisabledText: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    fontStyle: 'italic',
  },

  // Sombra multiplataforma
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),

  // Logout
  logoutBtn: {
    marginTop: 8,
    backgroundColor: COLORS.neutralBorda,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutBtnText: {
    color: COLORS.redAccent,
    fontSize: 15,
    fontWeight: 'bold',
  },

  versionFooter: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.neutralTexto,
    marginTop: 6,
  },
});
