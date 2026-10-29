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

## Backend de cliques (nova etapa)
A branch agora contém `functions/index.js`, `functions/package.json`, `firebase.json` e `database.rules.json`. O cliente chama a Cloud Function `registerLove` na região `us-central1` e **não grava mais cliques diretamente no Realtime Database**.

**Antes de testar:**
1. Ative Firebase App Check para o app web e configure reCAPTCHA v3. Copie a *site key pública* para `appCheckSiteKey` em `club.js` (atualmente vazia por segurança operacional). Não coloque chave secreta no repositório.
2. Confirme que o projeto suporta Cloud Functions e faturamento necessário; execute `npm install` dentro de `functions/`.
3. Faça backup dos dados e regras do Realtime Database e teste em ambiente isolado usando o Emulator Suite.
4. Valide a transação da raiz: ela preserva o contador existente, mas lê e grava a árvore inteira, portanto **não é adequada para banco grande**. Planeje migrar para uma estrutura de dados transacional dedicada antes de escalar.
5. Depois de validar o ambiente de teste, implante Functions e regras de forma coordenada. **Não implante somente as regras**: elas bloqueiam os cliques da versão pública atual.
6. Teste o preview da branch antes de fazer merge.

**Status:** código preparado, não implantado. O site da branch não registrará cliques enquanto a site key App Check estiver vazia. O site público da main continua usando seu comportamento atual.

**Limitações:** App Check e cooldown reduzem abuso, mas não eliminam bots. O chat ainda exige moderação e rate limiting do lado servidor. As regras propostas não substituem auditoria e testes reais.
