# PR - Persistência de Dados e Instruções de Execução

## 1. Persistência de Dados

A persistência dos dados foi implementada utilizando uma base de dados **MongoDB** executada dentro de um ambiente **Docker**. 

O processo realizado incluiu os seguintes passos:

- Desenvolvimento de um script em JavaScript para ler o ficheiro JSON original e realizar uma normalização leve dos dados, corrigindo tipos e ajustando campos para garantir consistência.
- Utilização de um ficheiro `docker-compose.yml` para configurar e levantar um container Docker com MongoDB.
- Transferência do ficheiro JSON para uma pasta temporária dentro do container Docker.
- Importação dos dados para o MongoDB usando o comando `mongoimport`.
- Os dados foram armazenados numa única coleção chamada `edicoes` na base de dados `eurovisao`, conforme requisitado.

### Detalhes Técnicos

- Base de dados: `eurovisao`
- Coleção: `edicoes`
- Número de documentos importados: 65
- A normalização efetuada foi mínima, focada na manutenção da integridade dos dados sem conversões profundas.
- Alterações específicas realizadas:
  - Removido o objeto mais externo que continha as edições como pares chave-valor, onde a key era o ID da edição (ex: "edxxx") e o value era o objeto da edição propriamente dito.
  - A estrutura foi convertida para uma lista de objetos `edicao`, cada um contendo o campo `id` como parte do seu conteúdo.  
    Deste modo, ao invés de um objeto com múltiplas propriedades onde cada propriedade é uma edição, temos uma lista homogénea de objetos completos.
  - Algumas chaves (fields) que existiam em algumas edições estavam ausentes noutras. Para garantir consistência, todas as chaves possíveis foram incluídas em todas as edições, preenchendo com `null` nos casos onde não existiam dados.


## 2. Instruções para Execução das Aplicações

### Passo 1: Levantar o ambiente MongoDB com Docker

No diretório do exercício 1 (`ex1`), execute o seguinte comando para construir e iniciar o serviço MongoDB em modo background:

```bash
docker compose up --build -d
```

### Passo 2: Importar os dados JSON para o MongoDB

Após o container estar ativo, execute o comando abaixo para importar os dados para a base de dados:

```bash
docker exec -it testeDocker mongoimport --db eurovisao --collection edicoes --file /tmp/eurovisao.json --jsonArray
```

### Passo 3: Instalar dependências e iniciar a aplicação do exercício 1

No diretório `ex1`, execute:

```bash
npm install
npm start
```

Ou, caso prefira usar o pnpm:

```bash
pnpm install
pnpm start
```

### Passo 4: Instalar dependências e iniciar a aplicação do exercício 2 (se aplicável)

No diretório `ex2`, execute:

```bash
npm install
npm start
```

Ou com pnpm:

```bash
pnpm install
pnpm start
```

## 3. Considerações Adicionais

* A estrutura dos dados mantém-se simples, com uma única coleção para todas as edições.
* A importação foi bem sucedida, com todos os 65 documentos carregados corretamente.
* As rotas da API estão implementadas conforme o solicitado, fornecendo os dados necessários para as páginas do frontend.

---

Este documento destina-se a fornecer uma visão clara e objetiva sobre a persistência dos dados, o setup do ambiente e as instruções para utilização das aplicações desenvolvidas.