export interface PhoneticDictionary {
    [key: string]: PhoneticSet[]
}

export interface PhoneticSet {
    word: string
    ipa: string
    tag?: TAG
}

export interface Tag {
    label: string
    desc: string
}