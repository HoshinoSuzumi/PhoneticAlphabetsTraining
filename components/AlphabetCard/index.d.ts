export interface PhoneticDictionary {
    [key: string]: PhoneticSet[];
}

export interface PhoneticSet {
    word: string;
    ipa: string;
}