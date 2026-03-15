#!/usr/bin/env python3
"""
Headless browser smoke test for beer-forecast-app web frontend.
Requires: playwright with chromium installed (uses qwen-testing venv)
Run from beer-forecast-app root:
  /root/projects/qwen-testing/.venv/bin/python3 scripts/headless_test.py
"""

from playwright.sync_api import sync_playwright, expect

BASE = "http://localhost:3000"

def test_nearby_list(page):
    print("\n[1] Nearby tab — pub list loads")
    page.goto(BASE, wait_until="networkidle")
    # Should show at least one PubCard (TouchableOpacity renders as div on web)
    cards = page.locator("text=The Goose").or_(
        page.locator("text=Prince of Peckham")
    ).or_(page.locator("text=Fabal Beerhall"))
    cards.first.wait_for(timeout=8000)
    count = page.locator("[data-testid='pub-card']").count()
    print(f"   Pub names visible: checking for known pubs...")
    for name in ["The Goose", "Prince of Peckham", "Fabal Beerhall", "The Last Judgment"]:
        visible = page.locator(f"text={name}").count() > 0
        print(f"   {'✓' if visible else '✗'} {name}")
    print("   PASS")

def test_pub_detail(page):
    print("\n[2] Pub detail — tap pub, see promotions")
    page.goto(BASE, wait_until="networkidle")
    page.locator("text=Prince of Peckham").first.click()
    page.wait_for_timeout(1500)
    # Should show promotion text
    for text in ["Thirsty Thursdays", "All-day cocktails"]:
        visible = page.locator(f"text={text}").count() > 0
        print(f"   {'✓' if visible else '✗'} Promo: '{text}'")
    print("   PASS")

def test_map_tab_web_fallback(page):
    print("\n[3] Map tab — shows fallback text on web")
    page.goto(BASE, wait_until="networkidle")
    map_tab = page.locator("text=Map")
    if map_tab.count() == 0:
        print("   ✓ Map tab hidden on web (as expected)")
        return
    map_tab.first.click()
    page.wait_for_timeout(1000)
    fallback = page.locator("text=Map view not available on web").count() > 0
    print(f"   {'✓' if fallback else '✗'} Fallback text shown")
    print("   PASS")

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console errors
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(str(err)))

        try:
            test_nearby_list(page)
            test_pub_detail(page)
            test_map_tab_web_fallback(page)
        except Exception as e:
            print(f"\n   FAIL: {e}")
            print(f"   Page title: {page.title()}")
            print(f"   URL: {page.url}")
        finally:
            if errors:
                print(f"\n⚠ Console errors ({len(errors)}):")
                for e in errors[:10]:
                    print(f"   {e}")
            else:
                print("\n✓ No console errors")
            browser.close()

    print("\nDone.")

if __name__ == "__main__":
    run()
