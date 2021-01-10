$(function(){
   let form = layui.form
   getCate()
function getCate(){
   $.ajax({
      url:'/my/article/cates',
      success:function(res){
        //   console.log(res); 
         let htmlStr = template('trTpl',res)
         $('#tb').html(htmlStr)
      }
     })
}
 

   let index //存储的弹出层索引，用于添加成功后关闭该弹出层 并且需要设置成全局变量 否则无法获取
   $('#addBtn').click(function(){
     index = layer.open({
        type:1,
        content: 'test',
        title:'添加文章类别',
        area:['500px','250px'],
        content: $('#addFormTpl').html()
      });
   })

   //------------------实现添加功能--------------------------
//   坑：添加的form表单 addForm 是动态创建处理啊的所以要注册事件委托 
   $('body').on('submit','#addForm', function(e){
      e.preventDefault()
      // 获取数据
      let data=$(this).serialize()
      // console.log(data);
      $.ajax({
         url:'/my/article/addcates',
         type:'POST',
         data,
         success:function(res){
            // console.log(res);
            if(res.status!==0){
               return layer.msg('新增文章分类失败！')
            }
            // 1.隐藏弹出层 
            layer.close(index)
            //2.重新加载数据
            getCate()
            // 3.提示框提示新责怪分类成功
            layer.msg('新增文章分类成功！')

         }
      })
   })

   //--------------------编辑功能----------------------------- 
   // 注册事件委托
   let editIndex
   $('body').on('click','.editBtn',function(){
      // 实现弹出层
       editIndex=layer.open({
         type:1,
         content: 'test',
         title:'修改文章类别',
         area:['500px','250px'],
         content: $('#editFormTpl').html()
       });


       //如何获取这条数据的id
       let id =$(this).attr('data-id')
      //  console.log(id);
       //发送ajax请求来填充弹出层的form表单
       $.ajax({
          url:'/my/article/cates/'+id,
          success:function(res){
            //  console.log(res);
           // form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值"username": "贤心" // "name": "value"

           // 给表单赋值操作
           form.val("editForm",res.data)
          },
       })
   })

   //--------------------更新----------------------------- 
   $('body').on('submit','#editForm',function(e){
      e.preventDefault()
      let data= $(this).serialize()
      // console.log(data);
      $.ajax({
         type:'POST',
         url:'/my/article/updatecate',
         data,
         success:function(res){
            // console.log(res);
            if(res.status!==0){
               return layer.msg('更新分类信息失败！')
            }
            // 隐藏弹出层
            layer.close(editIndex)

            // 重新加载所有文章类别的数据
            getCate()

            //提示框提示更改成功
            layer.msg('更新分类信息成功！')
         }
      })
   })


   //--------------------删除----------------------------- 
   $('#tb').on('click','.delBtn',function(){

      //先把id获取
      let id=$(this).attr('data-id')
      console.log(this);
      // console.log(id);
      layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
         //该函数只有点击确认按钮才会执行
         //在这里里面发送ajax请求删除对应的数据
         $.ajax({
            url:'/my/article/deletecate/'+id,
            success:function(res){
               // console.log(res);
            if(res.status!==0){
               return res.msg('删除文章分类成功！')
            }
            layer.msg('删除文章分类成功！')

            getCate()


            }
         })         
         layer.close(index);
       });
   })
})