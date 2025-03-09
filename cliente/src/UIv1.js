import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board, player) => {
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        base.style.position = `relative`;  // se le pone posición relativa para que la interfaz de movimiento pueda ser absoluta
        board.forEach(element => element.forEach((element) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            base.appendChild(tile);
            if (element === 5) {
                tile.style.backgroundColor = `green`;
            } else if (element === 1) {
                tile.style.backgroundColor = `red`;
                tile.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
                //para marcar al jugador actual y rotar la flecha según su dirección
                if (player && player.status === 1) {
                    tile.style.border = "8px solid lime";
                    tile.style.transform = `rotate(${player.direction * 90}deg)`;
                }
            } else if (element === 2) {
                tile.style.backgroundColor = `yellow`;
                tile.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
                if (player && player.status === 2) {
                    tile.style.border = "8px solid lime";
                    tile.style.transform = `rotate(${player.direction * 90}deg)`;
                }
            } else if (element === 3) {
                tile.style.backgroundColor = `blue`;
                tile.style.color = `white`;
                tile.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
                if (player && player.status === 3) {
                    tile.style.border = "8px solid lime";
                    tile.style.transform = `rotate(${player.direction * 90}deg)`;
                }
            } else if (element === 4) {
                tile.style.backgroundColor = `purple`;
                tile.style.color = `white`;
                tile.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
                if (player && player.status === 4) {
                    tile.style.border = "8px solid lime";
                    tile.style.transform = `rotate(${player.direction * 90}deg)`;
                }
            }
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));

        // se crea un div para contener los controles de movimiento
        const interfaceControl = document.createElement("div");
        interfaceControl.className = "interface";
        interfaceControl.style.position = `absolute`;
        interfaceControl.style.left = `${(board.length * 100) + 100}px`; //se posiciona a la derecha del tablero
        interfaceControl.style.display = `flex`;
        interfaceControl.style.flexDirection = `column`;
        interfaceControl.style.gap = `1rem`;

        const rotateButton = document.createElement("button");
        rotateButton.classList.add("rotate");
        /* rotateButton.textContent = "rotate"; */
        rotateButton.innerHTML = `<i class="fa-solid fa-rotate-right"></i>`;
        rotateButton.onclick = () => window.gameService.rotatePlayer(player);
        interfaceControl.appendChild(rotateButton);

        const moveButton = document.createElement("button");
        moveButton.classList.add("move");
        /* moveButton.textContent = "move"; */
        moveButton.innerHTML = `<i class="fa-solid fa-up-down-left-right"></i>`;
        moveButton.onclick = () => window.gameService.movePlayer(player);
        interfaceControl.appendChild(moveButton);

        const hitButton = document.createElement("button");
        hitButton.classList.add("hit");
        /* hitButton.textContent = "hit"; */
        hitButton.innerHTML = `<i class="fa-solid fa-crosshairs"></i>`;
        hitButton.onclick = () => window.gameService.hitPlayer(player);
        interfaceControl.appendChild(hitButton);

        // se añade la interfaz al tablero
        base.appendChild(interfaceControl);
    }

}

UIv1.drawBoard();
