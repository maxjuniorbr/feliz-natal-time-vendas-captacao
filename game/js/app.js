let currentParticipant = null;
let isTextRevealed = false;
let isAnswerRevealed = false;
let prizesRevealed = false;
let roundPointsGiven = new Set();

const admin = {
    init: function () {
        this.loadRoundState();
        this.renderGrid();
        this.checkCompletion();
        lucide.createIcons();
    },

    loadRoundState: function () {
        if (!window.DataManager) return;
        const roundData = window.DataManager.loadRound();
        if (roundData.participantId) {
            currentParticipant = participantsData.find(p => p.id === roundData.participantId);
            roundPointsGiven = roundData.pointsGiven;
        }
    },

    saveRoundState: function () {
        if (!window.DataManager || !currentParticipant) return;
        window.DataManager.saveRound(currentParticipant.id, roundPointsGiven);
    },

    saveState: function () {
        if (window.DataManager && window.participantsData) {
            window.DataManager.save(window.participantsData);
        }
    },

    checkCompletion: function () {
        const allRevealed = participantsData.every(p => p.isRevealed);
        const btn = document.getElementById('btn-ranking');

        if (allRevealed) {
            btn.disabled = false;
            btn.className = "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 animate-bounce";
            btn.innerHTML = `<i data-lucide="trophy" class="w-4 h-4"></i> Ranking Final`;
            setTimeout(() => btn.classList.remove('animate-bounce'), 2000);
        } else {
            btn.disabled = true;
            btn.className = "bg-gray-200 text-gray-400 px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 cursor-not-allowed";
            const count = participantsData.filter(p => p.isRevealed).length;
            btn.innerHTML = `<i data-lucide="lock" class="w-4 h-4"></i> Ranking (${count}/${participantsData.length})`;
        }
        lucide.createIcons();
    },

    renderGrid: function () {
        const grid = document.getElementById('participants-grid');
        grid.innerHTML = '';

        participantsData.forEach(p => {
            const card = document.createElement('div');
            const isDone = p.isRevealed;

            const borderClass = isDone ? "border-green-400 ring-2 ring-green-100" : "border-gray-100";
            const btnClass = isDone
                ? "bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50"
                : "bg-gray-900 text-white hover:bg-indigo-600";
            const btnText = isDone ? "Ver Novamente" : "Abrir Cartão";
            const btnIcon = isDone ? "eye" : "play-circle";

            let truthContent = '';
            let badge = '';

            if (isDone) {
                const revealedOrder = p.revealedOrder || [0, 1, 2];
                const truthIdx = revealedOrder.findIndex(i => p.options[i].isTruth);
                const letter = ['A', 'B', 'C'][truthIdx];
                const truth = p.options.find(o => o.isTruth).text;
                truthContent = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm animate-fade-in mt-2">
                        <span class="font-bold text-green-700 flex items-center gap-1 mb-1">
                            <i data-lucide="check-check" class="w-3 h-3"></i> A Verdade (${letter}):
                        </span>
                        <span class="text-green-900 block leading-tight">${truth}</span>
                    </div>
                `;
                badge = `<div class="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-md z-10"><i data-lucide="check" class="w-5 h-5"></i></div>`;
            }

            card.className = `bg-white rounded-xl p-5 shadow-sm ${borderClass} card-hover transition-all duration-200 flex flex-col gap-4 relative`;

            card.innerHTML = `
                ${badge}
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                            ${p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800 text-lg">${p.name}</h3>
                            <span class="text-xs text-gray-400 font-medium">Participante</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                    <span class="text-xs font-bold text-gray-400 uppercase">Pontuação</span>
                    <div class="flex items-center gap-3">
                        <button onclick="admin.updateScore(${p.id}, -1)" class="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition shadow-sm">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        <span class="text-xl font-bold text-gray-800 min-w-[20px] text-center" id="score-${p.id}">${p.score}</span>
                        <button onclick="admin.updateScore(${p.id}, 1)" class="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-green-500 hover:border-green-200 flex items-center justify-center transition shadow-sm">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                ${truthContent}

                <button onclick="admin.openModal(${p.id})" class="w-full mt-auto ${btnClass} font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2">
                    <i data-lucide="${btnIcon}" class="w-5 h-5"></i>
                    ${btnText}
                </button>
            `;
            grid.appendChild(card);
        });
        lucide.createIcons();
    },

    updateScore: function (id, change) {
        const person = participantsData.find(p => p.id === id);
        if (!person) return;

        if (change > 0 && currentParticipant && roundPointsGiven.has(id)) return;

        person.score += change;
        if (person.score < 0) person.score = 0;
        document.getElementById(`score-${id}`).innerText = person.score;
        this.saveState();

        if (change > 0 && currentParticipant) {
            roundPointsGiven.add(id);
            this.updatePlusButtonState(id, true);
            this.saveRoundState();
        }

        if (change < 0 && roundPointsGiven.has(id)) {
            roundPointsGiven.delete(id);
            this.updatePlusButtonState(id, false);
            this.saveRoundState();
        }
    },

    updatePlusButtonState: function (id, disabled) {
        const btn = document.querySelector(`button[onclick="admin.updateScore(${id}, 1)"]`);
        if (!btn) return;

        if (disabled) {
            btn.classList.add('opacity-30', 'cursor-not-allowed');
            btn.classList.remove('hover:text-green-500', 'hover:border-green-200');
        } else {
            btn.classList.remove('opacity-30', 'cursor-not-allowed');
            btn.classList.add('hover:text-green-500', 'hover:border-green-200');
        }
    },

    resetScores: function () {
        if (confirm("ATENÇÃO: Isso apagará todo o progresso do jogo.\n\nTem certeza que deseja zerar todos os pontos e rodadas?")) {
            window.participantsData = window.DataManager.reset();
            this.renderGrid();
            this.checkCompletion();
        }
    },

    openModal: function (id) {
        currentParticipant = participantsData.find(p => p.id === id);
        if (!currentParticipant) return;

        const savedRound = window.DataManager ? window.DataManager.loadRound() : { participantId: null };
        const isReviewMode = currentParticipant.isRevealed;
        const isSameRound = savedRound.participantId === id;

        if (!isReviewMode && !isSameRound) {
            roundPointsGiven.clear();
            this.saveRoundState();
        } else if (isSameRound) {
            roundPointsGiven = savedRound.pointsGiven;
        }

        isTextRevealed = isReviewMode;
        isAnswerRevealed = isReviewMode;

        document.getElementById('modal-name').innerText = currentParticipant.name;
        document.getElementById('modal-avatar').innerText = currentParticipant.name.substring(0, 2).toUpperCase();

        const btnRevealText = document.getElementById('btn-reveal-text');
        const btnRevealAnswer = document.getElementById('btn-reveal-answer');

        if (isReviewMode) {
            btnRevealText.innerHTML = `<i data-lucide="eye-off" class="w-5 h-5"></i> Textos Visíveis`;
            btnRevealText.classList.replace('bg-white', 'bg-gray-100');
            btnRevealText.disabled = true;
            btnRevealAnswer.innerHTML = `<i data-lucide="check-check" class="w-5 h-5"></i> Revelado`;
            btnRevealAnswer.disabled = true;
            btnRevealAnswer.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            btnRevealText.innerHTML = `<i data-lucide="eye" class="w-5 h-5"></i> Revelar Textos`;
            btnRevealText.className = "flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2";
            btnRevealText.disabled = false;
            btnRevealAnswer.disabled = true;
            btnRevealAnswer.classList.add('opacity-50', 'cursor-not-allowed');
            btnRevealAnswer.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> Revelar Resposta`;
        }

        const optionsContainer = document.getElementById('modal-options');
        optionsContainer.innerHTML = '';

        let displayOrder;
        if (isReviewMode && currentParticipant.revealedOrder) {
            displayOrder = currentParticipant.revealedOrder;
        } else if (!isReviewMode) {
            displayOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
            currentParticipant.shuffledOrder = displayOrder;
        } else {
            displayOrder = [0, 1, 2];
        }

        displayOrder.forEach((optIdx, displayIdx) => {
            const opt = currentParticipant.options[optIdx];
            const div = document.createElement('div');
            div.dataset.truth = opt.isTruth;
            div.dataset.optionIndex = optIdx;

            if (isReviewMode) {
                const isTruth = opt.isTruth;
                div.className = isTruth
                    ? "bg-green-50 p-4 rounded-xl border-2 border-green-500 ring-2 ring-green-200 shadow-sm relative overflow-hidden transition-all duration-500 option-card"
                    : "bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-500 option-card opacity-50";

                div.innerHTML = `
                    <div class="flex items-center gap-4">
                        <span class="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            ${['A', 'B', 'C'][displayIdx]}
                        </span>
                        <p class="font-medium text-gray-800 text-lg flex-1">
                            ${opt.text}
                        </p>
                        <div class="result-icon w-8 h-8 flex items-center justify-center">
                            ${isTruth
                        ? '<i data-lucide="check" class="text-green-600 w-6 h-6"></i>'
                        : '<i data-lucide="x" class="text-red-400 w-6 h-6"></i>'}
                        </div>
                    </div>
                `;
            } else {
                div.className = "bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-500 option-card";
                div.innerHTML = `
                    <div class="flex items-center gap-4">
                        <span class="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            ${['A', 'B', 'C'][displayIdx]}
                        </span>
                        <p class="font-medium text-gray-700 text-lg flex-1 blur-text transition-all duration-700 filter blur-md" id="opt-text-${displayIdx}">
                            ${opt.text}
                        </p>
                        <div class="result-icon w-8 h-8 flex items-center justify-center opacity-0 transition-opacity duration-300">
                        </div>
                    </div>
                `;
            }
            optionsContainer.appendChild(div);
        });

        const modal = document.getElementById('game-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('modal-content').classList.add('modal-enter');
        lucide.createIcons();
    },

    closeModal: function () {
        document.getElementById('game-modal').classList.add('hidden');
        document.getElementById('game-modal').classList.remove('flex');
        this.renderGrid();
    },

    revealText: function () {
        if (isTextRevealed) return;
        isTextRevealed = true;

        if (window.SoundFX) SoundFX.click();

        const texts = document.querySelectorAll('.blur-text');
        texts.forEach(el => {
            el.classList.remove('blur-text', 'filter', 'blur-md');
            el.classList.add('text-gray-800');
        });

        const btnRevealAnswer = document.getElementById('btn-reveal-answer');
        btnRevealAnswer.disabled = false;
        btnRevealAnswer.classList.remove('opacity-50', 'cursor-not-allowed');

        const btnRevealText = document.getElementById('btn-reveal-text');
        btnRevealText.innerHTML = `<i data-lucide="eye-off" class="w-5 h-5"></i> Textos Visíveis`;
        btnRevealText.classList.replace('bg-white', 'bg-gray-100');
        btnRevealText.disabled = true;

        lucide.createIcons();
    },

    revealAnswer: function () {
        if (isAnswerRevealed) return;
        isAnswerRevealed = true;

        if (currentParticipant) {
            currentParticipant.isRevealed = true;
            if (currentParticipant.shuffledOrder) {
                currentParticipant.revealedOrder = currentParticipant.shuffledOrder;
                delete currentParticipant.shuffledOrder;
            }
            this.saveState();
            this.checkCompletion();
        }

        const options = document.querySelectorAll('.option-card');

        options.forEach(card => {
            const isTruth = card.dataset.truth === 'true';
            const iconDiv = card.querySelector('.result-icon');

            if (isTruth) {
                card.classList.remove('bg-white', 'border-gray-200');
                card.classList.add('bg-green-50', 'border-green-500', 'ring-2', 'ring-green-200');

                iconDiv.innerHTML = `<i data-lucide="check" class="text-green-600 w-6 h-6"></i>`;
                iconDiv.classList.remove('opacity-0');

                if (window.SoundFX) SoundFX.reveal();
                this.confettiEffect();
            } else {
                card.classList.add('opacity-50');
                iconDiv.innerHTML = `<i data-lucide="x" class="text-red-400 w-6 h-6"></i>`;
                iconDiv.classList.remove('opacity-0');
            }
        });

        const btn = document.getElementById('btn-reveal-answer');
        btn.innerHTML = `<i data-lucide="check-check" class="w-5 h-5"></i> Revelado`;
        btn.disabled = true;

        lucide.createIcons();
    },

    showRanking: function () {
        prizesRevealed = false;
        const modal = document.getElementById('ranking-modal');
        const podium = document.getElementById('podium-display');
        const btnPrizes = document.getElementById('btn-prizes');

        btnPrizes.classList.remove('hidden');
        btnPrizes.innerHTML = `<i data-lucide="gift" class="w-5 h-5"></i> 🎁 Liberar Prêmios`;

        const eligibleParticipants = participantsData.filter(p => !["Ingrid", "Dianin"].includes(p.name));

        const sortedParticipants = [...eligibleParticipants].sort((a, b) => b.score - a.score);
        const uniqueScores = [...new Set(sortedParticipants.map(p => p.score))];
        const topScores = uniqueScores.slice(0, 3);

        const podiumOrder = [1, 0, 2];
        let podiumHTML = '';

        podiumOrder.forEach(scoreIndex => {
            if (scoreIndex >= topScores.length) return;

            const score = topScores[scoreIndex];
            const winners = sortedParticipants.filter(p => p.score === score);
            const rank = scoreIndex + 1;

            let rankClass = `rank-${rank}`;
            let orderClass = rank === 1 ? 'order-2' : (rank === 2 ? 'order-1' : 'order-3');
            let medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉');

            let avatarsHTML = winners.map(w => `
                <div class="flex flex-col items-center mb-1 w-16 transition-all duration-300 avatar-item shrink-0" id="avatar-${w.id}">
                        <div class="avatar-circle bg-gray-800 text-sm">
                        ${w.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span class="text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded-full truncate w-full text-center">${w.name}</span>
                </div>
            `).join('');

            let tieButton = '';
            if (winners.length > 1) {
                const winnerIds = winners.map(w => w.id);
                tieButton = `
                    <button onclick="admin.runTieBreaker('${rank}', [${winnerIds}])" class="mt-2 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-md hover:bg-indigo-50 transition flex items-center gap-1 z-20">
                        <i data-lucide="dices" class="w-3 h-3"></i> Sortear 1
                    </button>
                    <div id="tie-result-${rank}" class="text-white text-xs font-bold mt-1 h-4 z-20"></div>
                `;
            }

            podiumHTML += `
                <div class="podium-step ${rankClass} ${orderClass}">
                    <div class="prize-tag text-gray-400 text-sm flex items-center gap-1" id="prize-${rank}">
                        <i data-lucide="lock" class="w-3 h-3"></i> R$ ???
                    </div>
                    <div class="podium-block">
                        <span class="text-4xl mb-4 filter drop-shadow-md">${medal}</span>
                        <div class="flex flex-wrap justify-center content-start w-full gap-2 overflow-y-auto custom-scrollbar" style="max-height: 100%;" id="rank-group-${rank}">
                            ${avatarsHTML}
                        </div>
                        ${tieButton}
                        <div class="mt-auto pt-2 text-white/80 font-bold text-sm">
                            ${score} pts
                        </div>
                    </div>
                </div>
            `;
        });

        podium.innerHTML = podiumHTML;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        lucide.createIcons();
    },

    runTieBreaker: function (rank, ids) {
        const resultDiv = document.getElementById(`tie-result-${rank}`);
        resultDiv.innerText = "Sorteando...";

        let counter = 0;
        const maxIterations = 20;

        const interval = setInterval(() => {
            ids.forEach(id => {
                const el = document.getElementById(`avatar-${id}`);
                if (el) {
                    el.classList.remove('winner-highlight');
                    el.classList.add('loser-dim');
                }
            });

            const randIndex = Math.floor(Math.random() * ids.length);
            const currentId = ids[randIndex];
            const currentEl = document.getElementById(`avatar-${currentId}`);
            if (currentEl) {
                currentEl.classList.remove('loser-dim');
                currentEl.classList.add('winner-highlight');
            }

            counter++;
            if (counter >= maxIterations) {
                clearInterval(interval);
                const finalWinnerIndex = Math.floor(Math.random() * ids.length);
                const finalId = ids[finalWinnerIndex];
                const winner = participantsData.find(p => p.id === finalId);

                ids.forEach(id => {
                    const el = document.getElementById(`avatar-${id}`);
                    if (el) {
                        if (id === finalId) {
                            el.classList.remove('loser-dim');
                            el.classList.add('winner-highlight');
                            confetti({
                                particleCount: 50,
                                spread: 60,
                                origin: {
                                    x: el.getBoundingClientRect().left / window.innerWidth,
                                    y: el.getBoundingClientRect().top / window.innerHeight
                                }
                            });
                        } else {
                            el.classList.add('loser-dim');
                        }
                    }
                });
                resultDiv.innerText = `🏆 ${winner.name}`;
            }
        }, 100);
    },

    revealPrizes: function () {
        if (prizesRevealed) return;
        prizesRevealed = true;

        if (window.SoundFX) SoundFX.celebration();

        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        var random = function (min, max) { return Math.random() * (max - min) + min; };

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        const prizes = { 1: "R$ 250", 2: "R$ 150", 3: "R$ 100" };

        for (let i = 1; i <= 3; i++) {
            const tag = document.getElementById(`prize-${i}`);
            if (tag) {
                setTimeout(() => {
                    tag.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> ${prizes[i]}`;
                    tag.classList.add('prize-revealed');
                    lucide.createIcons();
                }, i * 600);
            }
        }
    },

    confettiEffect: function () {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    },

    closeRanking: function () {
        document.getElementById('ranking-modal').classList.add('hidden');
        document.getElementById('ranking-modal').classList.remove('flex');
    }
};

window.admin = admin;

document.addEventListener('DOMContentLoaded', () => {
    admin.init();
});
