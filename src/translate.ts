import { getQueryString, fetchData, getError, isLangCodeSupported } from './utils';
import getTk from './getTk';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from './errorCodes';
import { detect } from './detect';

export const translate = async ({text, from = '', to = '', com = true, userLang = '', autoDetect = true}: {text: string, from?: string, to?: string, com?: boolean, userLang?: string, autoDetect?: boolean}): Promise<{text: string, from: string, to: string, result: string[], dict: string[] | null, phonetic: string | undefined | null, raw: any}> => {
    userLang = userLang || 'en';
    from = from || (autoDetect ? await detect(text, com) : 'auto');
    to = to || (from === userLang ? 'en' : userLang);

    if (!isLangCodeSupported(from) || !isLangCodeSupported(to)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.google.${com ? 'com' : 'cn'}/translate_a/single`;
    let params = {
        client: 'webapp',
        sl: from,
        tl: to,
        hl: userLang || to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        ssel: 0,
        tsel: 0,
        kc: 1,
        tk: await getTk(text, com),
        q: encodeURIComponent(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data: any = await res.json();

        const result = {
            text,
            from: data[2],
            to,
            result: data[0].reduce((t: any, v: any) => (v[0] ? t.concat(v[0]) : t), []),
            dict: data[1] && data[1].reduce((t: any, v: any) => (t.concat(v[0] + ': ' + v[1].reduce((t1: any, v1: any, i1: any) => (i1? `${t1}, ${v1}`: v1), ''))), []),
            phonetic: data[0][data[0].length - 1][3],
            raw: data
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};