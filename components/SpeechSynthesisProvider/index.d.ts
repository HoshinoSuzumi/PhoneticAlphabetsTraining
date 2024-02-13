export type TTSApi = {
    speech: (
        text: string,
        options?: SpeechOptions
    ) => void,
    shut_up: () => void,
    get_voices: (lang?: string) => void,
}

export type SpeechOptions = {
    rate?: number
    pitch?: number
    lang?: string
    interrupt?: boolean
    onstart?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null
    onend?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null
    onerror?: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => any) | null
}