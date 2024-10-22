# 使用node:14的image
FROM node:14

# 創建一個frontend dir
WORKDIR /frontend

# 複製所有檔案到frontend底下
ADD . ./

# 安裝npm所需要的東西, 都包在package.json內, 類似python的requirements.txt
RUN npm install

# 開放30800
EXPOSE 30800

# container啟動後,直接跑這段cmd.
CMD [ "node", "server.js" ]