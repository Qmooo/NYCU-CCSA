# 使用python:3.8-slim的image
FROM python:3.8-slim
#在container創建一個api的dir
WORKDIR /api
# 將與Dockerfile同層的local資料 copy到container內的api folder
ADD . /api
# 下載需傲的module
RUN pip install -r requirements.txt
# 開放Port 5001
EXPOSE 5001
# 在container啟動後, 直接run這段cmd
CMD ["python", "./app.py"]