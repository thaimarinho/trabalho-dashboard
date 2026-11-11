import React, { useEffect, useState } from 'react';
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
import { obterDashboardLaboratorios } from '../services/dashboardLaboratoriosService';
import { API_BASE_URL } from '../../../core/services/api';

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

export default function DashboardLaboratoriosScreen({ onBackToMenu, onNavigate }) {
  const [periodoFiltro, setPeriodoFiltro] = useState('Semana');
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');
    obterDashboardLaboratorios(periodoFiltro)
      .then((dados) => { if (ativo) setDashboard(dados); })
      .catch(() => { if (ativo) setErro(`Não foi possível carregar os dados da API em ${API_BASE_URL}. Verifique se o backend está rodando e se o IP do notebook está atualizado.`); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [periodoFiltro]);

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
            <Text style={styles.headerTitle}>Dashboard de Labs</Text>
            <Text style={styles.headerSubtitle}>Indicadores de ocupação e eficiência do IFAM</Text>
          </View>
          <View style={styles.filtroPeriodoBox}>
            {['Semana', 'Mês'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodoBtn, periodoFiltro === p && styles.periodoBtnActive]}
                onPress={() => setPeriodoFiltro(p)}
              >
                <Text style={[styles.periodoBtnText, periodoFiltro === p && styles.periodoBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {erro ? <Text accessibilityRole="alert" style={styles.errorMessage}>{erro}</Text> : null}
        {carregando ? <Text style={styles.loadingMessage}>Carregando indicadores…</Text> : null}

        {/* GRID DE KPIS PRINCIPAIS */}
        <View style={styles.kpiGrid}>
          {/* KPI 1: Taxa de Ocupação */}
          <View style={[styles.kpiCard, styles.shadow]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiIcon}>📈</Text>
              <View style={[styles.kpiBadge, { backgroundColor: COLORS.greenLight }]}>
                <Text style={[styles.kpiBadgeText, { color: COLORS.greenIF }]}>+5% vs mês ant.</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{dashboard ? `${dashboard.taxa_ocupacao_media}%` : '—'}</Text>
            <Text style={styles.kpiTitle}>Taxa de Ocupação Média</Text>
          </View>

          {/* KPI 2: Labs em Uso Agora */}
          <View style={[styles.kpiCard, styles.shadow]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiIcon}>💻</Text>
              <View style={[styles.kpiBadge, { backgroundColor: COLORS.blueLight }]}>
                <Text style={[styles.kpiBadgeText, { color: COLORS.blueAccent }]}>Ao Vivo</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{dashboard ? <>{dashboard.labs_em_uso_agora} <Text style={{ fontSize: 16, color: COLORS.neutralTexto }}>/ {dashboard.total_labs_cadastrados}</Text></> : '—'}</Text>
            <Text style={styles.kpiTitle}>Laboratórios em Uso</Text>
          </View>

          {/* KPI 3: Total de Aulas / Alocações */}
          <View style={[styles.kpiCard, styles.shadow]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiIcon}>📅</Text>
              <View style={[styles.kpiBadge, { backgroundColor: COLORS.greenLight }]}>
                <Text style={[styles.kpiBadgeText, { color: COLORS.greenIF }]}>Hoje</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{dashboard?.aulas_agendadas_hoje ?? '—'}</Text>
            <Text style={styles.kpiTitle}>Aulas Agendadas Hoje</Text>
          </View>

          {/* KPI 4: Manutenções / Ocorrências */}
          <View style={[styles.kpiCard, styles.shadow]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiIcon}>🛠️</Text>
              <View style={[styles.kpiBadge, { backgroundColor: COLORS.redLight }]}>
                <Text style={[styles.kpiBadgeText, { color: COLORS.redAccent }]}>1 Lab</Text>
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: COLORS.redAccent }]}>{dashboard?.maquinas_em_manutencao ?? '—'}</Text>
            <Text style={styles.kpiTitle}>Máquinas em Manutenção</Text>
          </View>
        </View>

        {/* OCUPAÇÃO POR TURNO (BARRAS VISUAIS) */}
        <View style={[styles.sectionCard, styles.shadow]}>
          <Text style={styles.sectionCardTitle}>📊 Ocupação por Turno</Text>
          
          {/* Matutino */}
          <View style={styles.barItem}>
            <View style={styles.barItemHeader}>
              <Text style={styles.barItemLabel}>🌅 Matutino (07:30 - 12:00)</Text>
              <Text style={styles.barItemPercent}>{dashboard?.ocupacao_por_turno.matutino ?? '—'}% ocupado</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${dashboard?.ocupacao_por_turno.matutino ?? 0}%`, backgroundColor: COLORS.greenIF }]} />
            </View>
          </View>

          {/* Vespertino */}
          <View style={styles.barItem}>
            <View style={styles.barItemHeader}>
              <Text style={styles.barItemLabel}>☀️ Vespertino (13:30 - 17:50)</Text>
              <Text style={styles.barItemPercent}>{dashboard?.ocupacao_por_turno.vespertino ?? '—'}% ocupado</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${dashboard?.ocupacao_por_turno.vespertino ?? 0}%`, backgroundColor: COLORS.blueAccent }]} />
            </View>
          </View>

          {/* Noturno */}
          <View style={styles.barItem}>
            <View style={styles.barItemHeader}>
              <Text style={styles.barItemLabel}>🌙 Noturno (18:30 - 22:00)</Text>
              <Text style={styles.barItemPercent}>{dashboard?.ocupacao_por_turno.noturno ?? '—'}% ocupado</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${dashboard?.ocupacao_por_turno.noturno ?? 0}%`, backgroundColor: COLORS.warningYellow }]} />
            </View>
          </View>
        </View>

        {/* RANKING DE LABORATÓRIOS MAIS REQUISITADOS */}
        <View style={[styles.sectionCard, styles.shadow]}>
          <Text style={styles.sectionCardTitle}>🏆 Laboratórios Mais Demandados</Text>
          
          {dashboard?.ranking_mais_demandados?.map((item, indice) => (
            <React.Fragment key={`${item.posicao}-${item.laboratorio}`}>
              {indice > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.rankItem}>
                <Text style={styles.rankPos}>{item.posicao}º</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.rankTitle}>{item.laboratorio}</Text>
                  <Text style={styles.rankSub}>{item.horas_semana} horas de aula nesta semana</Text>
                </View>
                <Text style={styles.rankBadge}>{item.taxa}% uso</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ALERTAS DA EQUIPE DE TI */}
        <View style={[styles.sectionCard, styles.shadow]}>
          <Text style={styles.sectionCardTitle}>🔔 Alertas Recentes da TI</Text>
          {dashboard?.alertas_manutencao?.length ? dashboard.alertas_manutencao.map((alerta, indice) => (
            <View key={`${alerta.laboratorio}-${indice}`} style={[styles.alertItem, indice > 0 && { marginTop: 8 }]}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.alertTitle}>{alerta.laboratorio}</Text>
                <Text style={styles.alertSub}>{alerta.mensagem}</Text>
              </View>
            </View>
          )) : <Text style={styles.rankSub}>{carregando ? 'Carregando alertas…' : 'Nenhum alerta de manutenção.'}</Text>}
        </View>

        {/* BOTÃO PARA GRADE GERAL */}
        <TouchableOpacity
          style={styles.btnAcaoRapida}
          onPress={() => onNavigate ? onNavigate('GRADE_HORARIOS') : Alert.alert('Grade', 'Abrindo Grade Geral')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnAcaoRapidaText}>Visualizar Grade Semestral Completa ➔</Text>
        </TouchableOpacity>

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
  filtroPeriodoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    padding: 2,
  },
  periodoBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  periodoBtnActive: {
    backgroundColor: COLORS.greenLight,
  },
  periodoBtnText: {
    fontSize: 11,
    color: COLORS.neutralDark,
  },
  periodoBtnTextActive: {
    color: COLORS.greenIF,
    fontWeight: 'bold',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiIcon: {
    fontSize: 20,
  },
  kpiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kpiBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 2,
  },
  kpiTitle: {
    fontSize: 11,
    color: COLORS.neutralTexto,
    lineHeight: 14,
  },

  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  sectionCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },

  barItem: {
    marginBottom: 12,
  },
  barItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barItemLabel: {
    fontSize: 12,
    color: COLORS.neutralDark,
    fontWeight: '500',
  },
  barItemPercent: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.neutralFundo,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },

  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rankPos: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.greenIF,
    width: 24,
  },
  rankTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  rankSub: {
    fontSize: 11,
    color: COLORS.neutralTexto,
  },
  rankBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.neutralDark,
    backgroundColor: COLORS.neutralFundo,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutralFundo,
    marginVertical: 4,
  },

  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    padding: 10,
    borderRadius: 8,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
  },
  alertSub: {
    fontSize: 11,
    color: COLORS.black,
    lineHeight: 15,
  },
  loadingMessage: { color: COLORS.neutralTexto, textAlign: 'center', marginVertical: 8 },
  errorMessage: { color: COLORS.redAccent, backgroundColor: COLORS.redLight, padding: 10, borderRadius: 8, marginBottom: 10 },

  btnAcaoRapida: {
    backgroundColor: COLORS.greenIF,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  btnAcaoRapidaText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }),
});

