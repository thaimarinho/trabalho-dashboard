import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';

// Constantes de Design do IFAM
const COLORS = {
  greenIF: '#2F9E41',
  black: '#000000',
  white: '#FFFFFF',
  neutralFundo: '#F5F5F5',
  neutralBorda: '#E0E0E0',
  neutralTexto: '#757575',
};

// Dados Simulados
const mockEquipamentoLido = {
  id_emprestimo: 'emp-101',
  codigo_patrimonio: 'PAT-12345',
  marca_modelo: 'Datashow Epson X39',
  solicitante: 'Carlos Bento',
  data_hora_prevista: '18/08/2026 14:00',
};

export default function CheckOutScreen({ onBackToMenu }) {
  const [hasScanned, setHasScanned] = useState(false);
  const [equipamento, setEquipamento] = useState(null);

  const handleSimularLeitura = () => {
    setEquipamento(mockEquipamentoLido);
    setHasScanned(true);
  };

  const handleEscanearNovamente = () => {
    setHasScanned(false);
    setEquipamento(null);
  };

  const handleConfirmarRetirada = () => {
    alert(`Retirada (Check-out) registrada com sucesso!\nEquipamento: ${equipamento.codigo_patrimonio}\nEntregue a: ${equipamento.solicitante}`);
    handleEscanearNovamente();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-out (Retirada)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasScanned ? (
          <View style={styles.cameraContainer}>
            <Text style={styles.cameraTitle}>Ler QR Code para Saída</Text>
            <Text style={styles.cameraSubtitle}>Escaneie o patrimônio que será entregue</Text>
            
            <View style={styles.cameraViewfinder}>
              <View style={styles.scanLine} />
              <Text style={styles.cameraIcon}>📤</Text>
            </View>

            <TouchableOpacity style={styles.simulateButton} onPress={handleSimularLeitura}>
              <Text style={styles.simulateButtonText}>Simular Leitura</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Confirmar Entrega de Equipamento</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoPatrimonio}>📦 {equipamento.codigo_patrimonio}</Text>
                <TouchableOpacity onPress={handleEscanearNovamente}>
                  <Text style={styles.rescanText}>Escanear outro</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.infoMarcaModelo}>{equipamento.marca_modelo}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.infoLabel}>Liberar para o Solicitante:</Text>
              <Text style={styles.infoValue}>{equipamento.solicitante}</Text>
              
              <Text style={styles.infoLabel}>Reserva agendada para:</Text>
              <Text style={styles.infoValue}>{equipamento.data_hora_prevista}</Text>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarRetirada}>
              <Text style={styles.confirmButtonText}>Confirmar Check-out</Text>
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
  cameraViewfinder: { width: 250, height: 250, borderWidth: 2, borderColor: COLORS.greenIF, borderRadius: 16, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 40 },
  scanLine: { position: 'absolute', top: '50%', width: '100%', height: 2, backgroundColor: COLORS.greenIF, opacity: 0.7 },
  cameraIcon: { fontSize: 64, opacity: 0.5 },
  simulateButton: { backgroundColor: COLORS.black, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8 },
  simulateButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  formContainer: { backgroundColor: COLORS.white, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, ...(Platform.OS === 'ios' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 } : { elevation: 2 }) },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 16 },
  infoCard: { backgroundColor: COLORS.neutralFundo, padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: COLORS.neutralBorda },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoPatrimonio: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  rescanText: { color: COLORS.black, fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
  infoMarcaModelo: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 16 },
  divider: { height: 1, backgroundColor: COLORS.neutralBorda, marginBottom: 12 },
  infoLabel: { fontSize: 12, color: COLORS.neutralTexto, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '600', color: COLORS.black, marginBottom: 12 },
  confirmButton: { backgroundColor: COLORS.greenIF, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  confirmButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});