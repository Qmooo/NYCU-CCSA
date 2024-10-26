# CCSA-HW3
This document provide a introduction about HW3, and teach how to start this project.

## Set up VM

1. Create VM
``` bash
# create frontend
cd frontend
vagrant up

# create logic
cd ../logic
vagrant up
```
2. Run each application in each vm
```bash
# start frontend application
cd frontend 
vagrant ssh
node server.js

# start backend application
cd logic
vagrant ssh
python3 app.py
```

## Screenshot

### 主頁預約
可以在主頁輸入預約資訊, 然後選擇日期,時間,服務項目。

<br>
<p align="center">
    <img src="img/1.png">
</p>
<br>
<p align="center">
    <img src="img/2.png">
</p>

### 查詢預約
查詢預約的名字,就會看到列表, 可以使用修改來改時間日期和服務, 也可以直接取消, 但小於今日日期的預約是沒有辦法使用刪除預約或修改按鈕.

<br>
<p align="center">
    <img src="img/3.png">
</p>
<br>
<p align="center">
    <img src="img/4.png">
</p>

### 預約日歷
這邊可以看到所有日期的預約人, 包含時間和服務.

<br>
<p align="center">
    <img src="img/5.png">
</p>
