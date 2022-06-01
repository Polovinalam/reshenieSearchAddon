let searchPanel = document.createElement('div');
let searchBtn = document.createElement('input');
let answerDiv = document.createElement('div');
let answerBlock = document.createElement('div');
let clearBtn = document.createElement('input');
const input = document.createElement('input');
let iframe = document.createElement('iframe');
let divFrame = document.createElement('div');
 
let loadTreads = [];
let loadPage = []
let loadThreadsCounter = 0;
let loadPageCounter = 0;
let enableSearch = false;
 
document.addEventListener("DOMContentLoaded", ready);
 
function ready() {
    searchPanel.setAttribute("id", "mainSearchPanel");
    searchBtn.setAttribute("id", "mainSearchBtn");
    searchBtn.type = 'button';
    searchBtn.value = "Поиск";
 
    clearBtn.setAttribute("id", "clearBtn");
    clearBtn.type = 'button';
    clearBtn.value = "X";
    clearBtn.title = "Очистить/вернуться к ручному поиску";
    clearBtn.addEventListener("click", () => { onClear(); });
 
    answerBlock.setAttribute("id", "answer");
    answerBlock.appendChild(answerDiv);
    answerDiv.setAttribute('class', 'block-answer');
 
    divFrame.className = 'block-frame';
    divFrame.appendChild(iframe);
    iframe.name = "iframe_link";
    iframe.className = "block-frame__iframe"
 
    searchBtn.addEventListener("click", () => { onSearchclickPage(input.value.length > 0 ? input.value :'Введите что-нибудь'); });
    searchBtn.classList.add("searchBlock");
    input.setAttribute("id", "mainInput");
    input.setAttribute("placeholder", "Введите что-нибудь");
    input.type = "text";
    input.name = "SEARCH_INPUT";
    searchPanel.appendChild(searchBtn);
    searchPanel.appendChild(clearBtn);
    searchPanel.appendChild(input);
    searchPanel.appendChild(answerBlock);
 
    const elements = document.getElementsByTagName("*");
    elements[0].prepend(divFrame);
    elements[0].prepend(searchPanel);
 
    window.onload = function () {
        startAll();
    }
}
const n = 'none';
const b = 'block';
 
function onClear() {
    answerDiv.innerHTML = "";
    answerBlock.innerHTML = "";
    input.value = "";
    answerBlock.style.paddingBottom = '0';
    divFrame.style.display = n;
    iframe.style.display = n;
}
function onSearchclickPage(substring) {
    if (!enableSearch) return;
    answerBlock.innerHTML = "";
    let x = 0;
    answerDiv.innerHTML = "";
    answerBlock.style.paddingBottom = '0';
    for (let i = 0; i < loadPage.length; i++) {
        let elem = loadPage[i][1];
        if (elem.toUpperCase().includes(substring.toUpperCase())) {
            x++;
            if (x == 1 ){
                answerBlock.innerHTML += '<p>Результаты поиска: <b class="attention">По документам</b></p>';
                answerBlock.style.paddingBottom = '20px';           
            }  
            answerDiv.innerHTML += '<div class="block-link" ><a class="link" href="' + loadPage[i][2].pageUrl + '"target="iframe_link">' + (loadPage[i][2].pageName.length > 0 ? loadPage[i][2].pageName : 'НАЗВАНИЕ ОТСУТСТВУЕТ') + '</a></div>';
            answerBlock.appendChild(answerDiv);
            if (x == 1) {
                divFrame.style.display = b;
                iframe.style.display = b;
                iframe.setAttribute("src", loadPage[i][2].pageUrl + "\r\n")
            }
        }
    }
    if (x == 0) {
        answerBlock.innerHTML += "<p>По запросу <b>" + substring + "</b> ничего не найдено.</p>";
        answerBlock.style.paddingBottom = '0';
    }
 
}
function onSearchClick(substring) {
    if (!enableSearch) return;
    answerBlock.innerHTML = "";
    let x = 0;
    answerDiv.innerHTML = "";
    answerBlock.style.paddingBottom = '0';
    
    for (let i = 0; i < loadTreads.length; i++) {
        let elem = loadTreads[i][3];
        if (elem.toUpperCase().includes(substring.toUpperCase())) {
            x++;
            if (x == 1) {
                answerBlock.innerHTML += '<p>Результаты поиска: <b class="attention">По разделам</b></p>';
                answerBlock.style.paddingBottom = '20px';
            }
            answerDiv.innerHTML += '<div class="block-link"><a class="link" href="' + window.location.href + encodeURI(loadTreads[i][1].replace(/%20/g, '+')) + "\r\n" + '"target="iframe_link">' + loadTreads[i][2][0]  /*+ loadTreads[i][1]*/ + '</a></div>';
            answerBlock.appendChild(answerDiv);
            if (x == 1) {
                divFrame.style.display = b;
                iframe.style.display = b;
                iframe.setAttribute("src", window.location.href + encodeURI(loadTreads[i][1].replace(/%20/g, '+')) + "\r\n")
            }
        }
    }
 
    if (x == 0) {
        answerBlock.innerHTML += "<p>По запросу <b>" + substring + "</b> ничего не найдено.</p>";
        answerBlock.style.paddingBottom = '0';
    }
 
}
 
const parseAllUrlds = (documentText,url) => {
    documentText = documentText.getElementsByTagName("td");
    let massHtml = "";
    for (let i = 0; i < documentText.length; i++) {
        let elem = documentText[i].innerHTML
        //убираем все комментарии в элементе 
        while (elem.search("<!--") > 0) {
            elem = elem.replace(elem.slice(elem.search("<!--"), elem.search("-->") + 3), '');
        }
        if (elem.includes("<tbody>")) continue;
        massHtml += elem;
    }
    let str = "<script>";
    const allSearchedBtns = massHtml.split(str + "btnL");
    for (let i = 0; i < allSearchedBtns.length; i++) {
        if (allSearchedBtns[i].length === 0) continue;
        let splitByBtn2 = allSearchedBtns[i].split(")</script>");
        if (splitByBtn2.length < 2) continue;
        let newUrl = splitByBtn2[0].split("\", \"");
        let origLinkText = newUrl[1];
        newUrl = newUrl[2].split("\"")[0];
        if (newUrl.length !== 0) {
            loadTreads[loadTreads.length] = [loadTreads.length, newUrl, [origLinkText,url.urlID]];
            loadThreadsCounter++;
        }
    }
    parseAllUrldsCounter--;
 
    if (parseAllUrldsCounter == 0)
        for (let i = 0; i < loadTreads.length; i++) {
            getDocumentByUrl(loadTreads[i][1], insertDocument, { threadNum: i });
        }
}
const parsPage = (documentText, url) => {
    documentText = documentText.getElementsByTagName("body");
    for (let i = 0; i < documentText.length; i++) {
        let elem = documentText[i].textContent
        loadPage[loadPage.length] = [loadPage.length, elem, url]
    }
 
}
const insertDocument = (document, threadNumObj) => {
    loadTreads[threadNumObj.threadNum][3] = document.getElementsByTagName("html")[0].textContent;
    if (loadThreadsCounter > 0 && loadTreads[threadNumObj.threadNum][2][1] <=2) {
        try {
            let docHref = document.getElementsByTagName("a");
            for (let i = 0; i < docHref.length; i++) {
                if (docHref[i].href.indexOf('.htm') > 0 & docHref[i].href.indexOf('reshenie-soft.ru/doc') > 0) {
                    loadPageCounter++;
                    let docHrefName = docHref[i].attributes[0].textContent.replace(/%20/g, ' ');
                    getDocumentByUrl(docHref[i].href, parsPage, { pageUrl: docHref[i].href, pageName: docHrefName })
                }
            }
        } catch (err) {
            console.log('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack);
        }
    }
    if (--loadThreadsCounter === 0){
         searchReady();
    }                 
};
 
const searchReady = () => {
    enableSearch = true;
    searchBtn.classList.remove("searchBlock");
    searchBtn.classList.add("searchReady");
};
let parseAllUrldsCounter = 0;
function startAll() {
    parseAllUrldsCounter++;
    getDocumentByUrl("https://reshenie-soft.ru/doc/left_1.htm", parseAllUrlds, {urlID: 1 });
    parseAllUrldsCounter++;
    getDocumentByUrl("https://reshenie-soft.ru/doc/left_2.htm", parseAllUrlds, {urlID: 2 });
    parseAllUrldsCounter++;
    getDocumentByUrl("https://reshenie-soft.ru/doc/left_4.htm", parseAllUrlds, {urlID: 3 });
    parseAllUrldsCounter++;
    getDocumentByUrl("https://reshenie-soft.ru/doc/left_5.htm", parseAllUrlds, {urlID: 4 });
    parseAllUrldsCounter++;
    getDocumentByUrl("https://reshenie-soft.ru/doc/left_6.htm", parseAllUrlds, {urlID: 5 });
}
 
function getDocumentByUrl(url, callback, argsOb) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "document";
    xhr.open('GET', url, true);
    xhr.send('');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
            callback(xhr.response, argsOb);
        }
    }
}
 
//событие при изменении input
input.oninput = function changeInp() {
    onSearchClick(input.value);
    searchIframe(iframe, input.value.trim())
    answerBlock.style.display = b;
}
//поиск при нажатии клавиши ENTER
input.onkeydown = function runScript(e) {
    if ((e.which == 13 || e.keyCode == 13)&& input.value !='') {
        onSearchclickPage(input.value);
        return false;
    }
    return true;
}
//отображение списка найденных результатов при наведении
searchPanel.onmouseover = function (e) {
    answerBlock.style.display = b;
    e.scrollTop = e.scrollHeight;
}
//скрытие списка найденных результатов при отводе курсора от элемента
searchPanel.onmouseout = function (e) {
    answerBlock.style.display = n;
    e.scrollTop = e.scrollHeight;
}
//скрытие элементов при нажатии ESC
window.onkeydown = function (e) {
    if (e.which == 27 || e.keyCode == 27) {
        answerBlock.style.display = n;
        divFrame.style.display = n;
        iframe.style.display = n;
    }
    return true;
}
//скрытие блокирующего элемента под фреймом(модального окна) при нажатии
divFrame.onclick = function (e) {
    divFrame.style.display = n;
}
//при клике по ссылкам поиска
document.addEventListener("click", (e) => {
    target = e.target
   let link = document.getElementsByTagName('a');
    for(i=0; i < link.length; i++)
     {
         if(link[i] == target){
            target.classList.add('link_active')
         }else{link[i].classList.remove('link_active')}; 
     }
    if (target.className.includes('link')) {
        target.classList.add('link_viewed')
        divFrame.style.display = b;
        iframe.style.display = b;
        frame = document.getElementsByTagName('iframe')[0];
        searchIframe(frame, input.value.trim());
    }
});
const searchIframe = (frame, text) => {
    textUpper = text.toUpperCase();
    frame.onload = function () {
        let iframeDoc = frame.contentWindow.document;
        elem = iframeDoc.getElementsByTagName('p');
        for (let i = 0; i < elem.length; i++) {
            if (elem[i].innerText.toUpperCase().includes(textUpper)) {
                if (textUpper !== '' && textUpper.length > 1) {
                    if (elem[i].className == 'h1' || elem[i].className == 'text' || elem[i].className == 'MsoIndex1' || elem[i].className == 'MsoMessageHeader') {
                        elem[i].style.display = 'table'
                        if (elem[i].className == 'MsoIndex1' || elem[i].className == 'MsoMessageHeader') { elem[i].style.color = '#4157f5' }
                    }
                    elem[i].style.backgroundColor = '#fbeded';
 
                    pattern = elem[i].innerHTML.toUpperCase();
                    ind = pattern.indexOf(textUpper);
                    colorElement = elem[i].innerHTML.substring(ind, textUpper.length + ind);
                    elementBegin = elem[i].innerHTML.substring(0, ind);
                    elementEnd = elem[i].innerHTML.substring(textUpper.length + ind);
                    elem[i].innerHTML = elementBegin + '<span style="background-color:#fc776d">' + colorElement + '</span>' + elementEnd;
                }
            }
        }
        elemA = iframeDoc.getElementsByTagName('a');
        for (let i = 0; i < elemA.length; i++) {
            if (elemA[i].innerText.toUpperCase().includes(textUpper)) {
                if (textUpper !== '' && textUpper.length > 1) {
                    elemA[i].style.backgroundColor = '#fbeded';
                }
            }
        }
    }
 
}
