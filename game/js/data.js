// Dados originais dos participantes
const defaultParticipantsData = [
    {
        id: 1,
        name: "Carlos",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Tenho 2 filhos", isTruth: false },
            { text: "Fiz cirurgia para aumentar de tamanho", isTruth: false },
            { text: "Comecei 3 faculdades de engenharia", isTruth: true }
        ]
    },
    {
        id: 2,
        name: "Spósito",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Corri por 8 km para fugir de briga de torcida", isTruth: false },
            { text: "Morei 2 anos numa casa com 7 pessoas, 1 quarto e 1 banheiro", isTruth: true },
            { text: "Já fui atropelado pelo Chorão na pista de skate", isTruth: false }
        ]
    },
    {
        id: 3,
        name: "Junior",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Já viajei para fora do país", isTruth: false },
            { text: "Já ganhei dinheiro como digital influencer", isTruth: true },
            { text: "Já caí de uma escada rolante no shopping", isTruth: false }
        ]
    },
    {
        id: 4,
        name: "Gilmar",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Tenho 6 dedos nos pés", isTruth: false },
            { text: "Meu pai é cantor sertanejo", isTruth: true },
            { text: "Já fui skatista freestyle profissional", isTruth: false }
        ]
    },
    {
        id: 5,
        name: "Cibele",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Já capotei o carro", isTruth: false },
            { text: "Nunca peguei ônibus na vida", isTruth: false },
            { text: "Já andei com o carro em duas rodas numa trilha", isTruth: true }
        ]
    },
    {
        id: 6,
        name: "Jean",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Pulei de paraquedas", isTruth: false },
            { text: "Repeti de ano no serviço militar obrigatório", isTruth: true },
            { text: "Tive carro tunado", isTruth: false }
        ]
    },
    {
        id: 7,
        name: "Dianin",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Fiz aulas e voei como piloto de avião", isTruth: false },
            { text: "Casei com 20 anos e fui pai aos 31", isTruth: true },
            { text: "Já fui professor de auto-escola", isTruth: false }
        ]
    },
    {
        id: 8,
        name: "Ingrid",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Já tive uma jaguatirica de estimação", isTruth: false },
            { text: "Já subi no palco no show do Matheus e Kauan", isTruth: false },
            { text: "Já entrevistei a Marilia Gabriela", isTruth: true }
        ]
    },
    {
        id: 9,
        name: "Jander",
        score: 0,
        isRevealed: false,
        options: [
            { text: "Já fui atropelado com 3 anos de idade", isTruth: true },
            { text: "Já ganhei na quina", isTruth: false },
            { text: "Fiz um mochilão sozinho pela Europa", isTruth: false }
        ]
    }
];

const STORAGE_KEY = 'vendas_game_data_v1';
const ROUND_KEY = 'vendas_game_round_v1';

const DataManager = {
    load: function () {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                console.log("📦 Dados recuperados do LocalStorage");
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Erro ao carregar dados:", e);
        }
        console.log("✨ Carregando dados padrão");
        return JSON.parse(JSON.stringify(defaultParticipantsData)); // Deep copy
    },

    save: function (data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // console.log("💾 Dados salvos");
        } catch (e) {
            console.error("Erro ao salvar dados:", e);
        }
    },

    reset: function () {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ROUND_KEY);
        return JSON.parse(JSON.stringify(defaultParticipantsData));
    },

    loadRound: function () {
        try {
            const saved = localStorage.getItem(ROUND_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                return {
                    participantId: data.participantId,
                    pointsGiven: new Set(data.pointsGiven || [])
                };
            }
        } catch (e) { }
        return { participantId: null, pointsGiven: new Set() };
    },

    saveRound: function (participantId, pointsGivenSet) {
        try {
            localStorage.setItem(ROUND_KEY, JSON.stringify({
                participantId: participantId,
                pointsGiven: Array.from(pointsGivenSet)
            }));
        } catch (e) { }
    },

    clearRound: function () {
        localStorage.removeItem(ROUND_KEY);
    }
};

// Expose to window for app.js to use
window.DataManager = DataManager;
window.participantsData = DataManager.load();
