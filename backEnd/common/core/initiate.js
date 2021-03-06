/**
 * Created by wangyun on 17/3/8.
 */
const express = require("express");
const bodyParser = require('body-parser');

const path = require('path');



//加载配置信息
const config = require(path.resolve(process.cwd(),'config/config.js'));

const S = require(path.resolve(process.cwd(),'lib/string.js'))

let app = express();
app.listen(3001);

module.exports = class Initiate {
    constructor(){

    }

    static run(){
        //定义全局变量放在global上
        this.defineGlobalVar();
        //加载中间件
        this.initMiddleware();
        //分发路由
        this.routerDisPatch();


    }

    static initMiddleware(){
        //处理post请求数据
        app.use(bodyParser.urlencoded({extended: true}));

        //加载中间件，以备不时之需
        app.use((req,res,next)=>{
            next();
        })
    }

    static routerDisPatch(){
        app.post("/:c/:a",(req,res)=>{
            let {c,a} = req.params;

            if( !c || !a ){
                res.end();
                return;
            }



            //通过m找到控制器

            let controller_path = GLOBALPATH.CONTROLLER_PATH;

            let controller_file_path = path.resolve(controller_path,S(c).capitalize()+'Controller.js');
            let C = null;

            try{
                C = require(controller_file_path)
            }catch(e){
                console.log(e)
                res.end();
                return;
            }



            let controller = new C();

            try{
                controller[`${a}Action`].call(null,req,res);
            }catch(e){

                res.end();
                return;
            }
        })
    }

    static defineGlobalVar(){
        Object.assign(global, {
            GLOBALPATH: config.path
        });
    }
}
