import type {TTSApi} from "~/components/SpeechSynthesisProvider";

export const useTTS = () => {
    const tts = inject<TTSApi>('tts_api')
    if (!tts) {
        throw new Error('No outer SpeechSynthesisProvider found!')
    }
    return tts
}