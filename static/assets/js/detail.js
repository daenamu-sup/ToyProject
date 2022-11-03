document.addEventListener('DOMContentLoaded', detail);

// url에서 board_id 가져오기
const param = window.location.search;
const paramData = new URLSearchParams(param)
const board_id = paramData.get('id')

// 서버에서 detail 데이터 가져오기
function detail() {
    $.ajax({
        type: 'GET',
        url: '/worry/detail?id=' + board_id,
        data: {},
        success: function (response) {

            // 게시글 부분
            let rows = response['worry'];
            let nickname = rows['nickname'];
            let title = rows['title'];
            let desc = rows['desc'];
            let view_count = rows['view_count'];
            let created_at = rows['created_at'];

            document.getElementById('nickname').innerText = nickname;
            document.getElementById('title').innerText = title;
            document.getElementById('desc').innerText = desc;
            document.getElementById('view_count').innerText = view_count;
            document.getElementById('created_at').innerText = created_at;

            // 댓글 부분
            document.getElementById('comment').innerHTML = '';
            let comment = rows['comment'];
            for (let i = 0; i < comment.length; i++) {
                let comment_id = comment[i]['comment_id'];
                let comment_nickname = comment[i]['nickname'];
                let comment_password = comment[i]['password'];
                let comment_desc = comment[i]['desc'];
                let comment_created_at = comment[i]['created_at'];
                let comment_likes =comment[i]['likes'];

                let temp_html = `<div class="comment mb-4 border-bottom">
                                    <div class="d-flex">
                                      <div class="comment-img"><img src="/static/assets/img/blog/comments-1.png" alt="comment-img" class="rounded-circle"></div>
                                      <div class="w-100">
                                        <div>${comment_nickname}</div>
                                        <div class="small text-muted mb-2">${comment_created_at}</div>
                                        <p>${comment_desc}</p>
                                        <div class="mb-4">
                                          <a href="#" class="text-muted">수정</a>
                                          <a href="#" class="text-muted">삭제</a>
                                        </div>
                                      </div>
                                    </div>
                                </div>`;
                document.getElementById('comment').innerHTML += temp_html;
            }
        }
    });
}