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

def download_image(name, keyword_enable, words_cb):
    with open(lessons[name]) as f:
        lines = f.read().splitlines()

    images = [image.replace('.png', '') for image in os.listdir(os.path.join('img'))]
    words_set = {}

    for word in lines:
        if not word: continue
        if word.startswith('#'): continue
        word = word.lower()
        first, second = word.strip(), ''
        if word.split(','):
            first = word.split(',')[0].strip()
            second = ' '.join(word.split(',')[1:]).strip()
        words_set[first] = second
        if first in images: continue
        if f'{first}_1' in images: continue

        print(f'Downloading {first}, keyword: {second}')
        query = f'{first} {second}' if second and keyword_enable else f'{first}'
        args = ['python3', '-m', 'better_bing_image_downloader.download', query, '-l', '1', '-d', 'dataset', '-a', '-F', '-t', '60', '-f', 'clipart', '-n', f'{first}']
        process = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        process.stdin.write(b'y\n')
        process.stdin.flush()
        output = process.stdout.read()     

    return words_cb(name, words_set)

def make_default_words_set(name, words_set):
    content = ''
    content += f'const {name} = [\n'
    for word in words_set:
        content += f'"{word}",\n'
    content += f'];'
    return content

def make_plural_words_set(name, words_set):
    content = ''
    content += f'const {name} = {"{"} \n'
    for word, v in words_set.items():
        choices = [f'"{e}"' for e in v.strip().split(' ')]
        assert len(choices) == 4, choices
        choices = f'[{", ".join(choices)}]'
        content += f'"{word}": {choices},\n'
    content += f'{"}"};'
    return content

def make_definition_words_set(name, words_set):
    return make_plural_words_set(name, words_set)

lessons = get_lessons()

word_js = ''
for lesson in lessons:
    if lesson.startswith('plural'):
        content = download_image(lesson, False, make_plural_words_set)
    elif lesson.startswith('definition'):
        words_set = {}
        with open(lessons[lesson]) as f:
            lines = f.read().splitlines()
        for line in lines:
            if not line: continue
            if line.startswith('#'): continue
            assert len(line.split(',')) >= 4
            w = ','.join(line.split(',')[:-3])
            words_set[w] = ' '.join(line.split(',')[-3:]).strip()
            assert len(words_set)==4, words_set
        content = make_definition_words_set(lesson, words_set)
    else:
        content = download_image(lesson, True, make_default_words_set)

    word_js += f'{content}\n\n'

word_js += 'const words = {\n'
for lesson in lessons:
    if lesson.startswith('plural'):
        lesson_data = '{'+'"type": "plural", "words": {lesson}'.format(lesson=lesson) + '}'
        word_js += f'"{lesson}": {lesson_data},\n'
    elif lesson.startswith('definition'):
        lesson_data = '{'+'"type": "definition", "words": {lesson}'.format(lesson=lesson) + '}'
        word_js += f'"{lesson}": {lesson_data},\n'
    else:
        word_js += f'"{lesson}": {lesson},\n'
word_js += '}\n\n'
    
with open('words.js', 'w') as f:
    f.write(word_js)
