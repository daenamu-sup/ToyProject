document.addEventListener('DOMContentLoaded', list);

let sort_keyword = "worry-recent-list"

function recent() {
    sort_keyword = "worry-recent-list";
    list();
}
function comment() {
    sort_keyword = "worry-comment-list";
    list();
}
function view() {
    sort_keyword = "worry-view-list";
    list();
}

function list() {
    document.getElementById('worry-recent-list').innerHTML = '';
    document.getElementById('worry-comment-list').innerHTML = '';
    document.getElementById('worry-view-list').innerHTML = '';
    $.ajax({
        type: 'GET',
        url: '/worry/list',
        data: {},
        success: function (response) {
            let rows = response['worries'];

            if (sort_keyword === "worry-recent-list") {
                rows.sort(function (a, b) {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                });
            } else if (sort_keyword === "worry-comment-list") {
                rows.sort(function (a, b) {
                    return b.comment.length - a.comment.length;
                });
            } else if (sort_keyword === "worry-view-list") {
                rows.sort(function (a, b) {
                    return b.view_count - a.view_count;
                });
            }
            for (let i = 0; i < rows.length; i++) {
                let board_id = rows[i]['board_id'];
                let nickname = rows[i]['nickname'];
                let title = rows[i]['title'];
                let view_count = rows[i]['view_count'];
                let created_at = rows[i]['created_at'];
                let comment_len = rows[i]['comment'].length;
                let temp_html = `<tr class="table-light">
                                    <th scope="row">${board_id}</th>
                                    <td class="text-start"><a href="/detail?id=${board_id}">${title}<span style="font-size: small">(${comment_len})</span></a></td>
                                    <td class="text-start">${nickname}</td>
                                    <td>${view_count}</td>
                                    <td>${created_at}</td>
                                </tr>`;
                document.getElementById(sort_keyword).innerHTML += temp_html;
            }

        }
    });
}