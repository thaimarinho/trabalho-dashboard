import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
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
// --- MOCKS DE PORTAS / LABS (RF-LAB05) ---
// ==========================================
const mockLabsPortas = {
  'QR-LAB-01-PORTA-B102': {
    nome: 'Laboratório 01 - Redes e Infraestrutura',
    bloco: 'Bloco B - Sala 102',
    alocacaoAtual: {
      docente: 'Prof. Carlos Bento',
      disciplina: 'Redes de Computadores I',
      turno: 'Matutino (07:30 - 09:10)',
      status: 'Aprovada'
    }
  },
  'QR-LAB-02-PORTA-B104': {
    nome: 'Laboratório 02 - Desenvolvimento de Software',
    bloco: 'Bloco B - Sala 104',
    alocacaoAtual: {
      docente: 'Profª. Ana Silva',
      disciplina: 'Engenharia de Software',
      turno: 'Matutino (09:30 - 11:10)',
      status: 'Aprovada'
    }
  },
  'QR-LAB-03-PORTA-C004': {
    nome: 'Laboratório 03 - Computação Gráfica & CAD',
    bloco: 'Bloco C - Sala 04',
    alocacaoAtual: null // Sem alocação no momento
  }
};

export default function CheckinLabScreen({ onBackToMenu, onCheckinConcluido }) {
  const [codigoHash, setCodigoHash] = useState('');
  const [labIdentificado, setLabIdentificado] = useState(null);
  const [checkinRealizado, setCheckinRealizado] = useState(false);

  // Simular Leitura do QR Code
  const simularLeituraQR = (qrHash) => {
    setCodigoHash(qrHash);
    processarLeitura(qrHash);
  };

  const processarLeitura = (hash) => {
    const lab = mockLabsPortas[hash.trim()];
    if (!lab) {
      Alert.alert('Erro de Leitura', 'QR Code de porta não reconhecido no sistema IFAM.');
      setLabIdentificado(null);
      return;
    }

    setLabIdentificado(lab);
    setCheckinRealizado(false);
  };

  const confirmarAberturaCheckin = () => {
    if (!labIdentificado) return;

    if (!labIdentificado.alocacaoAtual) {
      Alert.alert(
        'Sem Alocação Vigente',
        'Não há nenhuma reserva aprovada para este laboratório no horário atual. Deseja registrar abertura emergencial pelo Suporte/TI?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abertura TI',
            onPress: () => {
              setCheckinRealizado(true);
              Alert.alert('✅ Acesso Liberado', `Abertura emergencial registrada para o ${labIdentificado.nome}.`);
            }
          }
        ]
      );
      return;
    }

    setCheckinRealizado(true);
    Alert.alert(
      '✅ Presença e Abertura Confirmadas!',
      `Check-in realizado com sucesso no ${labIdentificado.nome}.\n\nDocente: ${labIdentificado.alocacaoAtual.docente}\nDisciplina: ${labIdentificado.alocacaoAtual.disciplina}\nHorário de Início: ${new Date().toLocaleTimeString().substring(0, 5)}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu de Laboratórios</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-in de Abertura (QR)</Text>
        <Text style={styles.headerSubtitle}>Validação de presença e abertura da porta do laboratório</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* VISOR DA CÂMERA (SIMULADO) */}
        <View style={styles.cameraBox}>
          <View style={styles.cameraFrame}>
            <View style={styles.targetCornerTopLeft} />
            <View style={styles.targetCornerTopRight} />
            <View style={styles.targetCornerBottomLeft} />
            <View style={styles.targetCornerBottomRight} />
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📲</Text>
            <Text style={styles.cameraText}>Aponte para o QR Code fixado na porta da sala</Text>
          </View>
        </View>

        {/* BOTÕES DE TESTE RÁPIDO DO SCANNER */}
        <Text style={styles.testLabel}>🧪 Simular Leitura da Plaqueta na Porta:</Text>
        <View style={styles.testButtonsRow}>
          <TouchableOpacity
            style={styles.testQRBtn}
            onPress={() => simularLeituraQR('QR-LAB-01-PORTA-B102')}
          >
            <Text style={styles.testQRBtnText}>🏢 Porta Lab 01 (Redes)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testQRBtn}
            onPress={() => simularLeituraQR('QR-LAB-02-PORTA-B104')}
          >
            <Text style={styles.testQRBtnText}>🏢 Porta Lab 02 (Dev)</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT MANUAL CASO CÂMERA FALHE */}
        <View style={styles.manualInputContainer}>
          <Text style={styles.manualInputLabel}>Ou digite o código da plaqueta da sala:</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="Ex: QR-LAB-01-PORTA-B102"
              placeholderTextColor={COLORS.neutralTexto}
              value={codigoHash}
              onChangeText={setCodigoHash}
            />
            <TouchableOpacity style={styles.btnBuscarManual} onPress={() => processarLeitura(codigoHash)}>
              <Text style={styles.btnBuscarManualText}>Validar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RESULTADO DA LEITURA / DADOS DA ALOCAÇÃO */}
        {labIdentificado && (
          <View style={[styles.resultCard, styles.shadow]}>
            <View style={styles.resultHeader}>
              <View style={styles.badgeValido}>
                <Text style={styles.badgeValidoText}>● Laboratório Identificado</Text>
              </View>
              <Text style={styles.salaCodeText}>{codigoHash}</Text>
            </View>

            <Text style={styles.labNomeText}>{labIdentificado.nome}</Text>
            <Text style={styles.labBlocoText}>📍 {labIdentificado.bloco}</Text>

            <View style={styles.divider} />

            {labIdentificado.alocacaoAtual ? (
              <View style={styles.alocacaoBox}>
                <Text style={styles.alocacaoTitle}>📋 Alocação em Andamento / Vigente:</Text>
                <Text style={styles.alocacaoText}>• <Text style={styles.bold}>Docente:</Text> {labIdentificado.alocacaoAtual.docente}</Text>
                <Text style={styles.alocacaoText}>• <Text style={styles.bold}>Disciplina:</Text> {labIdentificado.alocacaoAtual.disciplina}</Text>
                <Text style={styles.alocacaoText}>• <Text style={styles.bold}>Horário:</Text> {labIdentificado.alocacaoAtual.turno}</Text>
                
                <View style={styles.statusConfirmadoTag}>
                  <Text style={styles.statusConfirmadoText}>✓ Reserva Aprovada no Sistema</Text>
                </View>
              </View>
            ) : (
              <View style={styles.alocacaoVaziaBox}>
                <Text style={styles.alocacaoVaziaText}>
                  ⚠️ Nenhuma alocação cadastrada para este horário.
                </Text>
              </View>
            )}

            {/* BOTÃO DE CONFIRMAR ABERTURA */}
            {!checkinRealizado ? (
              <TouchableOpacity
                style={styles.btnConfirmarCheckin}
                onPress={confirmarAberturaCheckin}
                activeOpacity={0.8}
              >
                <Text style={styles.btnConfirmarCheckinText}>
                  🔓 Confirmar Check-in e Liberar Acesso
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.checkinSucessoBox}>
                <Text style={styles.checkinSucessoText}>
                  ✅ Check-in Concluído com Sucesso! Sala aberta.
                </Text>
              </View>
            )}
          </View>
        )}

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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.neutralTexto,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  cameraBox: {
    backgroundColor: '#1E1E1E',
    height: 200,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  cameraFrame: {
    width: 220,
    height: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  targetCornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: COLORS.greenIF,
  },
  targetCornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: COLORS.greenIF,
  },
  targetCornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: COLORS.greenIF,
  },
  targetCornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: COLORS.greenIF,
  },
  cameraText: {
    color: COLORS.white,
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  testLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  testButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  testQRBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  testQRBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.black,
  },

  manualInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    marginBottom: 16,
  },
  manualInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutralDark,
    marginBottom: 6,
  },
  manualInputRow: {
    flexDirection: 'row',
  },
  manualInput: {
    flex: 1,
    backgroundColor: COLORS.neutralFundo,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.black,
    marginRight: 8,
  },
  btnBuscarManual: {
    backgroundColor: COLORS.greenIF,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnBuscarManualText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.greenIF,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeValido: {
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeValidoText: {
    color: COLORS.greenIF,
    fontSize: 11,
    fontWeight: 'bold',
  },
  salaCodeText: {
    fontSize: 10,
    color: COLORS.neutralTexto,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  labNomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  labBlocoText: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutralFundo,
    marginVertical: 10,
  },

  alocacaoBox: {
    backgroundColor: COLORS.neutralFundo,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  alocacaoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  alocacaoText: {
    fontSize: 12,
    color: COLORS.neutralDark,
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  statusConfirmadoTag: {
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusConfirmadoText: {
    color: COLORS.greenIF,
    fontSize: 11,
    fontWeight: 'bold',
  },

  alocacaoVaziaBox: {
    backgroundColor: COLORS.warningLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  alocacaoVaziaText: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: '600',
  },

  btnConfirmarCheckin: {
    backgroundColor: COLORS.greenIF,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnConfirmarCheckinText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  checkinSucessoBox: {
    backgroundColor: COLORS.greenLight,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkinSucessoText: {
    color: COLORS.greenIF,
    fontSize: 13,
    fontWeight: 'bold',
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
  }),
});

