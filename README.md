# WattWisely - IoT Power Monitoring Web Application

WattWisely is a gamified IoT power monitoring web application that retrieves real-time power usage from Sonoff smart plugs using Home Assistant and InfluxDB.

---

## 🚀 Getting Started (For Team Members)

Follow these steps to set up the project on your local machine.

### 1️⃣ Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/thesis-WattWisely.git
cd thesis-WattWisely
```

> **Note:** If the repository is private, ensure you have the correct permissions.

---

### 2️⃣ Create and Activate a Virtual Environment

#### 🔹 On macOS/Linux:
```bash
python3 -m venv wattwisely_env
source wattwisely_env/bin/activate
```

#### 🔹 On Windows (Command Prompt):
```bash
python -m venv wattwisely_env
wattwisely_env\Scripts\activate
```

---

### 3️⃣ Install Dependencies

Once the virtual environment is activated, install the required packages:

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Create a `.env` File

Create a `.env` file in the root folder (`thesis-WattWisely/`) and add the necessary environment variables:

```
INFLUXDB_URL=<your_influxdb_url>
INFLUXDB_TOKEN=<your_influxdb_token>
INFLUXDB_ORG=<your_influxdb_org>
INFLUXDB_BUCKET=<your_influxdb_bucket>
```

> **Important:** Do NOT commit your `.env` file to GitHub.

---

### 5️⃣ Apply Database Migrations

Run the following command to ensure the database is set up properly:

```bash
python manage.py migrate
```

---

### 6️⃣ Start the Development Server

Run the Django server:

```bash
python manage.py runserver
```

The server will start at:

```
http://127.0.0.1:8000/
```

---

## 📌 API Endpoints

| Endpoint                 | Description                           |
|--------------------------|---------------------------------------|
| `/api/power-data/`       | Returns power consumption data in JSON format |
| `/admin/`               | Django admin panel (requires login) |

> **Note:** The root URL (`/`) currently redirects to `/api/power-data/`. This will be removed when the frontend is integrated.

---

## 📝 Things to Change After Finishing Other Features

1. **Remove the automatic redirect in `wattwisely/urls.py`**
   ```python
   path('', lambda request: redirect('api/power-data/', permanent=False)),
   ```
   > This should be removed once the frontend is ready.

2. Update the API to support additional features like user authentication and historical power data.

---

## ✅ To-Do List

### 📊 Backend:
- [ ] Extract necessary data (time, watts, date, etc.) from JSON response.
- [ ] Calculate the average power usage over different time periods.
- [ ] Optimize queries for better performance.

### 🎨 Frontend:
- [ ] Choose a frontend framework (React, Vue, or plain HTML/CSS/JS).
- [ ] Connect the frontend to the Django API.
- [ ] Implement gamified elements (badges, rewards, leaderboards).

---

## 🛠 Additional Commands

#### 🗂 Updating Dependencies (If new packages are installed):
After installing any new package, update `requirements.txt`:

```bash
pip freeze > requirements.txt
```

#### 🔄 Deactivating Virtual Environment:
When you're done, deactivate the virtual environment:

```bash
deactivate
```

#### 📌 Running Tests (If added later):
```bash
python manage.py test
```

---

## 🌍 Deployment (Future)
Once the project is ready for deployment, we will:
- **Dockerize the application** for easy deployment and scalability.
- **Deploy it on a Raspberry Pi** using Docker.
- Optionally, integrate it as a **Home Assistant Add-on**, which also uses Docker for seamless integration.
- Configure **InfluxDB and Django** to work efficiently on the Raspberry Pi environment.
- Set up **environment variables and security settings** for production use.

## ❓ Need Help?
If you encounter any issues, message the team group chat or check the documentation.

🚀 **Happy Coding!**
```

---
