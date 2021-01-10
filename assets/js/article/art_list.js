$(function(){

    //这是接口文档的参数
    let query={
        pagenum: 1, // 默认加载第一个数据，页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // "" 也就是意味着找服务器要所有分类数据 文章分类的 Id
        state: "", // "" 表示所有状态 文章的状态，可选值有：已发布、草稿
    }

    // ================发送ajax请求来获取文章类别的数据=================
    let layer =layui.layer
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
                $(`<option value="${item.Id}">${item.name}</option>`).appendTo('#cateSelect')
            })
            // 动态创建的option添加到select下拉框中，不会自动的更新下拉框的界面，需要手动调用以下方法来实现表单的重新渲染
            form.render()
        }
       
    })


    //=======================美化处理时间===================补零操作
    let paddZero = function (n) {
        return n < 10 ? "0" + n : n;
      };
      template.defaults.imports.formatTime = function (msg) {
        // console.log(msg);
    
        let d = new Date(msg);
        let y = d.getFullYear();
        let m = paddZero(d.getMonth() + 1);
        let day = paddZero(d.getDate());
    
        let h = paddZero(d.getHours());
        let mm = paddZero(d.getMinutes());
        let s = paddZero(d.getSeconds());
    
        return `${y}-${m}-${day} ${h}:${mm}:${s}`;
      };


      //=================获取列表数据=======================
    //   封装
    getList()
    function getList(){
        $.ajax({
            url:'/my/article/list',
            data:query,
            success:function(res){


                let htmlStr=template('trTpl',res)
                $('#tb').html(htmlStr)
                renderPage(res.total);
            }
        })
    }
     // 定义分页渲染的renderPage函数
    let laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
    //执行一个laypage实例
     laypage.render({
      elem: "pageBox", // 注意，这里的 pageBox 是 ID，不用加 # 号
      count: total, // 数据总数，从服务端得到
      curr: query.pagenum, // 页码
      limit: query.pagesize, // 每页多少条数据
      limits:[1,2,3,10,20,30],
      layout:['count','limit','prev', 'page', 'next','skip'],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // 点击了分页按钮之后，jump函数会触发，通过obj.curr 来获取当前的页码值
        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数

        // console.log(first);

        // jump函数的执行时机：
        //  1. 当分页在初始化渲染的时候（laypage.render）， jump就会触发一次
        //  2. 当点击分页按钮切换的时候，jump也会触发

        // 解决bug的思路： 只有在点击分页的时候，才需要调用getList函数
        // 当first形参为true，表示分页在初始化渲染
        // 当first形参为undefined，表示点击分页按钮切换

        // 还需要做的事情
        // 1. 需要修改query对象的pagenum的值 ==> obj.curr
        // 2. 在来发送ajax请求

        // 1.
        query.pagenum = obj.curr;//修改页码
        query.pagesize = obj.limit;

        // 2.
        if (!first) {
          // if成立，说明first值为undefined，说明点击分页按钮，才需要调用getList发送ajax请求
          getList();
        }
      },
    });
  }
    // =============== 实现筛选功能 ===============
    $("#form").on("submit", function (e) {
        e.preventDefault();
    
        // 步骤：
        // 1. 获取下拉框的值
        // 2. 修改query对象里面的属性值
        // 3. 发送ajax请求来获取到对应的列表数据
    
        // 状态的值
        // console.log($("#stateSelect").val());
        // 分类的值
        // console.log($("#cateSelect").val());
    
        // 1 && 2
        query.cate_id = $("#cateSelect").val();
        query.state = $("#stateSelect").val();


        //解决小bug:当你在分页第五页筛选有的数据时 还是停留在第五页 无法筛选出来
        query.pagenum=1
    
        // console.log(query);
        // 3.
        getList();
      });
    

      //==============实现删除功能================
      //删除遇到的不过：当点击删除的时候，会发现删除成功了，但是ajax获取到的数据还是这一页的数据，需要展示上一页的数据
      //解决问题：if判断，判断删除按钮的个数===1，说明这一页没有数据了，就需要将页码-1
    //   还需注意：页码的最小值是1
      $('#tb').on('click','.delBtn',function(){
        let id =$(this).attr('data-id')

        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            let delBtnlen=$('.delBtn').length
            if(delBtnlen===1){
                // if(query.pagenum===1){
                //     query.pagenum=1
                // }else{
                //     query.pagenum= query.pagenum-1
                // }
                query.pagenum= query.pagenum===1?1:query.pagenum-1
            }
            //发送ajax
            $.ajax({
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除失败！')
                    }
                    
                    layer.msg('删除成功！')

                    getList()
                }
            })
            
            layer.close(index);
          });
      })
})