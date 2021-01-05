getUserInfo ()
function getUserInfo (){
    $.ajax({
        url:'/my/userinfo',
        // headers:{
        //    //设置请求头
        //    Authorization:localStorage.getItem('token'),
        // },
        success:function(res){
            console.log(res)
            if(res.status!==0){
                //获取用户信息
                return layer.msg('获取用户信息失败');
            }
         renderUserInfo(res.data)
        },
        // complete:function(xhr){
        //     //请求不论是成功还是失败都会执行
        //     //responseJSON 这是服务器响应回来的数据
        //     // console.log(xhr);

        //     if(xhr.responseJSON.status===1 && xhr.responseJSON.message==='身份认证失败'){
        //         //token 有问题，身份认证失败
        //         //跳转回login页面 ，需要重新登录才能进入index页面
        //         location.href='/home/login.html'
        //     }
        // }
    })
}
function renderUserInfo(data){
// console.log(data);
//先处理名字
console.log(data)

//需要将登录名称和昵称做优先级的处理，有限展示昵称
let name = data.nickname || data.username

//把文字中的第一个字符取出来 作为头像
let first=name[0].toUpperCase()
// console.log(name);

//显示名字
$('#welcome').text('欢迎'+name)

//处理头像
if(data.user_pic){
$('.layui-nav-img').attr('src',data.user_pic).show()
$('.text-avatar').hide()
}else{
    $('.layui-nav-img').hide()
    $('.text-avatar').text(first).show()
}
}


// -------------------------------------------------
let layer = layui.layer
$('#logoutBtn').click(function(){
    layer.confirm('确定退出吗', {icon: 3, title:'提示'}, function(index){
        //点击按钮时执行该函数
        //do something
        // console.log(index);//弹出层的索引



        //退出登录要做什么：就是当初登录的事情反过来即可
        // 1.删除本地储存的token
        // 2.跳转回登录页面

        //1.
        localStorage.removeItem('token')

        //2.
        location.href='/home/login.html'

        layer.close(index);//按照index索引啦关闭对应的弹出层
      });
})