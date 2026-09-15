import requests
from dotenv import load_dotenv
import os
import base64

# Load environment variables
load_dotenv()

def test_wordpress_api():
    # Get credentials from .env file
    wp_api_url = os.getenv('WP_API_URL')
    wp_username = os.getenv('WP_USERNAME')
    wp_app_password = os.getenv('WP_APP_PASSWORD')

    if not all([wp_api_url, wp_username, wp_app_password]):
        print("Error: Missing WordPress credentials in .env file")
        print("Please make sure you have set:")
        print("WP_API_URL, WP_USERNAME, and WP_APP_PASSWORD")
        return

    # Test API connection
    try:
        # First, try to access the API without authentication
        print("Testing public API access...")
        response = requests.get(
            f"{wp_api_url}/posts",
            params={'per_page': 1}
        )
        
        # Check if the request was successful
        response.raise_for_status()
        
        # Get the response data
        posts = response.json()
        
        if posts:
            print("✅ Successfully connected to WordPress REST API!")
            print("\nLatest post details:")
            post = posts[0]
            print(f"Title: {post['title']['rendered']}")
            print(f"Date: {post['date']}")
            print(f"Link: {post['link']}")
            print("\nNote: The REST API is accessible without authentication.")
            print("This means we can read posts, but we might need different")
            print("authentication for other operations.")
        else:
            print("✅ Connected to WordPress API, but no posts found.")
            
    except requests.exceptions.RequestException as e:
        print("❌ Error connecting to WordPress API:")
        print(f"Error message: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check if the WP_API_URL is correct")
        print("2. Verify your WordPress site is accessible")
        print("3. Check if REST API is enabled in WordPress")
        print("4. Try accessing the API URL directly in your browser")

if __name__ == "__main__":
    test_wordpress_api() 