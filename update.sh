#!/bin/bash

rm -rf ./dataset
rm -rf ./img
mkdir -p img
python3 image_dl.py

# Copy all the image to the img folder
fd . ./dataset -tf ./dataset --exec cp {} ./img

image_dir="img"
words_js="words.js"

# Loop through each file in the directory
for filename in "$image_dir"/*; do
  # Check if it's a regular file (not a directory or other special file)
  if [[ -f "$filename" ]]; then
    # Extract the filename without the path
    base_filename=$(basename "$filename")
    
    # Extract the extension (lowercase for case-insensitive comparison)
    extension="${base_filename##*.}"
    extension=$(tr [:upper:] [:lower:] <<< "$extension")

    # Check if the extension is not already jpg
    
    # Call your convert.py script with the full path and desired output filename
    echo python3 img_resize.py -i "$filename" -e png -x 300
    python3 img_resize.py -i "$filename" -e png -x 300
    
  fi
done

cd $image_dir
echo "const words = [" > $words_js
ls *.png | perl -pi -e 's/^(.*)\.png/"$1",/g' >> $words_js
echo "];" >> $words_js
mv $words_js ../$words_js
cd -
echo "Update completed"

open index.html