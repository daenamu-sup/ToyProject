document.addEventListener('DOMContentLoaded', detail);
document.getElementById('edit-btn').addEventListener('click', edit)

// url에서 board_id 가져오기
const param = window.location.search;
const paramData = new URLSearchParams(param);
const board_id = paramData.get('id');

// 서버로부터 데이터 받아오기
function detail() {
    $.ajax({
        type: 'GET',
        url: '/worry/detail?id=' + board_id,
        data: {},
        success: function (response) {

            let rows = response['worry'];
            let nickname = rows['nickname'];
            let title = rows['title'];
            let desc = rows['desc'];

            // 받아온 데이터 input 태그로 출력
            document.getElementById('nickname').value = nickname;
            document.getElementById('title').value = title;
            document.getElementById('desc').value = desc;
        }
    });
}

// 비밀번호가 일치하는지 확인하고 업데이트
function edit() {
    let nickname = document.getElementById('nickname').value;
    let title = document.getElementById('title').value;
    let password = document.getElementById('password').value;
    let desc = document.getElementById('desc').value;

    $.ajax({
        type: 'POST',
        url: '/worry/edit',
        data: {
            board_id_give: board_id,
            nickname_give: nickname,
            title_give: title,
            password_give: password,
            desc_give: desc,
        },
        success: function (response) {

            // 비밀번호가 일치하여 update 되었으면, 해당 detail 페이지로 이동
            if (response['msg']) {
                window.location.replace('/detail?id=' + board_id);
            }
            // 비밀번호가 일치하지 않으면, alert
            else {
                alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.')
                document.getElementById('password').value ='';
            }
        }
    })
}