// Script para validação com modal de carregamento animado
(function () {
    const modal = document.getElementById('loading-modal');
    const messageEl = document.getElementById('loading-message');
    const spinnerEl = document.getElementById('loading-spinner');
    const successEl = document.getElementById('loading-success');
    const errorEl = document.getElementById('loading-error');
    const btnStart = document.getElementById('btn-start-game');

    let errors = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateMessage(text) {
        if (messageEl) {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.textContent = text;
                messageEl.style.opacity = '1';
            }, 150);
        }
    }

    function checkParticipants() {
        if (!window.participantsData) {
            errors.push("'participantsData' não encontrado.");
            return false;
        }

        const ids = new Set();

        window.participantsData.forEach(p => {
            if (ids.has(p.id)) {
                errors.push(`ID duplicado: ${p.id} (${p.name})`);
            }
            ids.add(p.id);

            const trueOptions = p.options.filter(o => o.isTruth);
            if (trueOptions.length !== 1) {
                errors.push(`${p.name} deve ter exatamente 1 verdade (encontrado: ${trueOptions.length})`);
            }
        });

        return errors.length === 0;
    }

    function checkDependencies() {
        if (typeof window.confetti !== 'function') {
            errors.push("Biblioteca 'canvas-confetti' não carregada.");
            return false;
        }
        if (typeof window.lucide === 'undefined') {
            errors.push("Biblioteca 'lucide-icons' não carregada.");
            return false;
        }
        return true;
    }

    async function runLoadingSequence() {
        const participants = window.participantsData || [];

        // Frases iniciais
        const initialPhrases = [
            "🔍 Preparando ambiente do jogo...",
            "🎯 Carregando sistema de pontuação...",
        ];

        // Frases por participante
        const participantActions = [
            "🕵️ Investigando mentiras de",
            "👀 Analisando histórias de",
            "🔎 Verificando confissões de",
            "📝 Checando afirmações de",
        ];

        // Frases finais
        const finalPhrases = [
            "📊 Validando placar e rankings...",
            "🎁 Preparando prêmios secretos...",
            "✨ Finalizando verificação...",
        ];

        // Executar frases iniciais
        for (const phrase of initialPhrases) {
            updateMessage(phrase);
            await sleep(600);
        }

        // Iterar pelos participantes
        for (const participant of participants) {
            const action = participantActions[Math.floor(Math.random() * participantActions.length)];
            updateMessage(`${action} ${participant.name}...`);
            await sleep(500);
        }

        // Executar frases finais
        for (const phrase of finalPhrases) {
            updateMessage(phrase);
            await sleep(500);
        }

        // Realizar as verificações reais
        updateMessage("🛡️ Executando verificação de sanidade...");
        await sleep(400);

        const depsOk = checkDependencies();
        const dataOk = checkParticipants();

        // Mostrar resultado
        if (spinnerEl) spinnerEl.style.display = 'none';
        if (messageEl) messageEl.style.display = 'none';

        if (depsOk && dataOk) {
            if (successEl) successEl.style.display = 'block';
            if (btnStart) btnStart.style.display = 'inline-block';
        } else {
            if (errorEl) {
                errorEl.innerHTML = `❌ Erros encontrados:<br>${errors.map(e => `• ${e}`).join('<br>')}`;
                errorEl.style.display = 'block';
            }
            alert("⚠️ ERROS DETECTADOS! Verifique o modal de carregamento.");
        }
    }

    // Função global para iniciar o jogo
    window.startGame = function () {
        if (window.SoundFX) SoundFX.click();
        if (modal) modal.classList.add('hidden');
    };

    // Iniciar sequência de carregamento
    if (modal) {
        runLoadingSequence();
    }
})();
