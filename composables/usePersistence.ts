import type {PhoneticDictionary} from "~/components/AlphabetCard";

export const usePersistence = defineStore('persistence', () => {
    const phonetic_dict = ref<PhoneticDictionary>({
        'A': [{word: 'alpha', ipa: '/ˈælfə/'}],
        'B': [{word: 'bravo', ipa: '/ˈbrɑːvoʊ/'}],
        'C': [{word: 'charlie', ipa: '/ˈtʃɑːrli/'}, {word: 'comic', ipa: '/ˈkɒmɪk/'}],
        'D': [{word: 'delta', ipa: '/ˈdeltə/'}],
        'E': [{word: 'echo', ipa: '/ˈekoʊ/'}],
        'F': [{word: 'foxtrot', ipa: '/ˈfɑːkstrɑːt/'}, {word: 'florida', ipa: '/ˈflɔrədə/'}],
        'G': [{word: 'golf', ipa: '/ɡɑːlf/'}],
        'H': [{word: 'hotel', ipa: '/hoʊˈtel/'}],
        'I': [{word: 'india', ipa: '/ˈɪndiə/'}],
        'J': [{word: 'juliet', ipa: '/ˈdʒuliˌɛt/'}, {word: 'japan', ipa: '/dʒəˈpæn/'}],
        'K': [{word: 'kilo', ipa: '/ˈkiːloʊ/'}],
        'L': [{word: 'lima', ipa: '/ˈliːmə/'}],
        'M': [{word: 'mike', ipa: '/maɪk/'}],
        'N': [{word: 'november', ipa: '/noʊˈvembər/'}],
        'O': [{word: 'oscar', ipa: '/ˈɒskə/'}],
        'P': [{word: 'papa', ipa: '/ˈpɑːpə/'}],
        'Q': [{word: 'quebec', ipa: '/kwəˈbɛk/'}],
        'R': [{word: 'romeo', ipa: '/ˈroʊmioʊ/'}],
        'S': [{word: 'sierra', ipa: '/siˈerə/'}],
        'T': [{word: 'tango', ipa: '/ˈtæŋɡoʊ/'}],
        'U': [{word: 'uniform', ipa: '/ˈjuːnɪfɔːrm/'}],
        'V': [{word: 'victor', ipa: '/ˈvɪktər/'}],
        'W': [{word: 'whiskey', ipa: '/ˈwɪski/'}],
        'X': [{word: 'x-ray', ipa: '/ˈeks reɪ/'}],
        'Y': [{word: 'yankee', ipa: '/ˈjæŋki/'}],
        'Z': [{word: 'zulu', ipa: '/ˈzuːluː/'}],
    })

    return {
        phonetic_dict
    }
})