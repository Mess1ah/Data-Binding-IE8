/**
 * Created by Messiah_S on 19/04/2017.
 */
//适用于<input>, <select>, and <textarea> elements
function DataBind(target) {
  //创建一个订阅对象
  var pubsub = {
      callbacks: {},

      on: function ( message, callback ) {
        this.callbacks[ message ] = this.callbacks[ message ] || [];
        this.callbacks[ message ].push( callback );
      },

      publish: function ( message ) {
        this.callbacks[ message ] = this.callbacks[ message ] || [];
        for ( var i = 0, len = this.callbacks[ message ].length; i<len; i++ ){
          this.callbacks[ message ][ i ].apply( this, arguments);
        }
      }
  },

    data_attr = "data-bind-" + target,
    message = target + ":change",

    changeHandler = function (event) {
      var target = event.target || event.srcElement,
          prop = target.getAttribute( data_attr );
      if ( prop && prop  !== ""){
        pubsub.publish( message, prop, target.value );
      }
    };

  //监听事件变化，如果有变化将其传给订阅对象
  if( document.addEventListener ){
    document.addEventListener( "change",changeHandler, false );
  } else {
    document.attachEvent( "onchange", changeHandler );
  }

  //如果发生变化订阅对象把变化传播给所有绑定的元素
  pubsub.on( message, function ( event, prop, newState) {
    var elements = document.querySelectorAll("["+ data_attr +"="+ prop+"]"),
        tag;

        for ( var i = 0, len = elements.length; i < len; i++){
          tag = elements[i].tagName.toLowerCase();
          if( tag === "input" || tag === "textarea" || tag === "select" ){

            elements[ i ].value = newState;
          } else  {
            elements[i].innerHTML = newState;
          }
        }
  });

  return pubsub;
}


//测试

function User(userid){
  var binder = new DataBind(userid),

    _user = {
      attributes: {},

      //属性设置器使用数据绑定器PubSub来发布变化

      setter: function(attr_name,val){
        this.attributes[attr_name] = val;
        //使用“publish”方法
        binder.publish(userid+ ":change", attr_name, val, this);
        console.log(val)
      },

      getter: function(attr_name){
        console.log(attr_name);
        return this.attributes[attr_name];
      },

      _binder: binder
    };

  binder.on(userid +":change",function(vet,attr_name,new_val,initiator){
    if(initiator !== _user){
      _user.setter(attr_name,new_val);
    }
  });

  return _user;
}

