import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';

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

// Dados Simulados
const mockEquipamentoDevolvido = {
  id_emprestimo: 'emp-101',
  codigo_patrimonio: 'PAT-12345',
  marca_modelo: 'Datashow Epson X39',
  solicitante: 'Carlos Bento',
};

export default function CheckInScreen({ onBackToMenu }) {
  const [hasScanned, setHasScanned] = useState(false);
  const [equipamento, setEquipamento] = useState(null);

  const [estadoConservacao, setEstadoConservacao] = useState('Bom');
  const [observacoes, setObservacoes] = useState('');

  const opcoesEstado = ['Novo', 'Bom', 'Regular', 'Defeito'];

  const handleSimularLeitura = () => {
    setEquipamento(mockEquipamentoDevolvido);
    setHasScanned(true);
  };

  const handleEscanearNovamente = () => {
    setHasScanned(false);
    setEquipamento(null);
    setObservacoes('');
    setEstadoConservacao('Bom');
  };

  const handleConfirmarDevolucao = () => {
    alert(`Devolução (Check-in) concluída!\nEstado: ${estadoConservacao}\nEquipamento retornou ao estoque.`);
    handleEscanearNovamente();
  };

  const getChipColor = (estado, isSelected) => {
    if (!isSelected) return COLORS.neutralFundo;
    if (estado === 'Defeito') return COLORS.redAccent;
    if (estado === 'Regular') return COLORS.warningYellow;
    return COLORS.black;
  };

  const getChipTextColor = (estado, isSelected) => {
    if (!isSelected) return COLORS.neutralTexto;
    if (estado === 'Regular') return COLORS.black;
    return COLORS.white;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-in (Devolução)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasScanned ? (
          <View style={styles.cameraContainer}>
            <Text style={styles.cameraTitle}>Ler QR Code para Retorno</Text>
            <Text style={styles.cameraSubtitle}>Escaneie o patrimônio que está sendo devolvido</Text>
            
            <View style={styles.cameraViewfinder}>
              <View style={styles.scanLine} />
              <Text style={styles.cameraIcon}>📥</Text>
            </View>

            <TouchableOpacity style={styles.simulateButton} onPress={handleSimularLeitura}>
              <Text style={styles.simulateButtonText}>Simular Leitura</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Avaliar Retorno de Equipamento</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoPatrimonio}>📦 {equipamento.codigo_patrimonio}</Text>
                <TouchableOpacity onPress={handleEscanearNovamente}>
                  <Text style={styles.rescanText}>Escanear outro</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.infoMarcaModelo}>{equipamento.marca_modelo}</Text>
              <Text style={styles.infoLabel}>Sendo devolvido por: <Text style={styles.bold}>{equipamento.solicitante}</Text></Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de Conservação no Retorno</Text>
              <View style={styles.chipContainer}>
                {opcoesEstado.map((estado) => {
                  const isSelected = estadoConservacao === estado;
                  return (
                    <TouchableOpacity
                      key={estado}
                      style={[
                        styles.chip,
                        { backgroundColor: getChipColor(estado, isSelected) },
                        isSelected && { borderColor: getChipColor(estado, isSelected) }
                      ]}
                      onPress={() => setEstadoConservacao(estado)}
                    >
                      <Text style={[styles.chipText, { color: getChipTextColor(estado, isSelected) }]}>
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações sobre avarias (Opcional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Ex: Equipamento retornou com o cabo danificado..."
                placeholderTextColor={COLORS.neutralTexto}
                multiline={true}
                numberOfLines={3}
                value={observacoes}
                onChangeText={setObservacoes}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarDevolucao}>
              <Text style={styles.confirmButtonText}>Confirmar Check-in</Text>
            </TouchableOpacity>
          </View>
        )}
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
  cameraContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  cameraTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 8 },
  cameraSubtitle: { fontSize: 14, color: COLORS.neutralTexto, marginBottom: 32 },
  cameraViewfinder: { width: 250, height: 250, borderWidth: 2, borderColor: COLORS.black, borderRadius: 16, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 40 },
  scanLine: { position: 'absolute', top: '50%', width: '100%', height: 2, backgroundColor: COLORS.redAccent, opacity: 0.7 },
  cameraIcon: { fontSize: 64, opacity: 0.5 },
  simulateButton: { backgroundColor: COLORS.black, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8 },
  simulateButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  formContainer: { backgroundColor: COLORS.white, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, ...(Platform.OS === 'ios' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 } : { elevation: 2 }) },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 16 },
  infoCard: { backgroundColor: COLORS.neutralFundo, padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: COLORS.neutralBorda },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoPatrimonio: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  rescanText: { color: COLORS.black, fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
  infoMarcaModelo: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 8 },
  infoLabel: { fontSize: 14, color: COLORS.neutralTexto },
  bold: { fontWeight: 'bold', color: COLORS.black },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, marginBottom: 8 },
  chipText: { fontSize: 13, fontWeight: '600' },
  textArea: { backgroundColor: COLORS.neutralFundo, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: COLORS.black, height: 80 },
  confirmButton: { backgroundColor: COLORS.greenIF, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  confirmButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});