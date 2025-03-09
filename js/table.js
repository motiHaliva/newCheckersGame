
    const leaderboardBody = document.querySelector('#leaderboard-body');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // מיון המשתמשים לפי מספר הנצחונות בסדר יורד
    const sortedUsers = users
        .map(user => ({
            ...user,
            winRate: calculateWinRate(user)
        }))
        .sort((a, b) => (b.wins || 0) - (a.wins || 0))
        .slice(0, 10); // לקיחת 10 השחקנים הראשונים
    
    // יצירת שורות הטבלה
    sortedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        let rankClass = '';
        if (index === 0) {
            rankClass = 'rank-1';
        } else if (index === 1) {
            rankClass = 'rank-2';
        } else if (index === 2) {
            rankClass = 'rank-3';
        }
        row.innerHTML = `
            <td class="${rankClass}">${index + 1}</td>
            <td class="${rankClass}">${user.name}</td>
            <td>${user.wins || 0}</td>
            <td>${user.losses || 0}</td>
            <td>${formatPlayTime(user.playTime || 0)}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
    
    // כפתור חזרה לתפריט
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'start.html';
    });

// פונקציה לחישוב אחוז הנצחונות
function calculateWinRate(user) {
    const totalGames = (user.wins || 0) + (user.losses || 0);
    if (totalGames === 0) return 0;
    return Math.round((user.wins || 0) * 100 / totalGames);
}

// פונקציה להמרת שניות לפורמט קריא
function formatPlayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}