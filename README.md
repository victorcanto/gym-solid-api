# API de Academia - Fastify, Prisma, PostgreSQL, TypeScript, SOLID

Esta é uma API de Academia desenvolvida com Node.js e TypeScript. Utiliza o Fastify como framework, Prisma como ORM e PostgreSQL como banco de dados. O objetivo desta API é fornecer endpoints para gerenciar uma academia, incluindo funcionalidades como autenticação, gestão de usuários e gerenciamento de check-ins e academias.

## Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução JavaScript
-   **TypeScript**: Superset de JavaScript que adiciona tipagem estática
-   **Fastify**: Framework web rápido e eficiente
-   **Prisma**: ORM para acesso ao banco de dados
-   **PostgreSQL**: Banco de dados relacional
-   **Zod**: Biblioteca para validação de esquemas de dados
-   **JWT**: JSON Web Tokens para autenticação
-   **Vitest**: Framework de testes unitários
-   **Supertest**: Framework para testes end-to-end (e2e)

## Arquitetura e Padrões de Projeto

Para garantir a manutenção e escalabilidade, utilizei os princípios SOLID:

-   **Single Responsibility Principle** (Princípio da Responsabilidade Única)
-   **Open/Closed Principle** (Princípio Aberto/Fechado)
-   **Liskov Substitution Principle** (Princípio da Substituição de Liskov)
-   **Interface Segregation Principle** (Princípio da Segregação de Interfaces)
-   **Dependency Inversion Principle** (Princípio da Inversão de Dependência)

Além disso, usei o Repository Pattern para abstrair a lógica de acesso a dados e o Factory Pattern para criar instâncias de Use Cases.

## Funcionalidades da API

-   Criar um check-in
-   Listar o histórico de check-ins
-   Obter a contagem de check-ins
-   Validar um check-in
-   Criar uma academia
-   Listar academias próximas
-   Buscar academias por título
-   Autenticar usuários
-   Obter perfil do usuário
-   Atualizar um token
-   Registrar novos usuários
