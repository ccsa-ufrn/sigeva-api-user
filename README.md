<h2 align="center">api/user</h2>
<p align="center">Microserviço para gerenciamento de usuários e realização de autorizações para o sistema SIGEVA.</p>
<div align="center">
    <img src="https://img.shields.io/badge/MongoDB-latest-green.svg">
    <img src="https://img.shields.io/badge/Mongoose-latest-blue.svg">
    <img src="https://img.shields.io/badge/Typescript-latest-blue.svg">
    <img src="https://img.shields.io/badge/ClassValidator-latest-green.svg">
    <img src="https://img.shields.io/badge/ClassTransform-latest-green.svg">
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

Agora, basta iniciar o projeto:

```
npm start 
```

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
| **f:** string | Indica quais **campos** serão retornados da requisição | Objeto JSON em formato string de acordo com a documentação do Mongoose |
| **o:** string | Ordenar a query | Objeto JSON em formato string de acordo com a documentação do Mongoose |

#### Request/Response Examples
```
    GET ?p=1&c=2&f={"login":true,"createdAt":true} HTTP/1.1
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
    GET 5a0gfieo102?f={"login":true,"createdAt":true} HTTP/1.1
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
```json
    { }
```

### DELETE /:id
Remove um usuário

### Fields 
Sem campos

#### Request/Response Examples
```
    DELETE / HTTP/1.1
    Content-Type: 'application/json'

    { "_id": "id+do+usuario" }

```
```json
    { } # atualizar, retorna objeto "removido"
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
Cadastra um novo usuário

### Fields 
| Nome | Decrição | Valores | 
|-------|----------|---------|
| **login:** string | - | - |
| **password:** string | - | - |

#### Request/Response Examples
```
    POST / HTTP/1.1
    login=algum+login+do+usuario&password=senha+em+texto+plano
```
```json
    {
        "id": "8a12fadv1876" # atualizar, retorna usuario anterior
    }
```

## Referências

- [Desempenho - Melhorias](https://www.sitepoint.com/7-simple-speed-solutions-mongodb/)
- [Javascript - Referência](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Node.js + Express + NODE_ENV](https://www.dynatrace.com/blog/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/)
