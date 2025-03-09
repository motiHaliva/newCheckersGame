// document.addEventListener('DOMContentLoaded', () => {
//     const loadButton = document.querySelector('#id_button_load');
//     const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    
//     if (loadButton) {
//         const hasSavedGame = localStorage.getItem(`gameState_${currentPlayer.name}`);
        
//         if (hasSavedGame) {
//             loadButton.style.display = 'block';
//             loadButton.addEventListener('click', () => {
//                 window.location.href = 'game1.html?load=true';
//             });
//         } else {
//             loadButton.style.display = 'none';
//         }
//     }
// });
document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.querySelector('#id_button_load');
    if (!loadButton) return;

    const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    if (!currentPlayer) {
        loadButton.style.display = 'none';
        return;
    }

    const hasSavedGame = localStorage.getItem(`gameState_${currentPlayer.name}`);
    if (hasSavedGame) {
        loadButton.style.display = 'block';
        loadButton.addEventListener('click', () => {
            // שינוי הנתיב היחסי
            window.location.href = './game1.html?load=true';
        });
    } else {
        loadButton.style.display = 'none';
    }
});