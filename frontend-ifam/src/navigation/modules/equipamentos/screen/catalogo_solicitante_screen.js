import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Nova Dependência

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
// --- DADOS DE TESTE (Simulando API - RF03) ---
// ==========================================
const mockCatalogo = [
  { id_recurso: '1', categoria: 'Eletrônicos', marca_modelo: 'Datashow Epson 3000 lumens', patrimonio: 'PAT-102030', status: 'Disponível' },
  { id_recurso: '2', categoria: 'Eletrônicos', marca_modelo: 'Notebook Dell Inspiron', patrimonio: 'PAT-405060', status: 'Emprestado' },
  { id_recurso: '3', categoria: 'Cabos', marca_modelo: 'Cabo HDMI 2m', patrimonio: 'PAT-708090', status: 'Disponível' },
  { id_recurso: '4', categoria: 'Acessórios', marca_modelo: 'Extensão Elétrica 5m', patrimonio: 'PAT-112233', status: 'Manutenção' },
];

export default function CatalogoSolicitanteScreen({ onBackToMenu }) {
  const [searchText, setSearchText] = useState('');
  
  // Estados do Modal de Reserva (RF04)
  const [modalVisible, setModalVisible] = useState(false);
  const [recursoSelecionado, setRecursoSelecionado] = useState(null);
  
  // ==========================================
  // --- ESTADOS DO DATE/TIME PICKER ---
  // ==========================================
  const [datasReserva, setDatasReserva] = useState({
    dataRetirada: new Date(),
    horaRetirada: new Date(),
    dataDevolucao: new Date(),
    horaDevolucao: new Date()
  });

  const [pickerConfig, setPickerConfig] = useState({
    show: false,
    mode: 'date', // 'date' ou 'time'
    target: null  // qual campo está sendo editado
  });

  // Funções Auxiliares para Formatar a Data e Hora na Tela
  const formatarData = (data) => {
    let d = data.getDate().toString().padStart(2, '0');
    let m = (data.getMonth() + 1).toString().padStart(2, '0');
    let y = data.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatarHora = (hora) => {
    let h = hora.getHours().toString().padStart(2, '0');
    let m = hora.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Abrir o Calendário ou Relógio
  const abrirPicker = (target, mode) => {
    setPickerConfig({ show: true, mode, target });
  };

  // Lidar com a escolha do usuário no Picker
  const aoMudarPicker = (event, selectedDate) => {
    // No Android, precisamos fechar o picker manualmente após a seleção
    if (Platform.OS === 'android') {
      setPickerConfig({ ...pickerConfig, show: false });
    }

    if (event.type === 'set' && selectedDate) {
      setDatasReserva(prev => ({
        ...prev,
        [pickerConfig.target]: selectedDate
      }));
    } else if (event.type === 'dismiss') {
      setPickerConfig({ ...pickerConfig, show: false });
    }
  };

  // Fechar Modal (iOS)
  const confirmarPickerIOS = () => {
    setPickerConfig({ ...pickerConfig, show: false });
  };

  // Filtragem básica da lista pelo termo de busca
  const filteredCatalogo = mockCatalogo.filter(item => 
    item.marca_modelo.toLowerCase().includes(searchText.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchText.toLowerCase())
  );

  // Ação: Abrir Modal de Agendamento
  const handleAbrirReserva = (recurso) => {
    setRecursoSelecionado(recurso);
    setDatasReserva({
      dataRetirada: new Date(),
      horaRetirada: new Date(),
      dataDevolucao: new Date(),
      horaDevolucao: new Date()
    });
    setModalVisible(true);
  };

  // Ação: Confirmar Solicitação de Reserva
  const handleConfirmarReserva = () => {
    const dataRet = formatarData(datasReserva.dataRetirada);
    const horaRet = formatarHora(datasReserva.horaRetirada);
    const dataDev = formatarData(datasReserva.dataDevolucao);
    const horaDev = formatarHora(datasReserva.horaDevolucao);

    alert(`✅ Solicitação enviada com sucesso!\n\nEquipamento: ${recursoSelecionado.marca_modelo}\nRetirada: ${dataRet} às ${horaRet}\nDevolução: ${dataDev} às ${horaDev}\n\nAguarde a aprovação.`);
    setModalVisible(false);
  };

  // Definir cor do Status no card
  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponível': return COLORS.greenIF;
      case 'Emprestado': return COLORS.warningYellow;
      case 'Manutenção': return COLORS.redAccent;
      default: return COLORS.neutralTexto;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catálogo de Recursos</Text>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por equipamento ou categoria..."
          placeholderTextColor={COLORS.neutralTexto}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista do Catálogo */}
      <FlatList
        data={filteredCatalogo}
        keyExtractor={(item) => item.id_recurso}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, Platform.OS === 'ios' ? styles.cardShadowIOS : styles.cardShadowAndroid]}>
            <View style={styles.cardHeader}>
              <View style={[styles.badgeStatus, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={[styles.badgeStatusText, item.status === 'Emprestado' && { color: COLORS.black }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.categoriaText}>{item.categoria}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.equipamentoText}>{item.marca_modelo}</Text>
              <Text style={styles.patrimonioText}>Patrimônio: {item.patrimonio}</Text>
            </View>

            {item.status === 'Disponível' ? (
              <TouchableOpacity style={styles.btnReservar} onPress={() => handleAbrirReserva(item)}>
                <Text style={styles.btnReservarText}>📅 Solicitar Reserva</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.btnIndisponivel}>
                <Text style={styles.btnIndisponivelText}>Item Indisponível no Momento</Text>
              </View>
            )}
          </View>
        )}
      />

      {/* ========================================== */}
      {/* MODAL: SELEÇÃO DE DATAS E HORÁRIOS (RF04) */}
      {/* ========================================== */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agendar Equipamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Você está solicitando a reserva de:
                {"\n"}<Text style={styles.bold}>{recursoSelecionado?.marca_modelo}</Text>
              </Text>
              
              <View style={styles.divider} />

              {/* DADOS DE RETIRADA */}
              <Text style={styles.sectionLabel}>📤 Dados de Retirada (Check-out)</Text>
              <View style={styles.rowInputs}>
                <TouchableOpacity style={[styles.inputBox, styles.halfInput]} onPress={() => abrirPicker('dataRetirada', 'date')}>
                  <Text style={styles.inputText}>📅 {formatarData(datasReserva.dataRetirada)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inputBox, styles.halfInput]} onPress={() => abrirPicker('horaRetirada', 'time')}>
                  <Text style={styles.inputText}>⏰ {formatarHora(datasReserva.horaRetirada)}</Text>
                </TouchableOpacity>
              </View>

              {/* DADOS DE DEVOLUÇÃO */}
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>📥 Dados de Devolução (Check-in)</Text>
              <View style={styles.rowInputs}>
                <TouchableOpacity style={[styles.inputBox, styles.halfInput]} onPress={() => abrirPicker('dataDevolucao', 'date')}>
                  <Text style={styles.inputText}>📅 {formatarData(datasReserva.dataDevolucao)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inputBox, styles.halfInput]} onPress={() => abrirPicker('horaDevolucao', 'time')}>
                  <Text style={styles.inputText}>⏰ {formatarHora(datasReserva.horaDevolucao)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.alertaBox}>
                <Text style={styles.alertaTexto}>
                  Ao confirmar, sua solicitação entrará no status <Text style={styles.bold}>Pendente</Text> e será analisada pelo almoxarifado.
                </Text>
              </View>

              <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirmarReserva}>
                <Text style={styles.btnConfirmarText}>Confirmar Solicitação</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* COMPONENTE NATIVO: DATE / TIME PICKER */}
      {/* ========================================== */}
      {pickerConfig.show && (
        <>
          <DateTimePicker
            value={datasReserva[pickerConfig.target]}
            mode={pickerConfig.mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={aoMudarPicker}
            locale="pt-BR"
          />
          {/* Botão de Fechar Exclusivo para iOS (onde o picker não fecha sozinho) */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.btnFecharPickerIOS} onPress={confirmarPickerIOS}>
              <Text style={styles.btnFecharPickerTextIOS}>Confirmar Data/Hora</Text>
            </TouchableOpacity>
          )}
        </>
      )}

    </SafeAreaView>
  );
}

// ==========================================
// --- ESTILOS ---
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutralFundo },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.neutralFundo },
  backButton: { marginBottom: 8 },
  backButtonText: { color: COLORS.greenIF, fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  searchSection: { paddingHorizontal: 20, paddingBottom: 16, backgroundColor: COLORS.neutralFundo, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  searchInput: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: COLORS.black },

  listContent: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, marginBottom: 16, padding: 16 },
  cardShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  cardShadowAndroid: { elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeStatusText: { fontSize: 11, fontWeight: 'bold', color: COLORS.white },
  categoriaText: { fontSize: 12, color: COLORS.neutralTexto, fontWeight: '600' },
  cardBody: { marginBottom: 16 },
  equipamentoText: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 4 },
  patrimonioText: { fontSize: 13, color: COLORS.neutralTexto },

  btnReservar: { backgroundColor: COLORS.greenIF, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnReservarText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  btnIndisponivel: { backgroundColor: COLORS.neutralFundo, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.neutralBorda },
  btnIndisponivelText: { color: COLORS.neutralTexto, fontWeight: '600', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  closeIcon: { fontSize: 20, color: COLORS.neutralTexto, fontWeight: 'bold' },
  modalBody: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalSubtitle: { fontSize: 14, color: COLORS.neutralTexto, marginBottom: 16, lineHeight: 22 },
  bold: { fontWeight: 'bold', color: COLORS.black },
  divider: { height: 1, backgroundColor: COLORS.neutralBorda, marginBottom: 16 },
  
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginBottom: 8 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  
  // Novos Estilos para o Botão do Picker simulando um Input
  inputBox: { backgroundColor: COLORS.neutralFundo, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, justifyContent: 'center' },
  inputText: { fontSize: 14, color: COLORS.black, fontWeight: '500' },
  halfInput: { width: '48%' },

  alertaBox: { backgroundColor: '#FFF9C4', padding: 12, borderRadius: 8, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.warningYellow },
  alertaTexto: { fontSize: 12, color: COLORS.black, lineHeight: 18 },

  btnConfirmar: { backgroundColor: COLORS.greenIF, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  btnConfirmarText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  // Botão de Fechamento do Calendário no iOS
  btnFecharPickerIOS: { backgroundColor: COLORS.neutralFundo, padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.neutralBorda },
  btnFecharPickerTextIOS: { color: COLORS.greenIF, fontWeight: 'bold', fontSize: 16 },
});