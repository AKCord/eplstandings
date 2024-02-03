    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

function searchTable() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#table-body tr');

    rows.forEach(row => {
        const teamName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = teamName.includes(searchTerm) ? 'table-row' : 'none';
    });
}

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})


function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}
     function fetchAndDisplayLeagueTable() {
        fetch('https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2023-2024')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); 

                if (data.table) {
                    const tableBody = document.getElementById('table-body');
                    data.table.forEach((rowData, index) => {
                        const position = index + 1;
                        const last5MatchesHTML = getLast5MatchesHTML(rowData.strForm);
                        const logoUrl = getValueOrDefault(rowData.strTeamBadge, 'https://via.placeholder.com/50');

                        const row = `
                            <tr>
                                <td>${position}</td>
                                <td><img src="${logoUrl}" alt="Team Logo">${getValueOrDefault(rowData.strTeam, 'N/A')}</td>
                                <td>${getValueOrDefault(rowData.intPlayed, 0)}</td>
                                <td>${getValueOrDefault(rowData.intWin, 0)}</td>
                                <td>${getValueOrDefault(rowData.intDraw, 0)}</td>
                                <td>${getValueOrDefault(rowData.intLoss, 0)}</td>
                                <td>${getValueOrDefault(rowData.intGoalsFor, 0)}</td>
                                <td>${getValueOrDefault(rowData.intGoalsAgainst, 0)}</td>
                                <td>${getValueOrDefault(rowData.intGoalDifference, 0)}</td>
                                <td><b>${getValueOrDefault(rowData.intPoints, 0)}</b></td>
                                <td>${last5MatchesHTML}</td>
                            </tr>
                        `;
                        tableBody.insertAdjacentHTML('beforeend', row);
                    });
                } else {
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'No league table available for the selected season.';
                }
            })
            .catch(error => {
                console.error('Error fetching league table data:', error);
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'An error occurred while fetching league table data. Please try again.';
            });
    }

    function getLast5MatchesHTML(strForm) {
        const matches = strForm.split('');
        let html = '';

        matches.forEach(match => {
            if (match === 'W') {
                html += '<img src="images/win.png" alt="Win" style="">';
            } else if (match === 'L') {
                html += '<img src="images/loss.png" alt="Loss">';
            } else if (match === 'D') {
                html += '<img src="images/draw.png" alt="Draw">';
            }
        });

        return html;
    }

    function getValueOrDefault(value, defaultValue) {
        return value || defaultValue;
    }

    fetchAndDisplayLeagueTable();