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
            } else if (element === 2) {
                tile.style.backgroundColor = `yellow`;
            } else if (element === 3) {
                tile.style.backgroundColor = `blue`;
            } else if (element === 4) {
                tile.style.backgroundColor = `purple`;
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
        interfaceControl.style.display = `flex`;
        interfaceControl.style.gap = `1rem`;

        const rotateButton = document.createElement("button");
        rotateButton.classList.add("rotate");
        rotateButton.textContent = "rotate";
        rotateButton.onclick = () => player.rotate();
        interfaceControl.appendChild(rotateButton);

        const moveButton = document.createElement("button");
        moveButton.classList.add("move");
        moveButton.textContent = "move";
        moveButton.onclick = () => player.move();
        interfaceControl.appendChild(moveButton);

        const hitButton = document.createElement("button");
        hitButton.classList.add("hit");
        hitButton.textContent = "hit";
        hitButton.onclick = () => player.hit();
        interfaceControl.appendChild(hitButton);
    }

}

UIv1.drawBoard();

