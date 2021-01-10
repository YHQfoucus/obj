$(function(){
    //-----------------获取文章类别数据
    // let layer =layui.layer
    let form = layui.form
    $.ajax({
        url:'/my/article/cates',
        success:function(res){
            // console.log(res);
            if(res.status!==0){
                layer.msg('获取文章分类列表失败！')
            }

            //获取成功
            //遍历data数据
            res.data.forEach((item)=>{
                //JQ创建模版
                $(`<option value="${item.Id}">${item.name}</option>`).appendTo($ ('[name=cate_id]') )
            })
            // 动态创建的option添加到select下拉框中，不会自动的更新下拉框的界面，需要手动调用以下方法来实现表单的重新渲染
            form.render()
        }
       
    })
    // ============================初始化副文本编辑器=========================
    initEditor();
    // =======================图片裁剪====================
    // 1. 初始化图片裁剪器
    let $image = $("#image");
    // 2.裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
      };
    // 3. 初始化裁剪区域
    $image.cropper(options);
    // =============== 选择图片按钮功能 ===============
    $('#chooseBtn').click(function(){
        // 模拟点击
        $('#file').click()
    })
    // 监听文件域的change事件
    $('#file').on('change',function(){
        let imgFile = this.files[0]; // 选择的那张图片
        let newImgURL = URL.createObjectURL(imgFile)
    
        $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", newImgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    })

    //==================表单的submit事件====================

    let state //存文章的状态==>取决于点击啥事件
    $('#pubBtn').click(function(){
        state='已发布'
    }) 
    $('#saveBtn').click(function(){
        state='草稿'
    })
   $('#form').on('submit',function(e){
    e.preventDefault()

    //将裁切的图片转成文件对象
    $image
    .cropper('getCroppedCanvas',{
          // 创建一个 Canvas 画布
          width: 400,
          height: 280,
    })
    .toBlob((blob)=>{
         // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作 ==> 这个形参bolb就是服务器要求的cover_img这个数据

        // 1. 收集表单数据（FormData格式）
        // 2. 在发送ajax请求

        // 1. 备注：箭头函数中没有自己的this指向，找外层作用域中的this
        let fd = new FormData(this);

        // 还需要追加文章的状态 append()
        fd.append('state',state)

        //追加封面cover_img
        fd.append('cover_img',blob)

        //调用pubArt函数来实现发送ajax请求（发布文章）
        pubArt(fd)

        // fd.forEach((value)=>{
        //     console.log(value);
        // })
    })
   })

   //pubArt 这是发送ajax的函数，实现发布文章
   function pubArt(fd){
       $.ajax({
           url:'/my/article/add',
           type:'post',
           data:fd,
           contentType:false,
           processData:false,
           success:function(res){
            console.log(res);
            if(res.status!==0){
                return layer.msg('发布失败')
            }
            layer.msg('发布成功')

            location.href='/article/art_list.html'
           }
       })
   }
})