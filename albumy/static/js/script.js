$(function () {

    var default_error_massage ='Serve error, please try again later';


    // csrf处理
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader('X-CSRFToken', csrf_token);
            }
        }
    });


    // 统一处理error回调函数，获取消息提示
    $(document).ajaxError(function (event, request, settings) {
        var message = null;
        if (request.responseJSON && request.responseJSON.hasOwnProperty('message')) {
            message = request.responseJSON.message;
        } else if (request.responseText) {
            var IS_JSON = true;
            try {
                var data = JSON.parse(request.responseText); // 作为JSON解析
            }
            catch (err) {
                IS_JSON = false;
            }

            if (IS_JSON && data !== undefined && data.hasOwnProperty('message')) {
                message = JSON.parse(request.responseText).message;
            } else {
                message = default_error_massage; // 使用默认错误消息
            }
        } else {
            message = default_error_massage;
        }
        toast(message, 'error'); // 弹出消息提醒
    });


    // toast消息弹窗
    var flash = null;
    function toast(body, category) {
        clearTimeout(flash);
        var $toast = $('#toast');
        if (category === 'error') {
            $toast.css('background-color','red')
        } else {
            $toast.css('background-color', '#333')
        }
        $toast.text(body).fadeIn();
        flash = setTimeout(function () {
            $toast.fadeOut();
        }, 3000);
    }


    // 更新关注者数量
    function update_followers_count(id) {
        var $el = $('#followers-count-' + id);
        $.ajax({
            type: 'GET',
            url: $el.data('href'),
            success: function (data) {
                $el.text(data.count);
            }
        });
    }

    // 关注
    function follow(e) {
        var $el = $(e.target);
        var id = $el.data('id');

        $.ajax({
            type: 'POST',
            url: $el.data('href'),
            success: function (data) {
                $el.prev().show();
                $el.hide();
                update_followers_count(id);
                toast('User followed.');
            },
            error: function (error) {
                toast(default_error_massage);
            }
        });
    }

    // 取消关注
    function unfollow(e) {
        var $el = $(e.target);
        var id = $el.data('id');
        $.ajax({
            type: 'POST',
            url: $el.data('href'),
            success: function (data) {
                $el.next().show();
                $el.hide();
                update_followers_count(id);
                toast(data.message);
            },
            error: function (error) {
                toast(default_error_massage);
            }
        })
    }


    var hover_timer = null;

    // 用户头像资料卡(鼠标进入处理事件)
    function show_profile_popover(e) {
        var $el = $(e.target);

        hover_timer = setTimeout(function () {
            hover_timer = null;  // 完成鼠标移进去的动作就把计时器释放
            $.ajax({
                type: 'GET',
                url: $el.data('href'),
                success: function (data) {
                    $el.popover({
                        html: true,
                        content: data,
                        trigger: 'manual',
                        animation: true
                    });
                    $el.popover('show');

                    // 鼠标离开弹出的框后(需要单独关闭)
                    $('.popover').on('mouseleave', function () {
                        setTimeout(function () {
                            $el.popover('hide');
                        }, 200);

                    });
                },
                error: function (error) {
                    toast('server error, please try again later.');
                }
            });
        }, 500);

    }


    // 用户头像资料卡(鼠标离开事件)
    function hide_profile_popover(e) {
        var $el = $(e.target);

        if (hover_timer) {    // 如果之前的计时器还存在，就说明鼠标移入时不足500ms，先把计时器清零并释放
            clearTimeout(hover_timer);
            hover_timer = null;
        } else {
            setTimeout(function () {
                if (!$('.popover:hover').length) {
                    $el.popover('hide');
                }
            }, 200)
        }
    }


    // ajax获取用户未读消息
    function update_notifications_count () {
        var $el = $('#notification-badge');
        $.ajax({
            type: 'GET',
            url: $el.data('href'),
            success: function (data) {
                if (data.count === 0) {
                    $el.hide();
                } else {
                    $el.show();
                    $el.text(data.count);
                }
            }
        });
    }


    // ajax获取图片收藏数
    function update_collectors_count(id) {
        $.ajax({
            type: 'GET',
            url: $('#collectors-count-' + id).data('href'),
            success: function (data) {
                console.log(data);
                $('#collectors-count-' + id).text(data.count);
            }
        });
    }

    // 首页ajax按钮收藏图片
    function collect (e) {
        var $el = $(e.target);
        var id = $el.data('id');
        $.ajax({
            type: 'POST',
            url: $el.data('href'),
            success: function (data) {
                $el.prev().show();
                $el.hide();
                update_collectors_count(id);
                toast(data.message);
            }
        });
    }

    // 首页ajax按钮取消收藏图片
    function uncollect (e) {
        var $el = $(e.target);
        var id = $el.data('id');
        $.ajax({
            type: 'POST',
            url: $el.data('href'),
            success: function (data) {
                $el.next().show();
                $el.hide();
                update_collectors_count(id);
                toast(data.message);
            }
        });
    }


    // 头像和昵称弹窗动作绑定
    $('.profile-popover').hover(show_profile_popover.bind(this), hide_profile_popover.bind(this));
    // ajax动作绑定
    $(document).on('click', '.follow-btn', follow.bind(this));
    $(document).on('click', '.unfollow-btn', unfollow.bind(this));
    $(document).on('click', '.collect-btn', collect.bind(this));
    $(document).on('click', '.uncollect-btn', uncollect.bind(this));


    // 隐藏或显示图片标签
    $('#tag-btn').click(function () {
        $('#tags').hide();
        $('#tag-form').show();
    });
    $('#cancel-tag').click(function () {
        $('#tag-form').hide();
        $('#tags').show();
    });
    // 隐藏或显示图片描述
    $('#description-btn').click(function () {
        $('#description').hide();
        $('#description-form').show();
    });
    $('#cancel-description').click(function () {
        $('#description-form').hide();
        $('#description').show();
    });

    // 删除模态框确认
    $('#confirm-delete').on('show.bs.modal', function (e) {
        $('.delete-form').attr('action', $(e.relatedTarget).data('href'));
    });

    // 30s拉取一次用户未读消息数
    if (is_authenticated) {
        setInterval(update_notifications_count, 30000)
    }

    $("[data-toggle='tooltip']").tooltip({title: moment($(this).data('timestamp')).format('lll')})

});
