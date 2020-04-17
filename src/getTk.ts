import { fetchData } from './utils';

let TKK = '0';

/* tslint:disable */

const tkkToTk = (tkk: any, text: string) => {
    let a = tkk.split('.');
    let t0 = Number(a[0]) || 0, t1 = Number(a[1]) || 0;
    let e = [];

    for (let f = 0, g = 0; g < text.length; g++) {
        let l = text.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < text.length && 56320 == (text.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (text.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }

    a = t0;

    for (let f = 0; f < e.length; f++) {
        a += e[f];
        a = xr(a, '+-a^+6');
    }

    a = xr(a, '+-3^+b+-f');
    a ^= t1;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;

    return (a.toString() + '.' + (a ^ t0))
};

const xr = (a: any, b: any) => {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d: any = b.charAt(c + 2)
            , d: any = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d)
            , d: any = '+' == b.charAt(c + 1) ? a >>> d : a << d;
        a = '+' == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
};

/* tslint:enable */

const updateTkk = async (com: boolean) => {
        const now = Math.floor(Date.now() / 3600000);

        if (Number(TKK.split('.')[0]) === now) { return; } else {
            const url = `https://translate.google.${com? 'com': 'cn'}`;
            const res = await fetchData(url);
            const text = await res.text();
            const code = text.match(/tkk:.*?',/g);
            if (code) { TKK = code[0].split('\'')[1]; }
        }

        return;
};

const getTk = async (text: string, com: boolean): Promise<string> => {
    await updateTkk(com);

    return tkkToTk(TKK, text);
};

export default getTk;