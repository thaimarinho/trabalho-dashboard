/**
 * RF-EQ01 — Catálogo de Tipos de Recursos.
 *
 * CRUD das categorias/modelos de equipamentos (Eletrônicos, Cabos, Acessórios),
 * restrito ao perfil Administrador.
 *
 * Consome `/api/v1/equipamentos/tipos` através do `equipamentosService`, que
 * cai automaticamente num mock in-memory quando a API não está no ar.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../../core/theme/colors';
import {
  atualizarTipoRecurso,
  criarTipoRecurso,
  excluirTipoRecurso,
  isModoMock,
  listarTiposRecurso,
} from '../services/equipamentosService';

const OPCOES_CATEGORIA = ['Eletrônicos', 'Cabos', 'Acessórios', 'Outros'];

// ==========================================
// --- HELPERS MULTIPLATAFORMA ---
// `alert`/`confirm` só existem na web; no Android/iOS é preciso usar `Alert`.
// ==========================================

function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

function confirmar(titulo, mensagem, onConfirmar, textoConfirmar = 'Confirmar') {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) {
      onConfirmar();
    }
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoConfirmar, onPress: onConfirmar, style: 'destructive' },
  ]);
}

export default function TiposRecursoScreen({ onBackToMenu }) {
  const [listaTipos, setListaTipos] = useState([]);

  // Estados de carregamento e erro da comunicação com a API
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [modoMock, setModoMock] = useState(false);

  // Estados do Modal e Formulário
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Atributos de Dados (RF-EQ01)
  const [idAtual, setIdAtual] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Eletrônicos');

  // ==========================================
  // --- CARREGAMENTO (Read) ---
  // ==========================================

  const carregarTipos = useCallback(async ({ silencioso = false } = {}) => {
    if (silencioso) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErroCarregamento(null);

    try {
      const dados = await listarTiposRecurso();
      setListaTipos(dados);
      setModoMock(isModoMock());
    } catch (erro) {
      setErroCarregamento(erro.mensagem ?? 'Não foi possível carregar o catálogo.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarTipos();
  }, [carregarTipos]);

  // ==========================================
  // --- FORMULÁRIO ---
  // ==========================================

  // Abrir Modal de Criação (Create)
  const handleOpenCreate = () => {
    setIsEditing(false);
    setIdAtual(null);
    setDescricao('');
    setCategoria('Eletrônicos');
    setModalVisible(true);
  };

  // Abrir Modal de Edição (Update)
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setIdAtual(item.id_tipo_recurso);
    setDescricao(item.descricao);
    setCategoria(item.categoria);
    setModalVisible(true);
  };

  // Salvar Registro (Create / Update)
  const handleSave = async () => {
    if (!descricao.trim()) {
      avisar('Campo obrigatório', 'A descrição é obrigatória.');
      return;
    }

    const payload = { descricao: descricao.trim(), categoria };
    setSalvando(true);

    try {
      if (isEditing) {
        const atualizado = await atualizarTipoRecurso(idAtual, payload);
        setListaTipos((lista) =>
          lista.map((item) => (item.id_tipo_recurso === idAtual ? atualizado : item)),
        );
      } else {
        const criado = await criarTipoRecurso(payload);
        setListaTipos((lista) => [...lista, criado]);
      }

      setModoMock(isModoMock());
      setModalVisible(false);
    } catch (erro) {
      avisar('Não foi possível salvar', erro.mensagem ?? 'Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Excluir Registro (Delete)
  const handleDelete = (item) => {
    confirmar(
      'Excluir Tipo',
      `Tem certeza que deseja excluir "${item.descricao}"?`,
      async () => {
        try {
          await excluirTipoRecurso(item.id_tipo_recurso);
          setListaTipos((lista) =>
            lista.filter((t) => t.id_tipo_recurso !== item.id_tipo_recurso),
          );
          setModoMock(isModoMock());
        } catch (erro) {
          // 409 = categoria vinculada a itens do inventário (FK ON DELETE RESTRICT)
          avisar(
            erro.status === 409 ? 'Categoria em uso' : 'Não foi possível excluir',
            erro.mensagem ?? 'Tente novamente.',
          );
        }
      },
      'Excluir',
    );
  };

  // Componente Auxiliar: Chips de Categoria
  const SelectorChips = ({ options, selectedValue, onSelect }) => (
    <View style={styles.chipContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, selectedValue === option && styles.chipSelected]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.chipText, selectedValue === option && styles.chipTextSelected]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ==========================================
  // --- CONTEÚDO DA LISTA ---
  // ==========================================

  const renderConteudo = () => {
    if (carregando) {
      return (
        <View style={styles.estadoContainer}>
          <ActivityIndicator size="large" color={COLORS.greenIF} />
          <Text style={styles.estadoTexto}>Carregando catálogo...</Text>
        </View>
      );
    }

    if (erroCarregamento) {
      return (
        <View style={styles.estadoContainer}>
          <Text style={styles.estadoTituloErro}>Falha ao carregar</Text>
          <Text style={styles.estadoTexto}>{erroCarregamento}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => carregarTipos()}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={listaTipos}
        keyExtractor={(item) => item.id_tipo_recurso}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregarTipos({ silencioso: true })}
            colors={[COLORS.greenIF]}
            tintColor={COLORS.greenIF}
          />
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              Platform.OS === 'ios' ? styles.cardShadowIOS : styles.cardShadowAndroid,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardDescricao}>{item.descricao}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.categoria}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEdit(item)}>
                <Text style={styles.editButtonText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum tipo de recurso cadastrado.</Text>
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralFundo} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ Menu Principal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tipos de Recursos</Text>
      </View>

      {/* Aviso de modo offline (API indisponível ou mock ligado no app.json) */}
      {modoMock && (
        <View style={styles.mockBanner}>
          <Text style={styles.mockBannerText}>
            ⚠️ Servidor indisponível — exibindo dados locais de demonstração.
          </Text>
        </View>
      )}

      {renderConteudo()}

      {/* FAB - Adicionar Novo */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenCreate} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal de Formulário (Create / Update) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Editar Tipo' : 'Novo Tipo de Recurso'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição (Marca, Modelo, Especificação)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Datashow Epson 3000 lumens"
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholderTextColor={COLORS.neutralTexto}
                  maxLength={150}
                  editable={!salvando}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria</Text>
                <SelectorChips
                  options={OPCOES_CATEGORIA}
                  selectedValue={categoria}
                  onSelect={setCategoria}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar Tipo de Recurso</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// --- ESTILOS ---
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutralFundo },

  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.neutralFundo, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  backButton: { marginBottom: 8 },
  backButtonText: { color: COLORS.greenIF, fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },

  mockBanner: { backgroundColor: COLORS.yellowLightBg, borderBottomWidth: 1, borderBottomColor: COLORS.yellowIF, paddingHorizontal: 20, paddingVertical: 10 },
  mockBannerText: { color: COLORS.neutralTextoEscuro, fontSize: 12, fontWeight: '600' },

  listContent: { paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 100 },
  card: { backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.neutralBorda, marginBottom: 16, padding: 16 },
  cardShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardShadowAndroid: { elevation: 2 },

  cardHeader: { alignItems: 'flex-start', marginBottom: 16 },
  cardDescricao: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginBottom: 8 },
  badge: { backgroundColor: COLORS.neutralFundo, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.neutralBorda },
  badgeText: { fontSize: 12, fontWeight: '600', color: COLORS.neutralTexto },

  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: COLORS.neutralFundo, paddingTop: 12 },
  editButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: COLORS.neutralFundo, marginRight: 8, borderWidth: 1, borderColor: COLORS.neutralBorda },
  editButtonText: { color: COLORS.black, fontWeight: '600', fontSize: 14 },
  deleteButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: COLORS.redLightBg, borderWidth: 1, borderColor: '#FFD6D6' },
  deleteButtonText: { color: COLORS.redAccent, fontWeight: '600', fontSize: 14 },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: COLORS.neutralTexto, fontSize: 14 },

  estadoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  estadoTexto: { marginTop: 12, color: COLORS.neutralTexto, fontSize: 14, textAlign: 'center' },
  estadoTituloErro: { color: COLORS.redAccent, fontSize: 16, fontWeight: 'bold' },
  retryButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: COLORS.greenIF },
  retryButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },

  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.greenIF, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
  fabIcon: { fontSize: 32, color: COLORS.white, fontWeight: 'bold', lineHeight: 34 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.neutralBorda },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  closeIcon: { fontSize: 20, color: COLORS.neutralTexto, fontWeight: 'bold' },

  modalBody: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginBottom: 8 },
  input: { backgroundColor: COLORS.neutralFundo, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: COLORS.black },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: COLORS.neutralFundo, borderWidth: 1, borderColor: COLORS.neutralBorda, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  chipSelected: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  chipText: { fontSize: 13, color: COLORS.neutralTexto, fontWeight: '500' },
  chipTextSelected: { color: COLORS.white, fontWeight: 'bold' },

  saveButton: { backgroundColor: COLORS.greenIF, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 12, minHeight: 54, justifyContent: 'center' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
