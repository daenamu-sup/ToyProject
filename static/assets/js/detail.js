document.addEventListener('DOMContentLoaded', detail);

// url에서 board_id 가져오기
const param = window.location.search;
const paramData = new URLSearchParams(param)
const board_id = paramData.get('id')

function detail() {
    $.ajax({
        type: 'GET',
        url: '/worry/detail?id=' + board_id,
        data: {},
        success: function (response) {

            // 게시글 부분
            document.getElementById('worry-detail').innerHTML = '';
            let rows = response['worry'];
            let board_id = rows['board_id'];
            let nickname = rows['nickname'];
            let password = rows['password'];
            let title = rows['title'];
            let desc = rows['desc'];
            let view_count = rows['view_count'];
            let created_at = rows['created_at'];

            let temp_html = `<h2 class="title border-bottom-line ps-2 pb-4 mb-4">${title}</h2>
                              <div class="meta-top">
                                <ul class="d-flex p-0 justify-content-between">
                                  <li class="d-flex align-items-center mx-2"><div class="post-img"><img src="/static/assets/img/blog/comments-1.png" alt="board-img" class="rounded-circle"></div>${nickname}</li>
                                  <li class="d-flex align-items-center mx-2">
                                    <div class="me-3"><i class="bi bi-eye me-1"></i><a href="blog-details.html">${view_count}</a></div>
                                    <div><i class="bi bi-clock me-1"></i><time datetime="2020-01-01">${created_at}</time></div>
                                  </li>
                                </ul>
                              </div><!-- End meta top -->
                
                              <div class="content my-4">
                                <p>${desc}</p>
                              </div><!-- End post content -->
                
                              <div class="text-center mt-5">
                                <div class="btn-group">
                                  <button type="button" class="btn btn-secondary">수정</button>
                                </div>
                                <div class="btn-group">
                                  <button type="button" class="btn btn-secondary">삭제</button>
                                </div>
                                <div class="btn-group">
                                  <a href="/" class="btn btn-secondary">목록</a>
                                </div>
                              </div><!-- End button group -->`;
            document.getElementById('worry-detail').innerHTML += temp_html;

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