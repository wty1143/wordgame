import argparse
from PIL import Image
from pathlib import Path

description = """********************************************************
*                                                      *
*             simpleImageConverter 0.2b                *
*                                                      *
*                 Coded by: B0nz                       *
*                                                      *
********************************************************
"""
usage = """Usage:
    python3 simpleImageConverter.py -i <inputfile> -o <outputfile> -x <outwidth> -y <outheight>
    python3 simpleImageConverter.py -i <inputfile> -f <format> -x <outwidth> -y <outheight>

Options:
        -i, --input <file>          File to convert
        -o, --output <file>         File output (if blank, same as input. Input will be overwriten.)
        -x, --width <pixels>        Width in pixels if resize is desired
        -y, --heigh <pixels>        Heigh in pixels if resize is desired
        -e, --extension <format>    File extension output. Output file name extension will be used if given.
        -f, --fliph                 Flip image horizontally.
        -v, --flipv                 Flip image vertically.
        -p, --transpose             Transpose image.
        -t, --transverse            Transverse image.
        --r90                       Rotate image 90 degrees.
        --r180                      Rotate image 180 degrees.
        --r270                      Rotate image 270 degrees.
        -h                          This menu.
        --version                   Version.

Examples:
    python3 simpleImageConverter.py -i image.jpg -o image_out.gif -x 100 -y 100
    python3 simpleImageConverter.py -i image.jpg -o image_out.png -x 200  (in this case, y size will be proportional to x)
    python3 simpleImageConverter.py -i image.png -f gif -y 80  (in this case, file output is image.gif)
    python3 simpleImageConverter.py -i image.png -y 350  (in this case, file output is resized image.png)
"""
epilog = """    Github source: https://github.com/rcbonz/
"""
#---------------------------------------------------
"""PARSER AND USAGE"""
top_parser = argparse.ArgumentParser(description=description, epilog=epilog, formatter_class=argparse.RawDescriptionHelpFormatter) # usage=usage, 
top_parser.add_argument('-i', '--input', action="store", dest="input_file", required=True, help="Input file.")
top_parser.add_argument('-o', '--output', action="store", dest="output_file", required=False, help="Output to file. Default: same as input with different format.")
top_parser.add_argument('-x', '--width', action='store', dest="new_width", help="Width in pixels if resize is desired.")
top_parser.add_argument('-y', '--heigh', action='store', dest="new_heigh", help="Height in pixels if resize is desired.")
top_parser.add_argument('-e', '--extension', action='store', dest="out_format", help="File output format. Output file name format will be used if given.")
top_parser.add_argument('-f', '--fliph', action='store_true', dest="fliph", help="Flip image horizontally.")
top_parser.add_argument('-v', '--flipv', action='store_true', dest="flipv", help="Flip image vertically.")
top_parser.add_argument('-p', '--transpose', action='store_true', dest="transpose", help="Transpose image.")
top_parser.add_argument('-t', '--transverse', action='store_true', dest="transverse", help="Transverse image.")
top_parser.add_argument('--r90', action='store_true', dest="rotate90", help="Rotate image 90 degrees.")
top_parser.add_argument('--r180', action='store_true', dest="rotate180", help="Rotate image 180 degrees.")
top_parser.add_argument('--r270', action='store_true', dest="rotate270", help="Rotate image 270 degrees.")
top_parser.add_argument('--version', action='version', version='%(prog)s 0.2b')

supported_formats = ["bmp","dds","dib","eps","gif","ico","jpeg","jpg","pcx","png","tiff","webp"]


def all_flag_funcs(image):
    image = fliph_f(image)
    image = flipv_f(image)
    image = transverse_f(image)
    image = transpose_f(image)
    image = rotate90_f(image)
    image = rotate180_f(image)
    image = rotate270_f(image)
    return image

def fliph_f(image):
    if fliph:
        return image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    else:
        return image

def flipv_f(image):
    if flipv:
        return image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    else:
        return image

def transpose_f(image):
    if transpose:
        return image.transpose(Image.Transpose.TRANSPOSE)
    else:
        return image

def transverse_f(image):
    if transverse:
        return image.transpose(Image.Transpose.TRANSVERSE)
    else:
        return image

def rotate90_f(image):
    if rotate90:
        return image.transpose(Image.Transpose.ROTATE_90)
    else:
        return image

def rotate180_f(image):
    if rotate180:
        return image.transpose(Image.Transpose.ROTATE_180)
    else:
        return image

def rotate270_f(image):
    if rotate270:
        return image.transpose(Image.Transpose.ROTATE_270)
    else:
        return image


args = top_parser.parse_args()
input_file = args.input_file
if not input_file:
    print("Input file is required.")
    exit()
input_file_path = Path(input_file)
if not input_file_path.is_file():
    print("Input file not found.")
output_file = args.output_file
out_format = args.out_format
if args.new_width:
    new_width = int(args.new_width)
else:
    new_width =args.new_width
if args.new_heigh:
    new_heigh = int(args.new_heigh)
else:
    new_heigh = args.new_heigh

if all([input_file,output_file]):
    if any([str(input_file).split(".")[-1].lower() not in supported_formats,str(output_file).split(".")[-1].lower() not in supported_formats]):
        print("Unsupported file format. Suported formats arse:")
        for file_format in supported_formats:
            print(f"- {file_format}")
        exit()

fliph = args.fliph
flipv = args.flipv
transpose = args.transpose
transverse = args.transverse
rotate90 = args.rotate90
rotate180 = args.rotate180
rotate270 = args.rotate270



if all([input_file,out_format]):
    if any([str(input_file).split(".")[-1].lower() not in supported_formats,out_format.lower() not in supported_formats]):
        print("Unsupported file format. Suported formats are:")
        for file_format in supported_formats:
            print(f"- {file_format}")
        exit()
if all([not output_file,not out_format,not new_width,not new_heigh]):
    print("You must point at least one output spec.")

if not all([new_width,new_heigh]):
    "File wont be resized"
    out_image = Image.open(input_file)
    out_image = all_flag_funcs(out_image)
    if output_file:
        out_image = out_image.convert('RGB')
        out_image.save(output_file)
    if out_format:
        extension = str(input_file).split(".")[-1]
        out_name = str(input_file).replace(extension,out_format)
        out_image.save(out_name)

if any([new_heigh,new_width]):
    if all([new_heigh,new_width]):
        out_image = Image.open(input_file).resize([new_width,new_heigh])
        out_image = all_flag_funcs(out_image)
        if output_file:
            out_image.save(output_file)
        elif out_format:
            extension = str(input_file).split(".")[-1]
            out_name = str(input_file).replace(extension,out_format)
            out_image.save(out_name)
        else:
            out_image.save(input_file)
    elif new_heigh:
        x, y = Image.open(input_file).size
        x = round((new_heigh/y)*x)
        out_image = Image.open(input_file).resize([x,new_heigh])
        out_image = all_flag_funcs(out_image)
        if output_file:
            out_image.save(output_file)
        elif out_format:
            extension = str(input_file).split(".")[-1]
            out_name = str(input_file).replace(extension,out_format)
            out_image.save(out_name)
        else:
            out_image.save(input_file)
    elif new_width:
        x, y = Image.open(input_file).size
        y = round((new_width/x)*y)
        out_image = Image.open(input_file).resize([new_width,y])
        out_image = all_flag_funcs(out_image)
        if output_file:
            out_image.save(output_file)
        elif out_format:
            out_name = str(input_file).split(".")[:-1] + "." + out_format
            out_image.save(out_name)
        else:
            out_image.save(input_file)

print("Done.")