export const useRandomCallsign = (template: string) => {
    const regex = /\$(?<type>[c|n]\d?)(?:\{(?<ranges>[^}]+)\})?/g

    return template.replace(regex, (substring, type: string, ranges: string) => {
        let generated_part = ''

        if (type.startsWith('c')) { // chars
            if (!ranges) ranges = 'A-Z' // set default char ranges
            const char_count = type === 'c' ? 1 : parseInt(type.slice(1), 10)
            for (let i = 0; i < char_count; i++) {
                const char_ranges = ranges.split('|')
                const selected_range = char_ranges[Math.floor(Math.random() * char_ranges.length)]
                const [char_start, char_end] = selected_range.split('-')
                if (!char_end) {
                    generated_part += char_start
                    continue
                }
                const random_char_code = char_start.charCodeAt(0) + Math.floor(Math.random() * (char_end.charCodeAt(0) - char_start.charCodeAt(0) + 1))
                generated_part += String.fromCharCode(random_char_code)
            }
        } else if (type.startsWith('n')) { // numbers
            if (!ranges) ranges = '0-9' // set default number ranges
            const num_count = type === 'n' ? 1 : parseInt(type.slice(1), 10)
            for (let i = 0; i < num_count; i++) {
                const num_ranges = ranges.split('|')
                const selected_range = num_ranges[Math.floor(Math.random() * num_ranges.length)]
                const [num_start, num_end] = selected_range.split('-').map(i => parseInt(i))
                if (!num_end) {
                    generated_part += `${num_start}`
                    continue
                }
                generated_part += `${Math.floor(Math.random() * (num_end - num_start + 1)) + num_start}`
            }
        }
        return generated_part
    })
    // return generateCallSign(Object.values(callsignTemplates)[Math.floor(Math.random() * Object.keys(callsignTemplates).length)])
}