from better_bing_image_downloader import downloader
import subprocess, os, shutil
from pathlib import Path

# lessons = {
#     'lesson1': 'word/lesson1.txt',
#     'lesson2': 'word/lesson2.txt',
# }

def get_lessons():
    lessons = {}
    for f in Path('word').iterdir():
        lessons[f.stem] = str(f)
    return lessons

def download_image(name):
    with open(lessons[name]) as f:
        lines = f.read().splitlines()

    images = [image.replace('.png', '') for image in os.listdir(os.path.join('img'))]
    words_set = {}

    for word in lines:
        if not word: continue
        if word.startswith('#'): continue
        first, second = word.strip(), ''
        if word.split(','):
            first = word.split(',')[0].strip()
            second = ' '.join(word.split(',')[1:]).strip()
        words_set[first] = ''
        if first in images: continue
        if f'{first}_1' in images: continue

        print(f'Downloading {word}, keyword: {second}')
        query = f'{first} {second}' if second else f'{first}'
        args = ['python3', '-m', 'better_bing_image_downloader.download', query, '-l', '1', '-d', 'dataset', '-a', '-F', '-t', '60', '-f', 'clipart', '-n', f'{first}']
        process = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        process.stdin.write(b'y\n')
        process.stdin.flush()
        output = process.stdout.read()

    print(words_set)
    content = ''
    content += f'const {name} = [\n'
    for word in words_set:
        content += f'"{word}",\n'
    content += f'];'

    return content

lessons = get_lessons()

# shutil.rmtree('dataset')

word_js = ''
for lesson in lessons:
    content = download_image(lesson)
    word_js += f'{content}\n\n'

word_js += 'const words = {\n'
for lesson in lessons:
    word_js += f'"{lesson}": {lesson},\n'
word_js += '}\n\n'
    
with open('words.js', 'w') as f:
    f.write(word_js)
