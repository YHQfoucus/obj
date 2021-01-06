$(function () {
    let layer = layui.layer;
  
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $("#image");
  
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: ".img-preview",
    };
  
    // 1.3 创建裁剪区域
    $image.cropper(options);
  
    // ============ 模拟点击文件域 ============
    $("#chooseBtn").click(function () {
      $("#file").click();
    });
  
    // 文件域有change事件 当文件域的选择的文件发生了改变，该事件就会触发
    $("#file").on("change", function () {
      // 如何去获取到我们选择的图片 ==> 通过文件域的DOM对象的files属性可以获取到所有选择的文件
  
      let file = this.files[0]; // 选择的那张图片
      // console.dir(this.files[0]);
      // console.log("文件域的选择的文件发生了改变", file);
  
      if (!file) {
        // 解决报错问题（没有选择图片）
        return;
      }
  
      let newImgURL = URL.createObjectURL(file);
  
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", newImgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  
    // ============ 上传裁切好的图片 ============
    $("#sureBtn").click(function () {
      // 按照插件提供的方法将裁切的图片转成base64格式
      let dataURL = $image
        .cropper("getCroppedCanvas", {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100,
        })
        .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  
      $.ajax({
        type: "POST",
        url: "/my/update/avatar",
        data: {
          avatar: dataURL,
        },
        success: function (res) {
          console.log(res);
  
          if (res.status !== 0) {
            return layer.msg("更新头像失败!");
          }
  
          layer.msg("更新头像成功!");
  
          // 调用父页面的getUserInfo函数来实现头像的更新
          window.parent.getUserInfo();
        },
      });
    });
  });
  