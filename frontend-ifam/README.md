# Front-end IFAM (React Native / Expo)

Aplicativo mobile do **Portal de Serviços e Gestão IFAM**.

Documentação de referência: `Documentação/docs/seq_04_mapa_frontend.md`.

---

## Como executar

```bash
npm install
npx expo start
```

Depois: `a` para o emulador Android, `i` para iOS, `w` para o navegador, ou
escaneie o QR Code com o **Expo Go**.

### Apontando para a API

A URL do back-end fica em `app.json`, em `expo.extra`:

```json
"extra": {
  "apiBaseUrl": "http://localhost:8000",
  "useMock": false
}
```

> Em **dispositivo físico** `localhost` aponta para o próprio celular. Troque
> pelo IP da sua máquina na rede local (ex.: `http://192.168.0.10:8000`) e suba
> a API com `uvicorn app.main:app --host 0.0.0.0`.

Com `useMock: true` o app não chama a API e usa dados locais de demonstração.

---

## Features implementadas

| Requisito | Tela | Situação |
| :--- | :--- | :--- |
| **RF-EQ01** | `src/modules/equipamentos/screens/tipos_recurso_screen.js` | Integrada à API |
| **RF-LAB08** | `src/modules/laboratorios/screens/dashboard_laboratorios_screen.js` | Integrada à API (backend ainda usa dados de demonstração) |

As demais telas do repositório ainda são protótipos com dados fixos.

### RF-EQ01 — Catálogo de Tipos de Recursos

CRUD das categorias de equipamentos, consumindo
`/api/v1/equipamentos/tipos` através de
`src/modules/equipamentos/services/equipamentosService.js`.

**Fallback offline:** se a API não responder (ou `useMock` estiver ligado), o
service cai automaticamente em `tiposRecursoMock.js`, que reproduz o mesmo
contrato. A tela exibe um aviso de que está mostrando dados locais — assim a
demonstração nunca quebra por causa do back-end.

### RF-LAB08 — Dashboard e Indicadores de Ocupação

A tela consulta `/api/v1/laboratorios/dashboard/kpis` por meio de
`src/modules/laboratorios/services/dashboardLaboratoriosService.js`. Os KPIs,
ocupação por turno, ranking e alertas são preenchidos pela resposta da API.
Atualmente, o backend lê `app/mocks/laboratorios/dashboard.json`; para mostrar
indicadores reais, essa origem precisa ser substituída por consultas ao banco.

---

## Pontos de troca (dependências de outras equipes)

| Dependência | Arquivo | Situação hoje | O que muda depois |
| :--- | :--- | :--- | :--- |
| Token JWT (RF-CORE01) | `src/core/services/interceptors.js` | `obterTokenArmazenado()` devolve `null` | Ler o token do AuthContext / SecureStore |
| Navegação | `App.js` | Abre o dashboard RF-LAB08 para demonstração | Integrar ao `AppNavigator` e registrar as telas nos navegadores dos módulos |

Nada em `src/navigation/` foi alterado — essa camada continua livre para a
equipe responsável.
