# Testes de aceitação — ARMY Pixel Club

Execute em **projeto de teste ou Firebase Emulator Suite**, nunca substituindo as regras do banco de produção sem backup.

## Preparação
1. No Authentication, confirmar Email/Password e Anonymous habilitados.
2. No Realtime Database, anotar o valor atual de `totalClicks` e exportar as regras existentes.
3. Criar cópia de teste dos dados e aplicar nela `database.rules.proposed.json` (proposta, não validada em produção).
4. Abrir a branch em um preview isolado. Não publicar em `main`.

## Cenários
- Visitante sem conta: login anônimo automático, clique +1, clique +10, contador aumenta corretamente.
- Conta nova: cadastro com nome, e-mail e senha; pontuação inicial 0; cliques seguintes aparecem no ranking.
- Conta existente: login, recarregamento, pontuação preservada; logout volta a visitante.
- Ranking: somente contas cadastradas; ordem decrescente; atualização em tempo real.
- Chat: usuário logado envia texto até 240 caracteres; visitante não consegue ler nem enviar; HTML inserido na mensagem aparece como texto, sem execução.
- Segurança: usuário A não consegue editar pontuação de B, visitante não escreve pontuação, nem conta logada edita mensagens antigas; tentativas de escrever +1000 diretamente devem falhar.
- Acessibilidade: navegação por teclado e interação com bonequinhos.
- Spotify: player incorpora corretamente, com limitações próprias do Spotify.

## Limitações que bloqueiam a publicação
**Não há backend confiável de cliques nesta branch.** Regras que só aceitam incrementos de 1 ou 10 não impedem scripts de repetirem requisições e inflarem o ranking. O intervalo do chat no cliente também pode ser contornado. Para produção, implementar endpoint/Cloud Function com autenticação, limites de frequência, moderação e atualização transacional do total e da pontuação.

As regras propostas não foram aplicadas, os testes acima não foram executados e o Firebase real não foi inspecionado por esta integração.
