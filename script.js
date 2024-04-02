var foodies = ["pizza", "burger", "sushi", "pasta", "steak", "salad"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

var timer
var gameInterval; // Variabel untuk menyimpan interval permainan

var hasMoved = false; // Penanda apakah pergeseran sudah terjadi

window.onload = function () {
    startGame();

    //1/10th of a second
    window.setInterval(function () {
        crushFood();
        slideFood();
        generateCandy();
    }, 100);
}

function openPopup() {
    // var result = document.getElementById("result");
    // var score = document.getElementById('score').innerHTML;
    // result.textContent = score;
    // popup.classList.add("open-popup");
    var result = document.getElementById("result");
    var scoreElement = document.getElementById('score');
    var score = parseInt(scoreElement.textContent);

    if (score >= 500) {
        result.textContent = "Kamu Menang!";
    } else {
        result.textContent = "Kamu Kalah!";
    }

    var teksScore = document.getElementById("teksScore")
    teksScore.textContent = "Score : " + score;

    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
    location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    var waktu = 3 * 60; // 3 menit dikonversi ke detik
    var interval = setInterval(function () {
        var menit = parseInt(waktu / 60, 10);
        var detik = parseInt(waktu % 60, 10);

        menit = menit < 10 ? "0" + menit : menit;
        detik = detik < 10 ? "0" + detik : detik;

        document.getElementById('menit').textContent = menit;
        document.getElementById('detik').textContent = detik;

        if (--waktu < 0) {
            clearInterval(interval); // Hentikan hitung mundur
            clearInterval(gameInterval); // Hentikan interval permainan

            openPopup()

            // Opsional: Mencegah interaksi lebih lanjut
            board.forEach(row => row.forEach(tile => {
                tile.removeAttribute("draggable");
                tile.removeEventListener("dragstart", dragStart);
                // Hapus event listener lain jika perlu
            }));
        }
    }, 1000); // Update setiap detik

    // Fungsi untuk memutar atau menghentikan musik
    const audio = new Audio();
    audio.src = "backsound.mp3";
    audio.loop = true;

    let iconMusik = document.getElementById("musik-icon");
    let btnMusik = document.querySelector(".musik");

    btnMusik.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            iconMusik.src = "pausebtn.png";
        } else {
            audio.pause();
            iconMusik.src = "playbutton.png";
        }
    });
});




function randomCandy() {
    return foodies[Math.floor(Math.random() * foodies.length)]; //0 - 5.99
}

function startGame() {

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = randomCandy() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver); //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (validMove) {
            hasMoved = true; // Setelah pergerakan valid pertama, ubah hasMoved menjadi true
        } else {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

function crushFood() {
    if (!hasMoved) {
        return; // Jika belum ada pergerakan yang valid, jangan lakukan apa-apa
    }
    //crushFive();
    //crushFour();
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./blank.png";
                candy2.src = "./blank.png";
                candy3.src = "./blank.png";
                candy4.src = "./blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./blank.png";
                candy2.src = "./blank.png";
                candy3.src = "./blank.png";
                candy4.src = "./blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function slideFood() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = randomCandy() + ".png";
        }
    }
}

// // Global variable untuk mengontrol audio
// const audio = new Audio();
// audio.src = "backsound.mp3";
// audio.loop = true;


// document.getElementById('btnMusik').addEventListener('click', function() {
//     if (audio.paused) {
//         audio.play(); // Memainkan musik
//         this.textContent = "Pause Music"; // Opsi untuk mengganti teks tombol saat musik diputar
//     } else {
//         audio.pause(); // Menjeda musik
//         this.textContent = "Play Music"; // Opsi untuk mengganti teks tombol saat musik dijeda
//     }

// });