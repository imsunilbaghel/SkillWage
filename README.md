## 📸 SkillWage
<br>
<p align="center">
  <img src="https://drive.google.com/uc?id=1cveqsNSXBYK-L8qeX5hH9fS5bctnQAF2" 
       alt="SkillWage Homepage" 
       height="300px" />
  <img src="https://drive.google.com/uc?id=1E-szHnhw484ysaefeVFlr_XjDpmFaBBQ" 
       alt="SkillWage Worker Profile" 
       height="300px" />
</p>
<br>
SkillWage is a smart, web-based solution designed to bridge this gap. It connects customers with skilled tradespeople like electricians, plumbers, carpenters, painters, masons, and labourers. With features like location-based service matching, easy job posting, profile management, and a transparent rating system, SkillWage brings convenience and trust to both customers and workers.

## 💻 How to Run This Project

If you want to run the **SkillWage** project locally, follow these steps:

### 1. Import the Database
- Open **MySQL Workbench**.
- Create a new database (e.g., `skillwage`).
- Import the `skillwage.sql` file included in this repository.
- This will create all necessary tables:
  1. `Customer`
  2. `Post_requirement`
  3. `Rate`
  4. `ServiceRequests`
  5. `Worker`

### 2. Update `server.js` with Your Database Credentials

Open the `server.js` file and update the database connection to match your MySQL credentials:

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'your_password_here',
    database: 'skillwage'
});
```
Replace 'your_password_here' with your MySQL password and 'skillwage' with your database name if different.

### 3. Create the Scheduled Event

**SkillWage** uses a MySQL event to automatically clean up service requests.  
Run the following SQL in your `skillwage` database:

```sql
CREATE EVENT cleanup_service_requests
ON SCHEDULE EVERY 1 DAY
STARTS '2025-04-18 12:17:10'
ON COMPLETION NOT PRESERVE
ENABLE
DO
BEGIN
    -- Delete cancelled requests older than 3 days
    DELETE FROM serviceRequests
    WHERE status = 'cancelled'
      AND requestDate < NOW() - INTERVAL 3 DAY;

    -- Update accepted requests older than 3 days to completed
    UPDATE serviceRequests
    SET status = 'completed'
    WHERE status = 'accepted'
      AND requestDate < NOW() - INTERVAL 3 DAY;
END;
```
This event helps keep the database clean by automatically removing old cancelled requests and updating old accepted requests to completed.


### 4. Start the Server

1. Open a terminal in your project folder.

2. Install dependencies (if not done already):

```bash
npm install
```
3. Start the server:

```bash
node server.js
```


## 🖼 SkillWage Screenshots
<br>
<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=1hEVxuVyMB-2tu-ssJnDHf2qja6Pvelac" 
           alt="Login Screen" 
            width="100%" />
      <br>
      <b>Login</b>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?id=1_gXExfiThO21U1Tlf-9HBbV1PCE2BMz-" 
           alt="Registration Screen" 
            width="100%" />
      <br>
      <b>Registration</b>
    </td>
  </tr>
</table>

<br>

<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=1GODJyeSUkhGiL-Hb-yMTDMLyqPjvYmRT" 
           alt="Customer HomePage - Send Service Request" 
            width="100%" />
      <br>
      <b>Customer HomePage - Send Service Request</b>
    </td>
  </tr>
</table>

<br>

<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=17Abga5TocoaSoacD9RbUg1lyv9P1Ji52" 
           alt="Customer HomePage - View Send Request" 
            width="100%" />
      <br>
      <b>Customer HomePage - View Send Requests</b>
    </td>
  </tr>
</table>

<br>

<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=12k-2t3iAgaUrvhFteyZVk6icw-0xUvtD" 
           alt="Customer can View Worker Profile" 
            width="100%" />
      <br>
      <b>Customer can View Worker Profile</b>
    </td>
  </tr>
</table>

<br>

<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=11bb5tYrzO8l8JNZZ7tTB42jOAPpkY8C5" 
           alt="Post Requirement" 
            width="100%" />
      <br>
      <b>Post Requirement</b>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?id=1pFLTs_KkpoFc_pWBakWR6CpcBH-FJHcL" 
           alt="Registration Screen" 
            width="100%" />
      <br>
      <b>Registration Screen</b>
    </td>
  </tr>
</table>

<table align="center" style="border: 0 px">
  <tr style="border: 0 px">
    <td align="center">
      <img src="https://drive.google.com/uc?id=1Ibfxx1d_rVM2G5IV2BEtq4zoSXn3mjbY" 
           alt="Worker HomePage - View Requests" 
            width="100%" />
      <br>
      <b>Worker HomePage - View Requests</b>
    </td>
  </tr>
</table>
