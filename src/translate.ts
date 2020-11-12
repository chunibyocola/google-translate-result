import { getQueryString, fetchData, getError, isLangCodeSupported } from './utils';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from './errorCodes';
import { detect } from './detect';

export const translate = async ({text, from = '', to = '', userLang = '', autoDetect = true}: {text: string, from?: string, to?: string, userLang?: string, autoDetect?: boolean}): Promise<{text: string, from: string, to: string, result: string[], dict: string[] | null, phonetic: string | undefined | null, raw: any}> => {
    userLang = userLang || 'en';
    from = from || (autoDetect && !to ? await detect(text) : 'auto');
    to = to || (from === userLang ? 'en' : userLang);

    if (!isLangCodeSupported(from) || !isLangCodeSupported(to)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.googleapis.com/translate_a/single`;
    let params = {
        client: 'gtx',
        sl: from,
        tl: to,
        hl: userLang || to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        dj: 1,
        q: encodeURIComponent(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data: any = await res.json();

        const result = {
            text,
            from: data.src,
            to,
            result: data.sentences?.reduce((t: Array<string>, v: any) => (v.trans ? t.concat(v.trans) : t), []),
            dict: data.dict?.reduce((t: Array<string>, v: any) => (t.concat(v.pos + ': ' + v.terms.join(', '))), []),
            phonetic: data.sentences?.[1]?.src_translit,
            raw: data
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};