function save_worry() {
            let nickname = $('#nickname').val();
            let title = $('#title').val();
            let password = $('#password').val();
            let desc = $('#desc').val();
            $.ajax({
                type: 'POST',
                url: '/worry/create',
                data: {
                    nickname_give: nickname,
                    title_give: title,
                    password_give: password,
                    desc_give: desc,
                },
                success: function (response) {
                    alert(response['msg']);
                    window.location.replace('/')
                }
            })
        }