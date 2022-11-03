document.addEventListener('DOMContentLoaded', detail);

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

            // 게시글 부분
            let rows = response['worry'];
            let nickname = rows['nickname'];
            let title = rows['title'];
            let desc = rows['desc'];

            document.getElementById('nickname').value = nickname;
            document.getElementById('title').value = title;
            document.getElementById('desc').value = desc;
        }
    });
}