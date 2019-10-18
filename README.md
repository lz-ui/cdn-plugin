# @lz-ui/cdn-plugin 适用于node服务端 适用webpack build 自动部署脚步


## 使用： 

    const LzCdnPlugin = require('@lz-ui/cdn-plugin')

    new LzCdnPlugin({
        filePath: '../dist', // 本地需要上传的文件
        remoteFile: 'test/v1', //    https://cdn.jczxw.cn/lz-ui/cos/ ...remoteFile(远程资源路径).../filePath(本地需要上传的文件),
        flag: false // 默认false 
    })

    filePath是相对路径

## 更新日志：

    2019/10/19   v 0.1.0

        @lz-ui/cdn-plugin 基于webpack build完成后钩子函数出发cdn上传文件，傻瓜式部署
