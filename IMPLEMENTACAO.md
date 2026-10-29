# EU ILOVE BTS — Pixel Club

Branch de desenvolvimento. A versão publicada na main não deve ser alterada até testes e aprovação.

## Escopo
- Contador global público preservado.
- Login por e-mail e senha; cliques individuais apenas após login.
- Ranking dos usuários cadastrados.
- Chat exclusivo de usuários autenticados, com moderação e limites de envio.
- Player oficial incorporado do Spotify para músicas do BTS.
- Sete personagens pixelados interativos e animações acessíveis.

## Firebase
Habilitar Authentication (Email/Password e Anonymous). Validar cliques e pontuações no servidor antes de abrir ranking ao público. Regras do Realtime Database devem impedir que usuários escrevam pontos de terceiros ou mensagens sem autenticação. Implementar moderação, rate limiting e proteção contra abuso. Não substituir as regras atuais sem verificar o contador existente.
