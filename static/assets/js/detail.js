document.addEventListener('DOMContentLoaded', detail);
document.getElementById('pw-check-submit').addEventListener('click', ()=> {pw_check(edit_or_del)});

// url에서 board_id 가져오기
const param = window.location.search;
const paramData = new URLSearchParams(param)
const board_id = paramData.get('id')

// 서버로부터 데이터 받아오기
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

// 수정, 삭제 버튼 클릭 시 비밀번호 확인 하는 Modal창 띄우기
let edit_or_del = '';
document.getElementById('modal-btn-zone').addEventListener('click', (e)=> {
    edit_or_del = e.target.id;
    if (e.target.classList.contains('modal-btn')) {
        document.getElementById('pw-check-modal-btn').click();
        document.getElementById('pw-check').focus();
    }
})

// 비밀번호가 일치하는지 확인
function pw_check(edit_or_del) {
    const pw_check_elem = document.getElementById('pw-check');
    let password = pw_check_elem.value;

    // 입력칸이 빈 칸이면, 안내 문구 출력
    if (password === '') {
        document.getElementById('pw-check-fail').innerText = '비밀번호를 입력해주세요.';
        pw_check_elem.value = '';
    }
    // 입력칸이 빈 칸이 아니라면, ajax 호출
    else {
        $.ajax({
            type: 'POST',
            url: '/worry/pw_check',
            data: {
                board_id_give: board_id,
                password_give: password,
            },
            success: function (response) {

                // 비밀번호가 일치하고, edit 버튼을 클릭 했으면 edit.html로 board_id를 가지고 이동
                if (response['msg'] && edit_or_del === 'edit-btn') {
                    window.location.replace('/edit?id=' + board_id);
                }
                // 비밀번호가 일치하고, del 버튼을 클릭 했으면 alert
                else if (response['msg'] && edit_or_del === 'del-btn') {
                    alert('정말 삭제하시겠습니까?');
                }
                // 비밀번호가 일치하지 않으면, 안내 문구 출력
                else {
                    document.getElementById('pw-check-fail').innerText = '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.'
                    pw_check_elem.value = '';
                    pw_check_elem.focus();
                }
            }
        });
    }
}