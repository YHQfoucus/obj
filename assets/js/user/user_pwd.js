$(function(){
    let form = layui.form;

// --------------- 表单验证 -----------------
form.verify({
    // key: value
    // 验证规则: []
    // 验证规则: function

    // 验证长度 6~12位
    pass: [/^\S{6,12}$/, '长度必须6到12位，不能有空格'],  // {6,12}不能出现空格

    // 验证新密码不能和原密码相同
    newPass: function (value) {
        // value 表示新密码
        
        // 获取原密码
        let oldPwd = $('[name=oldPwd]').val();
        
        if (value === oldPwd) {
            return '新密码不能和原密码相同';
        }
    },

    // 验证两次新密码必须相同
    rePass: function (value) {
        // value 表示确认密码
        
        // 获取新密码
        let newPwd = $('[name=newPwd]').val();
        
        if (newPwd !== value) {
            return '两次密码不一致';
        }
    }
});

$('form').on('submit',function(e){
e.preventDefault()
let data = $(this).serialize()
$.ajax({
    type:'POST',
    url:'/my/updatepwd',
    data,
    success:function(res){
        console.log(res);
        if(res.status!==0){
            return layer.msg(res.message)
        }
        layer.msg('更新密码成功')
        $('form')[0].reset()
    }
})
})
})