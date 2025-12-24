// Sistema de sons usando Web Audio API
const SoundFX = (function () {
    let audioContext = null;

    function getContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playTone(frequency, duration, type = 'sine', volume = 0.1) {
        try {
            const ctx = getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    return {
        // Som de tick suave (para transições no loading)
        tick: function () {
            playTone(800, 0.05, 'sine', 0.08);
        },

        // Som de sucesso/chime
        success: function () {
            playTone(523, 0.15, 'sine', 0.12);
            setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
            setTimeout(() => playTone(784, 0.2, 'sine', 0.15), 200);
        },

        // Som de clique
        click: function () {
            playTone(400, 0.08, 'square', 0.06);
        },

        // Som de revelação correta
        reveal: function () {
            playTone(440, 0.1, 'sine', 0.1);
            setTimeout(() => playTone(880, 0.2, 'sine', 0.12), 80);
        },

        // Som de celebração (para prêmios/ranking)
        celebration: function () {
            const notes = [523, 659, 784, 1047];
            notes.forEach((note, i) => {
                setTimeout(() => playTone(note, 0.15, 'sine', 0.1), i * 100);
            });
        },

        // Som de erro
        error: function () {
            playTone(200, 0.3, 'sawtooth', 0.08);
        }
    };
})();

// Expor globalmente
window.SoundFX = SoundFX;
