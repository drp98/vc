const {Router} = require('express')
const Word = require('../models/Word')
const router = Router()
let currentWord = '';
let previousWord = '';
let selectValue = 'in progress';
let selectedSorting = 'old';
let selectedLanguage = 'eng';

Array.prototype.shuffle = function() {
    let currentIndex = this.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }

    return this;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let conditionDB = {isKnown: false};

router.get('/', async (req, res) => {
    await Word.find(conditionDB)
        .then(words => {
            const rand_numb = getRandomInt(words.length);
            if(words.length){
                currentWord = words[rand_numb].word;

                switch(selectedSorting) {
                    case 'random':
                        words.shuffle(); break;
                    case 'new':
                        words.reverse(); break;
                }
                if(selectedLanguage == 'rus') {
                    for(let i = 0; i < words.length; i++) {
                        [words[i].word, words[i].translate] = [words[i].translate, words[i].word]
                        //words[i].transcription = '-';
                    }
                }
                res.render('index', {
                    layout: 'main',
                    title: 'Vocabulary',
                    words,
                    selectValue,
                    selectedSorting,
                    selectedLanguage
                })
            }
            else {
                console.log('!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!');
                res.render('index', {
                    layout: 'main',
                    title: 'Vocabulary',
                    words,
                    selectValue
                    //selectedSorting
                })
            }
            if(words.length == 1)
                previousWord = '';
        })
        .catch(err => {
            console.log('Caught. Error in main:', err.message)
            res.status(404).sendFile('D:/ROMA/WEB/public/404.html');// ???
        });
})

router.get('/json', async (req, res) => {
    await Word.find(conditionDB)
        .then(words => {
            switch(selectedSorting) {
                case 'random':
                    words.shuffle(); break;
                case 'new':
                    words.reverse(); break;
            }
            if(selectedLanguage == 'rus')
                words.forEach(item => [item.word, item.translate] = [item.translate, item.word])
                
            res.json({
                words,
                selectValue//мб удалить
            })
        })
        .catch(err => console.log('Caught. Error in /json:', err.message))
})

router.get('/add', (req, res) => {
    res.render('add', {
        layout: 'main',
        title: 'Add',
        isAdd: true
    })
})

router.post('/add', async (req, res) => {
    const {word, translate, transcription} = req.body;
    const words = new Word({
        word,
        translate,
        transcription,
        isKnown: false
    })
    await words.save()
    res.redirect('/')
})

router.post('/already', async (req, res) => {
    const {word, isKnown} = req.body;
    await Word.updateOne({word}, {isKnown})
    res.redirect('/')
})

router.post('/select', async (req,res) => {
    if(req.body.valueCategory) {
        selectValue = req.body.valueCategory;
        console.log('selectValue -> ' + selectValue)
        switch(selectValue) {
            case 'already known': conditionDB = {isKnown: true}; break;
            case 'in progress': conditionDB = {isKnown: false}; break;
        }
    }
    if(req.body.valueSort) {
        selectedSorting = req.body.valueSort;
    }

    if(req.body.valueLanguage) {
        selectedLanguage = req.body.valueLanguage;
    }
    
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login',
        title: 'Vocabulary: Sign in'
    })
})

router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'signup',
        title: 'Vocabulary: Sign up'
    })
})

module.exports = router

