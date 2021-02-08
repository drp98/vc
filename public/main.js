let words;
let index = 0;

function getReference(ref) {
    let reference = '';
    if(window.location.protocol == 'http:')
        reference = "http://vocabulary-note.herokuapp.com" + '/' + ref;
    else if(window.location.protocol == 'https:')
        reference = "https://vocabulary-note.herokuapp.com" + '/' + ref;
    if(window.location.hostname == 'localhost')
        reference = '/' + ref;
    return reference;
}

async function serv () {
    const ref = getReference('json');
    const response = await fetch(ref);
    const serverResponse = await response.json();
    words = serverResponse.words;
}
serv();

document.addEventListener('DOMContentLoaded', function() {

    console.log('THIS')
    const kek = document.querySelector('#language').value;
    if(kek == 'rus') {
        document.querySelector('#transcriptionId').classList.add('isHidden');
    }

    if(document.querySelector('#category').value.toLowerCase() == 'already known') {
        document.querySelector('#btn-known').innerHTML = 'learn again';
    }


document.querySelector('#btn-known').addEventListener('click', () => {
    let cond;
    let wordValue;
    if($('#category').val().toLowerCase() == 'in progress') 
        cond = true;
    else if($('#category').val().toLowerCase() == 'already known')
        cond = false;
    if(kek == 'eng')
        wordValue = document.querySelector('#wordId').innerHTML
    else if(kek == 'rus')
        wordValue = document.querySelector('#translateId').innerHTML
    fetch('/already', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word: wordValue,
            isKnown: cond
        })
    })

    document.querySelector('#form-known').submit();
})




document.querySelector('#btn-next').onclick = function() {//button next
    document.querySelector('#translateId').classList.remove('isVisible');
    document.querySelector('#transcriptionId').classList.remove('isVisible');

    if(index == words.length-1) 
        index = 0;
    else
        index++;

    const count = `[ ${index + 1} / ${words.length} ]`;
    document.querySelector('#counter').innerHTML = count;

    document.querySelector('#wordId').innerHTML = words[index].word;
    document.querySelector('#transcriptionId').innerHTML = words[index].transcription;
    document.querySelector('#translateId').innerHTML = words[index].translate;
    console.log(index)
}

document.querySelector('#btn-back').onclick = function() {//button back
    document.querySelector('#translateId').classList.remove('isVisible');

    if(index == 0)
        index = words.length - 1;
    else    
        index--;

    const count = `[ ${index + 1} / ${words.length} ]`;
    document.querySelector('#counter').innerHTML = count;

    document.querySelector('#wordId').innerHTML = words[index].word;
    document.querySelector('#transcriptionId').innerHTML = words[index].transcription;
    document.querySelector('#translateId').innerHTML = words[index].translate;
}


document.querySelector('#btn-translate').onclick = function() {//button translate
    document.querySelector('#translateId').classList.add('isVisible');
    document.querySelector('#transcriptionId').classList.add('isVisible');
}

document.querySelector('#language').addEventListener('change', () => {
    if($('#language').val().toLowerCase() == 'eng') {
        document.querySelector('#wordId').innerHTML = words[index].translate;
        document.querySelector('#transcriptionId').innerHTML = words[index].transcription;
        document.querySelector('#translateId').innerHTML = words[index].word;
    }
})


document.querySelector('#sort').addEventListener('change', () => {//select sorting
    document.querySelector('#select-form').submit();
    const sel = document.querySelector('#sort').value;
    fetch('/select', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            valueSort: sel
        })
    })

    document.querySelector('#wordId').innerHTML = words[0].word;
    document.querySelector('#transcriptionId').innerHTML = words[0].transcription;
    document.querySelector('#translateId').innerHTML = words[0].translate;
    index = 1;
    const count = `[ ${index} / ${words.length} ]`;
    document.querySelector('#counter').innerHTML = count;

    console.log(document.querySelector('#sort').value)
    console.log(words);

})

document.querySelector('#language').addEventListener('change', () => {//select language
    document.querySelector('#select-form').submit();
    const sel = document.querySelector('#language').value;
    fetch('/select', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            valueLanguage: sel
        })
    })

    document.querySelector('#wordId').innerHTML = words[0].word;
    document.querySelector('#transcriptionId').innerHTML = words[0].transcription;
    document.querySelector('#translateId').innerHTML = words[0].translate;
    index = 1;
    const count = `[ ${index} / ${words.length} ]`;
    document.querySelector('#counter').innerHTML = count;

    console.log(document.querySelector('#sort').value)
    console.log(words);

})



});
