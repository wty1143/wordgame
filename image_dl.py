from better_bing_image_downloader import downloader
import subprocess

with open('word/lesson1.txt') as f:
    lines = f.read().splitlines()
for word in lines:
    if not word: continue
    if word.startswith('#'): continue
    word, second = word.strip(), ''
    if word.split(','):
        first = word.split(',')[0].strip()
        second = ' '.join(word.split(',')[1:]).strip()

    print(f'Downloading {word}, keyword: {second}')
    query = f'{first} {second}' if second else f'{first}'
    args = ['python3', '-m', 'better_bing_image_downloader.download', query, '-l', '1', '-d', 'dataset', '-a', '-F', '-t', '60', '-f', 'clipart', '-n', f'{first}']
    process = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    process.stdin.write(b'y\n')
    process.stdin.flush()
    output = process.stdout.read()
