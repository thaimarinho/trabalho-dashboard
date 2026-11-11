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

const mockAprovacoes = [
  {
    id_reserva: 'res-001',
    solicitante: 'Carlos Bento',
    perfil: 'Professor',
    equipamento: 'Datashow Epson 3000 lumens',
    data_retirada: '20/08/2026 14:00',
    data_devolucao: '20/08/2026 18:00',
  },
  {
    id_reserva: 'res-002',
    solicitante: 'Ana Silva',
    perfil: 'Aluna',
    equipamento: 'Notebook Dell Inspiron',
    data_retirada: '21/08/2026 08:00',
    data_devolucao: '21/08/2026 12:00',
  },
];

export default function AprovacoesPendentesScreen({ onBackToMenu }) {
  const [listaPendentes, setListaPendentes] = useState(mockAprovacoes);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [justificativa, setJustificativa] = useState('');

  const handleAprovar = (reserva) => {
    Alert.alert(
      'Confirmar Aprovação',
      `Deseja aprovar a reserva de ${reserva.equipamento} para ${reserva.solicitante}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: () => {
            setListaPendentes((prev) => prev.filter((item) => item.id_reserva !== reserva.id_reserva));
            Alert.alert('Sucesso', '✅ Reserva aprovada com sucesso!');
          },
        },
      ]
    );
  };

  const handleAbrirRejeicao = (reserva) => {
    setReservaSelecionada(reserva);
    setJustificativa('');
    setModalVisible(true);
  };

  const handleConfirmarRejeicao = () => {
    if (!justificativa.trim()) {
      Alert.alert('Atenção', '⚠️ A justificativa é obrigatória para rejeitar uma reserva.');
      return;
    }

    setListaPendentes((prev) => prev.filter((item) => item.id_reserva !== reservaSelecionada.id_reserva));
    setModalVisible(false);
    Alert.alert('Sucesso', '❌ Reserva rejeitada com sucesso.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aprovações Pendentes</Text>
      </View>

      <FlatList
        data={listaPendentes}
        keyExtractor={(item) => item.id_reserva}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, Platform.OS === 'ios' ? styles.cardShadowIOS : styles.cardShadowAndroid]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgePendente}>
                <Text style={styles.badgePendenteText}>Aguardando</Text>
              </View>
              <View>
                <Text style={styles.solicitanteName}>👤 {item.solicitante}</Text>
                <Text style={styles.perfilText}>{item.perfil}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.equipamentoText}>📦 {item.equipamento}</Text>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Retirada:</Text>
                <Text style={styles.dateValue}>{item.data_retirada}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Devolução:</Text>
                <Text style={styles.dateValue}>{item.data_devolucao}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.btnRejeitar} onPress={() => handleAbrirRejeicao(item)}>
                <Text style={styles.btnRejeitarText}>Rejeitar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAprovar} onPress={() => handleAprovar(item)}>
                <Text style={styles.btnAprovarText}>Aprovar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Nenhuma solicitação pendente no momento!</Text>
          </View>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rejeitar Solicitação</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Por que você está rejeitando o empréstimo do <Text style={styles.bold}>{reservaSelecionada?.equipamento}</Text> para {reservaSelecionada?.solicitante}?
              </Text>
              
              <Text style={styles.label}>Justificativa (Obrigatória)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Ex: Equipamento em manutenção no momento..."
                placeholderTextColor={COLORS.neutralTexto}
                multiline={true}
                numberOfLines={4}
                value={justificativa}
                onChangeText={setJustificativa}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.btnConfirmarRejeicao} onPress={handleConfirmarRejeicao}>
                <Text style={styles.btnConfirmarRejeicaoText}>Confirmar Rejeição</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutralFundo },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.neutralFundo, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  backButton: { marginBottom: 8 },
  backButtonText: { color: COLORS.greenIF, fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  listContent: { paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, marginBottom: 16, padding: 16 },
  cardShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardShadowAndroid: { elevation: 2 },
  cardHeader: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.neutralFundo, paddingBottom: 12 },
  badgePendente: { backgroundColor: COLORS.warningYellow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  badgePendenteText: { fontSize: 11, fontWeight: 'bold', color: COLORS.black },
  solicitanteName: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  perfilText: { fontSize: 13, color: COLORS.neutralTexto, marginTop: 2, marginLeft: 24 },
  cardBody: { marginBottom: 16 },
  equipamentoText: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 12 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, paddingLeft: 24 },
  dateLabel: { fontSize: 14, color: COLORS.neutralTexto },
  dateValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.black },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.neutralBorda },
  btnRejeitar: { flex: 0.48, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.redAccent, alignItems: 'center' },
  btnRejeitarText: { color: COLORS.redAccent, fontWeight: 'bold', fontSize: 14 },
  btnAprovar: { flex: 0.48, paddingVertical: 12, borderRadius: 8, backgroundColor: COLORS.greenIF, alignItems: 'center' },
  btnAprovarText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: COLORS.neutralTexto, fontSize: 16, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.redAccent },
  closeIcon: { fontSize: 20, color: COLORS.neutralTexto, fontWeight: 'bold' },
  modalBody: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalSubtitle: { fontSize: 14, color: COLORS.black, marginBottom: 20, lineHeight: 20 },
  bold: { fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginBottom: 8 },
  textArea: { backgroundColor: COLORS.neutralFundo, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: COLORS.black, height: 100, marginBottom: 20 },
  btnConfirmarRejeicao: { backgroundColor: COLORS.redAccent, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  btnConfirmarRejeicaoText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});