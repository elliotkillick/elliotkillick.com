#!/usr/bin/python3

# Copyright (C) 2023 Elliot Killick <contact@elliotkillick.com>
# Licensed under the MIT License. See LICENSE file for details.

"""Convert RSS to email newsletters and send them with Listmonk API"""

# pylint: disable=invalid-name

import time
import os
from pathlib import Path
import requests
import feedparser

HOME = str(Path.home())

# Configuration variables
ROOT_URL = "https://elliotkillick.com"
RSS_URL = f"{ROOT_URL}/rss.xml"
FEED_ENTRY_LINKS_FILE = f"{HOME}/rss2newsletter/feed_entry_links.txt"
CONTENT_TEMPLATE_FILE = f"{HOME}/rss2newsletter/content_template.html"
POLL_INTERVAL = 3 * 60 # Consider using cron job or systemd timer instead

LISTMONK_URL = "http://localhost:9000"
LISTMONK_USERNAME = "elliotkillick"
LISTMONK_PASSWORD = "NHiDoW5J*R5ngVDT"

def main():
    """Program entry point"""

    while True:
        main_loop()
        time.sleep(POLL_INTERVAL)

def main_loop():
    """Program infinite loop"""

    feed = fetch_rss()
    if not feed:
        return

    entry_links = get_entry_links(feed.entries)
    if populate_preexisting_entries(entry_links):
        return

    entry_links_last_update = read_feed_entry_links_file()
    create_newsletter_for_new_entries(entry_links, entry_links_last_update, feed.entries)
    update_feed_entry_links_file(entry_links)

def fetch_rss() -> feedparser.FeedParserDict | None:
    """Fetch and parse RSS"""

    feed = feedparser.parse(RSS_URL)
    # In case of failure
    if hasattr(feed, "bozo_exception"):
        return None

    return feed

def get_entry_links(entries: list[feedparser.FeedParserDict]) -> list[str]:
    """Get list of relative links to each RSS entry"""

    # We use entry links as the unique identifier of each entry
    # Previously, we simply checked to see if the number of entries has increased
    # However, this suffered from issues with deleting posts, max RSS entries limit,
    # and race conditions if a post was created and deleted within the poll interval
    # Hence, why we use this more robust strategy now
    return [e.link for e in entries]

def populate_preexisting_entries(entry_links: list[str]) -> bool:
    """Ensure we don't process entries that existed before first run of rss2newsletter"""

    if not os.path.exists(FEED_ENTRY_LINKS_FILE):
        update_feed_entry_links_file(entry_links)
        return True

    return False

def update_feed_entry_links_file(entry_links: list[str]):
    """Update feed entry links file so new entries are no longer considered new"""

    with open(FEED_ENTRY_LINKS_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(entry_links))

def read_feed_entry_links_file() -> list[str]:
    """Read state of which entries need no further processing"""

    with open(FEED_ENTRY_LINKS_FILE, 'r', encoding='utf-8') as f:
        return f.read().strip('\n').split('\n')

def create_newsletter_for_new_entries(entry_links: list[str], entry_links_last_update: list[str],
                                      entries: list[feedparser.FeedParserDict]) -> None:
    """
    Iterate entries from newest to oldest looking for any new ones.
    Stop iterating when the first already processed entry is found.
    """

    # pylint: disable=consider-using-enumerate
    for i in range(0, len(entry_links)):
        # Start campaign for new entries
        if entry_links[i] not in entry_links_last_update:
            print("Creating newsletter for:", entries[i].title)
            print_status(start_campaign(create_campaign(entries[i].title,
                                                        create_content(entries[i]))))
        else:
            return

def print_status(status_code: int) -> None:
    """Report success or failure depending on HTTP status code"""

    if status_code == 200:
        print("Successfully started campaign!")
        return

    print("Error starting campaign!")

def create_content(entry: feedparser.FeedParserDict) -> str:
    """Create content to be used as body of newsletter"""

    with open(CONTENT_TEMPLATE_FILE, "r", encoding='utf-8') as f:
        content = f.read()

    content = content.replace("LINK_HERE", f"{ROOT_URL}{entry.link}")
    content = content.replace("TITLE_HERE", entry.title)
    # Zola RSS generator doesn't seem to include an enclosure/media:content tag in its RSS
    # So, link to our image manually instead
    # I always save my image as "cover.png" in the blog post directory
    content = content.replace("IMAGE_HERE", f"{ROOT_URL}{entry.link}cover.png")
    return content.replace("CAMPAIGN_HERE", entry.link.strip('/').split('/')[-1])

def create_campaign(post_name: str, body: str) -> int:
    """Create Listmonk email campaign for new post"""

    headers = {
        'Content-Type': 'application/json;charset=utf-8'
    }

    json_data = {
        'name': f'New Post: {post_name}',
        'subject': post_name,
        'lists': [
            1 # List ID 1 is my "New Posts" list
        ],
        'content_type': 'richtext',
        'body': body,
        'messenger': 'email',
        'type': 'regular',
        'tags': [
            'new-post'
        ]
    }

    response = requests.post(f"{LISTMONK_URL}/api/campaigns", headers=headers,
                             json=json_data, auth=(LISTMONK_USERNAME, LISTMONK_PASSWORD))

    return response.json()["data"]["id"]

def start_campaign(campaign_id: int) -> int:
    """Start Listmonk email campaign"""

    headers = {
        'Content-Type': 'application/json'
    }

    json_data = {
        'status': 'running'
    }

    response = requests.put(f"{LISTMONK_URL}/api/campaigns/{campaign_id}/status", headers=headers,
                            json=json_data, auth=(LISTMONK_USERNAME, LISTMONK_PASSWORD))

    return response.status_code

if __name__ == "__main__":
    main()
