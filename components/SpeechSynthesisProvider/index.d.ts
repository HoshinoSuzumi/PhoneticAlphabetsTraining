import type {Ref} from "vue";

export type TTSApi = {
    speech: (
        text: string,
        options?: SpeechOptions
    ) => void,
    shut_up: () => void,
    get_voices: (lang?: string) => Ref<SpeechSynthesisVoice[]>,
    set_voice: (voice: SpeechSynthesisVoice | null) => void,
    current_voice: Ref<SpeechSynthesisVoice | null>,
    current_speed: Ref<number>,
    current_pitch: Ref<number>,
}

export type SpeechOptions = {
    rate?: number
    pitch?: number
    lang?: string
    voice?: SpeechSynthesisVoice
    interrupt?: boolean
    onstart?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null
    onend?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null
    onerror?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => any) | null
}