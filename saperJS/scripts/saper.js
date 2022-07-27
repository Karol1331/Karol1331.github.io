//ZMIENNE GLOBALNE
var tab, pola, flags, mxCol, mxRow, sekundy = 0,
    gameOver = false;
const timerInterwal = setInterval(timing, 1000);
var numColors = {
    1: "aqua",
    2: "yellow",
    3: "orange",
    4: "red",
    5: "whitesmoke",
    6: "rgb(42, 238, 42)", // taki jasny zielony
    7: "palevioletred",
    8: "blueviolet",
};

function losuj() {
    let bombs, pz;
    //localStorage.setItem("p/c", "poziom");
    //localStorage.setItem("trudnosc", "latwy");

    if (localStorage.getItem("p/c") == "poziom") {
        pz = localStorage.getItem("trudnosc");
        switch (pz) {
            case "latwy":
                mxCol = 10;
                mxRow = 8;
                bombs = flags = 10;
                document.title = "SAPER - łatwy";
                break;
            case "normalny":
                mxCol = 18;
                mxRow = 14 //14;
                bombs = flags = 40;
                document.title = "SAPER - normalny";
                break;
            case "trudny":
                mxCol = 24;
                mxRow = 20;
                bombs = flags = 99;
                document.title = "SAPER - trudny";
                break;
        }
    } else if (localStorage.getItem("p/c") == "custom") {
        mxCol = localStorage.getItem("szer");
        mxRow = localStorage.getItem("wys");
        bombs = flags = localStorage.getItem("bombs");
        document.title = "SAPER - custom";
        if (mxRow <= 9) pz = "latwy";
        else if (mxRow <= 14) pz = "normalny";
    } else document.location = 'index.html';
    localStorage.clear(); // USUWANIE WSZYSTKIEGO Z localStorage

    tab = new Array(mxRow);
    pola = mxCol * mxRow - bombs;
    document.getElementById("flaga").innerHTML = "<p>&#128681  " + flags + "</p>";
    for (let i = 0; i < mxRow; i++) {
        tab[i] = new Array(mxCol);
    }
    for (let i = 0; i < mxRow; i++) {
        for (let j = 0; j < mxCol; j++) tab[i][j] = 0;
    }
    for (let i = 0; i < bombs; i++) {
        let losCol = Math.floor(Math.random() * mxCol);
        let losRow = Math.floor(Math.random() * mxRow);
        if (tab[losRow][losCol] == -1) i -= 1; // sprawdza czy ta komorka zostala wylosowana wczesniej
        else tab[losRow][losCol] = -1; // -1 oznacza bombe
    }

    //DODAWANIE DO SASIEDNICH KOMOREK LICZBY BOMB
    for (let row = 0; row < mxRow; row++) {
        for (let col = 0; col < mxCol; col++) {
            if (tab[row][col] == -1) {
                if (row - 1 >= 0 && col - 1 >= 0)
                    if (tab[row - 1][col - 1] != -1) tab[row - 1][col - 1] += 1;
                if (col - 1 >= 0)
                    if (tab[row][col - 1] != -1) tab[row][col - 1] += 1;
                if (row + 1 < mxRow && col - 1 >= 0)
                    if (tab[row + 1][col - 1] != -1) tab[row + 1][col - 1] += 1;

                if (row - 1 >= 0)
                    if (tab[row - 1][col] != -1) tab[row - 1][col] += 1;
                if (row + 1 < mxRow)
                    if (tab[row + 1][col] != -1) tab[row + 1][col] += 1;

                if (row - 1 >= 0 && col + 1 < mxCol)
                    if (tab[row - 1][col + 1] != -1) tab[row - 1][col + 1] += 1;
                if (col + 1 < mxCol)
                    if (tab[row][col + 1] != -1) tab[row][col + 1] += 1;
                if (row + 1 < mxRow && col + 1 < mxCol)
                    if (tab[row + 1][col + 1] != -1) tab[row + 1][col + 1] += 1;
            }
        }
    }

    //GENEROWANIE PLANSZY
    const plansza = document.createElement('table');
    plansza.id = "plansza";
    for (let i = 0; i < mxRow; i++) {
        let tr = plansza.insertRow();
        for (let j = 0; j < mxCol; j++) {
            let td = tr.insertCell();
            td.id = ID(i, j);
            if (pz == "latwy" || pz == "normalny") td.className = pz;
            td.setAttribute("onclick", "play(" + i + ", " + j + ")");
            td.setAttribute("oncontextmenu", "flag(" + i + ", " + j + ")");
            td.clicked = false;
            td.flagged = false;
            //td.innerHTML = tab[i][j];
        }
    }
    document.querySelector('main').appendChild(plansza);
}

function odkryj(row, col) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (j == 0 && i == 0) continue;
            let komorka = document.getElementById(ID(i + row, j + col));
            if (komorka && !komorka.clicked && !komorka.flagged) {
                play(i + row, j + col);
                //console.log(tab[i + row][j + col]);
            }
        }
    }
}

function sprawdzFlagi(row, col) {
    let flagi = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (j == 0 && i == 0) continue;
            let komorka = document.getElementById(ID(i + row, j + col));
            if (komorka && komorka.flagged) flagi++;
        }
    }
    if (tab[row][col] == flagi) odkryj(row, col);
}

function play(r, c) {
    if (gameOver) return;
    let komorka = document.getElementById(ID(r, c));
    //console.log("play = " + tab[r][c]);
    //console.log(komorka.clicked);
    if (komorka.clicked) sprawdzFlagi(r, c);
    else if (!komorka.flagged) {
        if (tab[r][c] == -1) detonuj();
        else {
            komorka.innerHTML = tab[r][c];
            komorka.clicked = true;
            komorka.style.backgroundColor = 'rgb(72, 71, 71)';
            komorka.style.color = numColors[tab[r][c]];
            pola--;
        }
        if (tab[r][c] == 0) {
            komorka.innerHTML = "";
            odkryj(r, c);
        }
    }
    //console.log("ODKRYTE = " + pola);
    if (!pola) koniec(true);
}

function flag(r, c) {
    if (gameOver) return;
    let komorka = document.getElementById(ID(r, c));
    if (!komorka.clicked) {
        if (!komorka.flagged) {
            if (flags) {
                komorka.innerHTML = "&#128681";
                flags--;
                komorka.flagged = true;
            }
        } else {
            komorka.innerHTML = "";
            flags++;
            komorka.flagged = false;
        }
        document.getElementById("flaga").innerHTML = "<p>&#128681  " + flags + "</p>";
    }
}

function ID(i, j) {
    return "ROW-" + i + "_COL-" + j;
}

function wyjscie() {
    document.location = 'index.html';
}

function koniec(wygrana) {
    gameOver = true;
    if (wygrana) {
        document.getElementById("gameOver1").innerHTML = "Brawo!";
        document.getElementById("gameOver2").innerHTML = "Runda została wygrana!";
    } else {
        document.getElementById("gameOver1").innerHTML = "Niestety!";
        document.getElementById("gameOver2").innerHTML = "Runda przegrana!";
    }
    let exit = document.getElementById("exit");
    exit.innerHTML = "WYJŚCIE DO MENU GŁÓWNEGO";
    exit.setAttribute("onclick", "wyjscie()");
    exit.id = "exitCSS";
}

function detonuj() {
    for (let i = 0; i < mxRow; i++) {
        for (let j = 0; j < mxCol; j++) {
            let komorka = document.getElementById(ID(i, j));
            if (tab[i][j] == -1 && !komorka.flagged) {
                komorka.style.backgroundColor = 'gray';
                komorka.innerHTML = "&#128163";
            } else if (komorka.flagged && tab[i][j] != -1) komorka.innerHTML = "&#x1F3C1";
        }
    }
    koniec(false);
}

function timing() {
    if (gameOver) {
        clearInterval(timerInterwal);
        return;
    }
    sekundy += 1;
    document.getElementById("czas").innerHTML = "&#8986  " + sekundy + "s";
    //console.log(sekundy);
}