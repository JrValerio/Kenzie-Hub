# Kenzie Hub

![Kenzie Hub](https://github.com/Kenzie-Academy-Brasil-Developers/react-entrega-kenzie-hub-JrValerio/blob/main/src/assets/KenzieHub.png)

Kenzie Hub é uma aplicação web desenvolvida como parte dos estudos na Kenzie Academy Brasil. O projeto tem como objetivo fornecer uma plataforma onde os alunos podem registrar e acompanhar suas habilidades adquiridas ao longo do curso.

## Links Importantes

- **Aplicação ao Vivo**: [Kenzie Hub - Vercel](https://kenzie-hub-seven-blue.vercel.app/)
- **Código Fonte**: [GitHub - Kenzie Hub](https://github.com/JrValerio/Kenzie-Hub)

## Funcionalidades

- **Cadastro de Usuário**: Permite que novos usuários se cadastrem na plataforma, fornecendo informações como nome, email, senha, bio, contato e módulo do curso.
- **Login e Logout**: Autenticação de usuários com login e logout.
- **Autologin**: Mantém o usuário logado mesmo após atualizar a página ou fechar o navegador.
- **Dashboard**: Área restrita para usuários autenticados, onde podem visualizar e gerenciar suas informações.
- **Cadastro de Tecnologias**: Usuários podem adicionar tecnologias que estão aprendendo ou já dominam.
- **Edição de Tecnologias**: Usuários podem editar o status das tecnologias cadastradas.
- **Exclusão de Tecnologias**: Usuários podem remover tecnologias do seu perfil.

## Destaque

- **Integração com API**: A aplicação se comunica com uma API para gerenciar dados de usuários e tecnologias, proporcionando uma experiência dinâmica e atualizada.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface do usuário.
- **React Router Dom**: Gerenciamento de rotas na aplicação.
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições à API.
- **React Hook Form**: Biblioteca para gerenciamento de formulários.
- **Zod**: Biblioteca para validação de esquemas.
- **React Icons**: Biblioteca de ícones para React.
- **Material-UI**: Biblioteca de componentes de interface do usuário para React.
- **SASS**: Pré-processador CSS que permite escrever estilos de forma mais eficiente e modular.

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis como botões, inputs, toasts e modais.
- `src/pages`: Páginas da aplicação como Login, Registro, Dashboard e Edição de Tecnologias.
- `src/providers`: Contextos da aplicação como o contexto de autenticação e tecnologias.
- `src/routers`: Configuração das rotas públicas e privadas.
- `src/services`: Serviços de API para interação com o backend.
- `src/styles`: Arquivos de estilo globais e de componentes, utilizando SASS.
- `src/utils`: Funções úteis e constantes compartilhadas.
- `src/validation`: Esquemas de validação para formulários.

