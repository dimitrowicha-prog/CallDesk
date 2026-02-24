# Partner Onboarding Setup

## Configuration

To enable the partner onboarding wizard to submit data to your Google Sheets via Apps Script:

1. **Deploy your Google Apps Script as a Web App**
   - Open your Google Apps Script project
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Set "Execute as": "Me"
   - Set "Who has access": "Anyone"
   - Click "Deploy" and copy the Web App URL

2. **Update the environment variable**
   - Open `.env` file in the project root
   - Replace the placeholder URL with your actual Apps Script URL:
   ```
   APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

3. **Restart your development server**
   - Stop the current server (if running)
   - Start again to load the new environment variable

## Expected Apps Script Endpoint

Your Apps Script should handle POST requests with the following JSON payload:

```json
{
  "sipUser": "sip:salon_slug@calldeskbg.sip.twilio.com",
  "calendarId": "",
  "name": "Salon Name",
  "timezone": "Europe/Sofia",
  "slotStepMin": 15,
  "workHoursJson": "{\"mon\":{\"start\":\"10:00\",\"end\":\"19:00\"},...}",
  "services": [
    {
      "serviceId": "podstrigvane",
      "serviceName": "Подстригване",
      "durationMin": 30
    }
  ],
  "contact": {
    "fullName": "Ivan Petrov",
    "phone": "+359 88 123 4567",
    "email": "ivan@salon.bg"
  }
}
```

The script should:
- Upsert the TENANTS row using `sipUser` as the key
- Replace all SERVICES rows for that `sipUser` with the new services array

## Features

- **Multi-step wizard** with 5 steps
- **Step 1: Contact** - Collects name, phone, email
- **Step 2: Salon Basics** - Salon name, timezone, slot duration
- **Step 3: Working Hours** - Weekly schedule with toggle for each day
- **Step 4: Services** - Category templates or custom services
- **Step 5: Finish** - Shows SIP address and setup instructions

## Usage

Users can access the wizard by clicking the "Стани наш партньор" button in the hero section of the homepage.
