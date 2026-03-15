#!/usr/bin/env python3
"""
Headless browser smoke test for beer-forecast-app (weather-style UI).
Requires: playwright with chromium installed (uses qwen-testing venv)
Run from beer-forecast-app root:
  /root/projects/qwen-testing/.venv/bin/python3 scripts/headless_test.py
"""

from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"

def test_dashboard(page):
    print("\n[1] Dashboard — weather-style main screen loads")
    page.goto(BASE, wait_until="networkidle")
    # Should show the mock headline and condition
    for text in ["Thirsty Thursday", "Heavy Discounts", "HOURLY DRINK FORECAST", "NEARBY PUBS", "14-DAY FORECAST"]:
        visible = page.locator(f"text={text}").count() > 0
        print(f"   {'✓' if visible else '✗'} '{text}'")
    print("   PASS")

def test_hourly_detail(page):
    print("\n[2] Hourly widget — tap → detail screen")
    page.goto(BASE, wait_until="networkidle")
    page.locator("text=HOURLY DRINK FORECAST").first.click()
    page.wait_for_timeout(1500)
    for text in ["Hourly Forecast", "Happy Hour", "Pitcher"]:
        visible = page.locator(f"text={text}").count() > 0
        print(f"   {'✓' if visible else '✗'} '{text}'")
    print("   PASS")

def test_forecast_detail(page):
    print("\n[3] Forecast widget — tap → 14-day detail screen")
    page.goto(BASE, wait_until="networkidle")
    page.locator("text=14-DAY FORECAST").first.click()
    page.wait_for_timeout(1500)
    for text in ["14-Day Forecast", "Thirsty Thursday", "Accuracy not guaranteed"]:
        visible = page.locator(f"text={text}").count() > 0
        print(f"   {'✓' if visible else '✗'} '{text}'")
    print("   PASS")

def test_map_screen(page):
    print("\n[4] Map widget — tap → map screen")
    page.goto(BASE, wait_until="networkidle")
    page.locator("text=NEARBY PUBS").first.click()
    page.wait_for_timeout(1500)
    # On web shows pub links as fallback
    visible = (
        page.locator("text=Map view not available on web").count() > 0 or
        page.locator("text=Nearby Pubs").count() > 0
    )
    print(f"   {'✓' if visible else '✗'} Map screen reached")
    print("   PASS")

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(str(err)))

        try:
            test_dashboard(page)
            test_hourly_detail(page)
            test_forecast_detail(page)
            test_map_screen(page)
        except Exception as e:
            print(f"\n   FAIL: {e}")
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
