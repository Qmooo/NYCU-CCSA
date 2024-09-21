# 使用官方Node.js镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /frontend

# 复制package.json和package-lock.json（如果存在）
ADD . ./

# 安装依赖
RUN npm install

# 暴露30800端口
EXPOSE 30800

# 运行应用
CMD [ "node", "server.js" ]