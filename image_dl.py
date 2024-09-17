from better_bing_image_downloader import downloader

with open('word/lesson1.txt') as f:
    lines = f.read().splitlines()
for word in lines:
    if not word: continue
    word, second = word.strip(), ''
    if word.split(','):
        first = word.split(',')[0].strip()
        second = ' '.join(word.split(',')[1:]).strip()

    print(f'Downloading {word}, keyword: {second}')
    if second:
        downloader(f'{first} {second}', limit=1, output_dir='dataset', adult_filter_off=True, force_replace=False, timeout=60, filter="clipart", verbose=False, badsites= [], name=f'{first}')
    else:
        downloader(f'{first}', limit=1, output_dir='dataset', adult_filter_off=True, force_replace=False, timeout=60, filter="clipart", verbose=False, badsites= [], name=f'{first}')
