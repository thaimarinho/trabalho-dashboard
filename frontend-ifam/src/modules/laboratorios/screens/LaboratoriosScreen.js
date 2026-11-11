import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LaboratoriosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laboratorios</Text>
      <Text style={styles.subtitle}>Alocacao e gestao de laboratorios</Text>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nenhum laboratorio cadastrado</Text>
        <Text style={styles.emptyText}>
          Os laboratorios disponiveis serao exibidos aqui.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  title: {
    color: '#172033',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyText: {
    maxWidth: 280,
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
