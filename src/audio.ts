import { getQueryString, isLangCodeSupported, getError } from './utils';
import { LANGUAGE_NOT_SOPPORTED } from './errorCodes';
import { detect } from './detect';

export const audio = async ({ text, from = '' }: { text: string, from?: string }) => {
    if (!text) { return; }

    from = from || await detect(text);

    if (!isLangCodeSupported(from)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.googleapis.com/translate_tts`;

    let arr = getTextArray(text);

    for (let i = 0; i < arr.length; ++i) {
        const params = {
            client: 'gtx',
            ie: 'UTF-8',
            tl: from,
            q: encodeURIComponent(arr[i])
        };

        arr[i] = url + getQueryString(params);
    }

    return arr;
};

const MAX_TEXT_LENGTH = 200;

const getTextArray = (text: string) => {
    let arr: string[] = [];
    let textArr: string[] = [];

    while (text) {
        const index = text.search(/\.|。|\?|？|,|，|:|：|;|；|\s|\n/g);
        if (index >= 0) {
            textArr.push(text.substr(0, index + 1));
            text = text.substr(index + 1, text.length);
        } else {
            textArr.push(text);
            break;
        }
    }

    textArr.reduce((total, value, index) => {
        let {length, str} = total;
        if (length + value.length <= MAX_TEXT_LENGTH) {
            length += value.length;
            str += value;
        } else {
            str && arr.push(str);
            if (value.length > MAX_TEXT_LENGTH) {
                while (value.length > MAX_TEXT_LENGTH) {
                    arr.push(value.substr(0, MAX_TEXT_LENGTH));
                    value = value.substr(MAX_TEXT_LENGTH, value.length);
                }
            }
            length = value.length;
            str = value;
        }
        (index === textArr.length - 1 && str) && arr.push(str);
        return {length, str};
    }, {length: 0, str: ''});

    return arr;
};