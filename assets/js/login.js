$(function(){
    // 注册账号
    $('#gotoregister').click(function(){
        // 显示注册
        $('.register').show()

        // 隐藏登陆
        $('.login').hide()
    })

    // 去登陆
    $('#gotologin').click(function(){
               // 隐藏注册
               $('.register').hide()

               // 显示登录
               $('.login').show()
    })


    // =====================添加自定义规则============
    //form.verify layui提供的用来自定义校验规则
    //注意：verify layui不嫩恶搞直接使用，需要从layui中获取form的功能
    let form = layui.form;
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

    pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
    ] ,
    repwd: function (value, item){ 
        //value：表单的值、item：表单的DOM对象
        // console.log(value);
        // console.log(item);

        // 步骤：
        // 1、获取第一次输入的密码的值
        // 2、将两次输入的值进行比较，如果两次的值不一样，就需要出现提示框
        let pwd = $('.register [name=password]').val() //第一次输入的密码 //注意点：要的密码框是注册表单中的 一定要精确获取
        if(value!==pwd){
            // console.log(value);//value是第二次的输入框的值
            return '密码不一致'
        }

    }, 
    
  });

  
  // --------------------- 完成注册功能 ---------------------
  
  // 注册表单提交功能
  let layer = layui.layer; // 加载弹出层模块
  $("#regisForm").on("submit", function (e) {
      // 阻止表单的默认行为
      e.preventDefault();
      // 获取表单中的数据 ==> serialize是根据表单各项的name属性获取值的，所以要检查表单各项的name属性
      let data = $(this).serialize();

      // 发送ajax请求到接口，完成注册
      $.ajax({
          url: "/api/reguser",
          type: "POST",
          data,
          success: function (res) {
              console.log(res);
  
              if (res.status !== 0) {
                //   return console.log("注册失败" + res.message);
                  return layer.msg(res.message);
              }
  
            //   登录成功后，还需要把服务器给的token信息给存储起来
              localStorage.setItem('token','http://api-breakingnews-web.itheima.net')


              layer.msg("注册成功");
  
              // 提示出来就切换了，可以等关闭之后在切换
              $("#gotologin").click();
          },
      });
  });




  //------------------------------------------------------------------
  // --------------------------  完成登录功能 ---------------------------

// 步骤：
// 获取账号和密码
// 提交给接口，完成登录。登录成功，跳转到 index.html （index.html是项目的首页面）

$("#loginForm").on("submit", function (e) {
    e.preventDefault();

    let data = $(this).serialize();

    $.ajax({
        type: "POST",
        url: "/api/login",
        data,
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("登录失败");
            }

            // 提示
            layer.msg("登录成功！，即将跳转！");
            // 跳转到后台主页
            location.href = "index.html";
        },
    });
});
})
