# 🎄 Feliz Natal - Mensagem de Fim de Ano

Projeto de página web comemorativa para celebrar o final de ano com a equipe.

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal (Cartão de Natal)
├── time-2025.png           # Foto da equipe
└── game/                   # Dinâmica "2 Mentiras e 1 Verdade"
    ├── index.html          # Painel do moderador
    └── js/
        ├── data.js         # Dados dos participantes
        ├── app.js          # Lógica do jogo
        ├── sounds.js       # Sons sutis (Web Audio API)
        └── sanity-check.js # Validação automática
```

## 🎮 Dinâmica de Grupo (`game/`)

Painel para moderador conduzir a dinâmica "2 Mentiras e 1 Verdade".

### Funcionalidades
- **Gestão de Rodadas**: Controle total de quem já jogou.
- **Placar Interativo**: Pontuação atualizada em tempo real com limite de 1 ponto por rodada.
- **Ranking Automático**: Pódio final com animação e exclusão de moderadores (configurável).
- **🛡️ Persistência de Dados**: O jogo salva automaticamente o progresso no navegador, incluindo controle de votos por rodada.
- **🛡️ Verificação de Sanidade**: Ao abrir o jogo, um modal exibe o status de carregamento antes de liberar o painel.

### Como Jogar
1. Acesse a URL do jogo (veja abaixo).
2. Aguarde o modal de carregamento e clique em "Iniciar Jogo".
3. Chame um participante, abra o cartão e conduza a rodada.
4. Ao final, libere o Ranking e os Prêmios.

### Configuração
Para alterar os participantes ou perguntas, edite o arquivo `game/js/data.js` e faça o push para o repositório.

## 🚀 Acesso (GitHub Pages)

Este projeto está configurado para rodar no GitHub Pages.

1. **Acesse a URL online** fornecida pelo repositório (ex: `https://[seu-usuario].github.io/[nome-repo]/game/`).
2. **Persistência**: O progresso fica salvo no **Seu Navegador**. Se você mudar de computador ou limpar o cache, o jogo será zerado.
3. **Reset**: Use o botão "Zerar" no topo da página para limpar o cache e começar um novo jogo limpo.

### Uso Local (Desenvolvimento)
Se precisar rodar localmente para testes:

```bash
npx serve .
```

## 📄 Licença
Uso interno para confraternização de equipe.
