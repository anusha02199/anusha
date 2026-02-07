import zipfile
import re
import xml.etree.ElementTree as ET
import sys
import os

def extract_text(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            
        tree = ET.fromstring(xml_content)
        
        # Word stores text in 'w:t' tags. We need to handle namespaces properly or just find all 't' tags if we ignore namespaces (risky, better to handle namespaces).
        # Actually, finding all w:t is easier with correct namespace or iterative search.
        
        # Namespace map in typical docx
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        text = []
        for p in tree.iter():
            if p.tag.endswith('}t') or p.tag == 't': # w:t
                if p.text:
                    text.append(p.text)
            elif p.tag.endswith('}p') or p.tag == 'p': # w:p (paragraph)
               text.append('\n') # Add newline for paragraphs
            elif p.tag.endswith('}br'):
               text.append('\n')
            elif p.tag.endswith('}tab'):
               text.append('\t')

        full_text = "".join(text)
        print(full_text)

    except Exception as e:
        print(f"Error extracting text: {e}")

if __name__ == "__main__":
    file_path = r"c:\Users\Welcome\OneDrive\Pictures\workshop\anusha_resume[1].docx"
    
    # Save stdout
    original_stdout = sys.stdout
    
    with open(r"c:\Users\Welcome\OneDrive\Pictures\workshop\resume_text_utf8.txt", "w", encoding="utf-8") as f:
        sys.stdout = f
        extract_text(file_path)
        
    sys.stdout = original_stdout
