document.addEventListener('DOMContentLoaded', list);

function list() {
    $.ajax({
        type: 'GET',
        url: '/worry/list',
        data: {},
        success: function (response) {
            let rows = response['worries'];
            let recent_rows = [...rows].sort(function (a, b) {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
            let comment_rows = [...rows].sort(function (a, b) {
                        return b.comment.length - a.comment.length;
                    });
            let view_rows = [...rows].sort(function (a, b) {
                        return b.view_count - a.view_count;
                    });

            for (let i = 0; i < rows.length; i++) {
                let board_id = recent_rows[i]['board_id'];
                let nickname = recent_rows[i]['nickname'];
                let title = recent_rows[i]['title'];
                let view_count = recent_rows[i]['view_count'];
                let created_at = recent_rows[i]['created_at'];
                let comment_len = recent_rows[i]['comment'].length;
                let temp_html = `<tr class="table-light">
                                    <th scope="row">${board_id}</th>
                                    <td class="text-start"><a href="/detail?id=${board_id}">${title}<span style="font-size: small">(${comment_len})</span></a></td>
                                    <td class="text-start">${nickname}</td>
                                    <td>${view_count}</td>
                                    <td>${created_at}</td>
                                </tr>`;
                document.getElementById('worry-recent-list').innerHTML += temp_html;
            }
            for (let i = 0; i < rows.length; i++) {
                let board_id = comment_rows[i]['board_id'];
                let nickname = comment_rows[i]['nickname'];
                let title = comment_rows[i]['title'];
                let view_count = comment_rows[i]['view_count'];
                let created_at = comment_rows[i]['created_at'];
                let comment_len = comment_rows[i]['comment'].length;
                let temp_html = `<tr class="table-light">
                                    <th scope="row">${board_id}</th>
                                    <td class="text-start"><a href="/detail?id=${board_id}">${title}<span style="font-size: small">(${comment_len})</span></a></td>
                                    <td class="text-start">${nickname}</td>
                                    <td>${view_count}</td>
                                    <td>${created_at}</td>
                                </tr>`;
                document.getElementById('worry-comment-list').innerHTML += temp_html;
            }
            for (let i = 0; i < rows.length; i++) {
                let board_id = view_rows[i]['board_id'];
                let nickname = view_rows[i]['nickname'];
                let title = view_rows[i]['title'];
                let view_count = view_rows[i]['view_count'];
                let created_at = view_rows[i]['created_at'];
                let comment_len = view_rows[i]['comment'].length;
                let temp_html = `<tr class="table-light">
                                    <th scope="row">${board_id}</th>
                                    <td class="text-start"><a href="/detail?id=${board_id}">${title}<span style="font-size: small">(${comment_len})</span></a></td>
                                    <td class="text-start">${nickname}</td>
                                    <td>${view_count}</td>
                                    <td>${created_at}</td>
                                </tr>`;
                document.getElementById('worry-view-list').innerHTML += temp_html;
            }

        }
    });
}