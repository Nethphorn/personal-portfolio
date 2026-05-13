import re
import os
import sys

print(f"Python executing: {sys.executable}")
print("Starting conversion...")
try:
    if not os.path.exists('img/svg/logo.svg'):
        print("Error: img/svg/logo.svg not found")
        sys.exit(1)

    with open('img/svg/logo.svg', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Read {len(content)} bytes")

    new_content = re.sub(r'fill="#[0-9a-fA-F]{6}"', 'fill="#0ea5aa"', content)
    
    with open('img/svg/logo-blue.svg', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully created img/svg/logo-blue.svg")

except Exception as e:
    print(f"Error: {e}")
