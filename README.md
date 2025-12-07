# Química Orgânica Interativa

Site educacional sobre Química Orgânica com quizzes interativos.

## Como Executar

**⚠️ IMPORTANTE:** Para que os quizzes funcionem corretamente, você precisa abrir o arquivo em um navegador real, não no preview do VSCode.

### Opções para abrir:

1. **Arrastar e soltar:**
   - Abra o arquivo `index.html` no Windows Explorer
   - Arraste e solte no navegador (Chrome, Firefox, Edge, etc.)

2. **Clicar com botão direito:**
   - Clique com botão direito em `index.html`
   - Selecione "Abrir com" → Escolha seu navegador

3. **Usar Live Server (recomendado):**
   - Instale a extensão "Live Server" no VSCode
   - Clique com botão direito em `index.html`
   - Selecione "Open with Live Server"
   - Isso abrirá automaticamente no navegador e recarregará quando você salvar alterações

4. **Via terminal:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (com http-server instalado)
   npx http-server
   ```
   Depois acesse: `http://localhost:8000`

## Funcionalidades

- 📚 Conteúdo sobre Alcanos, Alcenos, Alcinos e Compostos Oxigenados
- 🎯 Quizzes interativos com alternativas embaralhadas
- 🎨 Design moderno e responsivo
- 🔊 Text-to-Speech (TTS) para acessibilidade
- 👨‍🏫 Painel do professor para adicionar questões

## Estrutura

- `index.html` - Página principal
- `professor.html` - Painel do professor
- `script.js` - Lógica JavaScript
- `professor.js` - Lógica do painel do professor
- `styles.css` - Estilos CSS

## Notas

- Os quizzes usam `localStorage` para salvar progresso e questões do professor
- Funciona melhor em navegadores modernos (Chrome, Firefox, Edge, Safari)
- Requer JavaScript habilitado
