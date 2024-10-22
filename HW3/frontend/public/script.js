let currentDate = new Date();
let appointments = {};
// const API_URL = 'http://192.168.61.3:5001';

document.addEventListener('DOMContentLoaded', function() {
    const formSection = document.getElementById('appointment-form');
    const calendarSection = document.getElementById('calendar-container');
    const searchSection = document.getElementById('searchEdit-form');
    const showFormBtn = document.getElementById('show-form');
    const showSearchBtn = document.getElementById('show-search');
    const showCalendarBtn = document.getElementById('show-calendar');
    const bookingForm = document.getElementById('booking-form');
    const searchForm = document.getElementById('search-form');

    showFormBtn.addEventListener('click', () => {
        formSection.classList.remove('hidden');
        calendarSection.classList.add('hidden');
        searchSection.classList.add('hidden');
    });

    showCalendarBtn.addEventListener('click', () => {
        formSection.classList.add('hidden');
        calendarSection.classList.remove('hidden');
        searchSection.classList.add('hidden');
    });

    showSearchBtn.addEventListener('click', () =>{
        formSection.classList.add('hidden');
        calendarSection.classList.add('hidden');
        searchSection.classList.remove('hidden');
    })

    showFormBtn.click();

    bookingForm.addEventListener('submit', handleSubmit);
    searchForm.addEventListener('submit', handleNameSearch);

    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));

    getAppointments()
});

function getAppointments(){
    // 获取所有预约
    fetch(`/api/appointments`)
    .then(response => response.json())
    .then(data => {
        appointments = data;
        generateCalendar();
    })
    .catch((error) => {
        console.error('獲取預約時出錯:', error);
    });
}

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const appointmentData = {
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        service: formData.get('service')
    };

    // 发送预约信息到API
    fetch(`/api/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('預約成功:', data);
        alert(`預約成功, 預約姓名: ${appointmentData.name}`)
        // 更新本地预约数据
        getAppointments();
    })
    .catch((error) => {
        console.error('錯誤:', error);
    });

    event.target.reset();
}

async function cancelAppointment(appointmentId) {
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('取消預約失敗');
        }
        alert('刪除預約成功')
        // 重新获取预约并更新日历
        await getAppointments();
        const searchName = document.getElementById('searchName').value;
        const results = await searchAppointmentsByName(searchName);

        displaySearchResults(results);
        generateCalendar();
    } catch (error) {
        console.error('取消預約時出錯:', error);
        alert('取消預約失敗，請稍後重試');
    }
}

async function handleNameSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('searchName');
    const results = await searchAppointmentsByName(name);
    displaySearchResults(results);
}

async function searchAppointmentsByName(name) {
    try {
        const params = new URLSearchParams();
        if (name) params.append('name', name);

        const response = await fetch(`/api/appointments/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error('查詢預約失敗');
        }

        const results = await response.json();
        return results;
    } catch (error) {
        console.error('查詢預約時出錯:', error);
        alert('查詢預約失败，請稍後重試');
        return [];
    }
}

function displaySearchResults(results){
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>没有找到預約資訊</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>姓名</th>
            <th>日期</th>
            <th>時間</th>
            <th>服務</th>
            <th>取消</th>
            <th>操作</th>
        </tr>
    `;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    results.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        const row = table.insertRow();
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${appointment.service}</td>
            <td>${appointmentDate > today ? '<button class="btn btn-cancel" onclick="cancelAppointment(\'' + appointment._id + '\')">取消預約</button>' : '已過期'}</td>
            <td>${appointmentDate > today ? '<button class="btn btn-edit" onclick="showEditForm(\'' + appointment._id + '\')">修改</button>' : '已過期'}</td>
        `;
    });
    
    resultsContainer.appendChild(table);

}

function showEditForm(appointmentId) {
    const appointment = appointments.find(app => app._id === appointmentId);
    if (!appointment) return;

    const editForm = document.createElement('form');
    editForm.id = 'editAppointmentForm'; // 添加一个唯一的 ID
    editForm.innerHTML = `
        <h3>修改预约</h3>
        <input type="hidden" id="editId" value="${appointment._id}">
        <label for="editName">姓名：</label>
        <input type="text" id="editName" value="${appointment.name}" required><br>
        <label for="editDate">日期：</label>
        <input type="date" id="editDate" value="${appointment.date}" required><br>
        <label for="editTime">时间：</label>
        <input type="time" id="editTime" value="${appointment.time}" required><br>
        <label for="editService">服務類型：</label>
        <select id="editService" required>
                    <option value="">請選擇服務</option>
                    <option value="洗頭" ${appointment.service === '洗頭' ? 'selected' : ''}>洗頭</option>
                    <option value="剪頭" ${appointment.service === '剪頭' ? 'selected' : ''}>剪頭</option>
                    <option value="燙髮" ${appointment.service === '燙髮' ? 'selected' : ''}>燙髮</option>
        </select><br>
        <button type="submit" class="btn btn-edit">保存修改</button>
        <button type="button" class="btn btn-cancel" onclick="cancelEdit()">取消</button>
    `;

    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.appendChild(editForm);

    // 使用事件委托
    resultsContainer.addEventListener('submit', handleEditSubmit);
}

function cancelEdit() {
    const editForm = document.querySelector('#searchResults form');
    if (editForm) editForm.remove();
}

async function handleEditSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const date = document.getElementById('editDate').value;
    const time = document.getElementById('editTime').value;
    const service = document.getElementById('editService').value;

    try {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, date, time, service }),
        });

        if (!response.ok) {
            throw new Error('修改預約失敗');
        }

        alert('預約修改成功');
        cancelEdit();
        // 重新搜索并显示更新后的结果
        const searchName = document.getElementById('searchName').value;
        const results = await searchAppointmentsByName(searchName);
        displaySearchResults(results);
    } catch (error) {
        console.error('修改預約時出錯:', error);
        alert('修改預約失敗，請稍後重試');
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    generateCalendar();
}

function generateCalendar() {
    const calendarBody = document.querySelector('#calendar-table tbody');
    calendarBody.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('current-month-year').textContent = 
        `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            } else if (date > lastDay.getDate()) {
                break;
            } else {
                const cell = document.createElement('td');
                cell.classList.add('calendar-day');
                
                const dateContainer = document.createElement('div');
                dateContainer.classList.add('date-container');
                
                const dateSpan = document.createElement('span');
                dateSpan.classList.add('date');
                dateSpan.textContent = date;
                dateContainer.appendChild(dateSpan);


                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const dayAppointments = Object.values(appointments).filter(app => app.date === dateString);

                if (dayAppointments.length > 0) {
                    cell.classList.add('booked');
                    const appointmentList = document.createElement('div');
                    appointmentList.classList.add('appointment-list');

                    dayAppointments.forEach(app => {
                        const appointmentDiv = document.createElement('div');
                        appointmentDiv.classList.add('appointment');
                        
                        const infoDiv = document.createElement('div');
                        infoDiv.classList.add('appointment-info');
                        
                        const timeSpan = document.createElement('span');
                        timeSpan.classList.add('appointment-time');
                        timeSpan.textContent = app.time;
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.classList.add('appointment-name');
                        nameSpan.textContent = ` - ${app.name}`;
                        
                        const serviceSpan = document.createElement('span');
                        serviceSpan.classList.add('appointment-service');
                        serviceSpan.textContent = ` - ${app.service}`;

                        infoDiv.appendChild(timeSpan);
                        infoDiv.appendChild(nameSpan);
                        infoDiv.appendChild(serviceSpan);

                        appointmentDiv.appendChild(infoDiv);
                        appointmentList.appendChild(appointmentDiv);
                    });
                    dateContainer.appendChild(appointmentList);
                }
                
                cell.appendChild(dateContainer)
                row.appendChild(cell);
                date++;
            }
        }
        calendarBody.appendChild(row);
    }
}
