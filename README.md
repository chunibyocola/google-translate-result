# google-translate-result
A simple translate API for Google Translate. Exports translate, audio and detect.
## Install
```
npm i google-translate-result
```
## Usage
Translate:
```javascript
import google from 'google-translate-result';

google.translate({text: 'hello', to: 'ja', userLang: 'ja'}).then(result => console.log(result));

/*
    => {
        dict: ["名詞: 今日は"],
        from: "en",
        phonetic: "heˈlō,həˈlō",
        raw: [raw data],
        result: ["こんにちは"],
        text: "hello",
        to: "ja"
    }
*/
```
Translate params:
```javascript
{
    /*
    * the text you wanna translate
    * should be a string
    */ 
    text,

    /*
    * translate from
    * should ba a language code like 'en', 'zh-CN', etc.
    */
    from = '', 

    /*
    * translate to
    * should be a language code like 'en', 'zh-CN', etc.
    */
    to = '',

    /*
    * should be 'navigator.language'
    * userLang: userLang || 'en'
    * &hl=`${userLang || to}`
    */
    userLang = '',

    /*
    * if you didn't set 'from'
    * translate will auto detect the text, to give a better performance
    * but it will take about two times of time to get the result
    * if you don't want the auto detect
    * you can set it false
    */
    autoDetect = true
}
```
Audio:
```javascript
import google from 'google-translate-result';

google.audio({text: 'Hello world!'}).then(result => console.log(result));

/*
    => [
        "https://translate.google.cn/translate_tts?client=webapp&ie=UTF-8&prev=input&total=1&idx=0&tl=en&textlen=12&tk=964336.527511&q=Hello%20world!"
    ]

    return array is
    because it will be 404 not found if the text-length > 200
*/
```
Audio params:
```javascript
{
    /*
    * the meaning is the same as translate's params
    * Notice: it must auto detect if you don't set 'from'
    */
    text,
    from = ''
}
```
You can play audio like it in the chrome extension background:
```javascript
const audioPlayer = new Audio();
let index = 0;
let audioSrcList = [];

audioPlayer.addEventListener('ended', () => {
    if (index < audioSrcList.length) {
        audioPlayer.src = audioSrcList[index];
        audioPlayer.play();
        ++index;
    }
});

const playAudio = (srcList) => {
    if (1 > srcList.length) return;

    audioSrcList = srcList;
    index = 1;

    audioPlayer.src = srcList[0];
    audioPlayer.play();
}
```
Detect:
```javascript
import google from 'google-translate-result';

google.detect('你好').then(result => console.log(result));

/*
    => 'zh-CN'
*/
```
Detect params:
```javascript
(
    /*
    * the meaning is the same as translate's params
    */
    text
)
```
You can catch the error of every function, catch like it:
```javascript
google.translate({text: 'hello', to: 'abc'})
    .then(result => console.log(result))
    .catch(err => console.log(err.code)); // => 'LANGUAGE_NOT_SOPPORTED'
```
The error code is as follows:
```javascript
'CONNECTION_TIMED_OUT'
'BAD_REQUEST'
'RESULT_ERROR'
'LANGUAGE_NOT_SOPPORTED'
```
## License
MIT