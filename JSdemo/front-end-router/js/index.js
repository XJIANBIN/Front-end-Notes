function Router() {
        this.routes = {};
        this.currentUrl = '';
    }
    Router.prototype.route = function(path, callback) {
        this.routes[path] = callback || function(){};
    };
    Router.prototype.refresh = function() {
        this.currentUrl = location.hash.slice(1) || '/';
        this.routes[this.currentUrl]();
    };
    Router.prototype.init = function() {
		//bind方法会创建一个新函数,称为绑定函数.当调用这个绑定函数时,绑定函数会以创建它时传入bind方法的第一个参数作为this,传入bind方法的第二个以及以后的
		//参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数.
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('hashchange', this.refresh.bind(this), false);
    }
    window.Router = new Router();
    window.Router.init();
    var content = document.querySelector('body');
    // change Page anything
    function changeBgColor(color) {
        content.style.backgroundColor = color;
    }
    Router.route('/', function() {
        changeBgColor('white');
    });
    Router.route('/orange', function() {
        changeBgColor('orange');
    });
    Router.route('/purple', function() {
        changeBgColor('purple');
    });