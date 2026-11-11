import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';

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
};

// ==========================================
// --- COMPONENTE: LOGO OFICIAL DO IFAM ---
// --- Compatível 100% com Expo Snack / Web / Mobile ---
// ==========================================
function IfamHeaderLogo({ size = 48 }) {
  const blockSize = size * 0.14;
  const gap = size * 0.04;

  return (
    <View style={[styles.headerLogoContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.ifamGridMini}>
        {/* Linha 1 */}
        <View style={styles.ifamRowMini}>
          <View style={[styles.ifamRedDotMini, { width: blockSize, height: blockSize, borderRadius: blockSize / 2, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize }]} />
        </View>
        {/* Linha 2 */}
        <View style={[styles.ifamRowMini, { marginTop: gap }]}>
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={{ width: blockSize, height: blockSize }} />
        </View>
        {/* Linha 3 */}
        <View style={[styles.ifamRowMini, { marginTop: gap }]}>
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize }]} />
        </View>
        {/* Linha 4 */}
        <View style={[styles.ifamRowMini, { marginTop: gap }]}>
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={[styles.ifamGreenBlockMini, { width: blockSize, height: blockSize, marginRight: gap }]} />
          <View style={{ width: blockSize, height: blockSize }} />
        </View>
      </View>
    </View>
  );
}

export default function MenuPrincipalScreen({ onNavigate, onLogout }) {
  // Estado para simular o perfil logado (Apenas para facilitar o teste no Snack)
  const [perfilUsuario, setPerfilUsuario] = useState('Solicitante'); 
  const nomeUsuario = "Carlos Bento";

  // Alterna entre Administrador e Solicitante para teste de UI
  const togglePerfil = () => {
    setPerfilUsuario(prev => prev === 'Solicitante' ? 'Administrador' : 'Solicitante');
  };

  // ==========================================
  // --- CONFIGURAÇÃO DOS MENUS ---
  // ==========================================
  const menuSolicitante = [
    { id: 'catalogo', titulo: 'Novo Empréstimo', icone: '📅', acao: 'CATALOGO_SOLICITANTE' },
    { id: 'meus_emprestimos', titulo: 'Meus Empréstimos', icone: '🕒', acao: 'MEUS_EMPRESTIMOS' },
    { id: 'perfil_notificacoes', titulo: 'Perfil e Alertas', icone: '🔔', acao: 'PERFIL_NOTIFICACOES' },
  ];

  const menuAdministrador = [
    { id: 'dashboard', titulo: 'Dashboard', icone: '📊', acao: 'DASHBOARD_ADMIN' },
    { id: 'aprovacoes', titulo: 'Aprovações', icone: '✅', acao: 'APROVACOES_PENDENTES', destaque: true },
    { id: 'checkout', titulo: 'Check-out (Saída)', icone: '📤', acao: 'CHECKOUT' },
    { id: 'checkin', titulo: 'Check-in (Retorno)', icone: '📥', acao: 'CHECKIN' },
    { id: 'inventario', titulo: 'Inventário Geral', icone: '📦', acao: 'INVENTARIO' },
    { id: 'novo_recurso', titulo: 'Cadastrar Recurso', icone: '➕', acao: 'CADASTRO_RECURSO' },
    { id: 'categorias', titulo: 'Categorias (Tipos)', icone: '🏷️', acao: 'TIPOS_RECURSO' },
    { id: 'usuarios', titulo: 'Gestão de Usuários', icone: '👥', acao: 'CRUD_USUARIOS' },
    { id: 'historico_global', titulo: 'Histórico Global', icone: '📜', acao: 'HISTORICO_GLOBAL' },
  ];

  const menuAtual = perfilUsuario === 'Administrador' ? menuAdministrador : menuSolicitante;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenIF} />
      
      {/* HEADER PRINCIPAL COM LOGOMARCA IFAM */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <IfamHeaderLogo size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.institutionTag}>MÓDULO 1 • EQUIPAMENTOS</Text>
              <Text style={styles.greetingText}>Olá, {nomeUsuario} 👋</Text>
              <View style={styles.badgePerfil}>
                <Text style={styles.badgePerfilText}>{perfilUsuario}</Text>
              </View>
            </View>
          </View>
          
          {/* Botão de Notificações com Dot de alerta */}
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

      {/* BOTÃO DE TESTE (Alternar Perfil) */}
      <TouchableOpacity style={styles.testBtn} onPress={togglePerfil} activeOpacity={0.8}>
        <Text style={styles.testBtnText}>🔄 Alternar para visão de {perfilUsuario === 'Solicitante' ? 'Administrador' : 'Solicitante'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>O que você deseja acessar?</Text>
        
        {/* GRID DE MENUS */}
        <View style={styles.menuGrid}>
          {menuAtual.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuCard, item.destaque && styles.menuCardDestaque, Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid]}
              onPress={() => onNavigate && onNavigate(item.acao)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icone}</Text>
              <Text style={styles.menuTitle}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTÃO DE LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>Sair do Sistema</Text>
        </TouchableOpacity>
      </ScrollView>

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

  // Header com cor institucional
  header: { 
    backgroundColor: COLORS.greenIF, 
    paddingHorizontal: 20, 
    paddingTop: 16,
    paddingBottom: 26,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogoContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  ifamGridMini: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ifamRowMini: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ifamRedDotMini: {
    backgroundColor: COLORS.redAccent,
  },
  ifamGreenBlockMini: {
    backgroundColor: COLORS.greenIF,
    borderRadius: 2,
  },

  userInfo: {
    flex: 1,
  },
  institutionTag: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  greetingText: { 
    color: COLORS.white, 
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgePerfil: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgePerfilText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  
  notificationBtn: {
    position: 'relative',
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginLeft: 8,
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

  // Botão de Teste (Mock)
  testBtn: {
    backgroundColor: COLORS.warningYellow,
    marginHorizontal: 20,
    marginTop: -14,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  testBtnText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 12,
  },

  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 22, 
    paddingBottom: 40 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.black, 
    marginBottom: 16 
  },

  // Grid de Cards
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  menuCard: { 
    backgroundColor: COLORS.white, 
    width: '48%', 
    aspectRatio: 1, // Mantém quadrado perfeito
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  menuCardDestaque: {
    borderWidth: 2,
    borderColor: COLORS.greenIF,
    backgroundColor: '#F0FFF0', // Fundo levemente esverdeado
  },
  shadowIOS: { 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4 
  },
  shadowAndroid: { 
    elevation: 2 
  },
  menuIcon: { 
    fontSize: 36, 
    marginBottom: 12 
  },
  menuTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COLORS.black, 
    textAlign: 'center' 
  },

  // Logout
  logoutBtn: { 
    marginTop: 16,
    backgroundColor: COLORS.neutralBorda, 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  logoutBtnText: { 
    color: COLORS.redAccent, 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
});