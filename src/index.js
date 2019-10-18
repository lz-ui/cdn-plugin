'use strict'
const upyun = require('upyun')
const fs = require('fs')
const path = require('path');


// 需要填写自己的服务名，操作员名，密码，通知URL
const serviceName = '2017cdn-blog'   // 服务名
const operatorName = 'lizhi'  // 用户名
const password = 'qq123456' // 操作密码


const service = new upyun.Service(serviceName, operatorName, password)
const client = new upyun.Client(service)


class LzCdnPlugin{
    constructor(option) {
        if (option && option.remoteFile && option.filePath) {
            // 远端路径
            this.remoteFile = `/lz-ui/cos/${option.remoteFile}/`
            // 要上传的本地文件路径
            this.filePath = path.join(option.filePath);
            // 默认不触发constructor
            if(option.flag){
                this.fileDisplay(this.filePath) 
            } 
        } else {
            console.log('remoteFile或filePath不存在,CDN无法自动上传')
        }
    }
    // Webpack 会调用 LzCdnPlugin 实例的 apply 方法给插件实例传入 compiler 对象
    apply(compiler) {
        if(compiler && compiler.hooks && compiler.hooks.done && compiler.hooks.done.tap){
            compiler.hooks.done.tap('LzCdnPlugin', compilation => {
            setTimeout(() => {
                console.log('编译完成')
                if (this.remoteFile && this.filePath) {
                    this.fileDisplay(this.filePath)
                } else {
                    console.log('remoteFile或filePath不存在,CDN无法自动上传')
                }
            }, 0)
            })
        }
    }
    // 上传
    uploadFile(localFile) {
        client.formPutFile(this.remoteFile + localFile, fs.createReadStream(localFile)).then(res => {
            console.log(`https://cdn.jczxw.cn`+ res.url)
        })
    }
    // 获取文件路径-递归
    fileDisplay(filePath){
        const _this = this
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath,function(err,files){
            if(err){
                console.warn(err)
            }else{
                //遍历读取到的文件列表
                files.forEach(function(filename){
                    //获取当前文件的绝对路径
                    let filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir,function(eror, stats){
                        if(eror){
                            console.warn('获取文件stats失败');
                        }else{
                            let isFile = stats.isFile();//是文件
                            let isDir = stats.isDirectory();//是文件夹
                            if(isFile){
                                _this.uploadFile(filedir.replace(/\\/g,'/'))
                            }
                            if(isDir){
                                _this.fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        });
    }
}

module.exports = LzCdnPlugin 