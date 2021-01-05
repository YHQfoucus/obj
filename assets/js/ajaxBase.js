// 优化url
$.ajaxPrefilter(function(options){
    console.log('函数执行了');
    // 来优化url（根路径）
   options.url= 'http://api-breakingnews-web.itheima.net'+ options.url
})