<h2 align="center">api/user</h2>
<p align="center">Microserviço para gerenciamento de usuários e realização de autorizações para o sistema SIGEVA.</p>
<div align="center">
    <img src="https://img.shields.io/badge/MongoDB-latest-green.svg">
    <img src="https://img.shields.io/badge/Mongoose-latest-blue.svg">
</div>

## Usando
Escolha uma pasta para fazer um clone do projeto, e instale as bibliotecas
necessárias.:

```bash
cd /path/to/folder
git clone https://github.com/ccsa-ufrn/sigeva-api-user.git
cd sigeva-api-user
npm install
```

Agora basta iniciar o projeto:
```
npm start
```

#### Modo de operação
| Modo | Ambiente | Descrição | Comando |
| ---------- | ---------- | ---------- | ---------- |
| **start**| `NODE_ENV=development` | O servidor é reiniciado automaticamente a cada alteração no código| `npm start` |
| **build**| - | Compila o código de `/src` em ES6 e o armazena no diretório `/dist` | `npm run build`|
| **serve** | `NODE_ENV=production` | executa o **build** e roda o código de `/dist` com `node`|`npm run serve`|
| **test** | `NODE_ENV=test` | executa os testes |`npm test`|

## Entidade: User
```javascript
{
    login: string,
    password: string,
    isActive: boolean,
    createdAt: date,
    modifiedAt: date
}
```

#### Restrições Importantes
- **Nunca** retorna o **password** de um usuário.
- Respostas da API devem seguir a [tabela de códigos HTTP](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) e *uma estrutura* descrevendo o erro.

## Documentação

Seção para a documentação da API de usuários.

### GET /
Retorna usuários

#### Fields
| Nome | Decrição | Valores |
|-------|----------|---------|
| **p:** number | Indica a **página** de retorno de resultados | Qualquer valor acima de zero. <br> **default:** 1 |
| **c:** number | Indica a **quantidade** de registros retornados por página (p) | Qualquer valor acima de 0. <br> **default:** 10 |
| **q:** string | Filtra os resultado com condições | Objeto JSON em formato string de acordo com a documentação do Mongoose ( Queries Object ) <br> **default:** sem filtro |
| **f:** string | Indica quais **campos** serão retornados da requisição | Nomes dos campos separados por virgula |
| **o:** string | Ordenar a query | Objeto JSON em formato string de acordo com a documentação do Mongoose |

#### Request/Response Examples
```
    GET ?p=1&c=2&f=login,createdAt HTTP/1.1
```
```json
    [
        {
            "_id": "5a0gfieo102",
            "login": "example",
            "createdAt": "Thu Jan 19 2017 12:13:18 GMT-0300 (BRT)"
        },
        {
            "_id": "6a043azeo171",
            "login": "example 2",
            "createdAt": "Thu Jan 19 2017 14:12:00 GMT-0300 (BRT)",
        }
    ]

```

### GET /:id
Retorna um único usuário

#### Fields
| Nome | Decrição | Valores |
|-------|----------|---------|
| **f:** string | Indica quais **campos** serão retornados da requisição | Objeto JSON em formato string de acordo com a documentação do Mongoose |

#### Request/Response Examples
```
    GET 5a0gfieo102?f=login,created HTTP/1.1
```
```json
    {
        "login": "example",
        "createdAt": "Thu Jan 19 2017 12:13:18 GMT-0300 (BRT)"
    }
```
### PUT /:id
Atualiza um usuário

### Fields
| Nome | Decrição | Valores |
|------|----------|---------|
| **password:** string | | |

#### Request/Response Examples
```
    POST / HTTP/1.1
    Content-Type: 'application/json'

    { "password" : "nova+senha" }
```

Retorna o antigo objeto usuário.

```json
    {
        "_id": "5a0gfieo102",
        "login": "example",
        "isActive": true,
        "createdAt": "Thu Jan 19 2017 12:13:18 GMT-0300 (BRT)",
        "modifiedAt": "Thu Jan 19 2017 12:16:24 GMT-0300 (BRT)"
    }
```

### DELETE /:id
Remove um usuário. Na verdade, a única coisa que ocorre é a modificação do
campo **isActive**.

### Fields
Sem campos

#### Request/Response Examples
```
    DELETE / HTTP/1.1
    Content-Type: 'application/json'

    { "_id": "id+do+usuario" }

```

Retorna o objeto removido.

```json
    {
        "_id": "5a0gfieo102",
        "login": "example",
        "isActive": false,
        "createdAt": "Thu Jan 19 2017 12:13:18 GMT-0300 (BRT)",
        "modifiedAt": "Thu Jan 19 2017 12:16:24 GMT-0300 (BRT)"
    }
```

**Erro para requisições inválidas:**

```
    DELETE / HTTP/1.1
    Content-Type: 'application/json'

    { }
```

```
    HTTP/1.1 400

    {
        "error": "campos obrigatórios vazios",
        "target": [
            { "field": "_id", "error": "não pode ser nulo" }
        ]
    }
```



### POST /authenticate
Retorna um token JWT caso as credenciais estejam corretas, caso contrário, nega.

### Fields
| Nome | Decrição | Valores |
|------|----------|---------|
| **login:** string | | |
| **password:** string | | |

#### Request/Response Examples
```
    POST /authenticate HTTP/1.1
    Content-Type: 'application/json'

    { "login": "login+do+usuario", "password": "senha+em+texto+plano" }
```
```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODEwNGU5OTM0Nz"
    }
```

### POST /
Cadastra um novo usuário.

A ideia é que as restrições de negócio não aconteçam em código na API,
e sim, sejam alteradas/criadas pelos operadores do sistema, ou seja,
serão armazenadas um microserviço da API específico para lidar com as
regras de negócio.

### Fields
| Nome | Decrição | Valores |
|-------|----------|---------|
| **login:** string | - | - |
| **password:** string | - | - |

#### Request/Response Examples
```
    POST /authenticate HTTP/1.1
    Content-Type: 'application/json'

    { "login": "login+do+usuario", "password": "senha+em+texto+plano" }
```

Retorna o objeto criado.

```
    HTTP/1.1 200 OK

    {
        "_id": "5a0gfieo102",
        "login": "example",
        "isActive": true,
        "createdAt": "Thu Jan 19 2017 12:13:18 GMT-0300 (BRT)",
        "modifiedAt": "Thu Jan 19 2017 12:16:24 GMT-0300 (BRT)"
    }
```

**Erro para requisições inválidas:**

```
    POST /authenticate HTTP/1.1
    Content-Type: 'application/json'

    { }
```

```
    HTTP/1.1 400

    {
        "error": "campos obrigatórios vazios",
        "target": [
            { "field": "login", "error": "não deve ser nulo" },
            { "field": "password", "error": "não deve ser nulo" }
        ]
    }
```


## Referências

- [Desempenho - Melhorias](https://www.sitepoint.com/7-simple-speed-solutions-mongodb/)
- [Javascript - Referência](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Node.js + Express + NODE_ENV](https://www.dynatrace.com/blog/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/)
