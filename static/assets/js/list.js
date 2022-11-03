document.addEventListener('DOMContentLoaded', list);

function list() {
    $.ajax({
        type: 'GET',
        url: '/worry/list',
        data: {},
        success: function (response) {
            let rows = response['worries'];
            for (let i = 0; i < rows.length; i++) {
                let board_id = rows[i]['board_id'];
                let nickname = rows[i]['nickname'];
                let title = rows[i]['title'];
                let view_count = rows[i]['view_count'];
                let created_at = rows[i]['created_at'];

                let temp_html = `<tr class="table-light">
                                    <th scope="row">${board_id}</th>
                                    <td class="text-start"><a href="/detail?id=${board_id}">${title}</a></td>
                                    <td class="text-start">${nickname}</td>
                                    <td>${view_count}</td>
                                    <td>${created_at}</td>
                                </tr>`;
                document.getElementById('worry-list').innerHTML += temp_html;
            }

        }
    });
}