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
// --- DADOS MOCKADOS (API Simulação - RF-LAB02) ---
// ==========================================
const initialSoftwares = [
  {
    id: 's1',
    nome: 'Visual Studio Code',
    versao: '1.87.0',
    categoria: 'Desenvolvimento',
    licenca: 'Open Source',
    labs: ['Lab 01', 'Lab 02', 'Lab 03'],
  },
  {
    id: 's2',
    nome: 'Cisco Packet Tracer',
    versao: '8.2.1',
    categoria: 'Redes',
    licenca: 'Educacional / Cisco NetAcad',
    labs: ['Lab 01'],
  },
  {
    id: 's3',
    nome: 'AutoCAD 2024',
    versao: '2024.1',
    categoria: 'Design & CAD',
    licenca: 'Educacional (Autodesk)',
    labs: ['Lab 03'],
  },
  {
    id: 's4',
    nome: 'Docker Desktop / Engine',
    versao: '24.0.7',
    categoria: 'Desenvolvimento',
    licenca: 'Open Source',
    labs: ['Lab 02'],
  },
  {
    id: 's5',
    nome: 'Wireshark',
    versao: '4.2.2',
    categoria: 'Redes',
    licenca: 'GPL v2',
    labs: ['Lab 01'],
  },
  {
    id: 's6',
    nome: 'Blender 3D',
    versao: '4.0.2',
    categoria: 'Design & CAD',
    licenca: 'GPL Open Source',
    labs: ['Lab 03'],
  },
  {
    id: 's7',
    nome: 'LibreOffice',
    versao: '7.6',
    categoria: 'Produtividade',
    licenca: 'MPL v2',
    labs: ['Lab 01', 'Lab 02', 'Lab 03', 'Lab 04', 'Lab 05'],
  }
];

const todosLabsDisponiveis = ['Lab 01', 'Lab 02', 'Lab 03', 'Lab 04', 'Lab 05'];
const categoriasDisponiveis = ['Todos', 'Desenvolvimento', 'Redes', 'Design & CAD', 'Produtividade'];

export default function GestaoSoftwaresScreen({ onBackToMenu }) {
  const [softwares, setSoftwares] = useState(initialSoftwares);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  // Modal de Criação / Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [softwareEmEdicao, setSoftwareEmEdicao] = useState(null);
  
  // Campos do Formulário
  const [formNome, setFormNome] = useState('');
  const [formVersao, setFormVersao] = useState('');
  const [formCategoria, setFormCategoria] = useState('Desenvolvimento');
  const [formLicenca, setFormLicenca] = useState('Open Source');
  const [formLabsSelecionados, setFormLabsSelecionados] = useState([]);

  // Filtragem
  const softwaresFiltrados = softwares.filter((s) => {
    const matchBusca = s.nome.toLowerCase().includes(busca.toLowerCase()) || s.versao.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaAtiva === 'Todos' || s.categoria === categoriaAtiva;
    return matchBusca && matchCat;
  });

  const abrirModalNovo = () => {
    setSoftwareEmEdicao(null);
    setFormNome('');
    setFormVersao('');
    setFormCategoria('Desenvolvimento');
    setFormLicenca('Open Source');
    setFormLabsSelecionados([]);
    setModalVisible(true);
  };

  const abrirModalEdicao = (soft) => {
    setSoftwareEmEdicao(soft);
    setFormNome(soft.nome);
    setFormVersao(soft.versao);
    setFormCategoria(soft.categoria);
    setFormLicenca(soft.licenca);
    setFormLabsSelecionados(soft.labs);
    setModalVisible(true);
  };

  const toggleLabSelecao = (labNome) => {
    if (formLabsSelecionados.includes(labNome)) {
      setFormLabsSelecionados(formLabsSelecionados.filter(l => l !== labNome));
    } else {
      setFormLabsSelecionados([...formLabsSelecionados, labNome]);
    }
  };

  const salvarSoftware = () => {
    if (!formNome.trim() || !formVersao.trim()) {
      Alert.alert('Atenção', 'Informe o nome e a versão do software.');
      return;
    }

    if (softwareEmEdicao) {
      // Atualizar existente
      setSoftwares(softwares.map(s => s.id === softwareEmEdicao.id ? {
        ...s,
        nome: formNome,
        versao: formVersao,
        categoria: formCategoria,
        licenca: formLicenca,
        labs: formLabsSelecionados,
      } : s));
      Alert.alert('Sucesso', 'Software atualizado com sucesso!');
    } else {
      // Criar novo
      const novoSoft = {
        id: `s-${Date.now()}`,
        nome: formNome,
        versao: formVersao,
        categoria: formCategoria,
        licenca: formLicenca,
        labs: formLabsSelecionados,
      };
      setSoftwares([novoSoft, ...softwares]);
      Alert.alert('Sucesso', 'Novo software cadastrado e vinculado aos laboratórios!');
    }
    setModalVisible(false);
  };

  const excluirSoftware = (id, nome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente remover o software "${nome}" do catálogo institucional?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setSoftwares(softwares.filter(s => s.id !== id));
          }
        }
      ]
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
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Gestão de Softwares</Text>
            <Text style={styles.headerSubtitle}>Catálogo e versões instaladas nos laboratórios</Text>
          </View>
          <TouchableOpacity style={styles.btnAdd} onPress={abrirModalNovo} activeOpacity={0.8}>
            <Text style={styles.btnAddText}>+ Novo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por software, versão..."
          placeholderTextColor={COLORS.neutralTexto}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* FILTRO DE CATEGORIAS */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categoriasDisponiveis.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, categoriaAtiva === cat && styles.filterChipActive]}
              onPress={() => setCategoriaAtiva(cat)}
            >
              <Text style={[styles.filterChipText, categoriaAtiva === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LISTA DE SOFTWARES */}
      <FlatList
        data={softwaresFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.categoriaTag}>
                  <Text style={styles.categoriaTagText}>{item.categoria}</Text>
                </View>
                <Text style={styles.softwareNome}>{item.nome}</Text>
                <Text style={styles.softwareVersao}>Versão: <Text style={styles.bold}>{item.versao}</Text> • Licença: {item.licenca}</Text>
              </View>
            </View>

            {/* Labs onde está instalado */}
            <View style={styles.labsInstalledBox}>
              <Text style={styles.labsInstalledTitle}>Instalado em:</Text>
              <View style={styles.labsChipsRow}>
                {item.labs.length > 0 ? (
                  item.labs.map((lab, i) => (
                    <View key={i} style={styles.labChip}>
                      <Text style={styles.labChipText}>🖥️ {lab}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.semLabText}>Nenhum laboratório vinculado</Text>
                )}
              </View>
            </View>

            {/* Ações */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => abrirModalEdicao(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.btnEditarText}>✏️ Editar / Vincular Labs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnExcluir}
                onPress={() => excluirSoftware(item.id, item.nome)}
                activeOpacity={0.7}
              >
                <Text style={styles.btnExcluirText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ========================================== */}
      {/* MODAL: CADASTRO / EDIÇÃO DE SOFTWARE (RF-LAB02) */}
      {/* ========================================== */}
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
                {softwareEmEdicao ? 'Editar Software' : 'Novo Software'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome do Software *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Cisco Packet Tracer, VS Code"
                placeholderTextColor={COLORS.neutralTexto}
                value={formNome}
                onChangeText={setFormNome}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Versão *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: v8.2.1"
                    placeholderTextColor={COLORS.neutralTexto}
                    value={formVersao}
                    onChangeText={setFormVersao}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>Licença</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: Open Source"
                    placeholderTextColor={COLORS.neutralTexto}
                    value={formLicenca}
                    onChangeText={setFormLicenca}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Categoria</Text>
              <View style={styles.catChipsSelector}>
                {['Desenvolvimento', 'Redes', 'Design & CAD', 'Produtividade'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catSelectChip, formCategoria === c && styles.catSelectChipActive]}
                    onPress={() => setFormCategoria(c)}
                  >
                    <Text style={[styles.catSelectChipText, formCategoria === c && styles.catSelectChipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Vincular aos Laboratórios:</Text>
              <View style={styles.labsCheckboxesRow}>
                {todosLabsDisponiveis.map((lab) => {
                  const isSelected = formLabsSelecionados.includes(lab);
                  return (
                    <TouchableOpacity
                      key={lab}
                      style={[styles.labCheckChip, isSelected && styles.labCheckChipActive]}
                      onPress={() => toggleLabSelecao(lab)}
                    >
                      <Text style={[styles.labCheckChipText, isSelected && styles.labCheckChipTextActive]}>
                        {isSelected ? '✓ ' : '+ '} {lab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.btnSalvar} onPress={salvarSoftware} activeOpacity={0.8}>
                <Text style={styles.btnSalvarText}>
                  {softwareEmEdicao ? 'Salvar Alterações' : 'Cadastrar Software'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
  btnAdd: {
    backgroundColor: COLORS.greenIF,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnAddText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.black,
  },

  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterScroll: {
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.greenIF,
    borderColor: COLORS.greenIF,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.neutralDark,
  },
  filterChipTextActive: {
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  cardHeader: {
    marginBottom: 8,
  },
  categoriaTag: {
    backgroundColor: COLORS.blueLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoriaTagText: {
    color: COLORS.blueAccent,
    fontSize: 10,
    fontWeight: 'bold',
  },
  softwareNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 2,
  },
  softwareVersao: {
    fontSize: 12,
    color: COLORS.neutralTexto,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.black,
  },

  labsInstalledBox: {
    backgroundColor: COLORS.neutralFundo,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  labsInstalledTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.neutralTexto,
    marginBottom: 4,
  },
  labsChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  labChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.black,
  },
  semLabText: {
    fontSize: 11,
    color: COLORS.neutralTexto,
    fontStyle: 'italic',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralFundo,
  },
  btnEditar: {
    flex: 1,
    backgroundColor: COLORS.neutralFundo,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  btnEditarText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
  },
  btnExcluir: {
    backgroundColor: COLORS.redLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnExcluirText: {
    fontSize: 14,
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
    maxHeight: '85%',
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
    fontSize: 17,
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
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: COLORS.neutralFundo,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  catChipsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  catSelectChip: {
    backgroundColor: COLORS.neutralFundo,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  catSelectChipActive: {
    backgroundColor: COLORS.blueAccent,
    borderColor: COLORS.blueAccent,
  },
  catSelectChipText: {
    fontSize: 11,
    color: COLORS.neutralDark,
  },
  catSelectChipTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  labsCheckboxesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  labCheckChip: {
    backgroundColor: COLORS.neutralFundo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.neutralBorda,
  },
  labCheckChipActive: {
    backgroundColor: COLORS.greenLight,
    borderColor: COLORS.greenIF,
  },
  labCheckChipText: {
    fontSize: 12,
    color: COLORS.neutralDark,
  },
  labCheckChipTextActive: {
    color: COLORS.greenIF,
    fontWeight: 'bold',
  },

  btnSalvar: {
    backgroundColor: COLORS.greenIF,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnSalvarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }),
});

