# Kenzie Hub

Kenzie Hub é uma aplicação web desenvolvida como parte do programa de treinamento da Kenzie Academy. O projeto tem como objetivo fornecer uma plataforma onde os alunos podem registrar e acompanhar suas habilidades adquiridas ao longo do curso.

## Funcionalidades

- **Cadastro de Usuário**: Permite que novos usuários se cadastrem na plataforma, fornecendo informações como nome, email, senha, bio, contato e módulo do curso.
- **Login e Logout**: Autenticação de usuários com login e logout.
- **Autologin**: Mantém o usuário logado mesmo após atualizar a página ou fechar o navegador.
- **Dashboard**: Área restrita para usuários autenticados, onde podem visualizar e gerenciar suas informações.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface do usuário.
- **React Router Dom**: Gerenciamento de rotas na aplicação.
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições à API.
- **React Hook Form**: Biblioteca para gerenciamento de formulários.
- **Zod**: Biblioteca para validação de esquemas.
- **React Icons**: Biblioteca de ícones para React.

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis como botões, inputs e toasts.
- `src/pages`: Páginas da aplicação como Login, Registro e Dashboard.
- `src/providers`: Contextos da aplicação como o contexto de autenticação.
- `src/routers`: Configuração das rotas públicas e privadas.
- `src/services`: Serviços de API para interação com o backend.
- `src/styles`: Arquivos de estilo globais e de componentes.
