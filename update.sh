#!/bin/bash

rm -rf ./dataset
mkdir -p img
mkdir -p dataset
python3 image_dl.py

# Copy all the image to the img folder
fd . ./dataset -tf ./dataset --exec cp {} ./img

image_dir="img"

# Loop through each file in the directory
for filename in "$image_dir"/*; do
  # Check if it's a regular file (not a directory or other special file)
  if [[ -f "$filename" ]]; then
    # Extract the filename without the path
    base_filename=$(basename "$filename")
    
    # Call your convert.py script with the full path and desired output filename
    echo python3 img_resize.py -i "$filename" -e png -x 300
    python3 img_resize.py -i "$filename" -e png -x 300
    
  fi
done

echo "Update completed"

open index.html