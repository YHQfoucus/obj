// 优化url
$.ajaxPrefilter(function(options){
    // 来优化url（根路径）
   options.url= 'http://api-breakingnews-web.itheima.net'+ options.url

//  第一次优化
//    优化header(带上token信息)
    // options.headers={
    //        //设置请求头
    //        Authorization:localStorage.getItem('token'),
    //     }

    if(options.url.indexOf('/my')!==-1){
        options.headers={
                   //设置请求头
                   Authorization:localStorage.getItem('token'),
                }
        
    }
    options.complete=function(xhr){
        //请求不论是成功还是失败都会执行
        //responseJSON 这是服务器响应回来的数据
        // console.log(xhr);

        if(xhr.responseJSON.status===1 && xhr.responseJSON.message==='身份认证失败！'){
            //token 有问题，身份认证失败
            //跳转回login页面 ，需要重新登录才能进入index页面
            location.href='/home/login.html'
        }
    }
    
})