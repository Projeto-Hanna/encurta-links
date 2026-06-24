## Encurta links - Projeto Hanna
### Descrição

Projeito feito para auxiliar em redirecionamento e encurtamento de links do Projeto Hanna, facilitando a substituição de links voláteis e a abrindo margem para a coleta de métricas.

### Setup

```bash
$ yarn install
```

### Compile e execute o projeto

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Testes

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### Como usar
1. Cadastre os códigos e URLs no banco de dados
2. Acesse https://links.projetohanna.com/go?to=<código>
3. Veja o redirecionamento acontecer

### Autores

- Marcus Natrielli - [InfiniteMarcus](https://github.com/InfiniteMarcus)

### Licença e contribuições
- Projeto feito sob a licença [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
- Fiquem a vontade para enviar PRs e contribuições ao repositório!
