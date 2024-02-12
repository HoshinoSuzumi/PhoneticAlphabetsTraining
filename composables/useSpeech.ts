import type {fuck_tts} from "~/components/SpeechSynthesisProvider";

export const useSpeech = () => {
    const tts = inject<fuck_tts>('fuck_tts')
    if (!tts) {
        throw new Error('No outer SpeechSynthesisProvider found!')
    }
    return tts
}