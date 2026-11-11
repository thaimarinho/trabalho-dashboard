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
// --- DADOS MOCKADOS (API Simulação - RF-LAB03) ---
// ==========================================
const mockGradeHorarios = {
  'Segunda-feira': {
    Matutino: [
      { id_slot: 's1', tempo: '1º e 2º Tempo (07:30 - 09:10)', status: 'Ocupado', disciplina: 'Redes de Computadores I', professor: 'Prof. Carlos Bento', curso: 'TADS 4º Período' },
      { id_slot: 's2', tempo: '3º e 4º Tempo (09:30 - 11:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's3', tempo: '5º Tempo (11:10 - 12:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Vespertino: [
      { id_slot: 's4', tempo: '1º e 2º Tempo (13:30 - 15:10)', status: 'Ocupado', disciplina: 'Estrutura de Dados em C', professor: 'Profª. Ana Silva', curso: 'Eng. Software 2º Per' },
      { id_slot: 's5', tempo: '3º e 4º Tempo (15:30 - 17:10)', status: 'Ocupado', disciplina: 'Banco de Dados II', professor: 'Prof. Marcos Lima', curso: 'TADS 3º Período' },
    ],
    Noturno: [
      { id_slot: 's6', tempo: '1º e 2º Tempo (18:30 - 20:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's7', tempo: '3º e 4º Tempo (20:20 - 22:00)', status: 'Ocupado', disciplina: 'Sistemas Operacionais', professor: 'Prof. Roberto Dias', curso: 'TSI Noturno' },
    ]
  },
  'Terça-feira': {
    Matutino: [
      { id_slot: 's8', tempo: '1º e 2º Tempo (07:30 - 09:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's9', tempo: '3º e 4º Tempo (09:30 - 11:10)', status: 'Ocupado', disciplina: 'Programação Web Front-End', professor: 'Prof. Lucas Rocha', curso: 'TADS 2º Período' },
      { id_slot: 's10', tempo: '5º Tempo (11:10 - 12:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Vespertino: [
      { id_slot: 's11', tempo: '1º e 2º Tempo (13:30 - 15:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's12', tempo: '3º e 4º Tempo (15:30 - 17:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Noturno: [
      { id_slot: 's13', tempo: '1º e 2º Tempo (18:30 - 20:10)', status: 'Ocupado', disciplina: 'Engenharia de Requisitos', professor: 'Profª. Fernanda Costa', curso: 'TSI Noturno' },
      { id_slot: 's14', tempo: '3º e 4º Tempo (20:20 - 22:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ]
  },
  'Quarta-feira': {
    Matutino: [
      { id_slot: 's15', tempo: '1º e 2º Tempo (07:30 - 09:10)', status: 'Ocupado', disciplina: 'Arquitetura de Computadores', professor: 'Prof. Marcelo Souza', curso: 'TADS 1º Período' },
      { id_slot: 's16', tempo: '3º e 4º Tempo (09:30 - 11:10)', status: 'Ocupado', disciplina: 'Arquitetura de Computadores', professor: 'Prof. Marcelo Souza', curso: 'TADS 1º Período' },
      { id_slot: 's17', tempo: '5º Tempo (11:10 - 12:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Vespertino: [
      { id_slot: 's18', tempo: '1º e 2º Tempo (13:30 - 15:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's19', tempo: '3º e 4º Tempo (15:30 - 17:10)', status: 'Ocupado', disciplina: 'Computação em Nuvem', professor: 'Prof. Eduardo Silva', curso: 'Especialização' },
    ],
    Noturno: [
      { id_slot: 's20', tempo: '1º e 2º Tempo (18:30 - 20:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's21', tempo: '3º e 4º Tempo (20:20 - 22:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ]
  },
  'Quinta-feira': {
    Matutino: [
      { id_slot: 's22', tempo: '1º e 2º Tempo (07:30 - 09:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's23', tempo: '3º e 4º Tempo (09:30 - 11:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's24', tempo: '5º Tempo (11:10 - 12:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Vespertino: [
      { id_slot: 's25', tempo: '1º e 2º Tempo (13:30 - 15:10)', status: 'Ocupado', disciplina: 'Inteligência Artificial', professor: 'Profª. Camila Ribeiro', curso: 'TADS 5º Período' },
      { id_slot: 's26', tempo: '3º e 4º Tempo (15:30 - 17:10)', status: 'Ocupado', disciplina: 'Inteligência Artificial', professor: 'Profª. Camila Ribeiro', curso: 'TADS 5º Período' },
    ],
    Noturno: [
      { id_slot: 's27', tempo: '1º e 2º Tempo (18:30 - 20:10)', status: 'Ocupado', disciplina: 'Segurança da Informação', professor: 'Prof. Carlos Bento', curso: 'TSI Noturno' },
      { id_slot: 's28', tempo: '3º e 4º Tempo (20:20 - 22:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ]
  },
  'Sexta-feira': {
    Matutino: [
      { id_slot: 's29', tempo: '1º e 2º Tempo (07:30 - 09:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's30', tempo: '3º e 4º Tempo (09:30 - 11:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's31', tempo: '5º Tempo (11:10 - 12:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Vespertino: [
      { id_slot: 's32', tempo: '1º e 2º Tempo (13:30 - 15:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's33', tempo: '3º e 4º Tempo (15:30 - 17:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ],
    Noturno: [
      { id_slot: 's34', tempo: '1º e 2º Tempo (18:30 - 20:10)', status: 'Livre', disciplina: null, professor: null, curso: null },
      { id_slot: 's35', tempo: '3º e 4º Tempo (20:20 - 22:00)', status: 'Livre', disciplina: null, professor: null, curso: null },
    ]
  }
};

const laboratoriosLista = [
  'Lab 01 - Redes',
  'Lab 02 - Dev Software',
  'Lab 03 - CAD & Gráfica',
  'Lab 04 - Informática Geral',
  'Lab 05 - Maker & Hardware'
];

const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
const turnosLista = ['Matutino', 'Vespertino', 'Noturno'];

export default function GradeHorariosScreen({ onBackToMenu, onSolicitarSlot }) {
  const [labSelecionado, setLabSelecionado] = useState('Lab 01 - Redes');
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda-feira');
  const [turnoSelecionado, setTurnoSelecionado] = useState('Matutino');

  const gradeDoDia = mockGradeHorarios[diaSelecionado] || {};
  const slotsDoTurno = gradeDoDia[turnoSelecionado] || [];

  const handleAgendarSlot = (slot) => {
    if (onSolicitarSlot) {
      onSolicitarSlot({
        laboratorio: labSelecionado,
        dia: diaSelecionado,
        turno: turnoSelecionado,
        tempo: slot.tempo,
      });
    } else {
      Alert.alert(
        'Reservar Horário',
        `Deseja abrir formulário de alocação para:\n\n${labSelecionado}\n${diaSelecionado} (${turnoSelecionado})\n${slot.tempo}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu de Laboratórios</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grade de Disponibilidade</Text>
        <Text style={styles.headerSubtitle}>Consulte os horários livres e alocações por turno</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SELETOR DE LABORATÓRIO */}
        <Text style={styles.sectionLabel}>1. Selecione o Laboratório:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {laboratoriosLista.map((lab) => (
            <TouchableOpacity
              key={lab}
              style={[styles.labChip, labSelecionado === lab && styles.labChipActive]}
              onPress={() => setLabSelecionado(lab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.labChipText, labSelecionado === lab && styles.labChipTextActive]}>
                🖥️ {lab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SELETOR DE DIA DA SEMANA */}
        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>2. Dia da Semana:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[styles.diaChip, diaSelecionado === dia && styles.diaChipActive]}
              onPress={() => setDiaSelecionado(dia)}
              activeOpacity={0.7}
            >
              <Text style={[styles.diaChipText, diaSelecionado === dia && styles.diaChipTextActive]}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SELETOR DE TURNO (ABAS) */}
        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>3. Turno:</Text>
        <View style={styles.turnosTabsRow}>
          {turnosLista.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.turnoTab, turnoSelecionado === t && styles.turnoTabActive]}
              onPress={() => setTurnoSelecionado(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.turnoTabText, turnoSelecionado === t && styles.turnoTabTextActive]}>
                {t === 'Matutino' ? '🌅 ' : t === 'Vespertino' ? '☀️ ' : '🌙 '}
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LISTAGEM DOS TEMPOS / SLOTS DE AULA */}
        <View style={styles.slotsContainer}>
          <Text style={styles.slotsHeaderTitle}>
            Horários de {diaSelecionado} ({turnoSelecionado}) • {labSelecionado}
          </Text>

          {slotsDoTurno.map((slot) => {
            const isLivre = slot.status === 'Livre';
            return (
              <View
                key={slot.id_slot}
                style={[
                  styles.slotCard,
                  isLivre ? styles.slotCardLivre : styles.slotCardOcupado,
                  styles.shadow
                ]}
              >
                <View style={styles.slotHeader}>
                  <Text style={styles.slotTempo}>{slot.tempo}</Text>
                  <View style={[styles.statusBadge, isLivre ? styles.badgeLivre : styles.badgeOcupado]}>
                    <Text style={[styles.statusBadgeText, isLivre ? styles.badgeLivreText : styles.badgeOcupadoText]}>
                      ● {slot.status}
                    </Text>
                  </View>
                </View>

                {isLivre ? (
                  <View style={styles.slotLivreBody}>
                    <Text style={styles.slotLivreDesc}>
                      Este horário encontra-se vago para alocação de aula ou projeto.
                    </Text>
                    <TouchableOpacity
                      style={styles.btnReservarSlot}
                      onPress={() => handleAgendarSlot(slot)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnReservarSlotText}>📅 Reservar Este Horário</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.slotOcupadoBody}>
                    <Text style={styles.disciplinaNome}>{slot.disciplina}</Text>
                    <Text style={styles.slotInfoText}>👤 Docente: <Text style={styles.bold}>{slot.professor}</Text></Text>
                    <Text style={styles.slotInfoText}>🎓 Turma: {slot.curso}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

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
    marginTop: 2,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },

  chipsScroll: {
    paddingBottom: 4,
  },
  labChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  labChipActive: {
    backgroundColor: COLORS.greenIF,
    borderColor: COLORS.greenIF,
  },
  labChipText: {
    fontSize: 12,
    color: COLORS.neutralDark,
    fontWeight: '500',
  },
  labChipTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  diaChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 6,
  },
  diaChipActive: {
    backgroundColor: COLORS.blueAccent,
    borderColor: COLORS.blueAccent,
  },
  diaChipText: {
    fontSize: 12,
    color: COLORS.neutralDark,
  },
  diaChipTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  turnosTabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    padding: 3,
  },
  turnoTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 6,
  },
  turnoTabActive: {
    backgroundColor: COLORS.greenLight,
  },
  turnoTabText: {
    fontSize: 12,
    color: COLORS.neutralDark,
    fontWeight: '500',
  },
  turnoTabTextActive: {
    color: COLORS.greenIF,
    fontWeight: 'bold',
  },

  slotsContainer: {
    marginTop: 20,
  },
  slotsHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.neutralTexto,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  slotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  slotCardLivre: {
    borderColor: '#C8E6C9',
  },
  slotCardOcupado: {
    borderColor: COLORS.neutralBorda,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTempo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeLivre: {
    backgroundColor: COLORS.greenLight,
  },
  badgeLivreText: {
    color: COLORS.greenIF,
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeOcupado: {
    backgroundColor: COLORS.redLight,
  },
  badgeOcupadoText: {
    color: COLORS.redAccent,
    fontSize: 11,
    fontWeight: 'bold',
  },

  slotLivreBody: {
    marginTop: 2,
  },
  slotLivreDesc: {
    fontSize: 12,
    color: COLORS.neutralTexto,
    marginBottom: 10,
  },
  btnReservarSlot: {
    backgroundColor: COLORS.greenIF,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnReservarSlotText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  slotOcupadoBody: {
    marginTop: 2,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralFundo,
  },
  disciplinaNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  slotInfoText: {
    fontSize: 12,
    color: COLORS.neutralDark,
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.black,
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
});

