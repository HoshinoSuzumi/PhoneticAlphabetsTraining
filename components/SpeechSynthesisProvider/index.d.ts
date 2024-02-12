export interface fuck_tts {
    (content: string, rate: number = 1.0, pitch: number = 1.0, onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null = null): number
}