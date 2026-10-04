export const STANDOUT_ELEMENTS = [
    { label: "The Score", emoji: "🎵" },
    { label: "The Visuals", emoji: "🎨" },
    { label: "Lead Actor", emoji: "🎭" },
    { label: "Plot Twist", emoji: "🌪️" },
    { label: "Emotional Hit", emoji: "❤️‍🩹" },
];

export const BRAIN_POWER_OPTIONS = [
    { label: "Easygoing", emoji: "🍿" },
    { label: "Engaged", emoji: "🛋️" },
    { label: "Overdrive", emoji: "🤯" }
];

export const ATTENTION_OPTIONS: Record<string, string> = {
    '0': '📱 Distracted',
    '50': '🛋️ Settled In',
    '100': '👁️ Didn\'t Blink'
};
export const VERDICT_OPTIONS = [
    { label: "Must Watch", caption: '"Drop everything and watch this"', points: 20 },
    { label: "Solid Pick", caption: '"Yes, it\'s a good time"', points: 14 },
    { label: "Niche Appeal", caption: '"Only if you love this genre or actors"', points: 7 },
    { label: "Skip It", caption: '"Dont\'t waste your time"', points: 0 }
];