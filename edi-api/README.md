# EDI API - Braspress

Aplicativo desktop para cálculo de cotação de frete na API Braspress.

## Características

- **Portable**: Executável único (.exe) - basta copiar para o desktop
- **Seguro**: Credenciais salvas no Windows Credential Manager (DPAPI)
- **Interface moderna**: React + TypeScript + Tailwind CSS + Shadcn/UI
- **Auto-update**: Verifica atualizações automáticas via GitHub Releases
- **Múltiplas APIs**: Arquitetura preparada para adicionar mais APIs da Braspress

## Download

### Portable (Recomendado)
Baixe `edi-api.exe` dos [Releases](../../releases) e coloque no desktop.

### Instalador
Baixe `EDI API_x.x.x_x64-setup.exe` para instalação completa com atalhos.

## Uso

1. Execute o aplicativo
2. Clique em **"Credenciais"** no cabeçalho
3. Insira seu **usuário** e **senha** da API Braspress
4. Preencha os dados da cotação:
   - CNPJ Remetente/Destinatário/Consignado
   - Modal (Rodoviário/Aéreo)
   - Tipo Frete (CIF/FOB/Terceiros)
   - CEP Origem/Destino
   - Valor da Mercadoria, Peso, Volumes
   - Cubagem (Altura, Largura, Comprimento - mínimo 1 item)
5. Clique em **"Calcular Cotação"**

## Desenvolvimento

### Pré-requisitos
- Node.js 20+
- Rust 1.90+
- pnpm/npm

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run tauri:dev
```

### Build
```bash
npm run tauri:build
```

## Estrutura do Projeto

```
edi-api/
├── src/                    # Frontend React
│   ├── components/         # Componentes UI
│   │   ├── ui/             # Componentes base (Shadcn/UI style)
│   │   ├── CotacaoForm.tsx # Formulário principal
│   │   ├── CubagemFields.tsx
│   │   └── ResultadoCotacao.tsx
│   ├── hooks/              # React Query hooks
│   ├── lib/                # Utilitários e API client
│   └── types/              # TypeScript types + Zod schemas
├── src-tauri/              # Backend Rust
│   ├── src/
│   │   ├── commands/       # Tauri commands (IPC)
│   │   ├── braspress/      # Cliente HTTP da API Braspress
│   │   └── keyring/        # Armazenamento seguro de credenciais
│   └── Cargo.toml
└── .github/workflows/      # CI/CD
```

## Tecnologias

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod
- **Backend**: Tauri v2, Rust, reqwest, keyring
- **UI**: Shadcn/UI components, Lucide React icons
- **Deploy**: GitHub Actions, NSIS installer

## Segurança

- Credenciais criptografadas no Windows Credential Manager (DPAPI)
- Comunicação com API via HTTPS
- Basic Auth no header Authorization
- Sem armazenamento de segredos no código

## Licença

MIT - Braspress Team