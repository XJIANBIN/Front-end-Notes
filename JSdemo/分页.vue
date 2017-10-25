<div id="app">
    <div class="container">
        <h1>  Vue 分页组件 </h1>
        <pagination :total="total" :current.sync="current"></pagination>
        <pre>{{ $data|json }}</pre>
    </div>
</div>

<script>
var app = new Vue({
    el: '#app',
    data: {
        total: 81,     // 记录总条数
        display: 10,   // 每页显示条数
        current: 1     // 当前第n页 ， 也可以 watch current 的变化 
    },
    events:{
        pagechange:function(p){     // 页码改变event ， p 为新的 current
            console.log('pagechange',p);
        }
    }
});
</script>



<!-- 模板 -->
<script type="text/template" id="template_pagination">
    <nav>
        <ul class="pagination">
            <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
            <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(current - 1)"> 上一页 </a></li> 
            <li v-for="p in grouplist" :class="{'active': current == p.val}"><a href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a></li>
            <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(current + 1)"> 下一页</a></li>
            <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
        </ul>
        <ul class="pagination pull-right">
            <li><span> 共 {{ total }}  条数据 </span></li>            
            <li><span> 每页显示 {{ display }}  条数据 </span></li>
            <li><span> 共 {{ page }} 页 </span></li>
            <li><span> 当前第 {{ current }} 页 </span></li>
        </ul>
    </nav>
</script>


/**
 * [pagination 分页组件]
 * @param  {Number} total         [数据总条数]
 * @param  {Number} display     [每页显示条数 default:10]
 * @param  {Number} current     [当前页码 default:1]
 * @param  {Number} pagegroup     [分页条数(奇数) default:5]
 * @param  {Event} pagechange     [页码改动时 dispatch ]
 * @return {[type]}   [description]
 */
Vue.component('pagination', {
    template: '#template_pagination',
    props: {
        total: {            // 数据总条数
            type: Number,
            default: 0
        },
        display: {            // 每页显示条数
            type: Number,
            default: 10
        },
        current: {            // 当前页码
            type: Number,
            default: 1
        },
        pagegroup: {        // 分页条数 -- 奇数
            type: Number,
            default: 5,
            coerce:function(v){
                v = v > 0 ? v : 5;
                return v % 2 === 1 ? v : v + 1;
            }
        }
    },
    computed: {
        page:function() { // 总页数
            return Math.ceil(this.total / this.display);
        },
        grouplist:function(){ // 获取分页页码
            var len = this.page , temp = [], list = [], count = Math.floor(this.pagegroup / 2) ,center = this.current;
            if( len <= this.pagegroup ){
                while(len--){ temp.push({text:this.page-len,val:this.page-len});};
                return temp;
            }
            while(len--){ temp.push(this.page - len);}; // 一个数组，值是从1到总页数
            var idx = temp.indexOf(center);   // 拿到当前页数在总页数的下标             
            (idx < count) && ( center = center + count - idx);  // 如果在左边边界，算出center = 3
            (this.current > this.page - count) && ( center = this.page - count); //右边边界 算出cnter为倒数第三位
            temp = temp.splice(center - count -1, this.pagegroup); // 注意center是页数，但是splice是下标，要减去1，，切割出所需五个页数            
            do {
                var t = temp.shift();
                list.push({
                    text: t,
                    val: t
                });
            }while(temp.length);                
            if( this.page > this.pagegroup ){
                (this.current > count + 1) && list.unshift({ text:'...',val: list[0].val - 1 });
                (this.current < this.page - count) && list.push({ text:'...',val: list[list.length - 1].val + 1 });
            }
            return list;
        }
    },
    methods: {
        setCurrent: function(idx) {
            if( this.current != idx && idx > 0 && idx < this.page + 1) {
                this.current = idx;
                this.$dispatch('pagechange',this.current);                    
            }                
        }
    }
});