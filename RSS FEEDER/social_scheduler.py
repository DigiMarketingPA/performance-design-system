import os
import logging
import schedule
import time
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import facebook
from PIL import Image
from io import BytesIO
import json

# Set up logging
logging.basicConfig(
    filename='social_media.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()

class SocialMediaScheduler:
    def __init__(self):
        self.wp_api_url = os.getenv('WP_API_URL')
        self.wp_username = os.getenv('WP_USERNAME')
        self.wp_app_password = os.getenv('WP_APP_PASSWORD')
        
        # Facebook/Instagram setup
        self.fb_app_id = os.getenv('FB_APP_ID')
        self.fb_app_secret = os.getenv('FB_APP_SECRET')
        self.fb_access_token = os.getenv('FB_ACCESS_TOKEN')
        self.fb_page_id = os.getenv('FB_PAGE_ID')
        self.ig_account_id = os.getenv('IG_ACCOUNT_ID')
        
        # Initialize Facebook Graph API
        self.graph = facebook.GraphAPI(access_token=self.fb_access_token, version="3.1")
        
        # Store the last processed post date
        self.last_processed_date = self.load_last_processed_date()

    def load_last_processed_date(self):
        """Load the last processed date from a file"""
        try:
            with open('last_processed.json', 'r') as f:
                data = json.load(f)
                return datetime.fromisoformat(data['last_date'])
        except (FileNotFoundError, json.JSONDecodeError):
            return datetime.now() - timedelta(days=14)  # Default to 2 weeks ago

    def save_last_processed_date(self, date):
        """Save the last processed date to a file"""
        with open('last_processed.json', 'w') as f:
            json.dump({'last_date': date.isoformat()}, f)

    def get_wordpress_posts(self):
        """Fetch new blog posts from WordPress"""
        try:
            # WordPress REST API authentication
            auth = (self.wp_username, self.wp_app_password)
            
            # Get posts published after last processed date
            params = {
                'after': self.last_processed_date.isoformat(),
                'per_page': 10,
                'status': 'publish'
            }
            
            response = requests.get(
                f"{self.wp_api_url}/posts",
                auth=auth,
                params=params
            )
            response.raise_for_status()
            
            return response.json()
        except Exception as e:
            logging.error(f"Error fetching WordPress posts: {str(e)}")
            return []

    def process_post_content(self, post):
        """Process post content for social media"""
        # Extract the main content
        soup = BeautifulSoup(post['content']['rendered'], 'html.parser')
        
        # Get the first image if available
        first_image = soup.find('img')
        image_url = first_image['src'] if first_image else None
        
        # Get excerpt or create one from content
        excerpt = post.get('excerpt', {}).get('rendered', '')
        if not excerpt:
            # Create excerpt from content
            text = soup.get_text()
            excerpt = ' '.join(text.split()[:50]) + '...'
        
        # Clean HTML from excerpt
        excerpt = BeautifulSoup(excerpt, 'html.parser').get_text()
        
        return {
            'title': post['title']['rendered'],
            'content': excerpt,
            'url': post['link'],
            'image_url': image_url,
            'date': post['date']
        }

    def download_image(self, image_url):
        """Download and process image for social media"""
        try:
            response = requests.get(image_url)
            response.raise_for_status()
            
            # Open image and convert to RGB if necessary
            img = Image.open(BytesIO(response.content))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save to temporary file
            temp_path = 'temp_image.jpg'
            img.save(temp_path, 'JPEG', quality=85)
            return temp_path
        except Exception as e:
            logging.error(f"Error processing image: {str(e)}")
            return None

    def post_to_facebook(self, post_data):
        """Post to Facebook"""
        try:
            # Prepare the message
            message = f"{post_data['title']}\n\n{post_data['content']}\n\nRead more: {post_data['url']}"
            
            # If we have an image, upload it first
            if post_data['image_url']:
                image_path = self.download_image(post_data['image_url'])
                if image_path:
                    with open(image_path, 'rb') as image:
                        self.graph.put_photo(
                            image=image,
                            message=message,
                            page_id=self.fb_page_id
                        )
                    os.remove(image_path)  # Clean up temp file
                    return True
            
            # If no image, just post the message
            self.graph.put_object(
                parent_object=self.fb_page_id,
                connection_name="feed",
                message=message
            )
            return True
            
        except Exception as e:
            logging.error(f"Error posting to Facebook: {str(e)}")
            return False

    def post_to_instagram(self, post_data):
        """Post to Instagram"""
        try:
            if not post_data['image_url']:
                logging.warning("Cannot post to Instagram without an image")
                return False
            
            # Download and process image
            image_path = self.download_image(post_data['image_url'])
            if not image_path:
                return False
            
            # Prepare the caption
            caption = f"{post_data['title']}\n\n{post_data['content']}\n\nRead more: {post_data['url']}"
            
            # Upload to Instagram
            with open(image_path, 'rb') as image:
                self.graph.put_photo(
                    image=image,
                    caption=caption,
                    instagram_account_id=self.ig_account_id
                )
            
            os.remove(image_path)  # Clean up temp file
            return True
            
        except Exception as e:
            logging.error(f"Error posting to Instagram: {str(e)}")
            return False

    def process_new_posts(self):
        """Main function to process and post new content"""
        try:
            logging.info("Starting to process new posts")
            
            # Get new posts
            posts = self.get_wordpress_posts()
            if not posts:
                logging.info("No new posts found")
                return
            
            # Process each post
            for post in posts:
                post_data = self.process_post_content(post)
                
                # Post to Facebook
                if self.post_to_facebook(post_data):
                    logging.info(f"Successfully posted to Facebook: {post_data['title']}")
                
                # Post to Instagram (if there's an image)
                if post_data['image_url'] and self.post_to_instagram(post_data):
                    logging.info(f"Successfully posted to Instagram: {post_data['title']}")
            
            # Update last processed date
            self.save_last_processed_date(datetime.now())
            logging.info("Finished processing posts")
            
        except Exception as e:
            logging.error(f"Error in process_new_posts: {str(e)}")

def main():
    scheduler = SocialMediaScheduler()
    
    # Schedule the job to run every two weeks
    schedule.every(14).days.do(scheduler.process_new_posts)
    
    # Run immediately on startup
    scheduler.process_new_posts()
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(3600)  # Check every hour

if __name__ == "__main__":
    main() 