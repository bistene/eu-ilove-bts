EU ILOVE BTS — Vercel

PUBLICAR:
1. Antes de publicar, edite index.html e preencha firebaseConfig com os dados do app web Firebase.
2. Entre em https://vercel.com e faça login.
3. Crie um repositório GitHub com os arquivos desta pasta (index.html e README.txt) e importe o repositório na Vercel.
   Alternativa: instale a CLI da Vercel e execute `vercel` nesta pasta.
4. Para um site HTML estático, não é necessário framework nem build command. Deixe o output directory como padrão ou `.` se solicitado.
5. Depois do deploy, abra o domínio fornecido pela Vercel e teste em dois navegadores/dispositivos.

FIREBASE:
- O arquivo ainda contém valores `COLE_AQUI_...` em firebaseConfig até você substituí-los.
- O contador global só funciona depois que o Realtime Database estiver configurado e as regras estiverem publicadas.
- Não use credenciais de conta de serviço no frontend.
