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
    const callsign_templates: {
        [key: string]: string
    } = {
        'China': 'B$c{A|D|G-I}$n{1-8}$c3{A-W}',
        'HongKong': 'VR2$c3{A-W}',
        'Macau': 'XX$n$c3{A-W}'
    }

    function random_cq(callsign: string) {
        const cqs = [
            `${callsign}`,
            `CQ ${callsign} calling cq and standing by.`,
            `CQ CQ CQ, This is ${callsign}, standing by.`,
            `My call sign is ${callsign}, over.`,
        ]
        return cqs[Math.floor(Math.random() * cqs.length)]
    }

    return {
        phonetic_dict,
        callsign_templates,
        random_cq
    }
})