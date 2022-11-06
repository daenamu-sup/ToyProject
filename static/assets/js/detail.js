document.addEventListener('DOMContentLoaded', detail);
document.getElementById('pw-check-submit').addEventListener('click', ()=> {pw_check(edit_or_del)});
document.getElementById('co-sbm-btn').addEventListener('click', co_create);

// url에서 board_id 가져오기
const param = window.location.search;
const paramData = new URLSearchParams(param)
const board_id = paramData.get('id')

// 서버로부터 게시글 데이터 받아오기
function detail() {
    $.ajax({
        type: 'GET',
        url: '/worry/detail?id=' + board_id,
        data: {},
        success: function (response) {

            // 해당 게시글이 삭제되지 않았으면, 화면에 출력
            if (response['msg']) {
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
                    let comment_desc = comment[i]['desc'];
                    let comment_created_at = comment[i]['created_at'];
                    let comment_likes = comment[i]['likes'];

                    let temp_html = `<div class="comment mb-4 border-bottom">
                                    <div class="d-flex">
                                      <div class="comment-img"><img src="/static/assets/img/blog/comments-1.png" alt="comment-img" class="rounded-circle"></div>
                                      <div class="w-100 comment-text">
                                        <div class="co-nickname">${comment_nickname}</div>
                                        <div class="small text-muted mb-2 co-created-at">${comment_created_at}</div>
                                        <p class="co-desc">${comment_desc}</p>
                                        <div class="mb-4">
                                          <a href="#" class="text-muted co-edit-btn" data-id="${comment_id}">수정</a>
                                          <a href="#" class="text-muted co-del-btn" data-id="${comment_id}">삭제</a>
                                        </div>
                                      </div>
                                    </div>
                                </div>`;
                    document.getElementById('comment').innerHTML += temp_html;
                }
            }
            // 해당 게시글이 삭제 되었으면, alert 띄우고 메인 페이지로 이동
            else {
                alert('삭제된 게시글입니다.')
                window.location.replace('/');
            }
        }
    });
}

// 게시글 수정, 삭제 버튼 클릭 시 비밀번호 확인 하는 Modal창 띄우기
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
                // 비밀번호가 일치하고, del 버튼을 클릭 했으면 alert 띄우고 del 함수 호출
                else if (response['msg'] && edit_or_del === 'del-btn') {
                    if (confirm('정말 삭제하시겠습니까?')) {
                        del(board_id);
                    }
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


// 삭제여부 확인하고 게시글 삭제(deleted_at 업데이트)
function del(board_id) {
    $.ajax({
        type: 'POST',
        url: '/worry/delete',
        data: {
            board_id_give: board_id,
        },
        success: function (response) {

            // 삭제(deleted_at 업데이트)에 성공하면, alert 띄우고 메인 페이지로 이동
            if (response['msg']) {
                alert('게시글이 삭제되었습니다.');
                window.location.replace('/');
            }
            // 삭제(deleted_at 업데이트)에 실패하면, 안내 alert
            else {
                alert('문제가 발생했습니다. 관리자에게 문의해 주세요.');
            }
        }
    });
}

// 서버로 댓글 데이터 보내기
function co_create() {
    let nickname = document.getElementById('co-nickname').value;
    let password = document.getElementById('co-password').value;
    let desc = document.getElementById('co-desc').value;

    $.ajax({
        type: 'POST',
        url: '/comment/create',
        data: {
            board_id_give: board_id,
            co_nickname_give: nickname,
            co_password_give: password,
            co_desc_give: desc,
        },
        success: function (response) {
            alert(response['msg']);
            detail();
            document.getElementById('co-nickname').value = '';
            document.getElementById('co-password').value = '';
            document.getElementById('co-desc').value = '';
        }
    });
}


// 댓글 수정, 삭제
let nickname = '';
let created_at = '';
let desc = '';
document.getElementById('comment').addEventListener('click', (e)=>{
    let comment_id = e.target.dataset.id;
    const comment_text_elem = e.target.parentElement.parentElement;

    // 수정 입력폼을 위한 수정 버튼 클릭
    if (e.target.classList.contains('co-edit-btn')) {
        e.preventDefault();
        nickname = comment_text_elem.querySelector('.co-nickname').innerText;
        created_at = comment_text_elem.querySelector('.co-created-at').innerText;
        desc = comment_text_elem.querySelector('.co-desc').innerText;
        let temp_html = `<div class="reply-form m-0 p-0">
                              <div class="row">
                                <div class="col-md-6 form-group">
                                  <input type="text" class="form-control co-nickname" placeholder="닉네임" value="${nickname}" disabled>
                                  <small class="text-muted p-2">닉네임은 변경할 수 없습니다.</small>
                                </div>
                                <div class="col-md-6 form-group">
                                  <input type="password" class="form-control co-password" placeholder="비밀번호 확인">
                                </div>
                              </div>
                              <div class="row">
                                <div class="col form-group">
                                  <textarea class="form-control co-desc" placeholder="따뜻한 댓글은 작성자에게 큰 힘이 됩니다 :)">${desc}</textarea>
                                </div>
                              </div>
                              <div class="mb-4">
                                <a href="#" class="text-muted co-edit-sbm-btn" data-id="${comment_id}">수정</a>
                                <a href="#" class="text-muted co-cancel-btn" data-id="${comment_id}">취소</a>
                              </div>
                          </div>`;
        comment_text_elem.innerHTML = temp_html;
    }

    // 댓글 수정 버튼 클릭
    if (e.target.classList.contains('co-edit-sbm-btn')) {
        e.preventDefault();
        const password_elem = e.target.parentElement.parentElement.querySelector('.co-password');
        const desc_elem = e.target.parentElement.parentElement.querySelector('.co-desc');

        // 비밀번호 입력칸이 빈 칸이면, alert
        if (password_elem.value === '') {
            alert('댓글 비밀번호를 입력해 주세요.');
        }
        // 내용 입력칸이 빈 칸이면, alert
        else if (desc_elem.value === '') {
            alert('댓글 내용을 입력해 주세요.');
        }
        // 입력칸이 빈 칸이 아니면, ajax콜 하는 함수 호출
        else {
            co_edit(comment_id, password_elem, desc_elem);
        }
    }

    // 댓글 수정 취소 버튼 클릭
    if (e.target.classList.contains('co-cancel-btn')) {
        e.preventDefault();
        let temp_html = `<div class="co-nickname">${nickname}</div>
                            <div class="small text-muted mb-2 co-created-at">${created_at}</div>
                            <p class="co-desc">${desc}</p>
                            <div class="mb-4">
                              <a href="#" class="text-muted co-edit-btn" data-id="${comment_id}">수정</a>
                              <a href="#" class="text-muted co-del-btn" data-id="${comment_id}">삭제</a>
                            </div>`;
        comment_text_elem.parentElement.innerHTML = temp_html;
    }
})

// 서버로 수정할 댓글 데이터 보내기
function co_edit(comment_id, password_elem, desc_elem) {
    $.ajax({
        type: 'POST',
        url: '/comment/edit',
        data: {
            board_id_give: board_id,
            co_comment_id_give: comment_id,
            co_password_give: password_elem.value,
            co_desc_give: desc_elem.value,
        },
        success: function (response) {

            // 비밀번호가 일치하여 update 되었으면, alert 띄우고 detail 함수 호출
            if (response['msg']) {
                alert('댓글 수정 완료!');
                detail();
            }
            // 비밀번호가 일치하지 않으면, alert
            else {
                alert('비밀번호가 일치하지 않슴니다. 다시 확인해 주세요.')
                password_elem.value = '';
            }
        }
    })
}