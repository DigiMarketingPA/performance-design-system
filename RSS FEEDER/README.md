# Toyota Social Media Scheduler

This program automatically fetches blog posts from the Toyota Bountiful website and posts them to Facebook and Instagram on a bi-weekly schedule.

## Setup Instructions

1. Install Python 3.8 or higher from [python.org](https://python.org)

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project directory with the following variables:
   ```
   # WordPress API Credentials
   WP_API_URL=https://www.toyotabountiful.com/wp-json/wp/v2
   WP_USERNAME=your_username
   WP_APP_PASSWORD=your_app_password

   # Facebook API Credentials
   FB_APP_ID=your_app_id
   FB_APP_SECRET=your_app_secret
   FB_ACCESS_TOKEN=your_access_token
   FB_PAGE_ID=your_page_id
   IG_ACCOUNT_ID=your_instagram_account_id
   ```

4. To get the required API credentials:
   - WordPress: Go to Users → Application Passwords in your WordPress admin panel
   - Facebook: Create an app in the [Facebook Developer Console](https://developers.facebook.com)
   - Instagram: Connect your Instagram account to your Facebook Page

## Running the Program

1. Run the scheduler:
   ```
   python social_scheduler.py
   ```

2. The program will:
   - Check for new blog posts every two weeks
   - Format content for each platform
   - Post to Facebook and Instagram
   - Log all activities

## Scheduling

The program can be run in two ways:
1. As a Windows Scheduled Task (recommended)
2. As a continuously running Python script

To set up as a Windows Scheduled Task:
1. Open Task Scheduler
2. Create a new task
3. Set the trigger to run every two weeks
4. Set the action to run `python social_scheduler.py`

## Logging

All activities are logged to `social_media.log` in the project directory.

## Security Notes

- Never commit the `.env` file to version control
- Keep your API credentials secure
- Regularly rotate your API passwords 