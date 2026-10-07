# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-07

### Added
- Initial release of EDI API desktop application
- Tauri v2 + React 19 + TypeScript architecture
- Braspress API integration for freight quotation calculation
- Secure credential storage using Windows Credential Manager (DPAPI)
- Modern UI with Tailwind CSS and Shadcn/UI components
- Form validation with React Hook Form + Zod
- Data fetching with TanStack Query
- Portable executable (.exe) and NSIS installer
- Auto-update via GitHub Releases
- GitHub Actions CI/CD for automated releases on tags

### Features
- Cotação de frete com todos os campos obrigatórios da API Braspress
- Suporte a múltiplos itens de cubagem (array dinâmico)
- Validação em tempo real de CNPJ, CEP, valores numéricos
- Exibição clara de resultados: Valor Frete, Seguro, Total, Prazo
- Indicador visual de credenciais não configuradas
- Toast notifications para sucesso/erro
- Interface responsiva (desktop)

### Technical
- Rust backend with reqwest for HTTP calls
- Base64 encoding for Basic Auth
- Keyring crate for secure credential storage
- Tauri plugins: store, opener, dialog, notification, http, shell, updater
- Type-safe IPC between frontend and backend