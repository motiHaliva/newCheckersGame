const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} : ${seconds}`;
}

    const statsContainer = document.querySelector('#stats-container');
    const currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
    const h1 = document.querySelector('h1');
    h1.textContent += ` ${currentPlayer.name}!`;
    if (currentPlayer) {
        const statsHTML = `
            <div class="stat-card">
                <span>Name:</span>
                <span>${currentPlayer.name}</span>
            </div>
            <div class="stat-card">
                <span>Total Wins:</span>
                <span>${currentPlayer.wins || 0}</span>
            </div>
            <div class="stat-card">
                <span>Total Losses:</span>
                <span>${currentPlayer.losses || 0}</span>
            </div>
               <div class="stat-card">
                <span>Total Play Time:</span>
                <span>${formatTime(currentPlayer.playTime || 0)}</span>
            </div>
        
        `;
        statsContainer.innerHTML = statsHTML;
    }

    document.querySelector('#back-btn').addEventListener('click', () => {
        window.location.href = 'start.html';


});

