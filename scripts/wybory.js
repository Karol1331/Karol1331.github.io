function poziom(wybor) {
    localStorage.setItem("p/c", "poziom");
    switch (wybor) {
        case 'latwy':
            localStorage.setItem("trudnosc", "latwy");
            break;
        case 'normalny':
            localStorage.setItem("trudnosc", "normalny");
            break;
        case 'trudny':
            localStorage.setItem("trudnosc", "trudny");
            break;
    }
    document.location = 'gra.html';
}

function custom() {
    localStorage.setItem("p/c", "custom");
    localStorage.setItem("szer", document.getElementById("szer").value);
    localStorage.setItem("wys", document.getElementById("wys").value);
    localStorage.setItem("bombs", document.getElementById("bomby").value);
    if (document.getElementById("szer").value < 2 || document.getElementById("wys").value < 2 || document.getElementById("bomby").value < 1) {
        localStorage.clear();
        document.querySelector("#error").innerHTML = "Szerokość i wysokość musi być większa od 2, a bomb musi być więcej niż 1";
    } else if (document.getElementById("szer").value * document.getElementById("wys").value <= document.getElementById("bomby").value) {
        localStorage.clear();
        document.querySelector("#error").innerHTML = "Liczba bomb nie może być taka sama lub większa co liczba pól";
    } else document.location = 'gra.html';
}