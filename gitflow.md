
# Git Flow - Processo de Desenvolvimento

Este documento descreve o fluxo de trabalho utilizado pela equipe de desenvolvimento para organização e controle de versões no repositório Git.

---

## Fluxo de Trabalho

1. **Criação da Branch de Release**
   - A partir da branch `main`, é criada uma nova branch chamada `release/xxxx`, onde `xxxx` representa o identificador da release ou sprint.
   - Exemplo: `release/2025-05-sprint10`.

2. **Criação de Branches de Feature**
   - Cada desenvolvedor cria sua própria branch a partir da `release/xxxx` para implementar as funcionalidades da sprint.
   - Exemplo: `feature/novos-botoes`, `feature/melhorias-api`.

3. **Pull Request para a Release**
   - Após concluir o trabalho, os desenvolvedores abrem um *Pull Request* (PR) da sua branch de feature para a branch `release/xxxx`.

4. **Revisão de Código**
   - Cada PR para a `release/xxxx` deve ser revisado por **duas ou mais pessoas**.
   - A revisão verifica se a funcionalidade está correta, com qualidade e aderente aos padrões definidos.

5. **Aprovação ou Change Request**
   - Se o PR estiver adequado, é feito o **merge** na `release/xxxx`.
   - Caso contrário, é aberto um **Change Request** com os ajustes necessários.

6. **Pull Request da Release para a Main**
   - Com todas as features finalizadas e integradas, é aberto um PR da branch `release/xxxx` para a branch `main`.

7. **Revisão Final**
   - Esse PR final também é revisado por **duas ou mais pessoas**, garantindo a estabilidade e qualidade da entrega para produção.

8. **Aprovação ou Change Request**
   - Se aprovado, é feito o **merge** na `main`.
   - Caso contrário, são solicitadas alterações por meio de um **Change Request**.

9. **Criação de Tag na Main**
   - Após o merge da release na `main`, é criada uma **tag** seguindo o padrão definido (ex.: `v1.2.0`).
   - Essa tag é utilizada para gerar as versões destinadas aos ambientes de **staging** e **produção**, conforme o pipeline automatizado.

---

## Considerações Finais

- O processo garante controle, rastreabilidade e qualidade no ciclo de vida da sprint.
- Nenhum código é integrado à `main` sem passar por revisão dupla.
- A criação da tag é o gatilho para a geração das versões de staging e produção e consequentemente para o deploy nos ambientes.
- Change Requests devem ser tratados com prioridade para não impactar o cronograma da sprint.
