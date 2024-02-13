const index2letter = (index: number) => String.fromCharCode('A'.charCodeAt(0) + index)
const letter2index = (letter: string): number => {
    if (letter.length !== 1 || !(/[A-Za-z]/.test(letter))) {
        throw new Error("invalid char input.");
    }
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
};

export const useMaidenheadGrid = (locator?: string) => {
    const inst = {
        locator: locator
    }
    return {
        /**
         * Coords to Maidenhead Grid Locator
         * @param longitude 经度
         * @param latitude  纬度
         * @param toBound
         * @return string   梅登黑德
         */
        from_coords(longitude: number, latitude: number, toBound: boolean = false): string | number[] {
            // field
            let field1 = Math.floor((180 + longitude) / 20)
            let field2 = Math.floor((90 + latitude) / 10)
            let field = index2letter(field1) + index2letter(field2)
            // square
            let square1 = Math.floor(Math.floor(longitude + 180) % 20 / 2)
            let square2 = Math.floor(latitude + 90) % 10
            let maidenhead = field + square1 + square2
            // block
            let block1 = Math.floor((longitude - Math.floor(longitude / 2) * 2) * 60 / 5)
            let block2 = Math.floor((latitude - Math.floor(latitude)) * 60 / 2.5)
            maidenhead = maidenhead + (index2letter(block1) + index2letter(block2)).toLowerCase()
            if (toBound) {
                inst.locator = maidenhead
                return this.to_bound()
            }
            return maidenhead
        },
        to_bound() {
            if (!inst.locator) throw new Error('no locator provided')
            let lon = letter2index(inst.locator[0]) * 20 + parseInt(inst.locator[2]) * 2 + letter2index(inst.locator[4]) * 5 / 60 - 180;
            let lat = letter2index(inst.locator[1]) * 10 + parseInt(inst.locator[3]) + letter2index(inst.locator[5]) * 2.5 / 60 - 90;

            return [lon, lat, lon + 5 / 60, lat + 2.5 / 60];
        }
    }
}