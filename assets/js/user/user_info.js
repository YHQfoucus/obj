$(function(){
    let form=layui.form
    let layer=layui.layer
    form.verify({
        nickname:(value)=>{
            if(value.length>6){
                return '昵称需要1-6字符之间'  
            }
            
        }
    });
    // ==================================
// $.ajax({
//     url:'/my/userinfo',
//     success:function(res){
// form.val('form',res.data)
//     }
// })
getInfo()
function getInfo(){
    $.ajax({
        url:'/my/userinfo',
        success:function(res){
            if(res.status!==0){
                return layer.msg('获取用户信息失败！')
            }
    form.val('form',res.data)
        }
    })
}


// =================================================================重置功能
$('#resetBtn').click(function(e){
    e.preventDefault()
    
    getInfo()
})
$('#form').on('submit',function(e){
    e.preventDefault()

    let data =$(this).serialize()//记得处理id

    $.ajax({
        url:'/my/userinfo',
        type:'POST',
        data,
        success:function(res){
            // console.log(res);
            if(res.status!==0){
                return layer.msg('修改信息失败！')
            }
            window.parent.getUserInfo() // 调用父页面的getUserInfo函数，重新渲染index.html 的昵称
            layer.msg('修改信息成功！')
        }
    })
})
})


// =====================================
