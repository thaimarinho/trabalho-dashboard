import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  Platform,
  Alert
} from 'react-native';

// ==========================================
// --- CONSTANTES DE DESIGN (V2/Manual IFAM) ---
// ==========================================
const COLORS = {
  greenIF: '#2F9E41',
  greenLight: '#E8F5E9',
  redAccent: '#CD191E',
  redLight: '#FFEBEE',
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

// ==========================================
// --- DADOS MOCKADOS (API Simulação - RF-LAB04) ---
// ==========================================
const initialAprovacoes = [
  {
    id_alocacao: 'aloc-101',
    laboratorio: 'Lab 01 - Redes e Infraestrutura',
    bloco: 'Bloco B - Sala 102',
    professor: 'Prof. Roberto Dias',
    matricula: 'SIAPE 1982341',
    disciplina: 'Segurança de Redes e Firewalls',
    curso: 'TADS 4º Período',
    qtd_alunos: 28,
    tipo: 'Pontual',
    data: '28/08/2026',
    turno: 'Matutino',
    tempos: '1º e 2º Tempo (07:30 - 09:10)',
    softwares: ['Wireshark', 'VirtualBox', 'Putty'],
    conflito: false,
  },
  {
    id_alocacao: 'aloc-102',
    laboratorio: 'Lab 02 - Desenvolvimento de Software',
    bloco: 'Bloco B - Sala 104',
    professor: 'Profª. Camila Ribeiro',
    matricula: 'SIAPE 2451990',
    disciplina: 'Desenvolvimento Web FullStack',
    curso: 'Eng. Software 3º Período',
    qtd_alunos: 34,
    tipo: 'Semestral',
    data: 'Todas as Quartas (2026/2)',
    turno: 'Vespertino',
    tempos: '3º e 4º Tempo (15:30 - 17:10)',
    softwares: ['VS Code', 'Docker', 'PostgreSQL'],
    conflito: false,
  },
  {
    id_alocacao: 'aloc-103',
    laboratorio: 'Lab 03 - Computação Gráfica & CAD',
    bloco: 'Bloco C - Sala 04',
    professor: 'Prof. Marcos Lima',
    matricula: 'SIAPE 3120098',
    disciplina: 'Modelagem Tridimensional com Blender',
    curso: 'Design Digital 2º Per',
    qtd_alunos: 22,
    tipo: 'Pontual',
    data: '29/08/2026',
    turno: 'Noturno',
    tempos: '1º e 2º Tempo (18:30 - 20:10)',
    softwares: ['Blender 3D', 'Photoshop'],
    conflito: true, // Demonstração de conflito de horário
  },
];

export default function AprovacoesAlocacoesScreen({ onBackToMenu }) {
  const [pedidos, setPedidos] = useState(initialAprovacoes);
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Modal de Rejeição (Justificativa Obrigatória)
  const [modalRejeicaoVisible, setModalRejeicaoVisible] = useState(false);
  const [pedidoParaRejeitar, setPedidoParaRejeitar] = useState(null);
  const [justificativaTexto, setJustificativaTexto] = useState('');

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroTipo === 'Todos') return true;
    return p.tipo === filtroTipo;
  });

  const handleAprovar = (pedido) => {
    Alert.alert(
      'Confirmar Aprovação',
      `Aprovar alocação do ${pedido.laboratorio} para o ${pedido.professor} em ${pedido.data} (${pedido.tempos})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: () => {
            setPedidos(pedidos.filter((p) => p.id_alocacao !== pedido.id_alocacao));
            Alert.alert('✅ Aprovado', 'Alocação confirmada. O solicitante e a equipe foram notificados.');
          },
        },
      ]
    );
  };

  const abrirModalRejeicao = (pedido) => {
    setPedidoParaRejeitar(pedido);
    setJustificativaTexto('');
    setModalRejeicaoVisible(true);
  };

  const handleConfirmarRejeicao = () => {
    if (!justificativaTexto.trim()) {
      Alert.alert('Atenção', 'A justificativa de rejeição é obrigatória.');
      return;
    }

    setPedidos(pedidos.filter((p) => p.id_alocacao !== pedidoParaRejeitar.id_alocacao));
    setModalRejeicaoVisible(false);
    Alert.alert('🚫 Rejeitado', 'O pedido foi rejeitado e o solicitante recebeu a justificativa.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu de Laboratórios</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Aprovações de Labs</Text>
            <Text style={styles.headerSubtitle}>Análise de solicitações de alocação de salas</Text>
          </View>
          <View style={styles.pendentesBadge}>
            <Text style={styles.pendentesBadgeText}>{pedidos.length} Pendentes</Text>
          </View>
        </View>
      </View>

      {/* FILTROS RÁPIDOS */}
      <View style={styles.filtrosRow}>
        {['Todos', 'Pontual', 'Semestral'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[styles.filtroBtn, filtroTipo === tipo && styles.filtroBtnActive]}
            onPress={() => setFiltroTipo(tipo)}
          >
            <Text style={[styles.filtroBtnText, filtroTipo === tipo && styles.filtroBtnTextActive]}>
              {tipo === 'Todos' ? 'Todos os Pedidos' : `Alocação ${tipo}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA DE SOLICITAÇÕES */}
      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id_alocacao}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🎉</Text>
            <Text style={styles.emptyTitle}>Tudo em dia!</Text>
            <Text style={styles.emptySubtitle}>Não há solicitações de laboratório pendentes de análise.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, styles.shadow]}>
            {/* BADGES EM COLUNA (DESIGN SYSTEM V2) */}
            <View style={styles.badgesColumn}>
              <View style={styles.statusRow}>
                <View style={styles.badgePendente}>
                  <Text style={styles.badgePendenteText}>● Aguardando Análise</Text>
                </View>
                <View style={styles.badgeTipo}>
                  <Text style={styles.badgeTipoText}>{item.tipo}</Text>
                </View>
              </View>

              {item.conflito && (
                <View style={styles.badgeConflito}>
                  <Text style={styles.badgeConflitoText}>⚠️ Alerta: Conflito de Horário no Lab</Text>
                </View>
              )}
            </View>

            {/* DADOS DO PEDIDO */}
            <Text style={styles.labNome}>{item.laboratorio}</Text>
            <Text style={styles.blocoText}>📍 {item.bloco}</Text>

            <View style={styles.infoDivider} />

            <Text style={styles.infoLine}>👤 <Text style={styles.bold}>Docente:</Text> {item.professor} ({item.matricula})</Text>
            <Text style={styles.infoLine}>📚 <Text style={styles.bold}>Disciplina:</Text> {item.disciplina}</Text>
            <Text style={styles.infoLine}>🎓 <Text style={styles.bold}>Turma:</Text> {item.curso} • {item.qtd_alunos} alunos</Text>
            <Text style={styles.infoLine}>⏰ <Text style={styles.bold}>Horário:</Text> {item.data} • {item.turno} ({item.tempos})</Text>

            {/* Tags de Softwares */}
            <View style={styles.softwaresRow}>
              {item.softwares.map((s, idx) => (
                <View key={idx} style={styles.softChip}>
                  <Text style={styles.softChipText}>💾 {s}</Text>
                </View>
              ))}
            </View>

            {/* BOTÕES DE APROVAÇÃO / REJEIÇÃO */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.btnRejeitar}
                onPress={() => abrirModalRejeicao(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnRejeitarText}>Rejeitar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnAprovar}
                onPress={() => handleAprovar(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAprovarText}>✓ Aprovar Alocação</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ========================================== */}
      {/* MODAL: JUSTIFICATIVA DE REJEIÇÃO (RF-LAB04) */}
      {/* ========================================== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRejeicaoVisible}
        onRequestClose={() => setModalRejeicaoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rejeitar Solicitação</Text>
              <TouchableOpacity onPress={() => setModalRejeicaoVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalDesc}>
                Informe o motivo da rejeição para o(a) <Text style={styles.bold}>{pedidoParaRejeitar?.professor}</Text>:
              </Text>

              <TextInput
                style={styles.justificativaInput}
                placeholder="Ex: Sala já reservada para manutenção preventiva ou conflito de grade..."
                placeholderTextColor={COLORS.neutralTexto}
                multiline
                numberOfLines={4}
                value={justificativaTexto}
                onChangeText={setJustificativaTexto}
              />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.btnCancelarModal}
                  onPress={() => setModalRejeicaoVisible(false)}
                >
                  <Text style={styles.btnCancelarModalText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnConfirmarRejeicao}
                  onPress={handleConfirmarRejeicao}
                >
                  <Text style={styles.btnConfirmarRejeicaoText}>Confirmar Rejeição</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  backButton: {
    marginBottom: 6,
  },
  backButtonText: {
    color: COLORS.greenIF,
    fontSize: 13,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.neutralTexto,
  },
  pendentesBadge: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: COLORS.warningYellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pendentesBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E65100',
  },

  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtroBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filtroBtnActive: {
    backgroundColor: COLORS.greenIF,
    borderColor: COLORS.greenIF,
  },
  filtroBtnText: {
    fontSize: 12,
    color: COLORS.neutralDark,
  },
  filtroBtnTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  badgesColumn: {
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgePendente: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePendenteText: {
    color: '#E65100',
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeTipo: {
    backgroundColor: COLORS.blueLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTipoText: {
    color: COLORS.blueAccent,
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeConflito: {
    backgroundColor: COLORS.redLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.redAccent,
  },
  badgeConflitoText: {
    color: COLORS.redAccent,
    fontSize: 11,
    fontWeight: 'bold',
  },

  labNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 2,
  },
  blocoText: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    marginBottom: 6,
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.neutralFundo,
    marginVertical: 8,
  },

  infoLine: {
    fontSize: 12,
    color: COLORS.neutralDark,
    lineHeight: 18,
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.black,
  },

  softwaresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 12,
  },
  softChip: {
    backgroundColor: COLORS.neutralFundo,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  softChipText: {
    fontSize: 10,
    color: COLORS.neutralDark,
  },

  actionRow: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralFundo,
  },
  btnRejeitar: {
    backgroundColor: COLORS.redLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  btnRejeitarText: {
    color: COLORS.redAccent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnAprovar: {
    flex: 1,
    backgroundColor: COLORS.greenIF,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnAprovarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorda,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  closeBtn: {
    fontSize: 18,
    color: COLORS.neutralTexto,
    fontWeight: 'bold',
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalDesc: {
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 10,
  },
  justificativaInput: {
    backgroundColor: COLORS.neutralFundo,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: COLORS.black,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActionRow: {
    flexDirection: 'row',
  },
  btnCancelarModal: {
    flex: 1,
    backgroundColor: COLORS.neutralFundo,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  btnCancelarModalText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: '600',
  },
  btnConfirmarRejeicao: {
    flex: 1,
    backgroundColor: COLORS.redAccent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnConfirmarRejeicaoText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    textAlign: 'center',
    marginTop: 4,
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }),
});

