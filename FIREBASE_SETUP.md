# Configuração Firebase para o Pixel Club

## Authentication
No console Firebase do projeto eu-ilove-bts, habilite **Email/Password** e **Anonymous** em Authentication > Sign-in method. Cadastros anônimos são necessários para visitantes clicarem sem conta.

## Banco de dados
O site usa o Realtime Database existente. Preserve o nó `totalClicks` e o valor atual.

Os novos caminhos previstos são:
- `scores/{uid}`: `{name, clicks}`
- `chat/{messageId}`: `{uid, name, text, createdAt}`

O ranking consulta `scores` ordenado por `clicks`; o chat consulta `chat` por `createdAt`. Adicione os índices adequados.

## ATENÇÃO — segurança antes da publicação
A interface e o código cliente são uma primeira implementação, **não uma solução antifraude**. O navegador atualmente envia os incrementos de `scores`, portanto regras que permitam alterações arbitrárias tornam o ranking manipulável. Não habilite gravações amplas em `scores` nem publique o ranking como confiável. Para produção, mova a contabilização dos cliques e a atualização do ranking para uma Cloud Function ou endpoint autenticado com transações e rate limiting. Visitantes devem ter identidade anônima e proteção contra automação.

No chat, valide no servidor que `auth.uid` corresponde a `uid`, limite tamanho e frequência das mensagens, rejeite edições indevidas e implemente moderação, bloqueio e denúncia. O nome exibido deve vir do perfil autenticado ou ser validado. Configure regras de leitura/gravação para impedir acesso indevido.

## Testes antes de mesclar
- Visitante pode clicar sem criar conta.
- Usuário cadastrado soma no global e no individual.
- Ranking atualiza após cliques de contas.
- Chat só aceita mensagens de contas autenticadas.
- Verifique logout, recarregamento, celulares e limites de spam.
- Confirme que o contador global original não foi zerado.

**Não faça merge para main enquanto backend, regras e testes não estiverem concluídos.**


## Regras propostas (não publicadas)
O arquivo `database.rules.proposed.json` é uma proposta para revisão, **não foi aplicado ao Firebase**. Não substitua as regras do banco sem antes exportar as atuais e testar no Emulator Suite: a troca pode interromper o contador já publicado. O arquivo limita a forma dos incrementos, mas **não impede automação nem manipulação por clientes maliciosos**. A solução definitiva deve validar os cliques no servidor.

## Dependências e limitações
O projeto usa Firebase Auth anônimo para visitantes; sem ativar o provedor Anonymous, o contador ficará indisponível para esses visitantes quando as regras exigirem autenticação. O chat precisa de moderação e proteção contra spam no servidor. Ainda não houve teste automatizado ou deploy do Firebase. O PR permanece rascunho.
